/*
import { Plugin } from 'vite';

// 虚拟模块的名称
const virtualFibModuleId = 'virtual:fib';

// 虚拟模块的名称需要做一下处理
// Vite中约定，对于虚拟模块，解析后的路径需要加上'\0'前缀
const resolvedVirtualFibModuleId = `\0${virtualFibModuleId}`;

export default function vitePluginVirtualModule(): Plugin { 
  return {
    name: 'vite-plugin-virtual-module',
    resolveId(id) { 
      if (id === virtualFibModuleId) { 
        return resolvedVirtualFibModuleId;
      }
    },
    load(id) { 
      if (id === resolvedVirtualFibModuleId) { 
        return `export default function fib(n){
          if (n < 2) {
            return n;
          }
          return fib(n - 1) + fib(n - 2);
        }`;
      }
    }
  }
}
*/


import { Plugin, ResolvedConfig } from 'vite';
import stringify from 'json-stringify-safe';
const prefix = 'virtual:';

type VirtualModule = {
  [path: string]: (config?: ResolvedConfig) => string
}

// 策略模式
const virtualModules:VirtualModule = {
  '\0virtual:fib': () => `export default function fib(n){ return n < 2 ? n : fib(n - 1) + fib(n - 2); }`,
  '\0virtual:config':(config?:ResolvedConfig) => `export default function config() { return ${stringify(config)}; }`
}

export default function vitePluginVirtualModule(): Plugin { 
  let config: ResolvedConfig | undefined;
  return {
    name: 'vite-plugin-virtual-module',
    configResolved(resolvedConfig) { 
      config = resolvedConfig;
    },
    resolveId(id) { 
      if (id.startsWith(prefix)) { 
        return `\0${id}`;
      }
    },
    load(id) { 
      if (id.startsWith(`\0${prefix}`)) { 
        return virtualModules[id](config);
      }
    }
  }
}
