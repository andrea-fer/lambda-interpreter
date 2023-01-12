<script>
import CodeEditor from "./components/CodeEditor.vue";
import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "../interpreter/lambdaLexer.js";
import lambdaParser from "../interpreter/lambdaParser.js";
import myLambdaVisitor from "../interpreter/myLambdaVisitor.js";
import { parseStringStyle } from "@vue/shared";

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
        printSolution(event) {
            //console.log("Hello");
            var lastLine = view.state.doc.lines;
            var input = view.state.doc.text[lastLine - 2];
            //var input = "Lx.Ly.x\n";
            console.log(input);
            var chars = new InputStream(input, true);
            var lexer = new lambdaLexer(chars);
            var tokens = new CommonTokenStream(lexer);
            var parser = new lambdaParser(tokens);

            parser.buildParseTrees = true;
            var tree = parser.term();
            console.log("Solution = ", new myLambdaVisitor().visit(tree));
        },
    },
};
</script>

<template>
    <CodeEditor @keydown="printLambda"></CodeEditor>
    <button @click="printSolution()">click me</button>
</template>

<style scoped></style>
