/**
 * Vercel Serverless 入口：所有流量经 vercel.json rewrites 进入此函数后交给 Express。
 * 勿删：去掉后仅会静态托管 dist，路由与 CORS 中间件都不会执行。
 */
import app from "../dist/index.js";

export default app;
