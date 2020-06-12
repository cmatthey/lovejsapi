const axios = require("axios");
const querystring = require("querystring");

getAccessToken = async function () {
  const authHeader =
    "Basic " +
    Buffer.from(
      process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET
    ).toString("base64");
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
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + access_token;
        axios.defaults.headers.post["Content-Type"] = "application/json";
      }
      return access_token;
    } else {
      throw response.data;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  // Fetch tweets and replies of a user by its screen_name
  getTimeline: async function (screen_name) {
    try {
      const access_token = await getAccessToken();
      const response = await axios.get("/statuses/user_timeline", {
        params: {
          screen_name: screen_name,
          count: 50,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      console.log(data);
    } catch (err) {
      console.log("in getTimeline err", err);
      return response.data;
    }
  },

  // TODO: Need to find out the correct API
  getRetweetCount: async function (screen_name) {
    return await module.exports.getTimeline();
  },
};
