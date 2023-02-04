<script>
import CodeEditor from "./components/CodeEditor.vue";
import SolutionShort from "./components/SolutionShort.vue"
import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "../interpreter/lambdaLexer.js";
import lambdaParser from "../interpreter/lambdaParser.js";
import myLambdaVisitor from "../interpreter/myLambdaVisitor.js";
import { parseStringStyle } from "@vue/shared";

export default {
    components: {
        CodeEditor,
        SolutionShort
    },
    data() {
        return {
            sol: ''
        }
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
            let lastLine = view.state.doc.lines;
            let input = view.state.doc.text[lastLine - 2];
            input = input.replaceAll('λ', 'L');
            //var input = "Lx.Ly.x\n";
            console.log(input);
            let chars = new InputStream(input, true);
            let lexer = new lambdaLexer(chars);
            let tokens = new CommonTokenStream(lexer);
            let parser = new lambdaParser(tokens);

            parser.buildParseTrees = true;
            let tree = parser.term();
            let solution = new myLambdaVisitor(input).visit(tree);
            solution = solution.replaceAll('L', 'λ');
            console.log("Solution = ", solution);
            return solution;
        },
    },
};
</script>

<template>
    <header>
        <h1>LAMBDA CALCULUS INTERPRETER</h1>
    </header>
        <div id="layout">
            <div id="help"></div>
            <div id="code_editor">
                <div class="btn_heading_row">
                    <button @click="sol = printSolution()">EVALUATE</button>
                    <button>Strategy<br>call-by-value</button>
                    <button>Upload</button>
                    <button>Save</button>
                </div>
                <CodeEditor @keydown="printLambda"></CodeEditor>
            </div>
            <div id="results">
                <div class="btn_heading_row">
                    <h2>SOLUTION</h2>
                </div>
                <div id="solution_short">
                    <SolutionShort :solution="sol"></SolutionShort>
                </div>
                <div class="btn_heading_row">
                    <h2>Step-by-step</h2>
                    <button>Next</button>
                    <button>View All</button>
                </div>
                <div id="solution_steps"></div>
                <div class="btn_heading_row">
                    <h2>3.step</h2>
                    <textarea></textarea>
                    <button>Try</button>
                </div>
            </div>
        </div>
    <footer><p>2023</p></footer>
</template>

<style scoped></style>
