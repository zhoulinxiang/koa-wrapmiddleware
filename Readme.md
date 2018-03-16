
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
    this.middleware.push(wrapFun);
    return this;
  };
}
```