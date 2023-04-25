<template>
  <div class="search-list-container">
    <div class="topList-item">
      <musicTopList></musicTopList>
    </div>

    <div class="search-item" v-if="resultSongs" v-for="(item, index) in resultSongs.songs" :key="item.id">
      <musicList :data="item" :currentPage="currentPage" :index="index" @clickPlay="clickPlayHandle"></musicList>
    </div>
    <div class="page-item" v-if="resultSongs">
      <el-pagination background :page-size="PAGE_LIMIT" :pager-count="11" layout="prev, pager, next" :total="resultSongs.songCount" v-model="currentPage" @update:current-page="currentPageChange"> </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import musicList from '../../components/musicList/index.vue'
import musicTopList from '../../components/musicList/musicTopList.vue'
import * as MusicMessage from '../../store/musicData'
import { readUserAccount } from '../../store/userLogin'
import * as getMusicApi from '../../api/getSong'
import { ElMessage } from 'element-plus'

const router = useRouter()
// 获取搜索的音乐
import { searchMusic } from '../../api/getSong'
// 页码改变触发
import { setCurrentPage, setData } from '../../store/musicData'

// const myLikeMusic = ref(null)

// axios得到的搜索数据
// {
//   songCount: ... ,
//   songs: []
// }
const resultSongs = ref(null)
// 每页多少条
import { PAGE_LIMIT } from '../../constant/pageLimit'
// const limit = 10
// 当前页数
const currentPage = ref(1)

onBeforeMount(() => {
  if (readUserAccount.value) {
    getMusicApi.UserLikeMusic().then(res => {
      if(res.response && res.response.status === 301) return;
      MusicMessage.setMyLikeMusicList(res.data.ids)
    })
  }
})

// 搜索的名字
const searchName = computed(() => {
  if (MusicMessage.musicSearchName.value) {
    return MusicMessage.musicSearchName.value
  } else if (router.currentRoute.value.params.searchname) {
    return router.currentRoute.value.params.searchname
  }
})

watch(
  searchName,
  (newVal, oldVal) => {
    if (newVal) {
      currentPage.value = 1
      searchMusic(newVal, PAGE_LIMIT, currentPage.value).then(res => {
        resultSongs.value = res.data.result
        // MusicMessage.setData(res.data.result)
        MusicMessage.setSinglePage(false)
      })
    }
  },
  {
    immediate: true
  }
)

watch(
  [resultSongs, readUserAccount],
  () => {
    if (readUserAccount.value !== null) {
      getMusicApi.UserLikeMusic().then(res => {
        if(res.response && res.response.status === 301) return;
        MusicMessage.setMyLikeMusicList(res.data.ids)
      })
    }
  },
  {
    immediate: true
  }
)

const currentPageChange = e => {
  setCurrentPage(e)
  currentPage.value = e
  searchMusic(searchName.value, PAGE_LIMIT, e).then(res => {
    resultSongs.value = res.data.result
    setData(res.data.result)
    MusicMessage.setSinglePage(false)
  })
}
const clickPlayHandle = (id) => {
  MusicMessage.setSinglePage(false)
  MusicMessage.setData(resultSongs.value)
  console.log(resultSongs.value)
  MusicMessage.setId(id)
  MusicMessage.setStatus("playing")
}
</script>

<style scoped>
.search-list-container {
  padding-left: 20px;
  padding-right: 20px;
  background-color: white;
  margin-top: 20px;
}

.topList-item {
  background-color: var(--body-background-color);
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: var(--normal-words);
}
.music-index {
  margin-left: -8px;
}
.play {
  margin-left: 50px;
}
.music-name {
  margin-left: 10%;
}
.music-singer {
  margin-left: 20%;
}
.music-time {
  margin-left: 35%;
}
.page-item {
  margin: 50px auto;
  padding-bottom: 50px;
  width: 500px;
}
</style>
