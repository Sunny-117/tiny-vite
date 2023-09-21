import { NextHandleFunction } from "connect";
// 一个用于加载静态资源的中间件
import sirv from "sirv";
import { isImportRequest } from "../../utils";

export function staticMiddleware(root: string): NextHandleFunction {
  const serveFromRoot = sirv(root, { dev: true });
  return async (req, res, next) => {
    if (!req.url) {
      return;
    }
    // 不处理import的请求
    if (isImportRequest(req.url)) {
      return;
    }
    serveFromRoot(req, res, next);
  };
}
