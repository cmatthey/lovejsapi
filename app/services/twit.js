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
  getTimeline: async function (display_name, screen_name) {
    try {
      const access_token = await getAccessToken();
      const response = await axios.get("/statuses/user_timeline", {
        params: {
          screen_name: screen_name,
          count: 50,
        },
      });
      let tweetsAndReplies = [];
      for (let [key, value] of Object.entries(response.data)) {
        let simplfiedTweet = Object();
        simplfiedTweet.display_name = display_name || "";
        simplfiedTweet.screen_name = value.user.screen_name;
        simplfiedTweet.link = `https://twitter.com/${screen_name}/status/${value.id_str}`;
        simplfiedTweet.retweet_count = value.retweet_count;
        simplfiedTweet.favorite_count = value.favorite_count;
        simplfiedTweet.created_at = value.created_at;
        simplfiedTweet.in_reply_to_screen_name =
          value.in_reply_to_screen_name || "";
        simplfiedTweet.lang = value.lang || "";
        simplfiedTweet.text = value.text || "";
        tweetsAndReplies.push(simplfiedTweet);
      }
      return tweetsAndReplies;
    } catch (error) {
      return {
        error: { code: error.response.status, message: error.response.data },
      };
    }
  },

  // TODO: Need to find out the correct API
  getRetweetCount: async function (display_name, screen_name) {
    try {
      let count = 0;
      const data = await module.exports.getTimeline(display_name, screen_name);
      if ("error" in data) {
        return data;
      }
      for (let [key, value] of Object.entries(data)) {
        count += value.retweet_count;
        if (value.retweet_count !== 0) {
          console.log("retweet_count ", value.retweet_count, " ", value.link);
        }
      }
      return { display_name: display_name, count: count };
    } catch (error) {
      return { error: error };
    }
  },
};
