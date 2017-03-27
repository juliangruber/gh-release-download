# gh-release-download

Download all assets of a GitHub release.

![screenshot](screenshot.png)

## Example

Using the CLI:

```bash
$ cd ~/dev/Level/leveldown
$ gh-release-download dist/
...
$ ls dist/
...
```

Using the API:

```js
const download = require('gh-release-download')

// point to your local checkout of a repository

const downloader = download({
  dir: process.env.HOME + '/dev/level/leveldown'
})

downloader.events.on('start', name => console.log(`${name}...`))
downloader.events.on('finish', name => console.log(name))

downloader
.then(() => console.log('All downloaded'))
.catch(err => console.error(err))
```

## Installation

For CLI:

```bash
$ npm install -g gh-release-download
```

For API:

```bash
$ npm install gh-release-download
```

## License

MIT
