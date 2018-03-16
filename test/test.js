const Koa = require("koa");
const isGeneratorFunction = require("is-generator-function");
const debug = require("debug")("koa:application");
const compose = require("koa-compose");
const wrappedKoaMiddleware = require("../index");
const app = new Koa();

wrappedKoaMiddleware(app);

const xResponseTimeFunc = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log(ctx.middlewareTakeTime);
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
