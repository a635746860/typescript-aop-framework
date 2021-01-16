import Koa from 'koa';
import { authLogin, get, post } from '../utils/decors';

const users = [
  {name: 'xiaoming', age: 18 } 
]

@authLogin([
  async function guard(ctx: Koa.Context, next: () => Promise<any>) {
    if(!ctx.request.header.token) {
      throw '用户未授权， 请登录'
    }
    await next()
  }
])
export default class User {

  @get('/users')
  public list(ctx: Koa.Context) {
    ctx.body = {
      success: true,
      data: users
    }
  }

  @post('/add', {
    middlewares: [
      async function validation(ctx: Koa.Context, next: () => Promise<any>) {
        console.log('接口拦截器校验=====>')
        const name = ctx.request.body?.name;
        if(!name) {
          throw '请输入用户名'
        }
        await next()
      }
    ]
  })
  public add(ctx: Koa.Context) {
    users.push(ctx.request.body)
    ctx.body = { success: true }
  }
}