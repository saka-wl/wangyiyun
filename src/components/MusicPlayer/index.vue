<template>
  <div class="music-player-top-container" ref="myMusicDetailRef">
    <div class="hideIcon" @click="hideMusicDetail">
      <i class="iconfont icon-xiangxia"></i>
    </div>
    <div class="music-details">
      <div class="music-player-utils">
        <div class="dot">
          <div class="dot-inner"></div>
        </div>
        <div class="music-details-image">
          <img
            src="../../assets/play-bar.png"
            alt=""
            :style="{
              transform: classIconIsPlay === 'icon-bofang-bottom' ? 'rotate(-38deg)' : 'rotate(-10deg)'
            }"
          />
        </div>
        <div class="musicImg">
          <div class="border-out">
            <img
              :src="musicImage"
              alt=""
              ref="myImageRef"
              :style="{
                transform: `rotate(${imageDeg}deg)`
              }"
            />
          </div>
        </div>
      </div>

      <div class="music-details-lyric">
        <h2 class="music-name">{{ musicName }}</h2>
        <h3 class="music-artist">{{ musicArtist }}</h3>
        <div class="lyric" ref="myLyricRef" @scroll="handleScrollStart">
          <div class="single-lyric" v-for="(item, index) in lyric" :key="item.time" @click="goToExactTime(index)">
            <h4 :class="{ activeMusic: index === lyricIndex }">
              {{ item.lyr || '^-^' }}
            </h4>
            <i class="iconfont icon-bofang1 iconlyric"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="comments">
      <Comment />
    </div>
    <div class="write-comment" @click="handleSubmitComment" v-show="isShowMusicDetail">
      <i class="iconfont icon-igw-l-edit"></i>
      <span>写评论</span>
    </div>
  </div>
  <div class="music-player-bottom-container">
    <div class="mask" v-if="musicImage">
      <img alt="" :src="musicImage" />
    </div>
    <div class="msg">
      <div class="image" @click="showMusicDetail" v-if="musicImage">
        <div class="show-place">
          <i class="iconfont" :class="classIconBtn"></i>
        </div>
        <img alt="" :src="musicImage" v-if="musicImage" />
      </div>
      <div class="music-msg">
        {{ musicName }}
      </div>
    </div>
    <div class="player">
      <div class="top">
        <div class="block" @click="toPrevMusic"><i class="iconfont icon-shangyishou"></i></div>
        <div class="block" @click="playMusic"><i class="iconfont" :class="classIconIsPlay"></i></div>
        <div class="block" @click="toNextMusic"><i class="iconfont icon-xiayishou"></i></div>
        <div class="block" @click="changeIsLoop"><i class="iconfont" :class="classIconIsLoop"></i></div>
      </div>
      <div class="bottom">
        <span style="margin-right: 30px">{{ nowTime && nowTime.min }}:{{ nowTime && nowTime.sec }}</span>
        <el-slider v-model="currentTime" @input="handleChangeTime" size="small" :show-tooltip="false" :max="endSec" />
        <span>{{ endTime && endTime.min }}:{{ endTime && endTime.sec }}</span>
      </div>
    </div>
    <div class="voice">
      <div class="icon">
        <i class="iconfont icon-shengyin voice-icon"></i>
      </div>
      <div class="voice-process">
        <el-slider v-model="voice" @change="handleVoiceChange" size="small" :min="0" :max="100" />
      </div>
    </div>
    <div class="audio">
      <audio controls :src="url">
        <audio :src="music.url" v-if="music" type="audio/mpeg" ref="myAudioRef" @ended="handleAudioEnded" @canplay="changeMusicStatus" @timeupdate="changeCurrentTime" @loadeddata="decreaseVoice"></audio>
      </audio>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { getMusicUrl, getMusicImage, getLyric } from '../../api/getSong'
import { handleTime, resolveTime } from '../../utils/timeFormat'
import * as MusicMessage from '../../store/musicData'
import { searchMusic } from '../../api/getSong'
import { PAGE_LIMIT } from '../../constant/pageLimit'
import { ElMessage, ElMessageBox, ElInput } from 'element-plus'
import Comment from '../../components/Comments/index.vue'
import { sendComment } from '../../api/getComments'
import * as storeMusicPlayList from '../../store/musicPlayList'
import { getPlayListDetails } from '../../api/getPlayLists'

// 现在的播放分钟数和秒数
const nowTime = reactive({
  min: '00',
  sec: '00'
})
// 音乐的总分钟数和秒数
const endTime = reactive({
  min: '00',
  sec: '00'
})
// 音乐的总秒数
const endSec = ref(0)
// 现在的播放时间
const currentTime = ref(0)
// 播放audio的dom元素
const myAudioRef = ref(null)
// 上面歌曲详情的dom元素
const myMusicDetailRef = ref(null)
// 路由
const router = useRouter()
// music的详细数据
const music = ref(null)
// 跨域问题
const url = ref('')
// 是否循环播放
const classIconIsLoop = ref('icon-shunxubofang')
// 声音大小
const voice = ref(20)
// 播放还暂停样式
const classIconIsPlay = ref('icon-bofang-bottom')
// 播放器的音乐名字
const musicName = ref('请选择播放歌曲')
// 播放器的图片url
const musicImage = ref(null)
// 音乐的作者
const musicArtist = ref(null)
// 是否进入歌词详情页面
const isShowMusicDetail = ref(false)
// 上拉或者下拉的icon
const classIconBtn = ref('icon-xiangshang')
// 旋转的音乐图片
const myImageRef = ref(null)
// 旋转音乐图片的定时器
let imageTimer = null
// 旋转音乐图片旋转角度
let imageDeg = ref(0)
// 关于歌词
const lyric = ref(null)
// 唱到哪一句歌词
const lyricIndex = ref(0)
// 歌词的dom元素
const myLyricRef = ref(null)
// 滚动条计时器
let scrollTimer = null
// 歌词是否自动滚动
let isScrollSelf = true
// 你写的评论
let commentSelf = ref(null)

// element-ui 组件，消息提示
const elementUiOpen = () => {
  ElMessage({
    message: '前面没有音乐了！',
    type: 'warning'
  })
}

// 关于播放和暂停 **
// 监听 id
const isImageTimer = () => {
  if (!imageTimer) {
          imageDeg.value = 0
          imageTimer = setInterval(function () {
            imageDeg.value += 10
          }, 1000)
        }
}
watch(MusicMessage.musicPlayingId, async (newVal, oldVal) => {
  imageTimer && clearInterval(imageTimer)
  imageTimer = null
  imageDeg.value = 0
  if (newVal) {
    await getMusicUrl(newVal)
      .then(res => {
        music.value = res.data.data[0]
        url.value = 'https://music.163.com/song/media/outer/url?id=' + newVal + '.mp3'
        let time = handleTime(Math.floor(music.value.time / 1000))
        endSec.value = Math.floor(music.value.time / 1000) + 1
        endTime.min = time.min
        endTime.sec = time.sec
      })
      .then(() => {
        if (myAudioRef.value) {
          myAudioRef.value.play()
          MusicMessage.setStatus('playing')
        }
      })
    getLyric(newVal).then(res => {
      let result = res.data.lrc.lyric.split('\n')
      lyric.value = []
      result.forEach(item => {
        lyric.value.push({
          time: item.split(']')[0].substr(1),
          lyr: item.split(']')[1]
        })
      })
      lyric.value.splice(lyric.value.length - 1, 1)
      for (let item of lyric.value) {
        item.formatTime = resolveTime(item.time.split(']')[0] + ']')
      }
    })

    if (!MusicMessage.musicSearchName.value) {
      router.currentRoute.value.params.searchname && MusicMessage.setSearchName(router.currentRoute.value.params.searchname)
    }
    if (!MusicMessage.musicData.value) {
      searchMusic(MusicMessage.musicSearchName.value, PAGE_LIMIT, MusicMessage.musicCurrentPage.value).then(res => {
        MusicMessage.setData(res.data.result)
        MusicMessage.setSinglePage(false)
        musicName.value = res.data.result.songs.find(it => newVal == it.id).name
        musicImage.value = res.data.result.songs.find(it => newVal == it.id).al.picUrl
        musicArtist.value = MusicMessage.musicData.value.songs.find(it => newVal == it.id).ar[0].name
        isImageTimer()
      })
    } else {
      let target = false
      MusicMessage.musicData.value.songs.forEach(it => {
        if (it.id == MusicMessage.musicPlayingId.value) {
          target = true
        }
      })
      if (target) {
        musicName.value = MusicMessage.musicData.value.songs.find(it => newVal == it.id).name
        musicImage.value = MusicMessage.musicData.value.songs.find(it => newVal == it.id).al.picUrl
        musicArtist.value = MusicMessage.musicData.value.songs.find(it => newVal == it.id).ar[0].name
        isImageTimer()
      } else {
        getPlayListDetails(storeMusicPlayList.readId.value).then(res => {
          let musicMsg = {
            songs: res.data.songs,
            songCount: res.data.songs.length
          }
          MusicMessage.setData(musicMsg)
          MusicMessage.setSinglePage(true)
          musicName.value = musicMsg.songs.find(it => newVal == it.id).name
          musicImage.value = musicMsg.songs.find(it => newVal == it.id).al.picUrl
          musicArtist.value = MusicMessage.musicData.value.songs.find(it => newVal == it.id).ar[0].name
          isImageTimer()
        })
      }
    }
  }
})
// 播放，暂停的修改
const playMusic = () => {
  if (!MusicMessage.musicPlayingId.value) {
    ElMessage({
      showClose: true,
      message: '请选择播放的歌曲',
      type: 'warning'
    })
    return
  }
  // 正在播放
  if (MusicMessage.musicStatus.value === 'playing') {
    myAudioRef.value.pause()
    MusicMessage.setStatus('stop')
  } else {
    // 不在播放
    myAudioRef.value.play()
    MusicMessage.setStatus('playing')
  }
}
// 当audio可以播放时触发， 修改播放状态
const changeMusicStatus = () => {
  if (MusicMessage.musicStatus.value === 'loading') {
    MusicMessage.setStatus('playing')
  }
}

// 关于播放时，时间的变化 **
// 监听currentTime的变化
watch(
  currentTime,
  (newVal, oldVal) => {
    if (newVal && lyric.value) {
      let i = 0
      for (i; i <= lyric.value.length - 1 && newVal >= lyric.value[i].formatTime; i++) {}
      lyricIndex.value = i - 1
    }
    if (newVal && Math.floor(newVal) !== 0) {
      let time = handleTime(Math.floor(newVal))
      nowTime.min = time.min
      nowTime.sec = time.sec
    } else {
      nowTime.min = '00'
      nowTime.sec = '00'
    }
  },
  {
    immediate: true
  }
)
// 修改 currentTime
// audio播放的currentTime更新时触发
const changeCurrentTime = e => {
  currentTime.value = e.target.currentTime
}
// input进度条的修改
const handleChangeTime = e => {
  if (!MusicMessage.musicPlayingId.value) return
  currentTime.value = e
  myAudioRef.value.currentTime = e
}

// 关于声音的变化 **
// 修改声音
const handleVoiceChange = e => {
  voice.value = e
}
// 监听声音数据变化
watch(
  voice,
  newVal => {
    if (newVal && myAudioRef.value) {
      myAudioRef.value.volume = newVal / 100
    }
  },
  {
    immediate: true
  }
)
// 刚开始降低音量
// 改变音乐状态（音乐加载完成以后）
const decreaseVoice = () => {
  myAudioRef.value.volume = voice.value / 100
}

// 关于播放结束时的处理 **
const handlePreMusic = (isPre = false) => {
  MusicMessage.setStatus('loading')
  if (MusicMessage.musicIsLoop.value && !isPre) {
    // 循环播放
    MusicMessage.setStatus('playing')
    currentTime.value = 0
    myAudioRef.value.play()
  } else {
    let musicMsg = MusicMessage.musicData.value
    let nextIdIndex = null
    let playingId = MusicMessage.musicPlayingId.value
    if (MusicMessage.musicIsSinglePage.value === true) {
      musicMsg.songs.forEach((it, index) => {
        if (it.id === playingId) {
          nextIdIndex = index
        }
      })
      if (nextIdIndex === null) {
        nextIdIndex = 0
      } else if (nextIdIndex === 0) {
        ElMessage({
          showClose: true,
          message: '前面没有歌曲咯^-^',
          type: 'warning'
        })
        MusicMessage.setStatus('playing')
        return
      } else {
        nextIdIndex--
      }
      MusicMessage.setId(musicMsg.songs[nextIdIndex].id)
      currentTime.value = 0
    } else {
      MusicMessage.musicData.value.songs.forEach((it, index) => {
        if (it.id === playingId && index > 0) {
          nextIdIndex = index
        }
      })
      if (nextIdIndex !== null) nextIdIndex--
      if (nextIdIndex !== null) {
        MusicMessage.setId(musicMsg.songs[nextIdIndex].id)
        currentTime.value = 0
      } else {
        if (MusicMessage.musicCurrentPage.value <= 1) {
          ElMessage({
            showClose: true,
            message: '前面没有歌曲咯^-^',
            type: 'warning'
          })
          MusicMessage.setStatus('playing')
          return
        } else {
          MusicMessage.setCurrentPage(MusicMessage.musicCurrentPage.value - 1)
          if (!MusicMessage.musicSearchName.value) {
            MusicMessage.setSearchName(router.currentRoute.value.params.searchname)
          }
          searchMusic(MusicMessage.musicSearchName.value, PAGE_LIMIT, MusicMessage.musicCurrentPage.value).then(res => {
            MusicMessage.setData(res.data.result)
            MusicMessage.setSinglePage(false)
            MusicMessage.setId(res.data.result.songs[PAGE_LIMIT - 1].id)
          })
        }
      }
    }

    MusicMessage.setStatus('playing')
    myAudioRef.value.play()
    isImageTimer()
  }
}
const handleNextMusic = (isNext = false) => {
  MusicMessage.setStatus('loading')
  if (MusicMessage.musicIsLoop.value && !isNext) {
    // 循环播放
    MusicMessage.setStatus('playing')
    currentTime.value = 0
    myAudioRef.value.play()
  } else {
    let musicMsg = MusicMessage.musicData.value
    let nextIdIndex = null
    let playingId = MusicMessage.musicPlayingId.value
    if (MusicMessage.musicIsSinglePage.value === true) {
      musicMsg.songs.forEach((it, index) => {
        if (it.id === playingId) {
          nextIdIndex = index
        }
      })
      if(nextIdIndex === musicMsg.songs.length - 1) {
        nextIdIndex = -1
      }
      if (nextIdIndex === null) {
        nextIdIndex = 0
      } else {
        nextIdIndex++
      }
      MusicMessage.setId(musicMsg.songs[nextIdIndex].id)
      currentTime.value = 0
    } else {
      MusicMessage.musicData.value.songs.forEach((it, index) => {
        if (it.id === playingId && index < PAGE_LIMIT - 1) {
          nextIdIndex = index
        }
      })
      if (nextIdIndex !== null) nextIdIndex++
      if (nextIdIndex !== null) {
        MusicMessage.setId(musicMsg.songs[nextIdIndex].id)
        currentTime.value = 0
      } else {
        console.log(nextIdIndex)
        MusicMessage.setCurrentPage(MusicMessage.musicCurrentPage.value + 1)
        if (!MusicMessage.musicSearchName.value) {
          MusicMessage.setSearchName(router.currentRoute.value.params.searchname)
        }
        searchMusic(MusicMessage.musicSearchName.value, PAGE_LIMIT, MusicMessage.musicCurrentPage.value).then(res => {
          MusicMessage.setData(res.data.result)
          MusicMessage.setSinglePage(false)
          MusicMessage.setId(res.data.result.songs[0].id)
        })
      }
    }

    MusicMessage.setStatus('playing')
    myAudioRef.value.play()
    isImageTimer()
  }
}
const handleAudioEnded = () => {
  handleNextMusic()
}
// 修改循环播放
const changeIsLoop = () => {
  MusicMessage.setIsLoop(!MusicMessage.musicIsLoop.value)
}

// 关于classIcon的变化 **
// 修改classIconIsPlay（播放，暂停，loading的classIcon）
watch(
  MusicMessage.musicStatus,
  newVal => {
    if (newVal === 'playing') {
      classIconIsPlay.value = 'icon-weibiaoti-bottom'
      if (myAudioRef.value) {
        myAudioRef.value.play()
      }
      isImageTimer()
    } else if (newVal === 'loading') {
      classIconIsPlay.value = 'icon-jiazaizhong-biger'
    } else {
      classIconIsPlay.value = 'icon-bofang-bottom'
      if (myAudioRef.value) {
        myAudioRef.value.pause()
      }
      clearInterval(imageTimer)
      imageTimer = null
    }
  },
  {
    immediate: true
  }
)
// 修改循环播放的classIcon
watch(MusicMessage.musicIsLoop, (newVal, oldVal) => {
  if (newVal) {
    classIconIsLoop.value = 'icon-24gl-repeatOnce2'
  } else {
    classIconIsLoop.value = 'icon-shunxubofang'
  }
})

// 上拉和下拉，关于歌词详情 **
const showMusicDetail = () => {
  if (isShowMusicDetail.value) {
    isShowMusicDetail.value = false
    classIconBtn.value = 'icon-xiangshang'
    myMusicDetailRef.value.style.height = 0 + 'vh'
  } else {
    isShowMusicDetail.value = true
    classIconBtn.value = 'icon-xiangxia'
    myMusicDetailRef.value.style.height = 'calc(100vh - 100px)'
  }
}
// 隐藏歌词详情
const hideMusicDetail = () => {
  isShowMusicDetail.value = false
  classIconBtn.value = 'icon-xiangshang'
  myMusicDetailRef.value.style.height = 0 + 'vh'
}

// 关于点击上一首和下一首 **
const toPrevMusic = () => {
  if (!MusicMessage.musicPlayingId.value) {
    ElMessage({
      showClose: true,
      message: '请选择播放的歌曲',
      type: 'warning'
    })
    return
  }
  if (MusicMessage.musicStatus.value === 'loading') return
  handlePreMusic(true)
}
const toNextMusic = () => {
  if (!MusicMessage.musicPlayingId.value) {
    ElMessage({
      showClose: true,
      message: '请选择播放的歌曲',
      type: 'warning'
    })
    return
  }
  if (MusicMessage.musicStatus.value === 'loading') return
  handleNextMusic(true)
}

// 关于歌词文字变色和滚动 **
watch(
  lyricIndex,
  newVal => {
    if (myLyricRef.value && isScrollSelf) {
      let to = 50 * (newVal - 4) >= 0 ? 50 * (newVal - 4) : 0
      myLyricRef.value.scrollTo({
        top: to,
        left: 0,
        behavior: 'smooth'
      })
    }
  },
  {
    immediate: true
  }
)
// 歌词跳转
const goToExactTime = index => {
  currentTime.value = lyric.value[index].formatTime
  lyricIndex.value = index
  myAudioRef.value.currentTime = currentTime.value
}
// 滚动时停止自动滚动
const handleScrollEnd = () => {
  isScrollSelf = true
}
const handleScrollStart = () => {
  isScrollSelf = false
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(handleScrollEnd, 600)
}

// 关于评论的提交 **
const handleSubmitComment = () => {
  ElMessageBox({
    title: '关于' + musicName.value + '的评论',
    message: () =>
      h(ElInput, {
        modelValue: commentSelf.value,
        type: 'textarea',
        rows: 5,
        'onUpdate:modelValue': val => {
          commentSelf.value = val
        }
      })
  })
    .then(() => {
      sendComment(MusicMessage.musicPlayingId.value, commentSelf.value)
        .then(res => {
          // 评论处理
        })
        .then(() => {
          ElMessage({
            type: 'success',
            message: `提交成功`
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消评论'
      })
    })
}
</script>

<style scoped>
.write-comment {
  position: fixed;
  bottom: 120px;
  right: 80px;
  height: 36px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  background-color: var(--border-hovered);
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  color: white;
  cursor: pointer;
}
.comments {
  width: 80%;
}
.music-player-top-container {
  height: 0vh;
  width: 100%;
  border-radius: 10px;
  background-color: white;
  overflow-y: scroll;
  transition: all 0.3s;
  padding-left: 100px;
  position: relative;
  z-index: 9999;
}
.hideIcon {
  height: 50px;
  width: 50px;
  margin-top: 20px;
  margin-left: -50px;
  animation: iconMove 1.5s infinite;
}
@keyframes iconMove {
  from {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(15px);
  }
  to {
    transform: translateY(0px);
  }
}
.music-details {
  position: relative;
  margin-top: 50px;
  display: flex;
  margin-left: 150px;
}
.music-player-utils {
  height: 400px;
  width: 400px;
}
.music-details-lyric {
  margin-top: -50px;
  padding-right: 100px;
  height: 600px;
  flex: 1 0 400px;
  margin-left: -200px;
}
.music-details-lyric .lyric {
  overflow-y: scroll;
  /* scroll-behavior: smooth; */
}
.music-details-lyric .lyric .single-lyric {
  text-align: center;
  height: 50px;
  width: 500px;
  font-size: 14px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
  box-sizing: border-box;
}
.music-details-lyric .lyric .single-lyric h4 {
  margin-left: -50px;
}
.iconlyric {
  opacity: 0;
}
.music-details-lyric .lyric .single-lyric:hover .iconlyric {
  opacity: 1;
}
.activeMusic {
  color: var(--border-hovered);
}
.music-details-lyric .music-name {
  font-size: 28px;
  font-weight: 600;
  width: 500px;
  margin: 0 auto;
  display: block;
  text-align: center;
}
.music-details-lyric .music-artist {
  font-size: 16px;
  font-weight: 400;
  margin: 0 auto;
  margin-top: 15px;
  width: 500px;
  display: block;
  text-align: center;
  color: var(--normal-words);
}
.music-details-lyric .lyric {
  margin: 30px auto;
  height: 400px;
  width: 50%;
  overflow-x: hidden;
  /* border: 1px solid black; */
}
.music-details .music-details-image {
  padding-left: 14%;
  position: relative;
  z-index: 99;
}
.music-details .dot {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  position: absolute;
  background-color: var(--words-gray);
  top: -3.4%;
  left: 3.2%;
  z-index: 1;
}
.music-details .dot .dot-inner {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: var(--body-background-color);
  transform: translate(5px, 5px);
}
.musicImg {
  height: 320px;
  width: 320px;
  background-color: var(--body-background-color);
  border-radius: 50%;
  position: absolute;
  transform: translate(0%, -25%);
}
.musicImg .border-out {
  transform: translate(20px, 20px);
  height: 280px;
  width: 280px;
  background-color: black;
  border-radius: 50%;
}
.musicImg .border-out img {
  height: 200px;
  width: 200px;
  padding: 40px;
  transition: all 1s linear;
  transform-origin: center center;
  border-radius: 50%;
}
.music-details .music-details-image img {
  width: 100px;
  height: 150px;
  transform: rotate(-38deg);
  transition: all 0.5s;
  transform-origin: left top;
}

.music-player-bottom-container {
  height: 100px;
  width: calc(100% - 5px);
  background-color: var(--player-color);
  display: flex;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  position: relative;
  margin-left: 5px;
}
.mask {
  position: absolute;
  height: 100px;
  width: 100%;
  top: 0;
  left: 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  /* border: 1px solid black; */
}
.mask img {
  /* height: 100px; */
  width: 100%;
  opacity: 0.1;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  object-fit: fill;

}
.image {
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 10px;
  height: 70px;
  width: 70px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}
.show-place {
  height: 70px;
  width: 70px;
  line-height: 70px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 5px;
  background-color: var(--white-background-color-transparent);
  color: var(--body-background-color);
  transform: scale(0);
}
.image:hover .show-place {
  transform: scale(1);
}
.image img {
  height: 70px;
  width: 70px;
  border-radius: 5px;
}
.audio {
  transform: scale(0);
}
.music-msg {
  height: 70px;
  padding-top: 40px;
  margin-left: 15px;
  width: 150px;
  font-size: 14px;
  word-break: break-all;
  word-wrap: break-word;
}
.msg {
  display: flex;
  margin-left: 30px;
  z-index: 99;
}
.player {
  width: 1000px;
    z-index: 99;
}

.block {
  height: 50px;
  width: 50px;
  line-height: 50px;
  text-align: center;
  margin-left: 70px;
  margin-top: 10px;
}
.block:hover {
  background-color: var(--body-background-color);
  border-radius: 100%;
}
.top {
  display: flex;
  width: 500px;
  margin: 0 auto;
}
.bottom {
  width: 800px;
  height: 30px;
  margin: 0 auto;
  display: flex;
}
.bottom span {
  line-height: 20px;
  margin-left: 30px;
  color: var(--normal-words);
}
.voice {
  width: 220px;
  height: 50px;
  margin-top: 45px;
  margin-left: 30px;
  line-height: 50px;
  text-align: center;
  display: flex;
  z-index: 99;
}
.voice .icon {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
.voice .icon:hover {
  background-color: var(--body-background-color);
}
.voice:hover .voice-process {
  transform: scaleX(1);
}
.voice .voice-process {
  transform: scaleX(0);
  transition: all 0.3s;
  transform-origin: 0 center;
  width: 150px;
  height: 50px;
  margin-top: 12px;
}
</style>
