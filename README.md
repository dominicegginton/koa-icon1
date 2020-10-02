<h1 align='center'>koa-icon</h1>

<h4 align='center'>Lighting fast favicon middleware for Koa</h4>

<div align='center'>
  <img src='https://img.shields.io/github/workflow/status/dominicegginton/koa-icon/CI/master?label=CI'>
  <img src='https://img.shields.io/codeclimate/coverage/dominicegginton/koa-icon'>
  <img src='https://img.shields.io/npm/dt/koa-icon?label=Downloads'>
  <img src='https://img.shields.io/badge/Code%20Style-standard-brightgreen.svg'>
</div>

## Why

- Caches your favicon for fast responses
- Built-in [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) support
- Supports all favicon file types
- Cache-control header support
- Easy to use API

## Install

``` shell
npm i koa-icon
```

## Getting Started

``` js
const Koa = require('koa')
const favicon = require('koa-icon')
const app = new Koa()

app.use(favicon('/assets/favicon.ico'))

app.listen(3000)
```

## API

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

## Documentation

### Serving a Favicon

To serve a favicon pass **koa-icon's** middleware to your `app.use()` function. **koa-icon** comes with great defaults options making getting effortless.

``` js
app.use(favicon('/assets/favicon.ico'))
```

### File Type

**koa-icon** supports all [favicon file formats](https://en.wikipedia.org/wiki/Favicon) out of the box. Use the `options.type` parameter to set the file type of your favicon

``` js
app.use(favicon('/assets/favicon.png'), { type: 'png' })
```

### Using a Buffer

Reading your favicon from file or requesting it from another source can be done manually by passing **koa-icon** a `Buffer`

``` js
const icon = fs.readFileSync('/assets/favicon.ico')
app.use(favicon(icon))
```

### Setting the Cache-Control HTTP Header

The [cash-control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) holds directives (instructions) for caching in both requests and responses and is used to determine how long a given resource is considered fresh

**koa-icon** makes it easy to control how long your favicon is considered fresh. Pass the maximum age in seconds in the `options.maxAge` perimeter

``` js
app.use(favicon(__dirname + '/assets/favicon.ico'), { maxAge: 3600 }) // 1 hour
```

>  **koa-icons** default value for `options.maxAge` is 86400 (1 day), and will max out at 31536000 (1 year)

### ETags and Request Freshness

An [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) is a identifer assigned by a web server to a specific version of a resource, and passed to the client within the HTTP ETag header of the response. When the resource at a given URL is updated a new unique ETag is generated. **koa-icon** uses the [**etag**](https://github.com/jshttp/etag) module to generate ETags.

Request freshness is determined by matching the current resources ETag against the ETag received from the [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) HTTP request header. Fresh requests are responded with a status code of **304** (not modified) and stale requests are sent a status code of **200** along with the favicon in the response body. Support for ETags and freshness checking is built into **koa-icon** by default.

## Contributing

Contributors are welcome, feel free to submit a new [pull request](https://github.com/dominicegginton/koa-icon/pulls)  to help improve **koa-icon**.
