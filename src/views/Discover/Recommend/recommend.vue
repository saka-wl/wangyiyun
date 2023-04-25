<template>
<div class="recommend-container">
  <h3>每日推荐歌单</h3>
  <Carousel @toPages="handleToPages">
    <div class="recommend-content" :style="{
      marginLeft: (-(currentPage-1)*100) + '%'
    }">
      <div class="content-item" v-for="(item, index) in recommendMusic" :key="index" @click="handleRecomMusicClick(item.id)">
        <div class="left-image">
          <img :src="item.al.picUrl" alt="">
        </div>
        <div class="right-msg">
          <div class="name">
            {{item.name}}
          </div>
          <div class="artist">
            {{item.ar[0].name}}
          </div>
        </div>
      </div>
    </div>
  </Carousel>
</div>
</template>

<script setup>
import Carousel from '../../../components/Carousel/newCarousel.vue'
import { getRecommendMusic } from '../../../api/getSong'
import { ref, onBeforeMount } from 'vue'
import MusicItem from '../../../components/musicList/index.vue'
import * as storeMusicMessage from '../../../store/musicData.js'

const recommendMusic = ref(null)
const currentPage = ref(1)

onBeforeMount(() => {
  getRecommendMusic().then(res => {
    if(res.data.code === 200) {
      recommendMusic.value = res.data.data.dailySongs.splice(0, 27)
    }else {
      recommendMusic.value = null
    }
  })
})

const handleToPages = (val) => {
  if(val === 'pre') {
    if(currentPage.value === 1) {
      currentPage.value = 3
    }else {
      currentPage.value --
    }
  }else if(val ==="next") {
    if(currentPage.value === 3) {
      currentPage.value = 1
    }else {
      currentPage.value ++
    }
  }
}

const handleRecomMusicClick = (id) => {
  storeMusicMessage.setData({
    songCount: recommendMusic.value.length,
    songs: recommendMusic.value
  })
  storeMusicMessage.setSinglePage(true)
  storeMusicMessage.setId(id)
  storeMusicMessage.setStatus("playing")
}

</script>

<style scoped>
.recommend-container {

}
.recommend-container>h3 {
  font-size: 30px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.recommend-content {
  width: 300%;
  display: flex;
  flex-wrap: wrap;
  transition: all .3s;
  justify-content: space-evenly;
}
.content-item {
  height: 100px;
  cursor: pointer;
  margin: 15px;
  width: 10%;
  display: flex;
  border-bottom: 1px solid var(--body-background-color);
}
.left-image {
  height: 80px;
  width: 80px;
  flex: 0 0 80px;
  margin: auto 10px;
  overflow: hidden;
}
.left-image img {
  height: 80px;
  width: 80px;
  transition: all .3s;
  transform-origin: center center;
}
.left-image img:hover {
  transform: scale(1.3);
}
.right-msg {
  height: 50%;
  flex: 1 1 auto;
  margin: auto 10px;
  overflow: hidden;
}
.right-msg .name {
  font-size: 18px;
  font-weight: 500;
  color: var(--normal-words);
}
.right-msg .artist {
  font-size: 15px;
  font-weight: 400;
  margin-top: 5px;
  color: var(--words-gray);
}
</style>