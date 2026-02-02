
import { createApp } from "vue";
import App from "./App.vue";
createApp(App).mount("#app");
console.log('环境变量', __VUE_OPTIONS_API__)

export function render() {
    app.innerHTML = "title1";
}
