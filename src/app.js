const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const { REDIS_CONF, } =  require('./conf/db')
const { isProd, } = require('./utils/env')

// 路由引入
const index = require('./routes/index')
const userViewRouter = require('./routes/view/user')
const userAPIRouter = require('./routes/api/user')
const errorViewRouter = require('./routes/view/error')

// error handlerc
let onerrorConf =  {}
if (isProd) {
  onerrorConf = {
    redirect: '/error',
  }
}
onerror(app, onerrorConf)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text',],
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs',
}))

// session配置
app.keys = ['UIDhh_1123$@#',]
app.use(session({
  key: 'weibo.sid', // cookie的名字,默认为'koa.sid'
  prefix: 'weibo:sess:', // redis key 的前缀，默认为'koa:sess:'
  cookie: {
    httpOnly: true,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // ms 
  },
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`,
  }),
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
