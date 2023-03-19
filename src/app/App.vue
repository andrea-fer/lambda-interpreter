<script>
import CodeEditor from "./components/CodeEditor.vue";
import SolutionShort from "./components/SolutionShort.vue"
import SolutionSteps from "./components/SolutionSteps.vue"
import DropDown from "./components/DropDown.vue";
import DropDownItem from "./components/DropDownItem.vue";
import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "../interpreter/lambdaLexer.js";
import lambdaParser from "../interpreter/lambdaParser.js";
import callByValueLambdaVisitor from "../interpreter/callByValueLambdaVisitor.js";

export default {
    components: {
        CodeEditor,
        SolutionShort,
        SolutionSteps,
        DropDown,
        DropDownItem,
    },
    data() {
        return {
            sol: '',
            steps: '',
            strategies: [
                'Call by value',
                'Call by name',
            ]
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
                    anchor: view.state.selection.main.head + 1,
                },
            });
            view.dispatch(transaction);
        },
        printGreekLetter(event) {
            let dictionary = {
                "\\alpha": "α",
                "\\beta": "β",
                "\\gamma": "γ",
                "\\delta": "δ",
                "\\epsilon": "ε",
                "\\zeta": "ζ",
                "\\eta": "η",
                "\\theta": "θ",
                "\\iota": "ι",
                "\\kappa": "κ",
                "\\lambda": "λ",
                "\\mu": "μ",
                "\\nu": "ν",
                "\\xi": "ξ",
                "\\omicron": "ο",
                "\\pi": "π",
                "\\rho": "ρ",
                "\\sigma": "σ",
                "\\tau": "τ",
                "\\upsilon": "υ",
                "\\phi": "φ",
                "\\chi": "χ",
                "\\psi": "ψ",
                "\\omega": "ω"
            }
            for(let word in dictionary) {  
                let text = view.state.doc.toString();
                let pos = 0;
                let changes = [];
                let symbol = dictionary[word];
                for (let next; (next = text.indexOf(word, pos)) > -1;) {
                    changes.push({from: next, to: next + word.length, insert: symbol});
                    pos = next + 1;
            }
                view.dispatch({changes});
            }
        },
        printSolution(event) {
            //console.log("Hello");
            let definitions = new Map();
            let lastLine = view.state.doc.lines;
            console.log("lastLine: ", lastLine);
            let i = 0;
            let input = view.state.doc.text[i];
            let solution, steps = null;
            while(input != null) {
                input = input.replaceAll('λ', '\\lambda');
                //var input = "Lx.Ly.x\n";
                console.log(input);
                let chars = new InputStream(input, true);
                let lexer = new lambdaLexer(chars);
                let tokens = new CommonTokenStream(lexer);
                let parser = new lambdaParser(tokens);

                parser.buildParseTrees = true;
                let tree = parser.term();
                for(let [key, value] of definitions) {
                        console.log("*", key, ":", value, "*");
                }
                [solution, steps] = new callByValueLambdaVisitor(tree, definitions).visit(tree);
                // if steps == null -> term is definition
                if(steps == null) {
                    definitions.set(solution[0], solution[1]);
                    //console.log("Does map contain ", solution[0], "?", definitions.has(solution[0]));
                    console.log("°°°°Adding to definitios");
                    for(let [key, value] of definitions) {
                        console.log("°", key, ":", value, "°");
                    }
                } else {
                    break;
                }
                input = view.state.doc.text[i++];
            }

            solution = solution.replaceAll(' ', '~');
            solution = solution.replaceAll('\\lambda', '\\lambda ');
            console.log("Solution = ", solution);
            let stepsLen = steps.length;
            for(let i = 0; i < stepsLen; i++) {
                steps[i] = steps[i].replaceAll(' ', '~');
                steps[i] = steps[i].replaceAll('\\lambda', '\\lambda ');
            }
            console.log("Long solution = ", steps);
            return [solution, steps];
        },
    },
};
</script>

<template>
    <div id="content">
        <header>
            <h1>LAMBDA CALCULUS INTERPRETER</h1>
        </header>
        <div id="layout">
            <div id="help"></div>
            <div id="code_editor">
                <div class="btn_heading_row">
                    <button @click="[sol, steps] = printSolution()">EVALUATE</button>
                    <!-- <button>Strategy<br>call-by-value</button> -->
                    <DropDown title="Strategy">
                        <div>
                            <DropDownItem v-for="item in strategies" :key="item">
                                {{ item }}
                            </DropDownItem>
                        </div>
                    </DropDown>
                    <button>Upload</button>
                    <button>Save</button>
                </div>
                <!-- <CodeEditor @keydown="printLambda"></CodeEditor> -->
                <CodeEditor @keyup="printGreekLetter"></CodeEditor>
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
                <div id="solution_steps">
                    <SolutionSteps :steps="steps"></SolutionSteps>
                </div>
                <div class="btn_heading_row">
                    <h2>3.step</h2>
                    <textarea></textarea>
                    <button>Try</button>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <p>2023</p>
    </footer>
</template>

<style scoped></style>
