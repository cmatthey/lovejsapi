const axios = require("axios");
const querystring = require("querystring");

let isTwitterTokenSet = false;

// Get Twitter OAuth 2.0 Bearer Token https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0
getAccessToken = async function () {
  console.log("isTwitterTokenSet", isTwitterTokenSet);
  if (isTwitterTokenSet) {
    const authHeader = `Basic ${Buffer.from(
      `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
    ).toString("base64")}`;
    try {
      const response = await axios.post(
        "https://api.twitter.com/oauth2/token",
        querystring.stringify({ grant_type: "client_credentials" }),
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        const access_token = response.data.access_token;
        if (access_token !== null) {
          axios.defaults.baseURL = "https://api.twitter.com/1.1";
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
          axios.defaults.headers.post["Content-Type"] = "application/json";
        }
        isTwitterTokenSet = true;
        console.log("Access token is fetched");
        return axios;
      } else {
        throw response.data;
      }
    } catch (error) {
      throw error;
    }
  }
};

getAccessTokenDev = function () {
  try {
    axios.defaults.baseURL = "https://api.twitter.com/1.1";
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${process.env.TOKEN}`;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    return axios;
  } catch (error) {}
};

module.exports = { getAccessToken, getAccessTokenDev };
