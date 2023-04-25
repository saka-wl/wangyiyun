import request from './request'
import { ARTIST_LIMIT, PAGE_LIMIT } from '../constant/pageLimit'
import {readUserAccount} from '../store/userLogin'

// 调用此接口,可获取歌手分类列表
export function getArtistList(page, limit, type = -1, initial = -1, area = -1) {
  return request({
    method: 'get',
    url: '/artist/list',
    params: {
      limit,
      type,
      initial,
      area,
      offset: (page - 1) * ARTIST_LIMIT
    }
  })
}

// 调用此接口,可收藏歌手
export function subArtist(id, t = 1) {
  return request({
    method: 'get',
    url: '/artist/sub',
    params: {
      id,
      t
    }
  })
}

// 调用此接口,可获取歌手热门 50 首歌曲
export function getArtistTopSongs(id) {
  return request({
    method: 'get',
    url: '/artist/top/song',
    params: {
      id
    }
  })
}

// 调用此接口,可获取歌手全部歌曲
export function getArtistAllSongs(id, page, limit = PAGE_LIMIT, order = 'time') {
  return request({
    method: 'get',
    url: '/artist/songs',
    params: {
      id,
      limit,
      offset: (page - 1) * limit,
      order
    }
  })
}

// 调用此接口 , 传入歌手 id, 可获得获取歌手详情
export function getArtistDetail(id) {
  return request({
    method: 'get',
    url: '/artist/detail',
    params: {
      id
    }
  })
}

// 调用此接口 , 可获取热门歌手数据
export function getTopArtist(limit, page) {
  return request({
    method: 'get',
    url: '/top/artists',
    params: {
      limit,
      offset: (page - 1) * limit
    }
  })
}

// 搜索歌手
export function searchArtist(keywords) {
  return request({
    method: 'get',
    url: '/cloudsearch',
    params: {
      keywords,
      type: 100
    }
  })
}

// 获取用户关注列表
export function getUserLikeArtists() {
  return request({
    method: 'get',
    url: '/artist/sublist',
  })
}