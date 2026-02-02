<template>
  <div>
    <img src="@/assets/logo.png" alt="">
    <img src="@/assets/vite.svg" alt="">
    <br>
    <img :src="viteSvgUrl" alt="">

    <br>
    <img src="@/assets/rocket.svg" alt="">
    <br>
    <div v-html="rocketSvgRaw" class="svg-container"></div>
    <!-- 
    <h2>welcome!!</h2>
    <input type="text" @input="handleInput">
    <button @click="handleCounter">count is {{ count }}</button> 
    -->
    <ImageShow />
  </div>
</template>

<script setup lang="ts">
import viteSvgUrl from '@/assets/vite.svg';
import rocketSvgRaw from '@/assets/rocket.svg?raw';
import vfib from 'virtual:fib';
import config from 'virtual:config';
const conf = config();
console.log(conf);
console.log(vfib(10));
console.log(import.meta.env);

/*
import { ref } from "vue" 
import { debounce } from "lodash-es";
const count = ref(0);
const handleCounter = () => {
  count.value++;
};
const handleInput = debounce((e:Event) => {
  console.log((e.target as HTMLInputElement).value);
}, 1000);
*/

// import NotFound from '@/views/NotFound.vue';
import ImageShow from '@/views/ImageShow.vue';
</script>

<style lang="scss">
.svg-container svg{
  width: 100px;
  height: 100px;
  fill: #f00;
  &:hover{
    fill: #0f0;
  }
}
</style>