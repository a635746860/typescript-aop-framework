import Koa from 'koa';
import { get } from '../utils/decors';

const users = [
  {name: 'xiaoming', age: 18 } 
]

export default class User {

  @get('/users')
  public list(ctx: Koa.Context) {
    ctx.body = {
      success: true,
      data: users
    }
  }

  public add(ctx: Koa.Context) {
    users.push(ctx.request.body)
    ctx.body = { success: true }
  }
}