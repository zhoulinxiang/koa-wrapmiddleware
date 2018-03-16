const Koa = require("koa");
const wrappedKoaMiddleware = require("../index");
const app = new Koa();

wrappedKoaMiddleware(app);

app.use(async (ctx, next) => {
  await next();
  console.log(ctx.middlewareTakeTime);
});
const xResponseTimeFunc = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
};
app.use(xResponseTimeFunc);

// logger
const loggerFunc = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
};
app.use(loggerFunc);

// response
app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000);
