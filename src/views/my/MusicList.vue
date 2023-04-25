<template>
  <div class="musiclit-top-container" @click="handleMusicListClick">
    <div class="musiclist-name">
      <div class="image">
        <img :src="data.coverImgUrl" alt="">
      </div>
      <div class="name">
        {{data.name}}
      </div>
    </div>
    <div class="music-count">{{data.trackCount}}首</div>
    <div class="maker">{{data.creator.nickname}}</div>
    <div class="lisetner">{{playCount}}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter } from 'vue-router'
import * as storeMusicPlayList from '../../store/musicPlayList' 


const props = defineProps(['data'])
const playCount = ref('0')
const router = useRouter()

// console.log(props.data)
if(props.data.playCount >= 10000) {
  playCount.value = (props.data.playCount / 10000).toFixed(2) + '万'
}else if(props.data.playCount >= 100000000) {
  playCount.value = (props.data.playCount / 100000000).toFixed(2) + '亿'
}else {
  playCount.value = props.data.playCount
}
const handleMusicListClick = () => {
  storeMusicPlayList.setId(props.data.id)
  storeMusicPlayList.setCoverImg(props.data.coverImgUrl)
  storeMusicPlayList.setTitle(props.data.name)
  storeMusicPlayList.setDesc(props.data.description)
  router.push('/playlistdetails')
}
</script>

<style scoped>
.musiclit-top-container {
  box-sizing: border-box;
  padding-left: 15px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  display: flex;
  font-size: 15px;
  color: var(--normal-words);
  cursor: pointer;
  transition: all .3s;
}
.musiclit-top-container:hover {
  background-color: var(--white-background-color);
}
.musiclist-name {
  width: 50%;
  display: flex;
}
.musiclist-name .image {
  padding: 10px;
}
.musiclist-name .image img {
  height: 40px;
  width: 40px;
}
.musiclist-name .name {

}
.music-count {
  width: 20%;
}
.maker {
  width: 20%;
}
.listener {
  width: 10%;
}
</style>