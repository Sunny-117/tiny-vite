import { Plugin } from 'vite'
export default function testPlugin():Plugin { 
  return {
    name: 'test-plugin',
    // vite独有钩子函数，就是在读取最开始的配置信息
    config(config, configEnv) { 
      console.log("🚀 ~ config:");
    },
    // vite独有钩子,读取最终的配置信息
    configResolved(resolvedConfig) { 
      console.log("🚀 ~ resolvedConfig:")
    },
    // 通用钩子
    options(opts) { 
      console.log("🚀 ~ options:")
    },
    // vite独有钩子，一般都是对开发服务器进行处理
    configureServer(server) { 
      console.log("🚀 ~ configureServer:")
    },
    // 通用钩子
    buildStart() { 
      console.log("🚀 ~ buildStart:")
    },
    // 通用钩子
    buildEnd() {
      console.log("🚀 ~ buildEnd:")
    },
    // 通用钩子
    closeBundle() { 
      console.log("🚀 ~ closeBundle:")
    }
  }
}