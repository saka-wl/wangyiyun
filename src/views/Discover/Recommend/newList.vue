<template>
  <div class="newlist-recommend">
    <h3>歌单推荐</h3>
    <NewCarousel @toPages="handleToPage">
      <div class="slot-songlist">
        <div class="block" v-for="item in musicRecommendList" @click="handleMusicListClick(item)">
          <div class="image">
            <img :src="item.coverImgUrl" alt="" />
          </div>
          <h4>{{ item.name }}</h4>
          <h5>{{ item.creator.nickname }}</h5>
        </div>
      </div>
    </NewCarousel>
  </div>
</template>

<script setup>
import NewCarousel from '../../../components/Carousel/newCarousel.vue'
import { getRecommendMusicList } from '../../..//api/getPlayLists'
import { ref, onBeforeMount, computed } from 'vue'
import * as storePlayList from '../../../store/musicPlayList'
import { useRouter } from 'vue-router'

const router = useRouter()
const musicRecommendList = ref(null)
const currentPage = ref(1)
const marginNum = computed(() => {
  if(currentPage.value === 1) {
    return '0%'
  }
  return '-' + (currentPage.value - 1) * 100 + '%'
})
onBeforeMount(() => {
  getRecommendMusicList().then(res => {
    musicRecommendList.value = res.data.playlists
  })
})
const handleToPage = (val) => {
  if(val === 'pre'){
    if(currentPage.value === 1) {
      currentPage.value = 5
    }else {
      currentPage.value --
    }
  }else if(val === 'next') {
    if(currentPage.value === 5) {
      currentPage.value = 1
    }else {
      currentPage.value ++
    }
  }
}
const handleMusicListClick = (item) => {
  storePlayList.setId(item.id)
  storePlayList.setCoverImg(item.coverImgUrl)
  storePlayList.setTitle(item.name)
  storePlayList.setDesc(item.description)
  router.push('/playlistdetails')
}
</script>

<style scoped>
.newlist-recommend {
  width: 100%;
  overflow: hidden;
}
.newlist-recommend h3 {
  width: 100%;
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 40px;
}
.slot-songlist {
  width: 500%;
  display: flex;
  justify-content: space-around;
  transition: all .3s;
  margin-left: v-bind("marginNum");
}
.slot-songlist .block {
  height: 250px;
  width: 3.4%;
  overflow: hidden;
  cursor: pointer;
}
.slot-songlist .block .image img {
  height: 200px;
  width: 100%;
  transition: all 0.3s;
}
.slot-songlist .block .image {
  height: 200px;
  width: 100%;
  overflow: hidden;
}
.slot-songlist .block .image img:hover {
  transform: scale(1.2);
}
.block h4 {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: center;
  margin-top: 5px;
}
.block h5 {
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  margin-top: 5px;
  text-align: center;
}
</style>
