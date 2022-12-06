A few hacky scripts to process the Advent Of Code leaderboards.

First you need to grab the session key out of your browser headers and save it as `sessionKey.json`. The contents should look like (obviously the value is elided below, grab yours from the browser developer tools. Look in the header of the response):
```
{
        "session": "53616c74..."
}
```

Second, run `queryData.js` (via `node queryData.js`) which will query the API for the private leaderboard data and store each year as a json file in the data directory.

Third, run `process.js` which will read the data files and produce an html file.

