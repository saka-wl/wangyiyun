<template>
  <div class="top-message-container" v-if="artistDetail">
    <div class="left-image">
      <img :src="artistDetail.avatar" alt="">
    </div>
    <div class="right-message">
      <div class="name">
        {{artistDetail.name}}
      </div>
      <div class="desc">
        {{artistDetail.briefDesc}}
      </div>
      <div class="maker-count">
        <div class="block">
          <span>单曲</span>
          {{artistDetail.musicSize}}
        </div>
        <div class="block">
          <span>专辑</span>
          {{artistDetail.albumSize}}
        </div>
        <div class="block">
          <span>MV</span>
          {{artistDetail.mvSize}}
        </div>
      </div>
      <div class="btns">
        <button class="play" @click="playAllMusic"><i class="iconfont icon-bofang1"></i><span>播放他(她)的歌曲</span></button>
        <button class="like" @click="likeArtist" :class="{
          liked: isLike
        }">{{isLike ? "取消关注" : "关注"}}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import * as getArtistApi from '../../api/getArtist'
import { ElMessage } from 'element-plus'
import {readUserAccount} from '../../store/userLogin'

const route = useRoute()
const artistDetail = ref(null)
const emit = defineEmits(['playAll'])
const isLike = ref(false)

onMounted(() => {
  getArtistApi.getArtistDetail(route.params.id).then(res => {
    artistDetail.value = res.data.data.artist
  })
})

const playAllMusic = () => {
  emit('playAll')
}
const likeArtist = () => {
  if(readUserAccount.value === null || readUserAccount.value.status === -10) {
    ElMessage({
    message: '请先登录',
    type: 'warning',
  })
    return
  }
  if(isLike.value === false) {
    isLike.value = true
    getArtistApi.subArtist(route.params.id)
  }else {
    isLike.value = false
    getArtistApi.subArtist(route.params.id, -1)
  }
}

</script>

<style scoped>
.top-message-container {
  width: 100%;
  display: flex;
}
.left-image {
  height: 350px;
  width: 350px;
  flex: 0 0 350px;
}
.left-image img {
  height: 250px;
  width: 250px;
  padding: 50px;
  border-radius: 50%;
}
.right-message {
  padding: 40px;
}
.name {
  font-size: 25px;
}
.desc {
  margin-top: 10px;
  height: 22vh;
  overflow-y: scroll;
  font-size: 14px;
}
.maker-count {
  display: flex;
  margin-top: 15px;
}
.block {
  padding-right: 20px;
  height: 30px;
  border-right: 1px solid rgb(136, 136, 136);
  font-size: 27px;
  margin-right: 20px;
  line-height: 20px;
}
.block:nth-child(3) {
    border-right: none;
}
.block span {
  font-size: 20px;
}
.btns {
  margin-top: 10px;
}
.play {
  border: 1px solid var(--qqmusic-words);
  background-color: var(--qqmusic-words);
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 2px;
  color: white;
  font-size: 16px;
  box-sizing: border-box;
  cursor: pointer;
}
.play .icon-bofang1 {
  font-size: 25px;
  vertical-align: middle;
}
.like {
  border: 1px solid var(--words-gray);
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 2px;
  color: var(--normal-words);
  margin-left: 30px;
  background-color: white;
  cursor: pointer;
}
.liked {
  background-color: var(--qqmusic-words);
  border: 1px solid var(--qqmusic-words);
  color: white;
  font-size: 16px;
}
</style>