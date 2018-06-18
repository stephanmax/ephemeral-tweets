# Ephemeral Tweets

**Ephemeral Tweets** is a Node.js script that automatically deletes your old tweets. It runs on [webtask](https://webtask.io/) for free and is highly inspired by Vicky Lai‘s [ephemeral](https://github.com/vickylai/ephemeral).

This script removes all tweets from your timeline that are older than a certain number of days. It will delete up to 200 tweets per execution (as per Twitter‘s [rate limits](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html)) and runs on any schedule.

## Setup

You will need to head over to [Twitter apps](https://apps.twitter.com/), create an app, and generate keys and access tokens. Then copy `.secrets.sample`, rename it to `.secrets`, and fill them in.

Then get an account with [webtask](https://webtask.io/), install the webtask CLI (`npm install -g wt-cli`) and authenticate with `wt init`.

You are now all set to run

```shell
$ npm start
```

which installs all dependencies and exposes the script as a webtask URL that you can call. Do not forget to set the query parameter `maxTweetAge` in days. So to delete all tweets that are older than a week open

```
https://wt-.../ephemeral-tweets?maxTweetAge=7
```

## Deploy Webtask

If you want to deploy the webtask so it triggers automatically, run

```shell
$ npm run deploy
```

You can set both the the `maxTweetAge` parameter and the cron schedule inside [`package.json`](package.json). Per default they are set to `7` and `'0 3 * * 1'`, so it would run every Monday, at 3:00 am and delete tweets that are older than a week.
