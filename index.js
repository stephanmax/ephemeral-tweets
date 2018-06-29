const Twitter = require('twit')

const dayInMs = 24 * 60 * 60 * 1000

module.exports = function (context, done) {
  const maxTweetAge = context.secrets.MAX_TWEET_AGE * dayInMs
  
  const twitterClient = new Twitter({
    consumer_key: context.secrets.CONSUMER_KEY,
    consumer_secret: context.secrets.CONSUMER_SECRET,
    access_token: context.secrets.ACCESS_TOKEN,
    access_token_secret: context.secrets.ACCESS_TOKEN_SECRET
  })
  
  twitterClient.get('statuses/user_timeline', {
    count: 200
  })
  .then(({data: tweets}) => {
    let deleteRequests = tweets
      .filter(tweet => {
        return new Date() - new Date(tweet.created_at) > maxTweetAge
      })
      .map(tweet => {
        return new Promise((resolve, reject) => {
          twitterClient.post('statuses/destroy/:id', {
            id: tweet.id_str
          })
          .then(({data: deletedTweet}) => {
            console.log(`Deleted tweet #${deletedTweet.id_str}: "${deletedTweet.text}"`)
            resolve(deletedTweet)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
        })
      })
    
    return Promise.all(deleteRequests)
  })
  .then(deletedTweets => {
    console.log(`Done. Deleted ${deletedTweets.length} tweets.`)
    done(null, { deletedTweets })
  })
  .catch(done)
}
