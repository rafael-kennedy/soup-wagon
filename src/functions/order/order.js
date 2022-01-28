const axios = require("axios");
const querystring = require("querystring");

const handler = async (event) => {
  try {
    const fields = {
      email: ["entry.159832721", ""],
      address: ["entry.1179605958", ""],
      soup: ["entry.2097007970", ""],
      disposableContainers: ["entry.2015699820", ""],
      reusableContainers: ["entry.1501295403", ""],
      returningContainers: ["entry.145362684", ""],
      totalPrice: ["entry.447434343", ""],
      payment: ["entry.899456984", "None"],
    };
    const eventData = JSON.parse(event.body);
    const target =
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSevQCDaUAtbCpJmdlJFMbnMtREiXiVdQeG47R9B7MKaZiWUug/formResponse?embedded=true";

    const payload = Object.fromEntries(
      [
        "email",
        "address",
        "soup",
        "disposableContainers",
        "reusableContainers",
        "returningContainers",
        "totalPrice",
        "payment",
      ].map((fieldName) => [fields[fieldName][0], eventData[fieldName]])
    );

     await axios
      .post(target, querystring.stringify(payload));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Submitted` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
