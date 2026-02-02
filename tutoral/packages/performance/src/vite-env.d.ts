/// <reference types="vite/client" />
/// <reference types="lodash-es" />
/// <reference types="lodash" />


declare interface ViteEnv{
  VITE_APP_TITLE: string
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_API_URL: string
  VITE_IMG_BASE_URL: string
  VITE_DROP_CONSOLE: boolean
  VITE_BUILD_COMPRESS: 'gzip' | 'brotliCompress' | 'none'
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
  VITE_USER_NODE_ENV: string
}
// 映射类型，将属性设置为只读
type ReadonlyProps<T> = {
  readonly [P in keyof T]: T[P];
};

interface ImportMetaEnv extends ReadonlyProps<ViteEnv>{
}
