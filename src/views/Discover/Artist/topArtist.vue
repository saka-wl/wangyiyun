<template>
  <div class="top-artist-container">
    <h3>热门歌手</h3>
    <Carousel @toPages="handlePageChange">
      <div
        class="top-artist-content"
        :style="{
          marginLeft: -((currentPage - 1) * 100) + '%'
        }"
      >
        <div class="artist-item" v-for="(item, index) in artists" @click="goToArtistDetail(item)">
          <div class="image">
            <img :src="item.picUrl" alt="" />
          </div>
          <div class="name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </Carousel>
    <div class="chooseBtn">
      <div class="lan-type">
        <div
          class="lan-block"
          v-for="item in lanTypeInfo"
          :class="{
            checked: lanType === item.type
          }"
          @click="changeLanType(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="song-type">
        <div
          class="song-type-block"
          :class="{
            checked: songType === item.type
          }"
          v-for="item in songTypeInfo"
          @click="changeSongType(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="artist-bottom">
      <div class="item" v-for="item in artistAllMessage" @click="goToArtistDetail(item)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import Carousel from '../../../components/Carousel/newCarousel.vue'
import { ref, onBeforeMount } from 'vue'
import * as getArtistApi from '../../../api/getArtist'
import { useRouter } from 'vue-router'

const artists = ref(null)
const artistAllMessage = ref([])
const artistsBottom = ref(null)
const currentPage = ref(1)
const router = useRouter()
const lanType = ref(-1)
const songType = ref(-1)
const lanTypeInfo = [
  { name: '全部', type: -1 },
  { name: '华语', type: 7 },
  { name: '欧美', type: 96 },
  { name: '日本', type: 8 },
  { name: '韩国', type: 16 },
  { name: '其他', type: 0 }
]
const songTypeInfo = [
  { name: '全部', type: -1 },
  { name: '男歌手', type: 1 },
  { name: '女歌手', type: 2 },
  { name: '乐队', type: 3 }
]

const getAllArtists = () => {
  artistAllMessage.value = []
  for (let i = 1; i <= 10; i++) {
    getArtistApi.getArtistList(i, 30, songType.value,-1, lanType.value).then(res => {
      artistAllMessage.value = artistAllMessage.value.concat(res.data.artists)
    })
  }
}

onBeforeMount(async () => {
  getArtistApi.getTopArtist(15, 1).then(res => {
    artists.value = res.data.artists
  })
  getAllArtists()
})

const changeLanType = val => {
  lanType.value = val
  getAllArtists()
}

const changeSongType = val => {
  songType.value = val
  getAllArtists()
}

const handlePageChange = val => {
  if (val === 'pre') {
    if (currentPage.value === 1) {
      currentPage.value = 3
    } else if (currentPage.value === 2) {
      currentPage.value = currentPage.value - 1
    } else if (currentPage.value === 3) {
      currentPage.value = currentPage.value - 1
    }
  } else if (val === 'next') {
    if (currentPage.value === 3) {
      currentPage.value = 1
    } else if (currentPage.value === 2) {
      currentPage.value = currentPage.value + 1
    } else if (currentPage.value === 1) {
      currentPage.value = currentPage.value + 1
    }
  }
}

const goToArtistDetail = it => {
  router.push('/artistdetail/' + it.id)
}
</script>

<style scoped>
.top-artist-container {
}
.top-artist-container h3 {
  font-size: 25px;
  margin-top: 20px;
  text-align: center;
  color: var(--normal-words);
  margin-bottom: 50px;
}
.carousel-container {
}
.artist-item {
  height: 100px;
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
.top-artist-content {
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 20px 20px;
  width: 300%;
  height: 150px;
  transition: all 0.4s;
}
.top-artist-content .name {
  text-align: center;
  margin-top: 10px;
}
.artist-bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 30px;
  margin-bottom: 150px;
}
.item {
  width: 20%;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
}
.item:hover {
  color: var(--qqmusic-words);
}
.chooseBtn {
  margin-top: 50px;
  margin-left: 100px;
}
.lan-type {
  display: flex;
}
.lan-block {
  height: 20px;
  padding: 5px;
  border-radius: 2px;
  line-height: 20px;
  text-align: center;
  margin-right: 25px;
  cursor: pointer;
  font-size: 14px;
}
.song-type {
  display: flex;
  margin-top: 15px;
}
.song-type-block {
  height: 20px;
  padding: 5px;
  line-height: 20px;
  border-radius: 2px;
  text-align: center;
  margin-right: 25px;
  cursor: pointer;
  font-size: 14px;
}
.lan-block:hover {
  color: var(--qqmusic-words);
}
.song-type-block:hover {
  color: var(--qqmusic-words);
}
.checked {
  background-color: var(--border-hovered);
  color: white;
}
</style>
