const Twitter = require('twit')

const TweetDeleter = require('./TweetDeleter.js')

const dayInMs = 24 * 60 * 60 * 1000

module.exports = function(context, done) {
  const maxTweetAge = context.secrets.MAX_TWEET_AGE * dayInMs
  
  const twitterClient = new Twitter({
    consumer_key: context.secrets.CONSUMER_KEY,
    consumer_secret: context.secrets.CONSUMER_SECRET,
    access_token: context.secrets.ACCESS_TOKEN,
    access_token_secret: context.secrets.ACCESS_TOKEN_SECRET
  })

  const tweetDeleter = new TweetDeleter(twitterClient, maxTweetAge)
  
  tweetDeleter.run()
  .then(deletedTweets => {
    console.log(`Done. Deleted ${deletedTweets.length} tweets.`)
    done(null, { deletedTweets })
  })
  .catch(done)
}
