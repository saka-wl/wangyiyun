import request from './request'
import * as UserLoginStore from '../store/userLogin'

// 用户登录(email)
export function emailLogin(data) {
  return request({
    method: 'get',
    url: '/login',
    params: {
      email: data.email,
      password: data.password
    }
  })
}

export function getMyDetails() {
  return request({
    method: 'get',
    url: '/user/account',
  })
}

export function getMyInfo(uid) {
  return request({
    method: 'get',
    url: '/user/detail',
    params: {
      uid
    }
  })
}

// export function isLogin() {
//   return request({
//     method: 'get',
//     url: '/login/status'
//   })
// }

//清除所有cookie函数
function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
      for (var i = keys.length; i--;)
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}

export function LoginOut() {
  clearAllCookie()
  UserLoginStore.setUserMessage(null)
  UserLoginStore.setUserInfo(null)
  UserLoginStore.setAvatar(null)
  return request({
    method: "get",
    url: "/logout"
  })
}

export function getLoginStatus() {
  return request({
    method: "get",
    url: "/login/status"
  })
}

// 扫码登陆
// get key
export function codeLogin() {
  return request({
    method: 'get',
    url: '/login/qr/key',
    params: {
      timestamp: Date.now(),
      withCredentials: true
    }
  })
}

// get code by key
export function getImageCode(key) {
  return request({
    method: 'get',
    url: '/login/qr/create',
    params: {
      key,
      timestamp: Date.now(),
      qrimg: true,
      withCredentials: true
    }
  })
}

// check the status
export function checkStatus(key) {
  return request({
    method: 'get',
    url: '/login/qr/check',
    params: {
      key,
      timestamp: Date.now(),
      withCredentials: true
    }
  })
}