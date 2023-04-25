import request from './request'

export function getHotMusic() {
  return request({
    method: 'get',
    url: '/search/hot/detail'
  })
}
