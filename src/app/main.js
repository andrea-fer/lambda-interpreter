import { createApp } from 'vue'
import katexvue3 from "katex-vue3";
import App from './App.vue';
import './style.css'

createApp(App).use(katexvue3, {
    flag: [
      { left: "$", right: "$" },
      { left: "$$", right: "$$" }
    ],
    options: {
      displayMode: false, 
      throwOnError: false, 
      errorColor: "#FF0000"
    }
  }).mount('#app')
