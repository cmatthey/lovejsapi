const Twit = require("twit");

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

module.exports = {
  get_timeline: function (screen_name, callback) {
    T.get(
      "statuses/user_timeline",
      {
        screen_name: screen_name,
        // since_id: since_id,
        // count: count,
      },
      function (err, data, response) {
        console.log(data);
        callback(err, data);
      }
    );
  },

  get_timeline_in_csv: function (screen_name, callback) {
    T.get(
      "statuses/user_timeline",
      {
        screen_name: screen_name,
        // since_id: since_id,
        // count: count,
      },
      function (err, data, response) {
        console.log(data);
        callback(err, data);
      }
    );
  },

  // TODO: Need to find out the correct API
  get_retweet_count: function (screen_name, callback) {
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
