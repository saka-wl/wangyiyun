import request from './request'
import {readUserAccount} from '../store/userLogin'

export function searchMusic(keywords, limit, page) {
  return request({
    method: 'get',
    url: '/cloudsearch',
    params: {
      keywords,
      limit,
      offset: (page - 1) * limit,
    }
  })
}

export function getMusicImage(keywords, limit, page) {
  return request({
    method: 'get',
    url: '/search',
    params: {
      keywords,
      limit,
      offset: (page - 1) * limit,
      type: 1000
    }
  })
}

export function getMusicUrl(id) {
  return request({
    method: 'get',
    url: '/song/url',
    params: {
      id
    }
  })
}

export function getLyric(id) {
  return request({
    method: 'get',
    url: '/lyric',
    params: {
      id
    }
  })
}

// 获取新歌
export function getNewSong(type = 0) {
  return request({
    method: 'get',
    url: '/top/song',
    params: {
      type
    }
  })
}

// 获取用户所有喜欢的音乐
export function UserLikeMusic() {
  return request({
    method: 'get',
    url: '/likelist',
    params: {
      id: readUserAccount.value.id
    }
  })
}

// 更改喜欢音乐
export function likeMusic(id, like) {
  return request({
    method: 'get',
    url: '/like',
    params: {
      id,
      like
    }
  })
}

// 通过id获取歌曲详情
export function getSongDetail(ids) {
  return request({
    method: 'get',
    url: '/song/detail',
    params: {
      ids
    }
  })
}

// 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
export function getRecommendMusic() {
  return request({
    method: 'get',
    url: '/recommend/songs'
  })
}