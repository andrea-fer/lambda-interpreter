<template>
    <div id=editor></div>
  </template>
  
  <script>
  import { EditorView, basicSetup } from "../../node_modules/codemirror";
  import { javascript } from "../../node_modules/@codemirror/lang-javascript";
  
  export default {
      mounted() {
          window.view = new EditorView({
          doc: 'console.log("Hello world")',
          extensions: [
              basicSetup,
              javascript(),
          ],
          parent: document.querySelector("#editor")
      });
      }
  }
  </script>
  
  <style>
  
  </style>