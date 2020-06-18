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
getTimeWindow = function (reportTime = new Date()) {
  const start = new Date(
    Date.UTC(
      reportTime.getUTCFullYear(),
      reportTime.getUTCMonth(),
      reportTime.getUTCDate() - 1,
      12
    )
  );
  const end = new Date(
    Date.UTC(
      reportTime.getUTCFullYear(),
      reportTime.getUTCMonth(),
      reportTime.getUTCDate(),
      12
    )
  );
  console.log("rt", reportTime, start, end);
  return [start, end];
};

// Fetch tweets, retweets and replies of a user by screen_name
getTimeline = async function (display_name, screen_name, reportTime) {
  try {
    await getAccessToken();
    const response = await axios.get("/statuses/user_timeline", {
      params: {
        screen_name: screen_name,
        count: MAX_TWEET_COUNT,
      },
    });
    const [start, end] = getTimeWindow(
      reportTime ? new Date(reportTime) : null
    );
    let tweetsAndReplies = response.data
      .filter(
        (t) => new Date(t.created_at) > start && new Date(t.created_at) < end
      )
      .map((t) => {
        return {
          display_name: display_name || "",
          screen_name: t.user.screen_name,
          link: `https://twitter.com/${screen_name}/status/${t.id_str}`,
          retweeted_status: "retweeted_status" in t ? true : false,
          favorite_count: t.favorite_count,
          retweet_count: t.retweet_count,
          created_at: t.created_at,
          in_reply_to_screen_name: t.in_reply_to_screen_name,
          location: t.user.location,
          lang: t.lang,
          text: t.text,
        };
      });
    return tweetsAndReplies;
  } catch (error) {
    return {
      error: { code: error.response.status, message: error.response.data },
    };
  }
};

// Fetch tweets and replies of a user by screen_name
getReport = async function (display_name, screen_name, reportTime) {
  try {
    const data = await module.exports.getTimeline(
      display_name,
      screen_name,
      reportTime
    );
    if ("error" in data) {
      return data;
    }
    return data.filter((t) => t.retweeted_status === false);
  } catch (error) {
    return {
      error: { code: error.response.status, message: error.response.data },
    };
  }
};

// Return retweet count for tweets or replies.
getRetweetCount = async function (display_name, screen_name) {
  try {
    const data = await module.exports.getReport(display_name, screen_name);
    if ("error" in data) {
      return data;
    }
    const retweetCount = data
      .map((t) => t.retweet_count)
      .reduce((a, c) => a + c);
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
    const data = await module.exports.getReport(display_name, screen_name);
    if ("error" in data) {
      return data;
    }
    let csvStr =
      "display_name|retweet_count|link|screen_name|created_at|in_reply_to_screen_name|location|lang|text\n";
    data
      .filter((t) => t.retweet_count > 0)
      .map(
        (t) =>
          (csvStr += `"${t.display_name}"|"${t.retweet_count}"|"${t.link}"|"${t.screen_name}"|"${t.created_at}"|"${t.in_reply_to_screen_name}"|"${t.location}"|"${t.lang}"|"${t.text}"\n`)
      );
    return csvStr;
  } catch (error) {
    console.log(error);
    return {
      error: { code: error.response.status, message: error.response.data },
    };
  }
};

module.exports = { getTimeline, getReport, getRetweetCount, toCsv };
