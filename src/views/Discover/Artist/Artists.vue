<template>
  <div class="ipt">
    <div class="icon" @click="goToArtistDetail">
      <span class="iconfont icon-chaxun-artist"></span>
    </div>
    <div class="input">
      <input type="text" v-model="searchVal" name="" id="" @keyup.enter.native="search" />
    </div>
  </div>
  <div class="search-name">关于你搜的{{searchName}}</div>
  <div class="artists-container">
    <div class="topDesc">
      <div class="top-avatar">头像</div>
      <div class="top-name">名字</div>
      <div class="top-music-count">歌单数</div>
    </div>
    <div class="item" v-for="item in artists" :key="item.id" @click="goToArtistDetail(item.id)">
      <div class="image">
        <img :src="item.picUrl" alt="" />
      </div>
      <div class="name">
        {{ item.name }}
      </div>
      <div class="music-count">
        {{ item.albumSize }}
      </div>
    </div>
  </div>
</template>

<script setup>
import * as getArtistApi from '../../../api/getArtist'
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const artists = ref(null)
const searchName = ref(null)
const searchVal = ref('')

onBeforeMount(() => {
  if(!route.params.name) {
    router.push('/discover/artist')
  }
  searchName.value = route.params.name
  getArtistApi.searchArtist(route.params.name).then(res => {
    artists.value = res.data.result.artists
  })
})
const search = () => {
  if (searchVal.value === '') {
    ElMessage({
      message: '搜索框不能为空',
      type: 'warning'
    })
    return
  }
  getArtistApi.searchArtist(searchVal.value).then(res => {
    searchName.value = searchVal.value
    artists.value = res.data.result.artists
    searchVal.value = ""
  })
}
const goToArtistDetail = (id) => {
  router.push("/artistdetail/" + id)
}
</script>

<style scoped>
.artists-container {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  gap: 20px 0px;
  margin-top: 10px;
  padding-left: 100px;
  margin-bottom: 200px;
}
.search-name {
  font-size: 25px;
  padding-top: 100px;
  box-sizing: border-box;
  margin-top: 20px;
  color: white;
  height: 300px;
  font-weight: 400;
  text-align: center;
  background: url(https://y.qq.com/mediastyle/yqq/img/bg_search.jpg?max_age=2592000) no-repeat;
}
.topDesc {
  display: flex;
  height: 20px;
  grid-area: 1/1/2/3;
  font-size: 14px;
  color: var(--normal-words);
}
.top-avatar {
  width: 65px;
}
.top-name {
  margin-left: 50px;
  width: 200px;
}
.top-music-count {
  margin-left: 50px;
}
.item {
  display: flex;
  height: 60px;
  cursor: pointer;
}
.item:hover {
  color: var(--qqmusic-words);
}
.item:hover .image img {
  height: 70px;
  width: 70px;
}
.name {
  line-height: 60px;
  margin-left: 50px;
  width: 200px;
  overflow: hidden;
}
.music-count {
  line-height: 60px;
  margin-left: 50px;
}
.item .image {
  height: 60px;
  width: 60px;
  padding: 5px;
}
.item .image img {
  height: 50px;
  width: 50px;
  transition: all .3s;
}


.ipt {
  height: 30px;
  width: 100%;
  margin-top: 10px;
  display: flex;
}
.ipt .input {
  width: 220px;
  height: 35px;
  overflow: hidden;
  transition: all 0.2s;
}
.ipt input {
  line-height: 30px;
  height: 30px;
  width: 200px;
  outline: none;
  padding-left: 10px;
  font-size: 16px;
}
.icon {
  display: inline-block;
  line-height: 30px;
  padding-top: 1px;
  width: 50px;
  height: 30px;
  text-align: center;
}
</style>
