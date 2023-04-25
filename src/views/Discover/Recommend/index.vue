<template>
  <div class="recommend-container">
    <Carousel :imgSrc="imgUrl" v-if="imgUrl" />
    <div class="newSongRecommend">
      <NewSongs />
    </div>
    <div class="songListRecommend">
      <NewList />
    </div>

    <div class="music-recommend" v-if="readUserAccount && readUserAccount.status !== -10">
      <RecommendMusic />
    </div>
    <el-backtop :right="20" :bottom="150" />
    <div style="height: 300px"></div>
  </div>
</template>

<script setup>
import Carousel from '../../../components/Carousel/index.vue'
import RecommendMusic from './recommend.vue'
import { getBanner } from '../../../api/getBanner'
import { ref } from 'vue'
import NewSongs from './newSongs.vue'
import NewList from './newList.vue'
import { readUserAccount } from '../../../store/userLogin'

let imgUrl = ref(null)
getBanner().then(res => {
  imgUrl.value = res.data.banners
})
</script>

<style scoped>
.recommend-container {
  padding-top: 30px;
  height: 340px;
  color: var(--normal-words);
}
.songListRecommend {
  margin-top: 80px;
}
.music-recommend {
  margin-top: 50px;
}
</style>
