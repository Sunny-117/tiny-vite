<template>
  <div class="photograph-wall">
    <div class="gallery" ref="galleryDom">
      <figure v-for="(month, index) in months" :key="index">
        <img :src="imgUrl(month.img)" :alt="month.title" :title="month.title" />
        <figcaption>{{ month.title }}</figcaption>
        <figcaption>{{ month.moral }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount } from "vue";
const months = [
  { img: "1.jpg", title: "首阳", moral: "团圆时刻，美好新生" },
  { img: "2.jpg", title: "绀（gan）香", moral: "“绀”为颜色，清新优美" },
  { img: "3.jpg", title: "莺时", moral: "春光明媚，万物复苏" },
  { img: "4.jpg", title: "槐序", moral: "初夏幽凉，美不胜收" },
  { img: "5.jpg", title: "鸣蜩（tiao）", moral: "清音歌鸣，鲜花烂漫" },
  { img: "6.jpg", title: "季夏", moral: "出梅入伏，炎炎盛夏" },
  { img: "7.jpg", title: "兰秋", moral: "兰吐芬芳，馨香无比" },
  { img: "8.jpg", title: "南宫", moral: "嫦娥住处，瓜果成熟" },
  { img: "9.jpg", title: "菊月", moral: "菊傲秋霜，落叶归根" },
  { img: "10.jpg", title: "子春", moral: "寒易转暖，误以为春" },
  { img: "11.jpg", title: "葭月", moral: '星寒冬月，葭草"绿头"' },
  { img: "12.jpg", title: "冰月", moral: "冰雪堆积，寒梅傲立" },
];

const imgUrl = computed(
  () => (filename: string) =>
    new URL(`../assets/month/${filename}`, import.meta.url).href
);

const galleryDom = ref<HTMLElement | null>(null);

let timer:NodeJS.Timeout | null = null;
const animStart = () => {
  if (galleryDom.value!.classList.contains("active") == false) {
    galleryDom.value!.classList.add("active");
    timer = setTimeout(() => {
      galleryDom.value && animEnd();
    }, 10000);
  }
};
const animEnd = () => {
  galleryDom.value!.classList.remove("active");
};

const animEvent = () => animStart();

onMounted(() => {
  window.addEventListener("scroll", animEvent, true);
  window.addEventListener("resize", animEvent, true);
});

onBeforeUnmount(() => {
	clearTimeout(timer!); 
	window.removeEventListener("scroll", animEvent, true);
	window.removeEventListener("resize", animEvent, true);
})
</script>

<style scoped>
.photograph-wall {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}
p {
  line-height: 1;
}
a {
  color: crimson;
  text-decoration: none;
}
img {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}
.gallery {
  position: relative;
  left: calc(-1 * var(--adjust-size));
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-width: 100vw;
  padding: 20px;
  -webkit-perspective: 0;
  perspective: 0;
}
.gallery figure:nth-child(7n) {
  --duration: 1s;
  --pin-color: crimson;
}
.gallery figure:nth-child(7n + 1) {
  --duration: 1.8s;
  --pin-color: hotpink;
}
.gallery figure:nth-child(7n + 2) {
  --duration: 1.3s;
  --pin-color: magenta;
}
.gallery figure:nth-child(7n + 3) {
  --duration: 1.5s;
  --pin-color: orangered;
}
.gallery figure:nth-child(7n + 4) {
  --duration: 1.1s;
  --pin-color: darkorchid;
}
.gallery figure:nth-child(7n + 5) {
  --duration: 1.6s;
  --pin-color: deeppink;
}
.gallery figure:nth-child(7n + 6) {
  --duration: 1.2s;
  --pin-color: mediumvioletred;
}
.gallery figure:nth-child(3n) {
  --angle: 3deg;
}
.gallery figure:nth-child(3n + 1) {
  --angle: -3.3deg;
}
.gallery figure:nth-child(3n + 2) {
  --angle: 2.4deg;
}
.gallery figure:nth-child(odd) {
  --direction: alternate;
}
.gallery figure:nth-child(even) {
  --direction: alternate-reverse;
}
.gallery figure {
  --angle: 3deg;
  --count: 5;
  --duration: 1s;
  --delay: calc(-0.5 * var(--duration));
  --direction: alternate;
  --pin-color: red;

  position: relative;
  display: inline-block;
  margin: var(--adjust-size);
  padding: 0.5rem;
  border-radius: 5px;
  box-shadow: 0 7px 8px rgba(0, 0, 0, 0.4);
  width: 100%;
  height: auto;
  text-align: center;
  background-color: ghostwhite;
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;

  transform-origin: center 0.22rem;
  will-change: transform;
  break-inside: avoid;
  overflow: hidden;
  outline: 1px solid transparent;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.gallery.active figure {
  animation-duration: var(--duration), 1.5s;
  animation-delay: var(--delay),
    calc(var(--delay) + var(--duration) * var(--count));
  animation-timing-function: ease-in-out;
  animation-iteration-count: var(--count), 1;
  animation-direction: var(--direction), normal;
  animation-fill-mode: both;
  animation-name: swing, swingEnd;
}
.gallery figure:after {
  position: absolute;
  top: 0.22rem;
  left: 50%;
  width: 0.7rem;
  height: 0.7rem;
  content: "";
  background: var(--pin-color);
  border-radius: 50%;
  box-shadow: -0.1rem -0.1rem 0.3rem 0.02rem rgba(0, 0, 0, 0.5) inset;
  filter: drop-shadow(0.3rem 0.15rem 0.2rem rgba(0, 0, 0, 0.5));
  transform: translateZ(0);
  z-index: 2;
}
figure img {
  aspect-ratio: 1 /1;
  width: 100%;
  object-fit: cover;
  display: block;
  border-radius: 5px;
  margin-bottom: 10px;
  z-index: 1;
}
figure figcaption {
  font-size: 14px;
  font-weight: 400;
  z-index: 1;
}
figure h2 {
  color: crimson;
  font-size: 22px;
}
figure p {
  font-size: 17px;
}
figure small {
  font-size: 12px;
}
figure > div {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
@keyframes swing {
  0% {
    transform: rotate3d(0, 0, 1, calc(-1 * var(--angle)));
  }
  100% {
    transform: rotate3d(0, 0, 1, var(--angle));
  }
}
@keyframes swingEnd {
  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}
#info {
  position: relative;
  text-align: center;
  z-index: 1;
}
#info a {
  font-size: 1.1rem;
}
/*
@media (orientation: landscape) {
	.gallery {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
}
*/
@media (min-width: 800px) {
  .gallery {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
