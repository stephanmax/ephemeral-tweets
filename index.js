const Twitter = require('twitter')

module.exports = function (context, done) {
  const twitterClient = new Twitter({
    consumer_key: context.secrets.CONSUMER_KEY,
    consumer_secret: context.secrets.CONSUMER_SECRET,
    access_token_key: context.secrets.ACCESS_TOKEN,
    access_token_secret: context.secrets.ACCESS_TOKEN_SECRET
  })
  
  twitterClient.get('statuses/user_timeline', {
    count: 200
  })
  .then(tweets => {
    return twitterClient.post(`statuses/destroy/${tweets[20].id}`, {})
    .then(deleted => {
      console.log(deleted)
      done()
    })
  })
  .catch(done)
}
