const Twit = require("twit");
const axios = require("axios").default;
const crypto = require("crypto");
const querystring = require("querystring");

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

twitGetWrapper = function (tpath, tParams) {
  let p = new Promise((resolve) => {
    T.get(tpath, tParams, (response) => resolve(response));
  });
  console.log(`- in twitGetWrapper ${tpath} ${tParams.screen_name} ${p}`);
  return p;
};

// getAxioInstance = function () {
//   return axios.create({
//     baseURL: "https://api.twitter.com",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });
// };

getToken = async function () {
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
      return response.data.access_token;
    } else {
      throw response;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  // Fetch tweets and replies of a user by its screen_name
  getTimeline: function (screen_name, callback) {
    T.get(
      "statuses/user_timeline",
      {
        screen_name: screen_name,
        // since_id: since_id,
        // count: count,
      },
      function (err, data, response) {
        console.log("---", err);
        // console.log("---", data);
        // console.log("---", response.statusCode);
        callback(err, data); // Should only return when 200 not 404
      }
    );
  },

  getTimelineAsync: async function (screen_name) {
    reponse = await twitGetWrapper(
      // const [err, data, reponse] = await twitGetWrapper(
      "statuses/user_timeline",
      {
        screen_name: screen_name,
        // since_id: since_id,
        // count: count,
      }
    );
    // console.log(`--in getTimelineAsync ${err}`);
    // console.log(`--in getTimelineAsync ${data}`);
    console.log(`--in getTimelineAsync ${reponse}`);
    console.log(Object.prototype.toString.call(reponse));
    return $reponse;
  },

  getTimelineAxio1: async function (screen_name) {
    // try {
    //   const axiosInstance = axios.create({
    //     baseURL: "https://api.twitter.com/1.1",
    //   });
    //   axiosInstance.defaults.headers.common["Authorization"] = OAuth;
    //   axiosInstance.defaults.headers.common["oauth_consumer_key"] =
    //     process.env.CONSUMER_KEY;
    //   axiosInstance.defaults.headers.common["oauth_nonce"] = "nonce";
    //   signingKey =
    //     process.env.CONSUMER_SECRET + "&" + process.env.ACCESS_SECRET;
    //   console.log("--signingKey", signingKey);
    //   console.log("--crypto", crypto.createHmac("HMAC-SHA1", signingKey));
    //   axiosInstance.defaults.headers.common[
    //     "oauth_signature"
    //   ] = crypto.createHmac("HMAC-SHA1", signingKey);
    //   axiosInstance.defaults.headers.common["oauth_signature_method"] =
    //     "HMAC-SHA1";
    //   axiosInstance.defaults.headers.common["oauth_timestamp"] = Date.now();
    //   axiosInstance.defaults.headers.common["oauth_token"] =
    //     process.env.ACCESS_TOKEN;
    //   axiosInstance.defaults.headers.common["oauth_version"] = "1.0";
    //   response = await axiosInstance.get("/users/show", {
    //     screen_name: screen_name,
    //   });
    //   console.log(`in getTimelineAxio data ${response.data}`);
    // } catch (err) {
    //   console.log(`in getTimelineAxio err ${err}`);
    //   console.log(`in getTimelineAxio err ${err.config}`);
    // }
  },

  getTimelineAxio: async function (screen_name) {
    try {
      const token = await getToken();
      console.log(token);
      return token;
    } catch (err) {
      console.log(`in getTimelineAxio2 err ${err}`);
    }
  },

  // Not in use now
  getUserInfo: function (screen_name, callback) {
    T.get(
      "users/show",
      {
        screen_name: screen_name,
      },
      function (err, data, response) {
        console.log(data);
        callback(err, data);
      }
    );
  },

  // TODO: Need to find out the correct API
  getRetweetCount: function (screen_name, callback) {
    T.get("statuses/mentions_timeline", { screen_name: screen_name }, function (
      err,
      data,
      response
    ) {
      console.log(data);
      callback(err, data);
    });
  },
};
