import { reactive, watch } from "../packages/reactivity"

const obj = reactive({
  text1: 'hello',
  text2: 'world'
})

watch(
  () => obj.text2,
  (newValue, oldValue) => console.log(newValue, oldValue)
)

obj.text2 = 'vue3'

