<template>
  <div class="artist-details-container">
    <div class="top-message">
      <TopMessage @playAll="handlePlayAllMusic"></TopMessage>
    </div>
    <div class="music">
      <h2>热门歌曲</h2>
      <MusicTop></MusicTop>
      <MusicContent v-for="(item, index) in musics" :data="item" :currentPage="1" :index="index" @clickPlay="handleClickPlay(item.id)"></MusicContent>
    </div>
    
  </div>
</template>

<script setup>
import TopMessage from './topMessage.vue'
import MusicTop from '../../components/musicList/musicTopList.vue'
import MusicContent from '../../components/musicList/index.vue'
import * as getArtistApi from '../../api/getArtist'
import { useRoute } from 'vue-router'
import { ref, onBeforeMount } from 'vue'
import * as storeMusicData from '../../store/musicData'
import { UserLikeMusic } from '../../api/getSong'

const route = useRoute()
const musics = ref([])

onBeforeMount(() => {
  UserLikeMusic().then(res => {
    if(res.data) {
      storeMusicData.setMyLikeMusicList(res.data.ids)
    }
  })
  getArtistApi.getArtistTopSongs(route.params.id).then(res => {
    musics.value = res.data.songs
    if (storeMusicData.musicData.value === null) {
      storeMusicData.setData({
        songCount: res.data.songs.length,
        songs: res.data.songs
      })
      storeMusicData.setSinglePage(true)
    }
  })
})

const handleClickPlay = (id) => {
  storeMusicData.setData({
    songCount: musics.value.length,
    songs: musics.value
  })
  storeMusicData.setSinglePage(true)
  storeMusicData.setStatus('playing')
  storeMusicData.setId(id)
}

const handlePlayAllMusic = () => {
  storeMusicData.setData({
    songCount: musics.value.length,
    songs: musics.value
  })
  storeMusicData.setSinglePage(true)
  storeMusicData.setStatus('playing')
  storeMusicData.setId(musics.value[0].id)
}
</script>

<style scoped>
.music h2 {
  margin-bottom: 20px;
}
</style>
