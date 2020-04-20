# koa-icon

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/dominicegginton/koa-icon/CI/master?label=CI)](https://github.com/dominicegginton/koa-icon/actions)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/dominicegginton/koa-icon)](https://codeclimate.com/github/dominicegginton/koa-icon)
[![npm](https://img.shields.io/npm/dt/koa-icon?label=Downloads)](https://www.npmjs.com/package/koa-icon)
[![js-standard-style](https://img.shields.io/badge/Code%20Style-standard-brightgreen.svg)](http://standardjs.com)

> Lighting Fast Node.js Koa Middleware for serving a favicon 🚀

[Favicons](https://en.wikipedia.org/wiki/Favicon) are an essential visual cue used commonly by browsers enabling users to easily and quickly determine site indemnification

Why use `koa-icon` to serve your favicon :thinking:

- Lighting fast - favicons are caches in memory :rocket:
- Supports all favicon file types :smile:
- Built-in [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) support :bookmark:
- Cache-Control header support :clock1:
- Easy to use API :package:

## Install

``` shell
npm i koa-icon
```

`koa-icon` is available via the [npm](https://www.npmjs.com) package registry. Documentation can be found [here](https://docs.npmjs.com/cli/install) on installing dependencies for your Node.js project

## Usage

``` js
const Koa = require('koa')
const favicon = require('koa-icon')
const app = new Koa()

app.use(favicon('/assets/favicon.ico'))

app.listen(3000)
```

## API :package:

### favicon(path, options) ⇒ `function`

serves favicon @ /favicon.ico

**Kind**: exported function  
**Returns**: `function` - middleware serving cached favicon @ /favicon.ico

| Param | Type | Description |
| --- | --- | --- |
| path | `String` or `Buffer` | path to favicon, or buffer containing favicon data |
| options | `Object` | koa-icon options object |
| options.maxAge | `Number` | maximum time the favicon is considered fresh - default one day |
| options.type | `String` | mime type of favicon - default 'x-icon' |

## Documentation :books:

### File Types

`koa-icon` supports all [favicon file formats](https://en.wikipedia.org/wiki/Favicon). Set the type property of the options object to the file type of your favicon

``` js
app.use(favicon('/assets/favicon.png'), { type: 'png' })
```

### Using a Buffer

If you need to read the favicon from disk yourself or get a favicon from a different source pass a Buffer object into `koa-icon` containing the favicon raw data

```js
const icon = fs.readFileSync('/assets/favicon.ico')
app.use(favicon(icon))
```

### Setting the Cache-Control HTTP Header

The [cash-control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) holds directives (instructions) for caching in both requests and responses and is used to determine how long a given resource is considered fresh

`koa-icon` makes it easy to control how long clients like, browsers and network caches, consider your favicon as fresh. Pass the maximum age in seconds your favicon should be considered fresh by browsers and other clients in `koa-icon`'s options object

``` js
app.use(favicon(__dirname + '/assets/favicon.ico'), { maxAge: 3600 }) // 1 hour
```

> :memo: `koa-icon`'s default value for the max-age cache-control is 86400 (1 day), and will max out at 31536000 (1 year)

### ETags and Request Freshness

An [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) is a identifer assigned by a web server to a specific version of a resource, and passed to the client within the HTTP ETag header of the response. When the resource at a given URL is updated a new unique ETag is generated. `koa-icon` uses the npm module [`etag`](https://github.com/jshttp/etag) to generate a ETag for the favicon

Freshness of the request is determined by matching the current resources ETag against the ETag in the requests [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) header. Fresh requests are responded with a status code of `304 - not modified` and stale requests are sent a status code of `200` along with the favicon in the response body

Support for ETags and freshness checking is built into `koa-icon` by default

## Bugs Reports & Feature Requests

:bug: Help eliminate bugs by submitting bug reports to `koa-icons` GitHub issue tracker [here](https://github.com/dominicegginton/koa-icon/issues)

:bulb: Want to see a new feature in `koa-icon` ? Submit a GitHub issue [here](https://github.com/dominicegginton/koa-icon/issues) detailing your amazing new idea

## Contributing

Want to contribute to `koa-icon` ? Feel free to open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) :smile:
