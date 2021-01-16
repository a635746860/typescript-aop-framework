import Koa from 'koa';
import bodify from 'koa-body';
import server from 'koa-static';
import { resolve } from 'path';
import { loader } from './utils/decors'
const PORT = 3666;

const app = new Koa();
app.use(server(`${__dirname}/public`));

app.use(bodify({
  multipart: true,
  strict: false,
}))

const router = loader(resolve(__dirname, './routes'));
app.use(router.routes())

app.listen(PORT, () => {
  console.log(`服务已经启动在${PORT}端口`)
})