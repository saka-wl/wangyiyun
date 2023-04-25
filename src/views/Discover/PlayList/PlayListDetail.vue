<template>
  <div class="playlist-detail-container">
    <div class="musiclist-top-desc">
      <MusicListTopDesc :music="playListMusic" />
    </div>
    <div class="musiclist-bottom-songs">
      <div class="songs">
        <div class="topList-item" v-if="playListMusic">
          <musicTopList></musicTopList>
        </div>
        <div class="search-item" v-for="(item, index) in playListMusic" :key="item">
          <musicList :data="item" :index="index" :currentPage="1"></musicList>
        </div>
      </div>
      <div class="words">
        <div class="desc">
          <h3>简介</h3>
          <h4 v-for="item in MusicListDesc">{{ item }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import * as playListApi from '../../../api/getPlayLists'
import * as storeMusicPlayList from '../../../store/musicPlayList'
import MusicListTopDesc from '../../../components/MusicListTopDesc/index.vue'
import * as getSongApi from '../../../api/getSong'
import * as storeMusicData from '../../../store/musicData'

import musicTopList from '../../../components/musicList/musicTopList.vue'
import musicList from '../../../components/musicList/index.vue'
import { readUserAccount } from '../../../store/userLogin'

// 关于歌单的基本信息
const playList = ref(null)
// 关于歌单内的所有歌曲
const playListMusic = ref(null)
// 歌单的介绍
const MusicListDesc = ref([])

onBeforeMount(() => {
  if(storeMusicPlayList.readdesc.value) {
    MusicListDesc.value = storeMusicPlayList.readdesc.value.split('\n')
  }else {
    MusicListDesc.value[0] = '作者没有写简介^-^'
  }
  playListApi.getPlayListDetails(storeMusicPlayList.readId.value).then(res => {
    playListMusic.value = res.data.songs
    if (storeMusicData.musicData.value === null) {
      storeMusicData.setData({
        songs: res.data.songs,
        songCount: res.data.songs.length
      })
    }
  })
  if (readUserAccount.value !== null) {
    getSongApi.UserLikeMusic().then(res => {
      if(res.response && res.response.status === 301) return;
      storeMusicData.setMyLikeMusicList(res.data.ids)
    })
  }
})
</script>

<style scoped>
.topList-item {
  background-color: var(--body-background-color);
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: var(--normal-words);
}
.musiclist-bottom-songs {
  width: 100%;
  display: flex;
}
.songs {
  width: 60%;
  flex: 1 1 auto;
}
.words {
  width: 400px;
  box-sizing: border-box;
  flex: 0 0 400px;
  padding: 30px;
}
.words .desc {
}
.words .desc h4 {
  font-size: 15px;
  font-weight: 400;
  margin-top: 20px;
}
</style>
