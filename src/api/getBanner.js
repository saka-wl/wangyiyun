
import request from './request'

export function getBanner() {
  return request({
    method: 'get',
    url: '/banner',
    params: {
      type: 0
    }
  })
}