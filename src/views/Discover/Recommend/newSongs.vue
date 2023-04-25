<template>
  <div class="newSongs-container">
    <h2>新歌首发</h2>
    <div class="newsong-content">
      <div class="block">
        <h4>全部</h4>
        <div class="icon">
          <i class="iconfont icon-bofang1" @click="handleNewSongsClick" data-type="0"></i>
        </div>
        <div class="musiclist">
          <div class="item" v-for="item in [0, 1, 2]">
            <div class="left">
              {{ item + 1 }}
            </div>
            <div class="right">
              <h4>{{ all && all.songs[item].name }}</h4>
              <h4>{{ all && all.songs[item].al.artists[0].name }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <h4>华语</h4>
        <div class="icon">
          <i class="iconfont icon-bofang1" @click="handleNewSongsClick" data-type="1"></i>
        </div>
        <div class="musiclist">
          <div class="item" v-for="item in [0, 1, 2]">
            <div class="left">
              {{ item + 1 }}
            </div>
            <div class="right">
              <h4>{{ china && china.songs[item].name }}</h4>
              <h4>{{ china && china.songs[item].al.artists[0].name }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <h4>欧美</h4>
        <div class="icon">
          <i class="iconfont icon-bofang1" @click="handleNewSongsClick" data-type="2"></i>
        </div>
        <div class="musiclist">
          <div class="item" v-for="item in [0, 1, 2]">
            <div class="left">
              {{ item + 1 }}
            </div>
            <div class="right">
              <h4>{{ USA && USA.songs[item].name }}</h4>
              <h4>{{ USA && USA.songs[item].al.artists[0].name }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <h4>日本</h4>
        <div class="icon">
          <i class="iconfont icon-bofang1" @click="handleNewSongsClick" data-type="3"></i>
        </div>
        <div class="musiclist">
          <div class="item" v-for="item in [0, 1, 2]">
            <div class="left">
              {{ item + 1 }}
            </div>
            <div class="right">
              <h4>{{ japan && japan.songs[item].name }}</h4>
              <h4>{{ japan && japan.songs[item].al.artists[0].name }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="block">
        <h4>韩国</h4>
        <div class="icon">
          <i class="iconfont icon-bofang1" @click="handleNewSongsClick" data-type="4"></i>
        </div>
        <div class="musiclist">
          <div class="item" v-for="item in [0, 1, 2]">
            <div class="left">
              {{ item + 1 }}
            </div>
            <div class="right">
              <h4>{{ korea && korea.songs[item].name }}</h4>
              <h4>{{ korea && korea.songs[item].al.artists[0].name }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from 'vue'
import * as getSongApi from '../../../api/getSong'
import * as storeMusicData from '../../../store/musicData'

// 新歌首发的歌曲
const all = ref(null)
const china = ref(null)
const USA = ref(null)
const japan = ref(null)
const korea = ref(null)

// 全部:0 华语:7 欧美:96 日本:8 韩国:16
const getNewSongs = () => {
  const rules = [
    {
      country: 'all',
      num: 0
    },
    {
      country: 'china',
      num: 7
    },
    {
      country: 'USA',
      num: 96
    },
    {
      country: 'japan',
      num: 8
    },
    {
      country: 'korea',
      num: 16
    }
  ]

  for(let index=0;index<5;index++) {
    getSongApi.getNewSong(rules[index].num).then(res => {
    let musicMsg = {
      songCount: res.data.data.length,
      songs: []
    }
    res.data.data.forEach(element => {
      element.al = element.album
      element.ar = element.artists
    })
    musicMsg.songs = res.data.data
    if(index===0) all.value = musicMsg;
    if(index===1) china.value = musicMsg;
    if(index===2) USA.value = musicMsg;
    if(index===3) japan.value = musicMsg;
    if(index===4) korea.value = musicMsg;
  })
  }

}
onBeforeMount(() => {
  getNewSongs()
})
const handleNewSongsClick = (e) => {
  if(e.target.dataset.type === "0") {
    storeMusicData.setStatus("stop")
    storeMusicData.setData(all.value)
    storeMusicData.setSinglePage(false)
    storeMusicData.setId(all.value.songs[0].id)
    storeMusicData.setStatus("playing")
  }else if(e.target.dataset.type === "1") {
    storeMusicData.setStatus("stop")
    storeMusicData.setData(china.value)
    storeMusicData.setSinglePage(false)
    storeMusicData.setId(china.value.songs[0].id)
    storeMusicData.setStatus("playing")
  }else if(e.target.dataset.type === "2") {
    storeMusicData.setStatus("stop")
    storeMusicData.setData(USA.value)
    storeMusicData.setSinglePage(false)
    storeMusicData.setId(USA.value.songs[0].id)
    storeMusicData.setStatus("playing")
  }else if(e.target.dataset.type === "3") {
    storeMusicData.setStatus("stop")
    storeMusicData.setData(japan.value)
    storeMusicData.setSinglePage(false)
    storeMusicData.setId(japan.value.songs[0].id)
    storeMusicData.setStatus("playing")
  }else if(e.target.dataset.type === "4") {
    storeMusicData.setStatus("stop")
    storeMusicData.setData(korea.value)
    storeMusicData.setSinglePage(false)
    storeMusicData.setId(korea.value.songs[0].id)
    storeMusicData.setStatus("playing")
  }
}
</script>

<style scoped>
.newSongs-container {
  /* width: 100%; */
  text-align: center;
  margin-top: 50px;
}
.newSongRecommend h2 {
  font-family: poppin, Tahoma, Arial, \5FAE\8F6F\96C5\9ED1, sans-serif;
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 20px;
}
.newsong-content {
  display: flex;
  justify-content: space-around;
  /* flex-wrap: wrap; */
}
.block {
  float: left;
  height: 500px;
  width: 250px;
  margin: 10px;
  padding-top: 40px;
  box-sizing: border-box;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0.6px 0.6px 1.2px rgba(0, 0, 0, 0.003), 1.3px 1.3px 2.7px rgba(0, 0, 0, 0.005), 2.2px 2.2px 4.6px rgba(0, 0, 0, 0.007), 3.3px 3.4px 6.9px rgba(0, 0, 0, 0.009), 4.8px 4.9px 10px rgba(0, 0, 0, 0.011), 6.7px 6.9px 14.2px rgba(0, 0, 0, 0.014), 9.6px 9.8px 20.1px rgba(0, 0, 0, 0.016),
    13.9px 14.2px 29.2px rgba(0, 0, 0, 0.019), 21.4px 21.9px 45px rgba(0, 0, 0, 0.023), 38px 39px 80px rgba(0, 0, 0, 0.03);
}
.block .icon {
  height: 50px;
  width: 50px;
  margin: 40px auto;
  line-height: 50px;
  border-radius: 50%;
  background-color: var(--body-background-color);
}
.block .icon .icon-bofang1 {
  font-size: 30px;
}
.block:hover {
  box-shadow: 0.6px 0.6px 1.2px rgba(0, 0, 0, 0.053), 1.3px 1.3px 2.7px rgba(0, 0, 0, 0.072), 2.2px 2.2px 4.6px rgba(0, 0, 0, 0.084), 3.3px 3.4px 6.9px rgba(0, 0, 0, 0.093), 4.8px 4.9px 10px rgba(0, 0, 0, 0.099), 6.7px 6.9px 14.2px rgba(0, 0, 0, 0.105), 9.6px 9.8px 20.1px rgba(0, 0, 0, 0.111),
    13.9px 14.2px 29.2px rgba(0, 0, 0, 0.118), 21.4px 21.9px 45px rgba(0, 0, 0, 0.13), 38px 39px 80px rgba(0, 0, 0, 0.16);
}
.block h4 {
  font-size: 22px;
  font-weight: 500;
}
.musiclist .item .right h4 {
  font-family: poppin, Tahoma, Arial, \5FAE\8F6F\96C5\9ED1, sans-serif;
  text-align: left;
  font-size: 18px;
  font-weight: 500;
}
.musiclist .item {
  margin-top: 40px;
  display: flex;
  padding-left: 30px;
}
.musiclist .item .left {
  margin-right: 10px;
}
.musiclist .item .right h4:nth-child(2) {
  margin-top: 10px;
  font-size: 15px;
}
</style>