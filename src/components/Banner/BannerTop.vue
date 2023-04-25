<template>
  <div class="banner-container">
    <div class="log">
      <i class="iconfont icon-wangyiyunyinleclick"></i>
      <p>网易云音乐</p>
    </div>

    <router-link to="/discover/recommend">
      <div
        class="block"
        :class="{
          checked: banner === 0
        }"
        @click="handleClick(0)"
      >
        发现音乐
      </div>
    </router-link>
    <router-link to="/my">
      <div
        class="block"
        :class="{
          checked: banner === 1
        }"
        @click="handleClick(1)"
      >
        我的音乐
      </div>
    </router-link>
    <router-link to="friend">
      <div
        class="block"
        :class="{
          checked: banner === 2
        }"
        @click="handleClick(2)"
      >
        关注
      </div>
    </router-link>
    <router-link to="/musician">
      <div
        class="block"
        :class="{
          checked: banner === 3
        }"
        @click="handleClick(3)"
      >
        <router-link to="/myhome">我的主页</router-link>
      </div>
    </router-link>

    <div class="input">
      <input type="text" v-model="search" />
      <div class="search-btn" @click="searchSong">
        <i class="iconfont icon-chaxun"></i>
      </div>
    </div>
    <div class="avatar" v-if="avatarUrl">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :size="40" :src="avatarUrl" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item> {{}} </el-dropdown-item> -->
            <el-dropdown-item @click="handleLogOut"> 退出登录 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="login" v-else @click="goToLogin">
      <h4>登录</h4>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, watch, onMounted, computed } from 'vue'
import { searchMusic } from '../../api/getSong'
import { PAGE_LIMIT } from '../../constant/pageLimit'
import * as MusicMessage from '../../store/musicData'
import * as UserLoginMessage from '../../store/userLogin'
import { useRouter } from 'vue-router'
import { getMyDetails, getMyInfo, getLoginStatus, LoginOut } from '../../api/login'
import { ElMessage } from 'element-plus'
// 搜索框内容
const search = ref('')
// 头像url
const avatarUrl = computed(() => {
  if (UserLoginMessage.readUserInfo.value === null || (UserLoginMessage.readUserAccount.value && UserLoginMessage.readUserAccount.value.status !== 0)) {
    return null
  }
  return UserLoginMessage.readUserAvatar.value
})
// css样式选择
const props = defineProps({
  banner: Number
})
const emit = defineEmits(['handleClickEmit'])
const handleClick = target => {
  emit('handleClickEmit', target)
}
// 去登录界面
const router = useRouter()
const goToLogin = () => {
  router.push('/login')
}
// 查询歌曲
const searchSong = () => {
  router.push('/search/' + search.value)
  MusicMessage.setSearchName(search.value)
  if (!MusicMessage.musicData) {
    searchMusic(search.value, PAGE_LIMIT, 1).then(res => {
      router.push('/search/' + search.value)
      MusicMessage.setSearchName(search.value)
      MusicMessage.setData(res.data.result)
    })
  }
}
// 自动登录
onMounted(async () => {
  const account = await getMyDetails()
  UserLoginMessage.setUserMessage(account.data.account)

  const loginStatus = await getLoginStatus()
  if (loginStatus.data.data.account.status === 0) {
    getMyInfo(account.data.account.id).then(musicInfo => {
      if (musicInfo.data && musicInfo.data.profile) {
        UserLoginMessage.setAvatar(musicInfo.data.profile.avatarUrl)
        UserLoginMessage.setUserInfo(musicInfo.data)
      }
    })
  } else {
    ElMessage({
      message: '请重新登录',
      type: 'warning'
    })
  }
})
// 取消登录
const handleLogOut = () => {
  LoginOut()
  ElMessage({
    message: '退出登录成功',
    type: 'success'
  })
}
</script>

<style scoped>
.el-dropdown-link {
  outline: none;
}
.login {
  height: 60px;
  width: 100px;
  line-height: 60px;
  font-size: 15px;
  transform: translateX(50px);
  cursor: pointer;
}
.banner-container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 60px;
  font-size: 14px;
  background-color: var(--body-background-color);
  color: var(--normal-words);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  overflow: hidden;
}
.log {
  display: flex;
  height: 60px;
  width: 200px;
  line-height: 60px;
  cursor: pointer;
}
.log p {
  margin-left: 10px;
  width: 150px;
}
.block {
  width: 160px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s;
}
.block:hover {
  background-color: var(--normal-words);
  color: var(--body-background-color);
  border-radius: 20px;
}
.checked {
  background-color: var(--normal-words);
  color: var(--body-background-color);
  border-radius: 20px;
}
.input {
  display: flex;
  width: 250px;
  height: 60px;
  text-align: center;
  cursor: pointer;
}
.input input {
  height: 30px;
  width: 170px;
  border-radius: 5px;
  padding-left: 5px;
  border: none;
  outline: none;
  margin-right: 15px;
  margin-top: 15px;
}
.search-btn {
  background-color: var(--normal-words);
  height: 30px;
  margin-top: 15px;
  border-radius: 4px;
  width: 60px;
  line-height: 32px;
}
.avatar {
  height: 60px;
  width: 100px;
  margin-top: 10px;
  transform: translateX(50px);
  cursor: pointer;
}
</style>
