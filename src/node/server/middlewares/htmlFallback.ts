import { NextHandleFunction } from "connect";
import { ServerContext } from "..";
import path from "node:path";
import fs from "node:fs";
import createDebug from "debug";
import { cleanUrl } from "../../utils";

const debug = createDebug("vite:html-fallback");

// 单页面应用 404的请求->index.html，前端路由跳转，但是服务端是没有对应的内容的
export function htmlFallbackMiddleware(serverContext: ServerContext, spaFallback?: boolean): NextHandleFunction {
    const { root } = serverContext;
    return function viteHtmlFallbackMiddleware(req, res, next) {
        if (
            (req.method !== "GET" && req.method !== "HEAD") ||
            req.url === "/favicon.ico" ||
            !(
                req.headers.accept === undefined ||
                req.headers.accept === "" ||
                req.headers.accept.includes("text/html") ||
                req.headers.accept.includes("*/*")
            )
        ) {
            return next();
        }

        const url = cleanUrl(req.url!);
        const pathname = decodeURIComponent(url);
        // TODO: FIXME: http://localhost:3000/123
        console.log(pathname, 'pathnamepathname')

        if (pathname.endsWith(".html")) {
            const filePath = path.join(root, pathname);
            if (fs.existsSync(filePath)) {
                debug?.(`Rewriting ${req.method} ${req.url} to ${url}`);
                req.url = url;
                return next();
            }
        } else if (pathname.endsWith("/")) {
            const filePath = path.join(root, pathname, "index.html");
            if (fs.existsSync(filePath)) {
                const newUrl = url + "index.html";
                debug?.(`Rewriting ${req.method} ${req.url} to ${newUrl}`);
                req.url = newUrl;
                return next();
            }
        } else {
            const filePath = path.join(root, pathname + ".html");
            if (fs.existsSync(filePath)) {
                const newUrl = url + ".html";
                debug?.(`Rewriting ${req.method} ${req.url} to ${newUrl}`);
                req.url = newUrl;
                return next();
            }
        }
        if (spaFallback) {
            debug?.(`Rewriting ${req.method} ${req.url} to /index.html`);
            req.url = "/index.html";
        }

        next();
    };
}