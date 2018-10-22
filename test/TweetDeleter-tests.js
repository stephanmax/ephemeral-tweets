const expect = require('chai').expect

const TweetDeleter = require('../TweetDeleter.js')

describe('TweetDeleter', () => {

  it('does not delete the keybase.io proof tweet', done => {
    const mockTwitterClient = {
      get() {
        return Promise.resolve({
          data: [{
            id_str: '0',
            created_at: 0
          }, {
            id_str: '1',
            created_at: 0
          }]
        })
      },
      post(url, payload) {
        return Promise.resolve({
          data: {
            id_str: payload.id
          }
        })
      }
    }
    const tweetDeleter = new TweetDeleter(mockTwitterClient, 0, '0')

    tweetDeleter.run()
    .then(deletedTweets => {
      expect(deletedTweets).to.have.lengthOf(1)
      expect(deletedTweets[0].id_str).to.equal('1')
      done()
    })
    .catch(done)
  })

})
