<template>
  <div class="musiclist-top-desc">
    <div class="left-image">
      <img :src="image" alt="" />
    </div>
    <div class="right">
      <div class="desc">
        <h1>{{ title }}</h1>
        <h2>folatingdream-</h2>
        <h3>{{ musicData && musicData.songCount }}首</h3>
      </div>
      <div class="btns">
        <div class="playAll block" @click="playAll">
          <i class="iconfont icon-bofang1"></i>
          播放全部
        </div>
        <div
          class="like block"
          @click="handleClickLike"
          :class="{
            liked: isLikeList === true
          }"
        >
          {{ isLikeList ? '取消收藏' : '收藏' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as storeMusicPlayList from '../../store/musicPlayList'
import { musicData, setStatus, setId, setData, setSinglePage } from '../../store/musicData'
import { onBeforeMount, computed, ref } from 'vue'
import * as playListApi from '../../api/getPlayLists'
import {readUserAccount} from '../../store/userLogin'
import { ElMessage } from 'element-plus'

// 我的歌单
// const myPlayList = ref(null)
// 是否收藏
const isLikeList = ref(false)
const props = defineProps(['music'])
const image = computed(() => {
  return storeMusicPlayList.readcoverImg.value
})
const title = computed(() => {
  return storeMusicPlayList.readtitle.value
})
const playAll = () => {
  setData({
    songs: props.music,
    songCount: props.music.length
  })
  setSinglePage(true)
  setId(musicData.value.songs[0].id)
  setStatus('playing')
}
const handleClickLike = () => {
  if(readUserAccount.value === null || readUserAccount.value.status === -10) {
    ElMessage({
    message: '请先登录',
    type: 'warning',
  })
    return
  }
  if (isLikeList.value) {
    playListApi.playlistSubscribe(storeMusicPlayList.readId.value, 2).then(res => {
      isLikeList.value = false
    })
  } else {
    playListApi.playlistSubscribe(storeMusicPlayList.readId.value).then(res => {
      isLikeList.value = true
    })
  }
}
</script>

<style scoped>
.musiclist-top-desc {
  width: 100%;
  display: flex;
}
.left-image {
  width: 300px;
  height: 300px;
  padding: 50px;
  flex: 0 0 300px;
}
.left-image img {
  height: 250px;
  width: 250px;
}
.right {
  flex: 1 1 auto;
  padding: 75px;
  padding-left: 10px;
}
.right .desc h1 {
  font-weight: 500;
}
.right .desc h2 {
  font-weight: 450;
  font-size: 20px;
  margin-top: 10px;
}
.right .desc h3 {
  font-weight: 450;
  font-size: 20px;
  margin-top: 10px;
}
.right .btns {
  display: flex;
  margin-top: 20px;
}
.block {
  height: 38px;
  width: 122px;
  line-height: 38px;
  text-align: center;
  border: 1px solid var(--border-dark-color);
  cursor: pointer;
}
.playAll {
  margin-right: 20px;
}
.block:hover {
  color: white;
  background-color: var(--border-hovered);
  border: 1px solid var(--border-hovered);
}
.liked {
  color: white;
  background-color: var(--border-hovered);
  border: 1px solid var(--border-hovered);
}
</style>
