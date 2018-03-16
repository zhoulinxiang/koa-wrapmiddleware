## Record the time spent on each middleware

Use this data for performance optimization

```js
function wrappedKoaMiddleware(app) {
  const appUse = app.use;
  app.use = function(fn) {
    if (isGeneratorFunction(fn)) {
      fn = convert(fn);
    }
    const middlewareLength = this.middleware.length;
    const wrapFun = async function(ctx, next) {
      const t1 = process.uptime() * 1000;
      await fn(ctx, next);
      ctx.middlewareTakeTime = ctx.middlewareTakeTime || [];
      ctx.middlewareTakeTime.push({
        num: middlewareLength,
        funcName: fn.name,
        takeTime: process.uptime() * 1000 - t1
      });
    };
    return appUse.call(this, wrapFun);
  };
}
```

Here is an example

```js
const app = new Koa();

wrappedKoaMiddleware(app);
app.use(async () => {
  await next();
  console.log(ctx.middlewareTakeTime);
  /**
   * console
  [ { num: 3, funcName: '', takeTime: 2 },
  { num: 2, funcName: 'loggerFunc', takeTime: 4 },
  { num: 1, funcName: 'xResponseTimeFunc', takeTime: 4 } ]
  **/
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
```
