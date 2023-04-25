<template>
  <div class="artist-container">
    <div class="ipt">
      <div class="icon" @click="goToArtistDetail">
        <span class="iconfont icon-chaxun-artist"></span>
      </div>
      <div class="input">
        <input type="text" v-model="searchVal" name="" id="" @keyup.enter.native="goToArtistDetail" />
      </div>
    </div>
    <TopArtist> </TopArtist>
  </div>
</template>

<script setup>
import TopArtist from './topArtist.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'

const router = useRouter()
const searchVal = ref('')

const goToArtistDetail = () => {
  if (searchVal.value === '') {
    ElMessage({
      message: '搜索框不能为空',
      type: 'warning'
    })
    return
  }
  router.push('/artists/' + searchVal.value)
  searchVal.value = ""
}
</script>

<style scoped>
.artist-container {
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
