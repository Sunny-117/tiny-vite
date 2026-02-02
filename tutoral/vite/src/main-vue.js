


import { createApp } from "vue";
import App from "./App.vue";
createApp(App).mount("#app");
console.log('环境变量', __VUE_OPTIONS_API__)

// import { init, parse } from 'es-module-lexer';
// import { createApp } from 'vue'
// import App from './App.vue'

// function demo() {
//   console.log('demo')
// }
// demo();
// const app = createApp()
// console.log('vue组件App： ', App)
// console.log(app);

// (async () => {
//   await init;
//   const [imports, exports] = parse(`import {debounce} from 'lodash';import vue from 'vue';\nexport var age = 5;export const name = 'sunny'`);
//   console.log(imports);
//   console.log(exports);
// })();
