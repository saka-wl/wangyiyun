<template>
  <div class="myLike-container">
    <div class="bigImg">
      <img src="../../assets/myHomeBackground.jpg" alt="" />
      <div class="user-msg">
        <div class="avatar" v-if="avatar">
          <img :src="avatar" alt="" />
        </div>
        <div class="user-name">
          <h4>{{ nickname }}</h4>
        </div>
      </div>
    </div>

    <div class="tabBar">
      <div class="myLike">
        <h4
          class="block"
          :class="{
            checked: barIndex === 0
          }"
          @click="handleBarClick(0)"
        >
          我的喜欢 <span>(歌曲)</span>
        </h4>
      </div>
      <div class="myLikeList">
        <h4
          class="block"
          :class="{
            checked: barIndex === 1
          }"
          @click="handleBarClick(1)"
        >
          我的收藏 <span>(歌单)</span>
        </h4>
      </div>
      <div class="myLikeArtist">
        <h4
          class="block"
          :class="{
            checked: barIndex === 2
          }"
          @click="handleBarClick(2)"
        >
          我喜欢的他(她) <span>(歌手)</span>
        </h4>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { getLoginStatus } from '../../api/login'
import { onMounted, watch, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as storeUserLogin from '../../store/userLogin'

const router = useRouter()
const avatar = ref(null)
const nickname = ref(null)
const barIndex = ref(0)
const loginStatus = computed(() => {
  if(storeUserLogin.readUserAccount.value) {
    return storeUserLogin.readUserAccount.value.status
  }else {
    return null
  }
})

watch(
  loginStatus,
  newVal => {
    if (newVal === 0 && newVal !== null) {
      avatar.value = storeUserLogin.readUserInfo.value.profile.avatarUrl
      nickname.value = storeUserLogin.readUserInfo.value.profile.nickname
    } else {
      nickname.value = '^-^'
      ElMessage({
        showClose: true,
        message: '您尚未登录！请前往登录',
        type: 'warning'
      })
      router.push('/login')
    }
  },
  {
    immediate: true
  }
)

getLoginStatus().then(res => {
  if (res.data.data.account.status === -10) {
    ElMessage({
      message: '还未登录，请重新登录。',
      type: 'warning'
    })
    router.push('/login')
  }
})
const handleBarClick = val => {
  // 点击了我的喜欢
  if (val === 0 && barIndex.value !== 0) {
    barIndex.value = 0
    router.push('/my/mylikemusiclist')
    // 点击了我的收藏
  } else if (val === 1 && barIndex.value !== 1) {
    barIndex.value = 1
    router.push('/my/mycollectlists')
  } else if (val === 2 && barIndex.value !== 2) {
    barIndex.value = 2
    router.push('/my/mylikeartist')
  }
}
</script>

<style scoped>
.myLike-container {
  width: 100%;
}
.content {
  height: 400px;
  width: 100%;
}
.myLike-container .bigImg {
  margin-top: 50px;
  width: 100%;
  position: relative;
}
.myLike-container .bigImg img {
  width: 100%;
}
.user-msg {
  position: absolute;
  top: 60%;
  left: 50%;
  width: 200px;
  transform: translate(-50%, -50%);
}
.user-msg .avatar {
  height: 120px;
  width: 120px;
  margin: 0 auto;
}
.user-msg .avatar img {
  height: 120px;
  width: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-sizing: border-box;
}
.user-msg .user-name {
  height: 60px;
  width: 200px;
  margin: 30px auto;
  overflow: hidden;
}
.user-msg .user-name h4 {
  color: white;
  text-align: center;
  word-wrap: break-word;
  line-height: 30px;
  font-size: 34px;
  font-weight: 400;
}
.tabBar {
  width: 100%;
  height: 60px;
  /* border: 1px solid; */
  display: flex;
}
.myLike {
  height: 100%;
  width: 10%;
  line-height: 60px;
  padding-left: 20px;
}
.block {
  font-size: 16px;
  cursor: pointer;
  font-weight: 400;
}
.myLikeArtist {
  height: 100%;
  width: 15%;
  line-height: 60px;
  padding-left: 20px;
}
.myLikeList {
  height: 100%;
  width: 10%;
  line-height: 60px;
  padding-left: 20px;
}
.checked {
  color: var(--qqmusic-words);
}
.block span {
  font-size: 14px;
}
</style>
