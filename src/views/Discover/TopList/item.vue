<template>
  <div class="item-container" v-if="props.data">
    <div class="top-item">
      <div class="left-index">
        排序
      </div>
      <div class="search-name">
        搜索的名字
      </div>
      <div class="content">
        简介
      </div>
      <div class="score">
        热度
      </div>
    </div>
    <div class="single-item" 
    v-for="(item, index) in props.data" 
    :key="item.searchWord" 
    @click="goToSearch(item.searchWord)"
    :style="{
      backgroundColor: (index % 2 === 0) ? 'var(--white-background-color)' : 'white'
    }"
    >
      <div class="left-index" :style="{
        color: (index === 0 || index === 1 || index === 2) ? '#ff4222' : 'black'
      }">
        {{ index + 1 }}
      </div>
      <div class="search-name">
        {{ item.searchWord }}
      </div>
      <div class="content">
        {{ item.content || '^-^' }}
      </div>
      <div class="score">
        {{ item.score }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import {setSearchName} from '../../../store/musicData'

const router = useRouter()
const props = defineProps(['data'])
console.log(props.data)
const goToSearch = (searchName) => {
  setSearchName(searchName)
  router.push("/search/" + searchName)
}
</script>

<style scoped>
.item-container {
  width: 80%;
  margin: 20px auto;
  margin-bottom: 150px;
}
.top-item {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  background-color: var(--white-background-color);
}
.top-item .left-index {
  font-size: 16px;
  font-weight: 500;
}
.single-item {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}
.left-index {
  width: 10%;
  font-size: 27px;
  font-weight: 300;
}
.search-name {
  width: 20%;
}
.content {
  width: 40%;
}
.score {
  width: 10%;
}
</style>
