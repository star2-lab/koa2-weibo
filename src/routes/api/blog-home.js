/**
 * @description 首页 api 路由
 * @author Duan Hongfei
 */

const router = require('koa-router')()
const { loginCheck, } = require('../../middlewares/loginCheck')
const { create, } = require('../../controller/blog-home')
const { genValidator, } = require('../../middlewares/validator')
const blogValidate = require('../../validator/blog')

router.prefix('/api/blog')

// 创建博客
router.post('/create', loginCheck, genValidator(blogValidate), async (ctx, next) => {
  const { content, image, } = ctx.request.body
  const { id: userId, } = ctx.session.userInfo

  ctx.body = await create(userId, content, image)
})

module.exports = router
