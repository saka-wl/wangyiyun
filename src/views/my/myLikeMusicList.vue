<template>
  <div class="mylike-musiclist-container">
    <MusicTopItem />
    <MusicItem v-for="(item, index) in myLikeMusicList" :key="item.id" :data="item" :currentPage="1" :index="index" @clickPlay="handleClickPlay(item.id)"> </MusicItem>
  </div>
</template>

<script setup>
import { UserLikeMusic, getSongDetail } from '../../api/getSong'
import { ref, onBeforeMount } from 'vue'
import * as storeMusicData from '../../store/musicData'
import { readUserAccount } from '../../store/userLogin'
import MusicItem from '../../components/musicList/index.vue'
import MusicTopItem from '../../components/musicList/musicTopList.vue'

const myLikeMusicList = ref(null)

onBeforeMount(() => {
  if (!myLikeMusicList.value && readUserAccount.value) {
    UserLikeMusic().then(res => {
      if (res.data && res.data.ids) {
        storeMusicData.setMyLikeMusicList(res.data.ids)
        let ids = null
        if (res.data.ids.length > 1) {
          ids = res.data.ids.join(',')
        } else if (res.data.ids.length === 0) {
          return
        } else {
          ids = res.data.ids[0]
        }
        getSongDetail(ids).then(res => {
          myLikeMusicList.value = res.data.songs
        })
      }
    })
  }
})
const handleClickPlay = id => {
  storeMusicData.setData({
    songs: myLikeMusicList.value,
    songCount: myLikeMusicList.value.length
  })
  storeMusicData.setId(id)
  storeMusicData.setStatus("playing")
  storeMusicData.setSinglePage(true)
}
</script>

<style scoped>
.mylike-musiclist-container {
  width: 100%;
  padding-bottom: 100px;
}
</style>
