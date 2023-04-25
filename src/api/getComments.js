import request from './request'

export function getMusicComments(id, limit, page) {
  return request({
    method: 'get',
    url: '/comment/music',
    params: {
      id,
      limit,
      offset: (page - 1) * limit,
    }
  })
}

export function sendComment(id, content, type = 0, t = 1) {
  return request({
    method: 'get',
    url: '/comment',
    params: {
      id,
      content,
      type,
      t
    }
  })
}