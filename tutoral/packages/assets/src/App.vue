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
    <ImageShow />
  </div>
</template>

<script setup lang="ts">
import viteSvgUrl from '@/assets/vite.svg';
import rocketSvgRaw from '@/assets/rocket.svg?raw';
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