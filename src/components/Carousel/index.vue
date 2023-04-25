<template>
  <div class="carousel-container">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in imgSrc" :key="item.imageUrl">
        <el-image style="width: 100%; height: 100%" :src="item.imageUrl" fit="contain" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
const props = defineProps({
  imgSrc: Array
})
</script>

<style scoped>
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  /* background-color: #99a9bf; */
}

.el-carousel__item:nth-child(2n + 1) {
  /* background-color: #d3dce6; */
}
.carousel-container {
  width: 100%;
  height: 100%;
}
</style>
