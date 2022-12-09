<template>
    <textarea id="editor"></textarea>
</template>

<script>
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

export default {
    components: {},
};
new EditorView({
    doc: "hello",
    extensions: [basicSetup, languageConf.of(javascript())],
    parent: document.querySelector("#editor"),
});
</script>

<style></style>
