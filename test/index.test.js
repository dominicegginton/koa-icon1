/* eslint-env jest */
'use strict'

/* IMPORT TEST */
const favicon = require('..')

/* IMPORT MODULES */
const Koa = require('koa')
const supertest = require('supertest')
const MockFS = require('mock-fs')

beforeEach(() => {
  MockFS({
    'assets/': {
      'favicon.ico': Buffer.from([10, 4, 6, 7, 7, 9, 4, 8]),
      'favicon.png': Buffer.from([66, 44, 78, 7, 7, 59, 6])
    }
  })
  this.app = new Koa()
  this.request = supertest(this.app.callback())
})

afterEach(() => {
  MockFS.restore()
})

describe('favicon()', () => {
  describe('arguments', () => {
    describe('path', () => {
      test('should throw error when null', async () => {
        expect(() => { this.app.use(favicon()) }).toThrow(new Error('[koa-icon] path is required'))
      })

      test('should throw error when undefined', async () => {
        expect(() => { this.app.use(favicon(undefined)) }).toThrow(new Error('[koa-icon] path is required'))
      })

      test('should accept file path', async () => {
        expect(() => { this.app.use(favicon('./assets/favicon.ico')) }).not.toThrow()
      })

      test('should throw error if path does not exist', async () => {
        expect(() => { this.app.use(favicon('./invalid.ico')) }).toThrow(new Error('[koa-icon] path must exist'))
      })

      test('should throw error if path is dir', async () => {
        expect(() => { this.app.use(favicon('./assets/')) }).toThrow(new Error('[koa-icon] path must be file not directory'))
      })

      test('should accept type buffer', async () => {
        expect(() => { this.app.use(favicon(Buffer.alloc(20))) }).not.toThrow()
      })

      test('should throw error if buffer is empty', async () => {
        expect(() => { this.app.use(favicon(Buffer.alloc(0))) }).toThrow(new Error('[koa-icon] buffer must not be empty'))
      })

      test('should throw error if type is not buffer or string', async () => {
        expect(() => { this.app.use(favicon(1)) }).toThrow(new Error('[koa-icon] path must be type string or buffer'))
      })
    })

    describe('options.maxAge', () => {
      test('should set valid delta seconds', async () => {
        this.app.use(favicon('./assets/favicon.ico', { maxAge: 200 }))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['cache-control']).toBe('public, max-age=200')
      })

      test('should default to one day', async () => {
        this.app.use(favicon('./assets/favicon.ico'))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['cache-control']).toBe('public, max-age=86400')
      })

      test('should accept 0', async () => {
        this.app.use(favicon('./assets/favicon.ico', { maxAge: 0 }))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['cache-control']).toBe('public, max-age=0')
      })

      test('should floor at 0', async () => {
        this.app.use(favicon('./assets/favicon.ico', { maxAge: -100 }))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['cache-control']).toBe('public, max-age=0')
      })

      test('should ceil at 1 year', async () => {
        this.app.use(favicon('./assets/favicon.ico', { maxAge: 999999999999 }))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['cache-control']).toBe('public, max-age=31536000')
      })

      test('should accept infinity ', async () => {
        this.app.use(favicon('./assets/favicon.ico', { maxAge: Infinity }))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['cache-control']).toBe('public, max-age=31536000')
      })
    })

    describe('options.type', () => {
      test('should default to x-icon', async () => {
        this.app.use(favicon('./assets/favicon.ico'))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['content-type']).toBe('image/x-icon')
      })

      test('should accept type string', async () => {
        expect(() => { this.app.use(favicon('./assets/favicon.ico', { type: 'png' })) }).not.toThrow()
      })

      test('should set vail mime type', async () => {
        this.app.use(favicon('./assets/favicon.png', { type: 'png' }))
        const res = await this.request.get('/favicon.ico')
        expect(res.header['content-type']).toBe('image/png')
      })
    })
  })

  describe('requests', () => {
    test('GET /favicon.ico : should serve favicon', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.get('/favicon.ico')
      expect(res.status).toBe(200)
    })

    test('GET /favicon.ico?v=1 : should serve favicon and ignore query', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.get('/favicon.ico?v=1')
      expect(res.status).toBe(200)
    })

    test('GET / : should not serve favicon', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.get('/')
      expect(res.status).not.toBe(200)
    })

    test('GET / favicon.ico : cache-control header should be set', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.get('/favicon.ico')
      expect(res.status).toBe(200)
      expect(res.header['cache-control']).toBe('public, max-age=86400')
    })

    test('GET /favicon.ico : etag header should be set', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.get('/favicon.ico')
      expect(res.status).toBe(200)
      expect(res.header.etag).not.toBe(null)
      expect(typeof res.header.etag).toBe('string')
      expect(res.header.etag.length).toBe(31)
    })

    test('GET /favicon.ico : status should be 304 when if-none-match header is sent and etag matches', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.get('/favicon.ico')
      expect(res.status).toBe(200)
      const res2 = await this.request.get('/favicon.ico').set('If-None-Match', res.header.etag)
      expect(res2.status).toBe(304)
    })

    test('GET /favicon.ico : status should be 200 when if-none-match header is sent and etag doesnt match', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this .request.get('/favicon.ico').set('If-None-Match', 'invalid')
      expect(res.status).toBe(200)
    })

    test('GET /favicon.ico : should send cached favicon', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      MockFS.restore() // restore mocked file system to ensure favicon is cashed in memory
      const res = await this.request.get('/favicon.ico')
      expect(res.status).toBe(200)
      expect(res.body).toEqual(Buffer.from([10, 4, 6, 7, 7, 9, 4, 8]))
    })

    test('POST /favicon.ico : status should be 405 & allow header should be set', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.post('/favicon.ico')
      expect(res.status).toBe(405)
      expect(res.header.allow).toBe('GET, HEAD, OPTIONS')
    })

    test('OPTIONS /favicon.ico : allow header should be set', async () => {
      this.app.use(favicon('./assets/favicon.ico'))
      const res = await this.request.options('/favicon.ico')
      expect(res.status).toBe(200)
      expect(res.header.allow).toBe('GET, HEAD, OPTIONS')
    })
  })
})
