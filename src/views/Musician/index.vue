<template>
  <div class="user-info-container" v-if="readUserInfo.profile">
    <div class="left-avatar">
      <el-image
        style="height: 300px;width: 300px;"
        :src="readUserInfo.profile.avatarUrl"
        :zoom-rate="1.2"
        :preview-src-list="[readUserInfo.profile.avatarUrl]"
        :initial-index="4"
        fit="cover"
      />
    </div>
    <div class="right-msg">
      <div class="top-right-msg">
        <div class="name">
          {{readUserInfo.profile.nickname}}
        </div>
        <div class="level">
          <span>你的等级：</span>{{readUserInfo.level}}
        </div>
      </div>
      <div class="bottom-right-msg">
        <div class="desc">
          <el-input
          v-model="textarea"
          :rows="5"
          type="textarea"
          placeholder="输入您的简介..."
        />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {readUserInfo} from '../../store/userLogin'
import {ref, onBeforeMount} from 'vue'

const textarea = ref(null)
onBeforeMount(() => {
  textarea.value = readUserInfo.value.profile.description
})

</script>

<style>
.user-info-container {
  width: 80%;
  margin: 50px auto;
  display: flex;
}
.left-avatar {
  height: 400px;
  width: 400px;
  text-align: center;
  line-height: 400px;
  flex: 0 0 400px;
}
.right-msg {
  flex: 1 1 600px;
}
.top-right-msg {

}
.level {
  margin-top: 40px;
}
.level span {
  font-size: 17px;
}
.level {
  font-size: 22px;
}
.top-right-msg .name {
  font-size: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--words-gray);
}
.bottom-right-msg {
  margin-top: 20px;
}
</style>
