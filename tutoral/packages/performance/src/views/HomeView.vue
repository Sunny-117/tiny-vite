<template>
<div class="band">
  <el-skeleton style="width: 240px" :loading="isLoading" animated :count="3">
    <template #template>
      <el-skeleton-item variant="image" style="width: 400px; height: 267px" />
      <div style="padding: 14px">
        <el-skeleton-item variant="h3" style="width: 50%" />
        <div
          style="
            display: flex;
            align-items: center;
            justify-items: space-between;
            margin-top: 16px;
            height: 16px;
          "
        >
          <el-skeleton-item variant="text" style="margin-right: 16px" />
          <el-skeleton-item variant="text" style="width: 30%" />
        </div>
      </div>
    </template>
    <template #default>
      <div v-for="(card,index) in state" :class="`item-${index+1}`">
      <a href="#" class="card">
        <div class="thumb" :style="`background-image: url(${card.download_url})`"></div>
        <article>
          <h1>Lorem ipsum dolor sit amet consectetur.</h1>
          <span>{{card.author}}</span>
        </article>
      </a>
    </div>
    </template>
  </el-skeleton>
</div>
</template>
<script setup lang="ts">
import { ElSkeleton,ElSkeletonItem } from 'element-plus';
import { useAsyncState } from '@vueuse/core'
const { state, isLoading } = useAsyncState(async () => {
  const res = await fetch('https://picsum.photos/v2/list?page=3&limit=10')
  return await res.json()
}, {});

</script>
<style lang="scss">
.band {
  width: 90%;
  max-width: 1240px;
  margin: 8px auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 20px;
}

@media only screen and (min-width: 500px) {
  .band {
    grid-template-columns: 1fr 1fr;
  }  
  .item-1 {
    grid-column: 1 / span 2;
  }
  .item-1 h1 {
    font-size: 30px;
  }
  .item-6 {
    grid-column: span 2 / -1;
  }
  .item-6 h1 {
    font-size: 30px;
  }
}

@media only screen and (min-width: 850px) {
  .band {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

/* card */

.card {
  min-height: 100%;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #444;
  position: relative;
  top: 0;
  transition: all .1s ease-in;
}

.card:hover {
  top: -2px;
  box-shadow: 0 4px 5px rgba(0,0,0,0.2);
}

.card article {
  padding: 20px;
  display: flex;
  
  flex: 1;
  justify-content: space-between;
  flex-direction: column;
  
}
.card .thumb {
  padding-bottom: 60%;
  background-size: cover;
  background-position: center center;
}

.card p { 
  flex: 1; /* make p grow to fill available space*/
  line-height: 1.4;
}

/* typography */
h1 {
  font-size: 20px;
  margin: 0;
  color: #333;
}

.card span {
  font-size: 12px;
  font-weight: bold;
  color: #999;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin: 2em 0 0 0;
}
</style>