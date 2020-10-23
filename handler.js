"use strict";
const https = require("https");
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

module.exports.hello = async (event) => {
  let dataString = "";

  const response = await new Promise((resolve, reject) => {
    const req = https.get(
      "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json",
      function (res) {
        res.on("data", (chunk) => {
          dataString += chunk;
        });
        res.on("end", () => {
          const gasData = JSON.parse(dataString);

          // if (gasData.safeLow < 300) {
          client.messages
            .create({
              body: `🚨 Gas Prices are low. 
                Currently 
                  fast: ${gasData.fast},
                  fastest: ${gasData.fastest},
                  safeLow: ${gasData.safeLow},
                  average: ${gasData.average},`,
              from: process.env.FROM,
              to: process.env.TO,
            })
            .then((message) =>
              resolve({
                statusCode: 200,
                body: dataString,
              })
            );
          // }
        });
      }
    );

    req.on("error", (e) => {
      reject({
        statusCode: 500,
        body: "Something went wrong!",
      });
    });
  });
  return response;
};
