<template>
  <div
    class="music-container"
    :class="{
      darkBackground: index % 2 === 0
    }"
  >
    <div class="music-index">{{ number }}</div>
    <i class="iconfont music-icon" :class="classIcon" @click="goToMusicDetail"></i>
    <div class="music-name">
      {{ item.name }}
    </div>
    <div
      class="vip"
      :style="{
        opacity: isVip
      }"
    >
      VIP
    </div>
    <div class="tip">{{ item.name }}</div>
    <div class="music-singer" @click="goToMusicArtist(item)">{{ item.ar && item.ar[0].name }}</div>
    <div class="like">
      <i
        class="iconfont icon-aixin"
        :class="{
          liked: isLike
        }"
        @click="handleLikeChange"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onBeforeMount, defineEmits } from 'vue'
import * as MusicMessage from '../../store/musicData'
import {readUserAccount} from '../../store/userLogin'
import * as getSongApi from '../../api/getSong'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'

const props = defineProps(['data', 'currentPage', 'index'])
const number = props.index + 1 + (props.currentPage - 1) * 10
const router = useRouter()
const item = computed(() => {
  return props.data
})
const isVip = computed(() => {
  if (props.data.fee === 1) {
    return 1
  }
  return 0
})
const emit = defineEmits('clickPlay')
const isLike = ref(false)

watch(
  MusicMessage.musicMyLikeList,
  () => {
    if (MusicMessage.musicMyLikeList.value && MusicMessage.musicMyLikeList.value.includes(props.data.id)) {
      isLike.value = true
    } else {
      isLike.value = false
    }
  },
  {
    immediate: true
  }
)

const handleLikeChange = () => {
  if(readUserAccount.value === null || readUserAccount.value.status === -10) {
    ElMessage({
    message: '请先登录',
    type: 'warning',
  })
    return
  }
  if (isLike.value === true) {
    isLike.value = false
    getSongApi.likeMusic(props.data.id, false)
  } else if (isLike.value === false) {
    isLike.value = true
    getSongApi.likeMusic(props.data.id, true)
  }
}

const classIcon = ref('icon-bofang')
// 前往播放音乐组件
const goToMusicDetail = () => {
  if (MusicMessage.musicPlayingId.value === item.value.id) {
    if (MusicMessage.musicStatus.value === 'playing') {
      MusicMessage.setStatus('stop')
    } else if (MusicMessage.musicStatus.value === 'stop') {
      MusicMessage.setStatus('playing')
    } else if (MusicMessage.musicStatus.value === 'loading') {
      return
    }
  } else {
    MusicMessage.setStatus('loading')
    MusicMessage.setId(item.value.id)
    emit('clickPlay', item.value.id)
  }
}
// 监听，然后判断是否要变化classIcon
watch(
  [MusicMessage.musicPlayingId, MusicMessage.musicStatus],
  ([newVal, newVal2], [oldVal, oldVal2]) => {
    if (newVal === item.value.id && newVal2 === 'playing') {
      classIcon.value = 'icon-weibiaoti'
    } else if (newVal === item.value.id && newVal2 === 'loading') {
      classIcon.value = 'icon-jiazaizhong-smaller'
    } else {
      classIcon.value = 'icon-bofang'
    }
  },
  {
    immediate: true
  }
)

const goToMusicArtist = (item) => {
  router.push('/artistdetail/' + item.ar[0].id)
}
</script>

<style scoped>
.music-container {
  display: flex;
  height: 55px;
  line-height: 55px;
  /* border-top: 1.6px solid var(--body-background-color); */
  padding-left: 40px;
  /* background-color: var(--body-background-color); */
  background-color: white;
  position: relative;
}
.darkBackground {
  background-color: #f8f8f7;
}
.music-index {
  font-size: 17px;
  color: var(--words-gray);
  font-weight: 600;
  width: 20px;
}
.music-icon {
  margin-left: 50px;
}
.music-name {
  margin-left: 10%;
  font-size: 16px;
  color: var(--normal-words);
  width: 150px;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
}
.tip {
  position: absolute;
  height: 30px;
  top: -16px;
  left: 450px;
  z-index: 99;
  border-radius: 6px;
  background-color: var(--words-gray);
  color: white;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  opacity: 0;
  transition: all 0.3s;
}
.tip::after {
  content: '';
  width: 0;
  height: 0;
  border-top: 10px solid var(--words-gray);
  border-right: 15px solid transparent;
  border-left: 20px solid transparent;
  position: absolute;
  top: 23px;
  left: -17px;
  transform: rotate(-40deg);
  z-index: 9;
}
.music-name:hover ~ .tip {
  opacity: 1;
}
.music-singer {
  margin-left: 20%;
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.music-time {
  margin-left: 18%;
}
.vip {
  height: 20px;
  line-height: 20px;
  margin: auto 0;
  border: 2px solid var(--border-hovered);
  color: var(--border-hovered);
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 40px;
}
.like {
  margin-left: 50px;
  margin-right: 50px;
}
.like .iconfont {
  font-size: 20px;
}
.like .iconfont.liked {
  color: red;
}
</style>
