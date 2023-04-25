<template>
  <div class="musiclit-top-container">
    <div class="musiclist-name">歌单</div>
    <div class="music-count">曲目数</div>
    <div class="maker">创建人</div>
    <div class="lisetner">收听</div>
  </div>
</template>

<style scoped>
.musiclit-top-container {
  box-sizing: border-box;
  padding-left: 15px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  font-size: 15px;
  color: var(--words-gray);
}
.musiclist-name {
  width: 50%;
}
.music-count {
  width: 20%;
}
.maker {
  width: 20%;
}
.listener {
  width: 10%;
}
</style>
