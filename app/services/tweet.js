const axios = require("axios");
const querystring = require("querystring");

const MAX_TWEET_COUNT = 30;
let isTwitterTokenSet;

// Library to handle Twitter requests

// Get Twitter OAuth 2.0 Bearer Token https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0
getAccessToken = async function () {
  if (!isTwitterTokenSet) {
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
        return access_token;
      } else {
        throw response.data;
      }
    } catch (error) {
      throw error;
    }
  }
};

// Time window is between yesterday noon and today noon in UTC time
getTimeWindow = function () {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 12)
  );
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12)
  );
  return [start, end];
};

// Fetch tweets and replies of a user by screen_name
getTimeline = async function (display_name, screen_name) {
  try {
    await getAccessToken();
    const response = await axios.get("/statuses/user_timeline", {
      params: {
        screen_name: screen_name,
        count: MAX_TWEET_COUNT,
      },
    });
    let tweetsAndReplies = [];
    for (let [key, value] of Object.entries(response.data)) {
      const created_at = new Date(value.created_at);
      const [start, end] = getTimeWindow();
      if (created_at > start && created_at <= end) {
        let simplfiedTweet = {};
        simplfiedTweet.display_name = display_name || "";
        simplfiedTweet.screen_name = value.user.screen_name;
        simplfiedTweet.link = `https://twitter.com/${screen_name}/status/${value.id_str}`;
        simplfiedTweet.retweeted_status = value.retweeted_status;
        simplfiedTweet.favorite_count = value.favorite_count;
        simplfiedTweet.retweet_count = value.retweet_count;
        simplfiedTweet.created_at = value.created_at;
        simplfiedTweet.in_reply_to_screen_name = value.in_reply_to_screen_name;
        simplfiedTweet.location = value.user.location;
        simplfiedTweet.lang = value.lang;
        simplfiedTweet.text = value.text;
        tweetsAndReplies.push(simplfiedTweet);
      }
    }
    return tweetsAndReplies;
  } catch (error) {
    return {
      error: { code: error.response.status, message: error.response.data },
    };
  }
};

// Return retweet count for tweets only, not retweets or replies.
getRetweetCount = async function (display_name, screen_name) {
  try {
    let retweetCount = 0;
    let favoriteCount = 0;
    const data = await module.exports.getTimeline(display_name, screen_name);
    if ("error" in data) {
      return data;
    }
    for (let [key, value] of Object.entries(data)) {
      // Reply: value.in_reply_to_screen_name RT: value.retweeted_status
      if (!value.retweeted_status) {
        if (value.retweet_count) {
          retweetCount += value.retweet_count;
        }
        if (value.favoriteCount !== 0) {
          favoriteCount += value.favorite_count;
        }
      }
    }
    return {
      display_name: display_name,
      retweetCount: retweetCount,
    };
  } catch (error) {
    return {
      error: { code: error.response.status, message: error.response.data },
    };
  }
};

// Return a downloadable csv file
toCsv = async function (display_name, screen_name) {
  try {
    const data = await module.exports.getTimeline(display_name, screen_name);
    const count = await module.exports.getRetweetCount(
      display_name,
      screen_name
    );
    let csvStr =
      "display_name|screen_name|link|favorite_count|retweet_count|created_at|in_reply_to_screen_name|location|lang|text|retweeted_status\n";
    for (let [key, value] of Object.entries(data)) {
      let row_header = Object.keys(value);
      const idx = row_header.indexOf("retweeted_status");
      if (idx > -1) {
        row_header.splice(idx, 1);
      }
      let row = [];
      row_header.forEach((cell) => row.push(`"${value[cell]}"`));
      // Retweet status
      if ("retweeted_status" in value) {
        row.push(true);
      } else {
        row.push(false);
      }
      csvStr += row.join("|");
      csvStr += "\n";
    }
    return csvStr;
  } catch (error) {
    console.log(error);
    return {
      error: { code: error.response.status, message: error.response.data },
    };
  }
};

module.exports = { getTimeline, getRetweetCount, toCsv };
