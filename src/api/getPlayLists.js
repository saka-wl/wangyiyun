import request from './request'
import { PLAYLIST_LIMIT } from '../constant/pageLimit'
import { readUserAccount } from '../store/userLogin'

// 歌单分类
export function getPlaylistCategory() {
  return request({
    method: 'get',
    url: '/playlist/catlist'
  })
}

// 获取歌单
export function getPlaylist(cat, limit = PLAYLIST_LIMIT, page, order = 'hot') {
  return request({
    method: 'get',
    url: '/top/playlist',
    params: {
      cat,
      limit,
      offset: (page - 1) * limit,
      order
    }
  })
}

// 获取歌单详情
export function getPlayListDetails(id) {
  return request({
    method: 'get',
    url: '/playlist/track/all',
    params: {
      id
    }
  })
}

// 收藏或者取消收藏
export function playlistSubscribe(id, t = 1) {
  return request({
    method: 'get',
    url: '/playlist/subscribe',
    params: {
      id,
      t
    }
  })
}

// 获取用户自己的歌单
export function getUserPlaylist() {
  return request({
    method: 'get',
    url: '/user/playlist',
    params: {
      uid : readUserAccount.value.id
    }
  })
}

// 获取首页推荐的歌单
export function getRecommendMusicList() {
  return request({
    method: 'get',
    url: '/top/playlist/highquality',
    params: {
      limit: 25
    }
  })
}

