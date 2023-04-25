<template>
  <div class="mycollectlist-container" v-if="myLikeLists" >
    <MusicListTop />
    <MusicList v-for="(item, index) in myLikeLists" :key="item.id" :data="item" />
  </div>
</template>

<script setup>
import MusicListTop from './MusicListTop.vue'
import MusicList from './MusicList.vue'
import {getUserPlaylist} from '../../api/getPlayLists'
import {ref, onBeforeMount} from 'vue'
const myLikeLists = ref(null)
onBeforeMount(() => {
  getUserPlaylist().then(res => {
    myLikeLists.value = res.data.playlist
  })
})
</script>

<style scoped>
.mycollectlist-container {
  width: 100%;
  margin-bottom: 200px;
}
</style>