<template>
  <div class="comment-container">
    <div class="words">
      <h4>关于评论({{ commentMsg && commentMsg.total }})</h4>
    </div>
    <div class="comments" v-if="commentMsg" v-for="item in commentMsg.comments" :key="item.commentId">
      <SingleComment :comment="item" />
    </div>
    <div class="pager" v-if="commentMsg">
      <el-pagination background :page-size="COMMENT_LIMIT" :pager-count="11" layout="prev, pager, next" :total="commentMsg.total" v-model="currentCommentPage" @update:current-page="currentCommentPageChange"> </el-pagination>
    </div>
  </div>
</template>

<script setup>
import SingleComment from './singleComment.vue'
import { getMusicComments } from '../../api/getComments'
import { COMMENT_LIMIT } from '../../constant/pageLimit'
import * as MusicMessage from '../../store/musicData'
import { ref, watch } from 'vue'

// 当前评论页数
const currentCommentPage = ref(1)
// 评论信息
const commentMsg = ref("")

// 监听id变化从而改变评论
watch(
  MusicMessage.musicPlayingId,
  (newVal, oldVal) => {
    // 获取评论
    getMusicComments(newVal, COMMENT_LIMIT, currentCommentPage.value).then(res => {
      commentMsg.value = res.data
    })
  },
  {
    immediate: true
  }
)

// 关于页码跳转
const currentCommentPageChange = e => {
  currentCommentPage.value = e
  getMusicComments(MusicMessage.musicPlayingId.value, COMMENT_LIMIT, e).then(res => {
    commentMsg.value = res.data
  })
}
</script>

<style scoped>
.comment-container {
  width: 100%;
}
.words {
  height: 30px;
  padding-left: 100px;
}
.words h4 {
  font-size: 20px;
  font-weight: 600;
  color: var(--normal-words);
}
.single-comment-container {
  width: 90%;
  margin: 25px auto;
}
.pager {
  width: 30%;
  margin: 40px auto;
}
</style>
