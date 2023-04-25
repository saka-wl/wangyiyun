<template>
  <div class="music-container">
    <div class="music-index">序号</div>
    <div class="music-icon">
      播放
    </div>
    <div class="music-name">歌名</div>
    <div class="music-singer">歌手</div>
    <!-- <div class="music-time">时间</div> -->
  </div>
</template>

<script>

</script>

<style scoped>
.music-container {
  display: flex;
  height: 55px;
  line-height: 55px;
  padding-left: 30px;
  font-size: 15px;
  background-color: var(--white-background-color);
  /* background-color: white; */
  overflow: hidden;
}
.music-icon {
  margin-left: 50px;
}
.music-name {
  margin-left: 10%;
  width: 150px;
}
.music-singer {
  margin-left: calc(20% + 70px);
  width: 250px;
}
.music-time {
  margin-left: 18%;
}
</style>
