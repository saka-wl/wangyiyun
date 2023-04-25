import { ref, readonly } from "vue";
// 创建默认的全局单例响应式数据，仅供该模块内部使用
// status : playing | stop | loading | ""
// 是否在播放
const status = ref("")
// 歌曲所有信息
const data = ref(null)
// 正在播放的歌曲id
const playingId = ref("")
// 是否循环播放
const isLoop = ref(false)
// 当前页数
const currentPage = ref(1)
// 搜索歌曲的名字
const searchName = ref(null)
// 我喜欢的音乐
const myLikeMusicList = ref(null)
// 是否为多页类型
const isSinglePage = ref(false)
// 对外暴露的数据是只读的，不能直接修改

export const musicStatus = readonly(status)

export const musicData = readonly(data)

export const musicPlayingId = readonly(playingId)

export const musicIsLoop = readonly(isLoop)

export const musicCurrentPage = readonly(currentPage)

export const musicSearchName = readonly(searchName)

export const musicMyLikeList = readonly(myLikeMusicList)

export const musicIsSinglePage = readonly(isSinglePage)

export function setSinglePage(it) {
  isSinglePage.value = it
}

export function setMyLikeMusicList(it) {
  myLikeMusicList.value = it
}

export function setStatus(musicStatus) {
  status.value = musicStatus
}

export function setData(datas) {
  data.value = datas
}

export function setId(id) {
  playingId.value = id
}

export function setIsLoop(data) {
  isLoop.value = data
}

export function setCurrentPage(page) {
  currentPage.value = page
}

export function setSearchName(data) {
  searchName.value = data
}
