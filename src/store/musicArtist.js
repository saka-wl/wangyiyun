import { ref, readonly, reactive } from 'vue'

const data = ref(null)

export const readData = readonly(data)

export function setData(it) {
  data.value = it
}