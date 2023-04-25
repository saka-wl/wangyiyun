<template>
  <div class="play-list-container">
    <div class="topBanner" v-if="playListMessage">
      <div class="mask">
        <img :src="playListMessage[showIndex].coverImgUrl" alt="" />
      </div>
      <div class="left-image">
        <img :src="playListMessage[showIndex].coverImgUrl" alt="" />
      </div>
      <div class="right-msg">
        <div class="title">{{ playListMessage[showIndex].name }}</div>
        <div class="desc">
          {{ playListMessage[showIndex].description }}
        </div>
      </div>
    </div>
    <div class="classify-btn">
      <div
        class="content"
        :style="{
          height: conentHeight + 'px'
        }"
      >
        <div
          class="classify-item"
          v-for="item in playlistCategory"
          :class="{
            btnChecked: item.name === checkedBtn
          }"
          :key="item.name"
          @click="handlePlayListClick(item.name)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="icon" @click="handleClickIcon">
        <i class="iconfont" :class="topIconClass"></i>
      </div>
    </div>
    <div class="classify-content">
      <div class="classify-content-item" v-for="item in playListMessage" @click="handleContentClick(item)">
        <div class="image">
          <img :src="item.coverImgUrl" alt="" />
        </div>
        <div class="words">{{ item.name }}</div>
      </div>
    </div>
    <div class="pager" v-if="playListMessage">
      <el-pagination background layout="prev, pager, next" @current-change="handlePageChange" :page-size="PLAYLIST_LIMIT" :total="totalPlayList" v-model:current-page="currentPage" />
    </div>
  </div>
</template>

<script setup>
import * as playListApi from '../../../api/getPlayLists'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as storePlayList from '../../../store/musicPlayList'
// 关于歌单的所有分类
const playlistCategory = ref(null)
// 向上还是向下的icon
const topIconClass = ref('icon-xiangxia')
const conentHeight = ref(50)
// 点击了的btn的name
const checkedBtn = ref('全部歌单')
// 当前页数
const currentPage = ref(1)
// 当前分类的数据
const playListMessage = ref(null)
// 当前分类数据的总数
const totalPlayList = ref(0)
// 在首屏展示的
const showIndex = ref(0)
const router = useRouter()

import { PLAYLIST_LIMIT } from '../../../constant/pageLimit'

onMounted(async () => {
  await playListApi.getPlaylistCategory().then(res => {
    playlistCategory.value = res.data.sub
    playlistCategory.value.unshift(res.data.all)
  })
  await playListApi.getPlaylist(checkedBtn.value, PLAYLIST_LIMIT, currentPage.value, 'hot').then(res => {
    playListMessage.value = res.data.playlists
    totalPlayList.value = res.data.total
  })
  let maxCount = 0
  playListMessage.value.forEach((element, index) => {
    if (element.playCount > maxCount) {
      showIndex.value = index
    }
  })
})
const handleClickIcon = () => {
  let flag = playlistCategory.value.length / 16
  if (topIconClass.value === 'icon-xiangshang') {
    topIconClass.value = 'icon-xiangxia'
    conentHeight.value = 50
  } else {
    topIconClass.value = 'icon-xiangshang'
    conentHeight.value = flag * 50 + 20
  }
}
const handlePlayListClick = async name => {
  checkedBtn.value = name
  currentPage.value = 1
  await playListApi.getPlaylist(name, PLAYLIST_LIMIT, currentPage.value, 'hot').then(res => {
    playListMessage.value = res.data.playlists
    totalPlayList.value = res.data.total
  })
  let maxCount = 0
  playListMessage.value.forEach((element, index) => {
    if (element.playCount > maxCount) {
      showIndex.value = index
    }
  })
}
const handlePageChange = async val => {
  currentPage.value = val
  await playListApi.getPlaylist(checkedBtn.value, PLAYLIST_LIMIT, currentPage.value, 'hot').then(res => {
    playListMessage.value = res.data.playlists
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  })
  let maxCount = 0
  playListMessage.value.forEach((element, index) => {
    if (element.playCount > maxCount) {
      showIndex.value = index
    }
  })
}

const handleContentClick = item => {
  storePlayList.setId(item.id)
  storePlayList.setCoverImg(item.coverImgUrl)
  storePlayList.setTitle(item.name)
  storePlayList.setDesc(item.description)
  router.push('/playlistdetails')
}
</script>

<style scoped>
.play-list-container {
  background-color: var(--body-background-color);
  padding: 30px;
}
.topBanner {
  height: 230px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  /* background-size: 100% 100%;
  background-attachment: fixed; */
  border-radius: 20px;
  position: relative;
}
.mask {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 20px;
  z-index: 10;
}
.mask img {
  height: 100%;
  width: 100%;
  border-radius: 20px;
  opacity: 0.2;
  object-fit: cover;
}
.left-image {
  height: 180px;
  flex: 0 0 180px;
  margin-top: 25px;
  margin-left: 40px;
  border-radius: 20px;
  z-index: 99;
}
.left-image img {
  height: 100%;
  width: 100%;
  border-radius: 20px;
}
.right-msg {
  margin-left: 30px;
  margin-top: 25px;
  z-index: 99;
}
.right-msg .title {
  font-size: 20px;
  font-weight: 600;
}
.right-msg .desc {
  font-size: 14px;
  margin-top: 15px;
  line-height: 25px;
  height: 80%;
  overflow: scroll;
}
.classify-btn {
  margin-top: 30px;
  width: 100%;
  display: flex;
}
.classify-btn .content {
  width: 95%;
  overflow-y: hidden;
  display: grid;
  grid-template-columns: repeat(16, calc(6.25% - 20px));
  gap: 20px 20px;
  transition: all 0.4s;
}
.classify-item {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  overflow: hidden;
  background-color: var(--white-background-color);
  cursor: pointer;
  transition: all 0.3s;
}
.classify-item:hover {
  color: var(--border-hovered);
  border-radius: 10px;
}
.btnChecked {
  color: var(--border-hovered);
  border-radius: 10px;
}
.classify-btn .icon {
  width: 5%;
  height: 50px;
  text-align: center;
}
i.iconfont {
  color: var(--words-gray);
}
.classify-content {
  padding-left: 50px;
  padding-right: 50px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.classify-content-item {
  margin-top: 20px;
  width: 18%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-dark-color);
}
.classify-content-item:hover .image img {
  transform: scale(1.2);
  transform-origin: center center;
}
.classify-content-item .image {
  width: 100%;
  height: 28vh;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  cursor: pointer;
}
.classify-content-item .words {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  font-size: 15px;
  overflow: hidden;
}
.classify-content-item .image img {
  height: 100%;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: all 0.4s;
}
.pager {
  margin-top: 20px;
  margin-bottom: 50px;
}
.pager .el-pagination {
  width: 400px;
  margin: 0 auto;
}
</style>
