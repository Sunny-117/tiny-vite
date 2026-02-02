<template>
  <div class="season">
    <button class="btn-primary" @click="handleChange" value="spring">春</button>
    <button class="btn-primary" @click="handleChange" value="summer">夏</button>
    <button class="btn-primary" @click="handleChange" value="autumn">秋</button>
    <button class="btn-primary" @click="handleChange" value="winter">冬</button>
  </div>

  <div class="card">
    <!-- <img src="@/assets/summer.jpg" alt=""> -->
    <!-- <img :src="spring" alt=""> -->
    <!-- <img :src="spring" alt=""> -->

    <!-- 使用import动态导入的方式 -->
    <!-- <img :src="imgPath" alt=""> -->

    <!-- 使用new URL的方式处理 -->
    <img :src="url" alt="">
  </div>

  <!-- 通过import.meta.glob显示多张图片 -->
  <div class="card" v-for="(img,index) in imgUrls" :key="index">
    <img :src="img" alt="">
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import md from '@/assets/readme.md?raw'
console.log("🚀 ~ md:", md)


// import spring from "@/assets/spring.jpg";

// 直接引入变量的方式是没有效果的，vite并不会帮我们去解析路径
// const spring = ref('/src/assets/spring.jpg');

// import spring from '@/assets/spring.jpg';
// const imgPath = ref(spring);
// const handleChange = (e:Event) => { 
//   const v = (e.target as HTMLButtonElement).value;
//   import(`@/assets/${v}.jpg`).then((res) => { 
//     console.log(res);
//     imgPath.value = res.default;
//   })
// }

// 使用new URL的方式处理变量的静态资源路径
const imgPath = ref('spring');
// 计算属性处理URL地址
const url = computed(() => { 
  // const href = new URL(`../assets/${imgPath.value}.jpg`, import.meta.url).href;
  const href = new URL(`../assets/${imgPath.value}.jpg`, import.meta.env.VITE_IMG_BASE_URL).href;
  
  console.log("🚀 ~ href:", href)

  return href;
})
// 事件切换路径字符串
const handleChange = (e: Event) => { 
  const v = (e.target as HTMLButtonElement).value;
  imgPath.value = v;
}

// 使用import.meta.glob 导入多个模块文件
// 这个api不仅仅是适用于静态资源的，更多的时候是处理js动态文件的，比如动态路由
const monthImgs = import.meta.glob('@/assets/month/*.jpg', { eager: true });
// 返回的是由键值对组成的对象
// key（string） value(module  default)
// console.log(monthImgs)

const imgUrls = Object.values(monthImgs).map((mod) => {
  return (mod as {default:string}).default
})
console.log(imgUrls);
</script>

<style scoped lang="scss">
.season {
  padding-top: 30px;
  /* height: 100vh;
  background-image: url(../assets/spring.jpg); */
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s;
}
.btn-primary {
  background-color: #00a0e9;
  border-color: #00a0e9;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 0 10px;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: #008cc4;
    border-color: #008cc4;
  }
  &:focus {
    background-color: #0077b3;
    border-color: #0077b3;
  }
}
.card {
  display: inline-block;
  margin: 16px;
  width: 50%;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-shadow: 0 0 3rem -1rem rgba(0, 0, 0, 0.5);
  transition: transform 0.3s;
  img {
    max-width: 100%;
    object-fit: cover;
  }
  &:hover {
    transform: translateY(-0.5rem) scale(1.0125);
    box-shadow: 0 0.5em 3rem -1rem rgba(0, 0, 0, 0.5);
  }
}
</style>
