<script>
import CodeEditor from "./components/CodeEditor.vue";
import SolutionShort from "./components/SolutionShort.vue"
import SolutionSteps from "./components/SolutionSteps.vue"
import CodeInput from "./components/CodeInput.vue"
import DropDown from "./components/DropDown.vue";
import DropDownItem from "./components/DropDownItem.vue";
import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "../interpreter/lambdaLexer.js";
import lambdaParser from "../interpreter/lambdaParser.js";
import callByValueLambdaVisitor from "../interpreter/callByValueLambdaVisitor.js";
import CodeInputVue from './components/CodeInput.vue';

export default {
    components: {
        CodeEditor,
        SolutionShort,
        SolutionSteps,
        CodeInput,
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
            ],
            nsteps: 0
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
            let input, solution, steps = null;
            let i = 0;
            do {
                input = view.state.doc.text[i++];
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
            } while(input != null);
    
            for(let [key, value] of definitions) {
                if(solution == value || solution.substring(1, solution.length - 1) == value) {
                    solution = key;
                    steps.push(solution);
                }
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
        saveTextAsFile(fileName) {
            let input, textToWrite = "";
            input = view.state.doc.text[0];
            let i = 1;
            while(input != null && input != '') {
                input = input.replaceAll('λ', '\\lambda');
                textToWrite = textToWrite + input + '\n';
                input = view.state.doc.text[i++];
            };
            let textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
            let downloadLink = document.createElement("a");
            downloadLink.download = fileName;
            downloadLink.innerHTML = "Download File";
            if(window.webkitURL != null) {
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            } else {
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }

            downloadLink.click();
        },
        importTextFromFile() {
            const [file] = document.querySelector("input[type=file]").files;
            const reader = new FileReader();

            reader.addEventListener(
                "load",
                () => {
                    let transaction = view.state.update({
                        changes: { from: 0, to: view.state.doc.length, insert: ""},
                    });
                    view.dispatch(transaction);

                    transaction = view.state.update({
                        changes: { from: 0, insert: reader.result},
                        selection: {
                            anchor: view.state.doc.length + 1,
                        },
                    });
                    view.dispatch(transaction);
                    this.printGreekLetter();
                },
                false
            );

            if(file) {
                reader.readAsText(file);
            }
        },
        incrementVisibleLineNumber(nsteps, steps) {
            if(nsteps < steps.length) {
                nsteps++;
            }            
            return nsteps;
        }
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
                    <button @click="[sol, steps] = printSolution(), nsteps = 1">EVALUATE</button>
                    <!-- <button>Strategy<br>call-by-value</button> -->
                    <DropDown title="Strategy">
                        <div>
                            <DropDownItem v-for="item in strategies" :key="item">
                                {{ item }}
                            </DropDownItem>
                        </div>
                    </DropDown>
                    <button>
                    <label for="upload-file">Upload</label>
                        <input type="file" @change="importTextFromFile()" accept=".txt" id="upload-file"/>
                    </button>
                    <button @click="saveTextAsFile('lambda_kalkul')">Save</button>
                </div>
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
                    <button @click="nsteps = incrementVisibleLineNumber(nsteps, steps)">Next</button>
                    <button @click="nsteps = steps.length">View All</button>
                </div>
                <div id="solution_steps">
                    <SolutionSteps :steps="steps" :nsteps="nsteps"></SolutionSteps>
                </div>
                <div class="btn_heading_row">
                    <h2>{{nsteps < steps.length ? (nsteps + 1 + '.step') : ''}}</h2>
                    <!-- <CodeInput></CodeInput> -->
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
