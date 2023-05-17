import { createApp } from 'vue'
import katexvue3 from "katex-vue3";
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import App from './App.vue';
import './style.css'

createApp(App).use(ToastPlugin).use(katexvue3, {
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
