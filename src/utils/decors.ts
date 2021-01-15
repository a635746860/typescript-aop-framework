import { sync } from "glob";
import Koa from "koa";
import Router from "koa-router";
import KoaRouter from "koa-router";

type HTTPMethod = "get" | "post" | "delete";
type LoadOptions = {
  extname?: string;
};
type RouterOptions = {
  prefix?: string;
  middlewares?: Array<Koa.Middleware>;
};

const router = new KoaRouter();

const method = (method: string) => (path: string, options?: RouterOptions) => {
  console.log('装饰器执行了吗')
  return (
    target: { [key: string]: any },
    property: string,
  ) => {
    const url = options && options?.prefix ? options?.prefix + path : path;
    //@ts-ignore
    router[method](url, target[property]);
  };
};

const get = method("get");
const post = method("post");

//loader
const loader = (folder: string, options: LoadOptions = {}) => {
  const extname = options.extname || ".{js,ts}";
  sync(require("path").join(folder, `./**/*${extname}`)).forEach((item) =>
    require(item)
  );
  return router;
};

export { get, post, loader };
