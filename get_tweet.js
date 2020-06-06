const Twit = require("twit");

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

function get_timeline(screen_name, since_id, count, max_id) {
  T.get(
    "statuses/user_timeline",
    {
      screen_name: screen_name,
      since_id: since_id,
      count: count,
      max_id: max_id,
    },
    function (err, data, response) {
      console.log(data);
    }
  );
}

// TODO: Need to find out the correct API
function get_retweet_count(screen_name) {
  T.get("statuses/mentions_timeline", { screen_name: screen_name }, function (
    err,
    data,
    response
  ) {
    console.log(data);
  });
}

// export default get_retweet_count;
