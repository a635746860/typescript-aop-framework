import { sync } from "glob";
import Koa from "koa";
import KoaRouter from "koa-router";

type HTTPMethod = "get" | "post" ;
type LoadOptions = {
  extname?: string;
};
type RouterOptions = {
  prefix?: string;
  middlewares?: Array<Koa.Middleware>;
};

const router = new KoaRouter();

/**
 * 使用ts装饰器实现AOP风格的KOA-ROUTER before
 * @param method 
 * @param path 
 * @param router 
 * @param options 
 */
const decorate = (method: HTTPMethod, path: string, router: KoaRouter, options?: RouterOptions, ) => {
  return ( 
    target: { [key: string]: any },
    property: string,
  ) => {
    process.nextTick(() => {
      const middlewares: Array<Koa.Middleware> = [];
      if(target?.middlewares) {
        middlewares.push(...target.middlewares)
      }
      if(options?.middlewares) {
        middlewares.push(...options.middlewares)
      }
      middlewares.push(target[property])
      const url = options && options?.prefix ? options?.prefix + path : path;
      router[method](url, ...middlewares);
    })
  };
};

const method = (method: HTTPMethod) => (path: string, options?: RouterOptions) => decorate(method, path, router, options);
const get = method("get");
const post = method("post");

/**
 * class装饰器 after
 * @param target 
 */
const authLogin = (middlewares: Koa.Middleware[]) => {
  return function(target: Function) {
    target.prototype.middlewares = middlewares
  }
}

//loader
const loader = (folder: string, options: LoadOptions = {}): KoaRouter => {
  const extname = options.extname || ".{js,ts}";
  sync(require("path").join(folder, `./**/*${extname}`)).forEach((item) =>
    require(item)
  );
  return router;
};

export { get, post, loader, authLogin };
