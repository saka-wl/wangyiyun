<template>
  <div class="app-container">
    <BannerTop :banner="banner" @handleClickEmit="handleBannerTopChange" />
    <router-view></router-view>
    <div class="music-player">
      <MusicPlayer></MusicPlayer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BannerTop from './components/Banner/BannerTop.vue'
import Discover from './views/Discover/index.vue'
import MusicPlayer from './components/MusicPlayer/index.vue'
const banner = ref(0)
const handleBannerTopChange = value => {
  banner.value = value
}
</script>

<style scoped>
.app-container {
  margin: 50px;
  margin-bottom: 100px;
  border-radius: 10px;
}

.music-player {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
}
</style>
