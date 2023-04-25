<template>
  <div class="top-list-container">
    <h3>热搜排行榜</h3>
    <div class="items">
      <Item :data="hotMusicData"></Item>
    </div>
  </div>
</template>

<script setup>
import * as getTopMusicApi from '../../../api/getTopMusic'
import Item from './item.vue'
import { ref, onBeforeMount } from 'vue'

const hotMusicData = ref([])

onBeforeMount(() => {
  getTopMusicApi.getHotMusic().then(res => {
    hotMusicData.value = res.data.data
  })
})
</script>

<style scoped>
.top-list-container {
  width: 100%;
  margin-top: 50px;
}
.top-list-container > h3 {
  font-size: 30px;
  color: var(--normal-words);
  width: 15%;
  margin: 20px auto;
}
</style>
