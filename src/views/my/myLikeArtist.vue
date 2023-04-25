<template>
<div class="mylike-artist-container">
  <div class="artist-item" v-for="(item, index) in likedArtist" @click="goToArtistDetail(item.id)">
    <div class="image">
      <img :src="item.picUrl" alt="" />
    </div>
    <div class="name">
      {{ item.name }}
    </div>
    <div class="album">
      <span>歌单数</span>{{item.albumSize}}
    </div>
  </div>
</div>
</template>

<script setup>
import {ref, onBeforeMount} from 'vue'
import {getUserLikeArtists} from '../../api/getArtist'
import {useRouter} from 'vue-router'

const router = useRouter()
const likedArtist = ref([])

onBeforeMount(() => {
  getUserLikeArtists().then(res => {
    likedArtist.value = res.data.data
  })
})

const goToArtistDetail = (id) => {
  router.push("/artistdetail/" + id)
}
</script>

<style scoped>
.mylike-artist-container {
  padding-bottom: 250px;
}
.artist-item {
  height: 200px;
  width: 200px;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.artist-item .image {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin: 0 auto;
}
.artist-item .image img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
}
.mylike-artist-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 20px;
  width: 100%;
  height: 150px;
  transition: all 0.4s;
  margin-bottom: 150px;
}
.mylike-artist-container .name {
  text-align: center;
  margin-top: 10px;
}
.mylike-artist-container .album {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>