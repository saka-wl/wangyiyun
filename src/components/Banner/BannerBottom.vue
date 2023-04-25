<template>
  <div class="banner-bottom-container">
    <router-link to="/discover/recommend">
      <div
        class="block"
        :class="{
          checked: checkedRef === 0
        }"
      >
        推荐
      </div>
    </router-link>
    <router-link to="/discover/toplist">
      <div
        class="block"
        :class="{
          checked: checkedRef === 1
        }"
      >
        排行榜
      </div>
    </router-link>
    <router-link to="/discover/playlist">
      <div
        class="block"
        :class="{
          checked: checkedRef === 2
        }"
      >
        歌单
      </div>
    </router-link>
    <router-link to="/discover/djradio">
      <div
        class="block"
        :class="{
          checked: checkedRef === 3
        }"
      >
        主播电台
      </div>
    </router-link>
    <router-link to="/discover/artist">
      <div
        class="block"
        :class="{
          checked: checkedRef === 4
        }"
      >
        歌手
      </div>
    </router-link>
    <router-link to="/discover/album">
      <div
        class="block"
        :class="{
          checked: checkedRef === 5
        }"
      >
      新碟上架
    </div>
    </router-link>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const checkedRef = ref(0)
const arr = ['/discover/recommend', '/discover/toplist', '/discover/playlist', '/discover/djradio', '/discover/artist', '/discover/album']

const route = computed(() => router.currentRoute.value.path)
watch(
  route,
  (newVal, oldVal) => {
    arr.forEach((it, i) => {
      if (newVal === it) {
        checkedRef.value = i
      }
    })
  },
  {
    deep: true
  }
)
</script>

<style scoped>
.banner-bottom-container {
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: center;
  /* background-color: rgb(180, 0, 0); */
  background-color: var(--red-words);
  color: rgb(255, 255, 255);
  overflow: hidden;
}
.block {
  height: 25px;
  line-height: 25px;
  width: 90px;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s;
}
.block:hover {
  /* background-color: rgb(255, 55, 55, 0.5); */
  background-color: var(--red-words-hovered);
  border-radius: 20px;
}
.checked {
  /* background-color: rgb(255, 55, 55, 0.5); */
  background-color: var(--red-words-hovered);
  border-radius: 20px;
}
</style>
