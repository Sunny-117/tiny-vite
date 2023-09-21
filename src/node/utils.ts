import os from "os";
import path from "path";
import { HASH_RE, JS_TYPES_RE, QEURY_RE } from "./constants";

export function slash(p: string): string {
  return p.replace(/\\/g, "/");
}

export const isWindows = os.platform() === "win32";

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

export const isJSRequest = (id: string): boolean => {
  id = cleanUrl(id);
  if (JS_TYPES_RE.test(id)) {
    return true;
  }
  if (!path.extname(id) && !id.endsWith("/")) {
    return true;
  }
  return false;
};

export const cleanUrl = (url: string): string =>
  url.replace(HASH_RE, "").replace(QEURY_RE, "");

export const isCSSRequest = (id: string): boolean =>
  cleanUrl(id).endsWith(".css");

export const isImportRequest = (id: string): boolean =>
  cleanUrl(id).endsWith("?import");

export const removeImportQuery = (url: string): string =>
  url.replace(/\?import$/, "");

export function getShortName(file: string, root: string) {
  return file.startsWith(root + "/") ? path.posix.relative(root, file) : file;
}
