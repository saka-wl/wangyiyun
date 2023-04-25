import { ref, readonly } from "vue";
import * as userLogin from "../api/login"; // 导入api模块
// 创建默认的全局单例响应式数据，仅供该模块内部使用

// 关于用户的账户信息
const user_account = ref(null)
// 是否在登入中
const user_loading = ref(false)
// 关于获取用户信息 , 歌单，收藏，mv, dj 数量
const user_info = ref(null)
// 用户头像
const user_avatar = ref(null)
// 对外暴露的数据是只读的，不能直接修改
// UserDetails
export const readUserAccount = readonly(user_account)
// LoginIsLoading
export const readUserIsLoading = readonly(user_loading)
// UserInfo
export const readUserInfo = readonly(user_info)
// UserAvatar
export const readUserAvatar = readonly(user_avatar)

// email登录
export async function Login(email, password) {
  user_loading.value = true;
  const user = await userLogin.emailLogin({
    email,
    password
  })
  let cookies = user.data.cookie.split(";;")
  cookies.forEach(item => {
    document.cookie = item
  })
  user_account.value = user;
  user_loading.value = false;
  return user
}

export function setUserMessage(data) {
  user_account.value = data
}

export function setUserInfo(data) {
  user_info.value = data
}

export function setAvatar(url) {
  user_avatar.value = url
}
// 退出
// export async function loginOut() {
//   state.loading = true;
//   await userServ.loginOut();
//   state.loading = false;
//   state.loginUser = null;
// }
// 恢复登录状态
// export async function whoAmI() {
//   state.loading = true;
//   const user = await userServ.whoAmI();
//   state.loading = false;
//   state.loginUser = user;
// }