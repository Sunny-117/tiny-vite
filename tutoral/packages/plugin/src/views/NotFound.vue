<template>
  <div title="404">404</div>
  <p :class="$content.text">Page Not Found</p>
</template>

<script setup lang="ts">
import $content from "../styles/content.module.scss";
</script>

<style scoped lang="scss">

div{
  display: flex;
  color: #fff;
  font-size: 96px;
  font-family: 'Fira Mono', monospace;
  letter-spacing: -7px;
  animation: glitch 1s linear infinite;
  &::before,
  &::after{
    content: attr(title);
    position: absolute;
    left: 0;
  }
  &::before{
    animation: glitchTop 1s linear infinite;
    clip-path: polygon(0 0, $pct100 0, $pct100 $pct33, 0 $pct33);
  }
  &::after{
    animation: glitchBottom 1.5s linear infinite;
    clip-path: polygon(0 $pct67, $pct100 $pct67, $pct100 $pct100, 0 $pct100);
    
  }
}

@keyframes glitch{
  2%,64%{
    
    transform: translate(2px,0) skew(0deg);
  }
  4%,60%{
    
    transform: translate(-2px,0) skew(0deg);
  }
  62%{
    transform: translate(0,0) skew(5deg); 
  }
}

@keyframes glitchTop{
  2%,64%{
    transform: translate(2px,-2px);
  }
  4%,60%{
    transform: translate(-2px,2px);
  }
  62%{
    transform: translate(13px,-1px) skew(-13deg); 
  }
}



@keyframes glitchBottom{
  2%,64%{
    transform: translate(-2px,0);
  }
  4%,60%{
    transform: translate(-2px,0);
  }
  62%{
    transform: translate(-22px,5px) skew(21deg); 
  }
}
</style>
