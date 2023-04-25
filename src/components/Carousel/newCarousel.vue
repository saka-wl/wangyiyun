<template>
  <div class="carousel-container">
    <div class="block left-btn" @click="toPages('pre')">
      <i class="iconfont icon-chevron-left"></i>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="block right-btn" @click="toPages('next')">
      <i class="iconfont icon-chevron-right"></i>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['toPages'])
const toPages = (val) => {
  emit('toPages', val)
}
</script>

<style scoped>
.carousel-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.block {
  height: 150px;
  width: 80px;
  transition: all .3s;
  background-color: white;
  text-align: center;
}
.block i {
  font-size: 60px;
  line-height: 150px;
}
.block:hover {
  background-color: var(--border-dark-color);
}
.content {
  width: 100%;
  overflow: hidden;
}
</style>
