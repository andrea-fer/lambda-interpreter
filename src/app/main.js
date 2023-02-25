import { createApp } from 'vue'
import MathJax, { initMathJax, renderByMathjax } from "mathjax-vue3";
import App from './App.vue';
import './style.css'

function onMathJaxReady() {
    const sol = document.getElementById("sol");
    renderByMathjax(sol);
}

initMathJax({}, onMathJaxReady);

createApp(App).use(MathJax).mount('#app')
