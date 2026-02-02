/// <reference types="vite/client" />
declare interface ViteEnv { 
  VITE_APP_TITLE: string
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_DROP_CONSOLE: boolean
}

//定义映射类型，将属性设置为只读
type ReadonlyProps<T> = {
  readonly [P in keyof T]: T[P]
}

interface ImportMetaEnv extends ReadonlyProps<ViteEnv>{
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}