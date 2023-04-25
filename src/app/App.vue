<script>
import CodeEditor from "./components/CodeEditor.vue";
import SolutionShort from "./components/SolutionShort.vue"
import SolutionSteps from "./components/SolutionSteps.vue"
import CodeInput from "./components/CodeInput.vue"
import DropDown from "./components/DropDown.vue";
import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "../interpreter/lambdaLexer.js";
import lambdaParser from "../interpreter/lambdaParser.js";
import callByValueLambdaVisitor from "../interpreter/callByValueLambdaVisitor.js";
import callByNameLambdaVisitor from "../interpreter/callByNameLambdaVisitor.js";

export default {
    components: {
        CodeEditor,
        SolutionShort,
        SolutionSteps,
        CodeInput,
        DropDown,
    },
    data() {
        return {
            sol: '',
            steps: '',
            strategy: {id: 1, name: 'Call by Value'},
            nsteps: 0,
        }
    },
    methods: {
        logDocs() {
            const doc1 = this.$refs.editor_definitions.view.state.doc;
            const doc2 = this.$refs.editor_guess.view.state.doc;
            const doc3 = this.$refs.editor_redex.view.state.doc;
            console.log("Doc 1:", doc1.toString());
            console.log("Doc 2:", doc2.toString());
            console.log("Doc 3:", doc3.toString());
        },
        printGreekLetter(event, editorView) {
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
            
            let changes = [];
            for(let word in dictionary) {  
                let text = editorView.state.doc.toString();
                let pos = 0;
                let symbol = dictionary[word];
                for (let next; (next = text.indexOf(word, pos)) > -1;) {
                    changes.push({from: next, to: next + word.length, insert: symbol});
                    pos = next + 1;
                }
            }
            editorView.dispatch({changes});
        },
        printSolution(event) {
            //console.log("Hello");
            let definitions = new Map();
            // select visitor
            let visitor;
            switch(this.strategy.id) {
                case 1:
                    visitor = callByValueLambdaVisitor;
                    break;
                case 2:
                    visitor = callByNameLambdaVisitor;
                    break;
                default:
                    return ["", null];
            }
            /* let lastLine = view.state.doc.lines;
            console.log("lastLine: ", lastLine); */
            let input, solution, steps = null;
            let i = 0;
            // parse input from editor_definitions
            do {
                input = this.$refs.editor_definitions.view.state.doc.text[i++];
                if(input == null || input.length == 0) {
                    console.log(input)
                    console.log("input is null ", input == null)
                    console.log("input len ", input.length)
                    console.log("break")
                    break;
                }
                console.log(input.length);
                input = input.replaceAll('λ', '\\lambda');
                //var input = "Lx.Ly.x\n";
                let chars = new InputStream(input, true);
                let lexer = new lambdaLexer(chars);
                let tokens = new CommonTokenStream(lexer);
                let parser = new lambdaParser(tokens);

                parser.buildParseTrees = true;
                let tree = parser.term();
                /* for(let [key, value] of definitions) {
                        console.log("*", key, ":", value, "*");
                } */
                [solution, steps] = new visitor(tree, definitions).visit(tree);
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

            // parse input from editor_redex
            input = this.$refs.editor_redex.view.state.doc.text[0];
            if(input != null && input.length > 0) {
                input = input.replaceAll('λ', '\\lambda');
                //var input = "Lx.Ly.x\n";
                console.log(input);
                let chars = new InputStream(input, true);
                let lexer = new lambdaLexer(chars);
                let tokens = new CommonTokenStream(lexer);
                let parser = new lambdaParser(tokens);

                parser.buildParseTrees = true;
                let tree = parser.term();
                /* for(let [key, value] of definitions) {
                        console.log("*", key, ":", value, "*");
                } */
                [solution, steps] = new visitor(tree, definitions).visit(tree);
                solution = solution.replaceAll(' ', '~');
                solution = solution.replaceAll('\\lambda', '\\lambda ');
                console.log("Solution = ", solution);
                let stepsLen = steps.length;
                for(let i = 0; i < stepsLen; i++) {
                    steps[i] = steps[i].replaceAll(' ', '~');
                    steps[i] = steps[i].replaceAll('\\lambda', '\\lambda ');
                }
                
                for(let [key, value] of definitions) {
                    if(solution == value || solution.substring(1, solution.length - 1) == value) {
                        solution = key;
                        steps.push(solution);
                    }
                }
                console.log("Long solution = ", steps);
                return [solution, steps];
            }
            console.log(input)
            console.log("input is null ", input == null)
            console.log("input len ", input.length)
            console.log("exit func")
            return ["", null];
        },
        saveTextAsFile(fileName, editorView) {
            let input, textToWrite = "";
            input = editorView.state.doc.text[0];
            let i = 1;
            while(input != null && input != '') {
                input = input.replaceAll('λ', '\\lambda');
                textToWrite = textToWrite + input + '\n';
                input = editorView.state.doc.text[i++];
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
        importTextFromFile(editorView, input_id) {
            const [file] = document.querySelector(`#${input_id}[type=file]`).files;
            const reader = new FileReader();
            if(file) {
                reader.readAsText(file);
            }

            reader.addEventListener(
                "load",
                () => {
                    let fileContent = reader.result;
                    console.log(fileContent);
                    if(input_id === "upload-file-redex"){
                        // if user tries to load multiline file, accept only first line
                        if(fileContent.includes("\n")) {
                            fileContent = fileContent.substring(0, fileContent.indexOf("\n"));
                        }
                    }
                    let changes = [
                        { from: 0, to: editorView.state.doc.length, insert: "" },
                        { from: 0, insert: fileContent }
                    ];
                    editorView.dispatch({changes});
                    this.printGreekLetter(null, editorView);
                },
                false
            );
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
            <!-- <p>Strategy = {{ strategy.name }}</p> -->
        </header>
        <div id="layout">
            <div id="help"></div>
            <div id="code_editor">
                <div class="btn_heading_row">
                    <button @click="[sol, steps] = printSolution(), nsteps = steps ? 1 : 0">EVALUATE</button>
                    <!-- <button @click="logDocs">Log Docs</button> -->
                    <!-- <button>Strategy<br>call-by-value</button> -->
                    <DropDown @option-selected="strategy = $event" title="Strategy"></DropDown>
                    <button>
                        <label for="upload-file-redex">Upload Redex</label>
                        <input type="file" @change="importTextFromFile(this.$refs.editor_redex.view, 'upload-file-redex')" accept=".txt" id="upload-file-redex"/>
                    </button>
                    <button @click="saveTextAsFile('lambda_kalkul_redex', this.$refs.editor_redex.view)">Save Redex</button>
                </div>
                <CodeInput ref="editor_redex" @keyup="printGreekLetter($event, this.$refs.editor_redex.view)"></CodeInput>
                <div class="btn_heading_row">
                    <button>
                        <label for="upload-file-definitions">Upload Definitions</label>
                        <input type="file" @change="importTextFromFile(this.$refs.editor_definitions.view, 'upload-file-definitions')" accept=".txt" id="upload-file-definitions"/>
                    </button>
                    <button @click="saveTextAsFile('lambda_kalkul_definitions', this.$refs.editor_definitions.view)">Save Definitions</button>
                </div>
                <CodeEditor ref="editor_definitions" @keyup="printGreekLetter($event, this.$refs.editor_definitions.view)"></CodeEditor>
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
                    <button @click="nsteps = steps ? incrementVisibleLineNumber(nsteps, steps) : null">Next</button>
                    <button @click="nsteps = steps ? steps.length : 0">View All</button>
                </div>
                <div id="solution_steps">
                    <SolutionSteps :steps="steps" :nsteps="nsteps"></SolutionSteps>
                </div>
                <div class="btn_heading_row">
                    <h2>{{ (steps && nsteps < steps.length) ? (nsteps + 1 + '.step') : '' }}</h2>
                    <CodeInput ref="editor_guess" @keyup="printGreekLetter($event, this.$refs.editor_guess.view)"></CodeInput>
                    <!-- <textarea></textarea> -->
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
