<template>
  <div class="login-container">
    <div class="container right-panel-active">
      <!-- Sign In -->
      <div class="container__form container--signin">
        <div class="form" id="form2">
          <h2 class="form__title">Sign In</h2>
          <input type="text" placeholder="Email" class="inputer" v-model="email" />
          <input type="password" placeholder="Password" class="inputer" v-model="password" />
          <div class="link" @click="chooseCodeLogin">选择扫码登录</div>
          <button class="btn" @click="login">Sign In</button>
        </div>
      </div>
      <!-- Overlay -->
      <div class="container__overlay">
        <div class="overlay"></div>
      </div>
    </div>
    <div
      class="outter-modal"
      :style="{
        display: isModalShow
      }"
    >
      <div class="modal">
        <img :src="codeImage" alt="" />
        <h3>用网易云App扫码登录</h3>
        <h4 @click="chooseSecLogin">选择密码登录</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const password = ref('')
// 登录
import * as LoginStore from '../../store/userLogin'
import { ElMessage } from 'element-plus'
import { getMyDetails, getMyInfo } from '../../api/login'
import { useRouter } from 'vue-router'
import * as loginApi from '../../api/login'
import { ElNotification } from 'element-plus'

const router = useRouter()

const codeImage = ref(null)
const isModalShow = ref('none')
let checkedTimer = null

const login = async () => {
  if (LoginStore.readUserIsLoading.value) {
    ElMessage({
      showClose: true,
      message: '请勿重复点击登录',
      type: 'warning'
    })
    return
  }
  await LoginStore.Login(email.value, password.value)
  const myDetails = await getMyDetails()
  await LoginStore.setUserMessage(myDetails.data.account)
  getMyInfo(myDetails.data.account.id).then(myInfo => {
    if (!myInfo.data) {
      ElMessage({
        showClose: true,
        message: '登录出现了bug，请重新登录',
        type: 'error'
      })
      return
    }
    LoginStore.setAvatar(myInfo.data.profile.avatarUrl)
    LoginStore.setUserInfo(myInfo.data)
    router.push('/discover/recommend')
  })
}
const checkLoginStatus = key => {
  checkedTimer = setInterval(async () => {
    const loginStatus = await loginApi.checkStatus(key)
    if (loginStatus.data.code === 803) {
      clearInterval(checkedTimer)
      document.cookie = loginStatus.cookie
      const myDetails = await getMyDetails()
      await LoginStore.setUserMessage(myDetails.data.account)
      const myInfo = await getMyInfo(myDetails.data.account.id)
      if (!myInfo.data) {
        ElMessage({
          showClose: true,
          message: '登录出现了bug，请重新登录',
          type: 'error'
        })
        return
      }
      LoginStore.setAvatar(myInfo.data.profile.avatarUrl)
      LoginStore.setUserInfo(myInfo.data)
      router.push('/discover/recommend')
    } else if (loginStatus.data.code === 801) {
      // 等待扫码
    } else if (loginStatus.data.code === 802) {
      // 正在扫码
    }
  }, 1500)
}
const chooseCodeLogin = async () => {
  isModalShow.value = 'block'
  const key_val = await loginApi.codeLogin()
  const key = key_val.data.data.unikey
  const img_val = await loginApi.getImageCode(key)
  const imageUrl = img_val.data.data.qrimg
  codeImage.value = imageUrl
  checkLoginStatus(key)
}
const chooseSecLogin = () => {
  isModalShow.value = 'none'
  clearInterval(checkedTimer)
  checkedTimer = null
}
</script>

<style>
.outter-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgb(204, 204, 204, 0.2);
  z-index: 9998;
  display: none;
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  height: 40%;
  width: 26%;
  z-index: 9999;
  text-align: center;
}
.modal img {
  height: 150px;
  width: 150px;
  margin-top: 10%;
}
.modal h3 {
  margin-top: 20px;
}
.modal h4 {
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
  color: var(--blue-name);
  cursor: pointer;
}
:root {
  /* COLORS */
  --white: #e9e9e9;
  --gray: #333;
  --blue: #0367a6;
  --lightblue: #008997;

  /* RADII */
  --button-radius: 0.7rem;

  /* SIZES */
  --max-width: 758px;
  --max-height: 420px;

  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.login-container {
  align-items: center;
  background-color: rgb(235, 235, 235);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  padding-top: 100px;
  padding-bottom: 100px;
  place-items: center;
  position: relative;
  z-index: 0;
}

.form__title {
  font-weight: 300;
  margin: 0;
  margin-bottom: 1.25rem;
}

.link {
  color: var(--gray);
  font-size: 0.9rem;
  margin: 1.5rem 0;
  /* text-decoration: none; */
  cursor: pointer;
  color: var(--blue-name);
}

.container {
  background-color: var(--white);
  border-radius: var(--button-radius);
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25), 0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: var(--max-height);
  max-width: var(--max-width);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.container__form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .container--signin {
  transform: translateX(100%);
}

.container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.container.right-panel-active .container--signup {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.container__overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.container.right-panel-active .container__overlay {
  transform: translateX(-100%);
}

.overlay {
  background-color: var(--lightblue);
  background: url('https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay__panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: var(--blue);
  background-image: linear-gradient(90deg, var(--blue) 0%, var(--lightblue) 74%);
  border-radius: 20px;
  border: 1px solid var(--blue);
  color: var(--white);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form > .btn {
  margin-top: 1.5rem;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}

.form {
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.inputer {
  background-color: #fff;
  border: none;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>
