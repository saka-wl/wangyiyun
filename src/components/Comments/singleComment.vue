<template>
  <div class="single-comment-container">
    <div class="avatar">
      <img :src="comment.user.avatarUrl" alt="" />
    </div>
    <div class="msg">
      <div class="top">
        <span class="name">{{ comment && comment.user.nickname }}:&nbsp;&nbsp;&nbsp;</span>
        <span class="comment-words">
          {{ comment.content }}
        </span>
      </div>
      <div class="bottom">
        <div class="time">{{comment && getTime(comment.time)}} &nbsp;&nbsp;&nbsp; <span style="color: var(--words-gray);">{{comment && comment.ipLocation.location}}</span></div>
        <div class="like" @click="handleLikeClick">
          <i
            class="iconfont icon-good"
            :class="{
              likeClick: isLike ? isLike : false
            }"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isLike = ref(false)
const props = defineProps(['comment'])
import { getTime } from '../../utils/timeFormat'
const handleLikeClick = () => {
  isLike.value = !isLike.value
}
</script>

<style scoped>
.single-comment-container {
  display: flex;
}
.avatar {
  padding: 10px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.avatar img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
.msg {
  flex: 1 0 400px;
  margin-left: 30px;
}
.msg .top {
}
.msg .top .name {
  font-size: 20px;
  color: var(--blue-name);
}
.msg .top .comment-words {
  font-size: 15px;
  width: 100%;
}
.msg .bottom {
  width: 100%;
  height: 30px;
  display: flex;
  position: relative;
  font-size: 13px;
  color: var(--normal-words);
  border-bottom: 1px solid var(--words-gray);
  margin-top: 10px;
}
.msg .bottom .time {
  position: absolute;
  left: 0px;
}
.msg .bottom .like {
  position: absolute;
  right: 0px;
  color: var(--words-gray);
}
.likeClick {
  color: red;
}
</style>
