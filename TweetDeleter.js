module.exports = class TweetDeleter {

  constructor(twitterClient, maxTweetAge, keybaseTweetId) {
    this.twitterClient = twitterClient
    this.maxTweetAge = maxTweetAge
    this.keybaseTweetId = keybaseTweetId
  }

  run() {
    return this.twitterClient.get('statuses/user_timeline', {
      count: 200
    })
    .then(({data: tweets}) => {
      let deleteRequests = tweets
        .filter(tweet => {
          return new Date() - new Date(tweet.created_at) > this.maxTweetAge
        })
        .filter(tweet => {
          return tweet.id_str !== this.keybaseTweetId
        })
        .map(tweet => {
          return new Promise((resolve, reject) => {
            this.twitterClient.post('statuses/destroy/:id', {
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
  }

}
