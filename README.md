# koa-icon

> Lighting Fast Node.js Koa Middleware for serving a favicon 🚀

[Favicons](https://en.wikipedia.org/wiki/Favicon) are an essential visual cue used commonly by browsers enabling users to easily and quickly determine site indemnification

Why use `koa-icon` to serve your favicon :thinking:

- Lighting fast - favicons are caches in memory :rocket:
- Supports all favicon file types :smile:
- Built-in [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) support :bookmark:
- Custom max-age https response header control :clock1:
- Easy to use API :package:

## Install

``` shell
npm i koa-icon
```

## Usage

``` js
const Koa = require('koa')
const favicon = require('koa-icon')
const app = new Koa()

app.use(favicon('/assets/favicon.ico'))

app.listen(3000)
```
