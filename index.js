'use strict'

/* MODULE DEPENDENCIES */
const fs = require('fs-extra')
const etag = require('etag')

/* MODULE VARIABLES */
const ONE_YEAR_MS = 60 * 60 * 24 * 365 // one year in seconds
const ONE_DAY_MS = 60 * 60 * 24 // one day in seconds
const DEFAULT_OPTIONS = {
  maxAge: ONE_DAY_MS,
  type: 'x-icon'
}

function middleware (path, options) {
  if (!path) throw new Error('[koa-icon] path is required')

  let favicon // favicon cache

  if (Buffer.isBuffer(path)) {
    if (path.length > 0) {
      favicon = Buffer.from(path) // read favicon from buffer
    } else throw new Error('[koa-icon] buffer must not be empty')
  } else if (typeof path === 'string') {
    if (!fs.pathExistsSync(path)) throw new Error('[koa-icon] path must exist')
    if (!fs.statSync(path).isFile()) throw new Error('[koa-icon] path must be file not directory')
    favicon = fs.readFileSync(path) // read favicon from file
  } else throw new TypeError('[koa-icon] path must be type string or buffer')

  options = options || DEFAULT_OPTIONS
  options.maxAge = options.maxAge === null ? ONE_DAY_MS : Math.min(Math.max(0, options.maxAge), ONE_YEAR_MS)
  options.type = options.type === null ? 'x-icon' : options.type

  return (ctx, next) => {
    if (ctx.path !== '/favicon.ico') return next()
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
      ctx.status = ctx.method === 'OPTIONS' ? 200 : 405
      ctx.set('Allow', 'GET, HEAD, OPTIONS')
    } else {
      ctx.set('Cache-Control', `public, max-age=${options.maxAge}`)
      ctx.set('ETag', etag(favicon))
      ctx.type = `image/${options.type}`
      ctx.status = 200

      if (ctx.fresh) {
        ctx.status = 304
        return
      }

      ctx.body = favicon
    }
  }
}

module.exports = middleware
