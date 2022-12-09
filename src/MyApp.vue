<script>
import CodeEditor from "./components/CodeEditor.vue";

export default {
    components: {
        CodeEditor,
    },
    methods: {
        printLambda(event) {
            if (event.key !== "\\") {
                return;
            }
            event.preventDefault();
            let transaction = view.state.update({
                changes: { from: view.state.selection.main.head, insert: "λ" },
                selection: {
                    anchor: view.state.doc.toString().length + 1,
                },
            });
            view.dispatch(transaction);
        },
    },
};
</script>

<template>
    <CodeEditor @keydown="printLambda"></CodeEditor>
</template>

<style scoped></style>
