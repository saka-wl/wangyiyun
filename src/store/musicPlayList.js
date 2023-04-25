import { readonly, ref } from 'vue'
const id = ref(null)
const coverImg = ref(null)
const title = ref(null)
const desc = ref(null)

export const readId = readonly(id)
export const readcoverImg = readonly(coverImg)
export const readtitle = readonly(title)
export const readdesc = readonly(desc)


export function setId(it) {
  id.value = it
}
export function setCoverImg(it) {
  coverImg.value = it
}
export function setTitle(it) {
  title.value = it
}
export function setDesc(it) {
  desc.value = it
}
