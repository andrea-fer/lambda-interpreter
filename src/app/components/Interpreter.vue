<template>
    <div id="code-editor">
        <div class="btn-heading-row">
            <button>
                <label class="no-select" for="upload-file-definitions">Upload Definitions</label>
                <input type="file" @change="importTextFromFile(this.$refs.editor_definitions.view, 'upload-file-definitions')" accept=".txt" id="upload-file-definitions"/>
            </button>
            <button class="no-select" @click="saveTextAsFile('lambda_kalkul_definitions', this.$refs.editor_definitions.view)">Save Definitions</button>
        </div>
        <CodeEditor ref="editor_definitions" @keyup="printGreekLetter(this.$refs.editor_definitions.view)"></CodeEditor>
        <div class="btn-heading-row">
            <button>
                <label class="no-select" for="upload-file-redex">Upload Redex</label>
                <input type="file" @change="importTextFromFile(this.$refs.editor_redex.view, 'upload-file-redex')" accept=".txt" id="upload-file-redex"/>
            </button>
            <button class="no-select" @click="saveTextAsFile('lambda_kalkul_redex', this.$refs.editor_redex.view)">Save Redex</button>
        </div>
        <CodeInput placeholderText="Type your λ-term here..." class="editor_redex" ref="editor_redex" @keyup="printGreekLetter(this.$refs.editor_redex.view)"></CodeInput>
        <div class="btn-heading-row">
            <DropDown @option-selected="strategy = $event"></DropDown>
            <button class="no-select" id="evaluate-btn" @click="this.sol = ''; this.steps = ''; [sol, steps] = printSolution(), nsteps = steps ? 1 : 0"><span>EVALUATE </span></button>
        </div>
    </div>
    <div id="results">
        <div class="btn-heading-row">
            <h2 id="solution-txt" class="no-select">Solution</h2>
            <button class="no-select" :disabled="!this.sol" @click="showSolution = !showSolution; if(showSolution) formatGuessText('.guess-sol-message', '', 'black'); else formatGuessText('.guess-sol-message', 'Try to guess the normal form of the term.', 'black');">
                <p v-if="showSolution">Hide</p>
                <p v-if="!showSolution">Show</p>
            </button>
        </div>
        <div id="solution-short">
            <SolutionShort v-if="showSolution" :solution="sol"></SolutionShort>
        </div>
        <div class="guess-sol-message">
            <p class="no-select">{{ this.guessSolMessage }}</p>
        </div>
        <div class="btn-heading-row">
            <CodeInput placeholderText="Type your guess here..." class="editor-sol-guess" ref="editor_guess_sol" @keyup="printGreekLetter(this.$refs.editor_guess_sol.view)"></CodeInput>
            <button class="no-select" :disabled="!this.steps || this.showSolution || (this.steps && this.nsteps == this.steps.length)" @click="this.compareGuess('.guess-sol-message', this.sol, this.$refs.editor_guess_sol.view.state.doc.toString())">
                <p>Try</p>
            </button>
        </div>
        <div class="btn-heading-row" id="steps-heading">
            <h2 id="step-by-step-txt" class="no-select">Step-by-step</h2>
            <button class="no-select" :disabled="!this.steps || nsteps <= 1" @click="nsteps = steps ? decrementVisibleLineNumber(nsteps, steps) : null">
                <p>Previous</p>
            </button>
            <button class="no-select" :disabled="!this.steps || nsteps >= steps.length" @click="nsteps = steps ? incrementVisibleLineNumber(nsteps, steps) : null">
                <p>Next</p>
                </button>
            <button class="no-select" :disabled="!this.steps || nsteps >= steps.length" @click="nsteps = steps ? steps.length : 0; this.guessAllowed = false; this.formatGuessText('.guess-sol-message', '', 'black'); this.formatGuessText('.guess-message', '', 'black')">
                <p>View All</p>
            </button>
        </div>
        <div id="solution-steps">
            <SolutionSteps :steps="steps" :nsteps="nsteps"></SolutionSteps>
        </div>
        <div class="guess-message">
            <p class="no-select">{{ this.guessMessage }}</p>
        </div>
        <div class="btn-heading-row">
            <p id="step_count" class="no-select">{{ (steps && nsteps < steps.length) ? (nsteps + 1 + '.step') : '' }}</p>
            <CodeInput placeholderText="Type your guess here..." class="editor-step-guess" ref="editor_guess" @keyup="printGreekLetter(this.$refs.editor_guess.view)"></CodeInput>
            <button class="no-select" :disabled="!this.guessAllowed" @click="this.compareGuess('.guess-message',this.steps[nsteps], this.$refs.editor_guess.view.state.doc.toString())">Try</button>
        </div>
    </div>
</template>

<script>
import CodeEditor from "./CodeEditor.vue";
import SolutionShort from "./SolutionShort.vue"
import SolutionSteps from "./SolutionSteps.vue"
import CodeInput from "./CodeInput.vue"
import DropDown from "./DropDown.vue";
import 'vue-toast-notification/dist/theme-default.css';

import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "../../interpreter/LambdaLexer.js";
import LambdaParser from "../../interpreter/LambdaParser.js";
import CallByValueLambdaVisitor from "../../interpreter/CallByValueLambdaVisitor.js";
import CallByNameLambdaVisitor from "../../interpreter/CallByNameLambdaVisitor.js";
import CompareLambdaTreesVisitor from "../../interpreter/CompareLambdaTreesVisitor.js";
import LambdaErrorListener from "../../interpreter/LambdaErrorListener.js";

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
            guessAllowed: false,
            guessMessage: "",
            showSolution: false,
            guessSolMessage: "",
        }
    },
    methods: {
        showToast(message) {
            this.$toast.error(message, {
                position: 'top-right',
                duration: 3000,
            });
        },
        printGreekLetter(editorView) {
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
            if(changes.length > 0) {
                editorView.dispatch({changes});
            }
        },
        printSolution() {
            /* reset member variables */
            this.sol = '';
            this.steps = '';
            this.nsteps = 0;
            this.guessAllowed = false;
            this.showSolution = false;
            this.formatGuessText(".guess-message", "", "black");
            this.formatGuessText(".guess-sol-message", "", "black");
            let definitions = new Map();
            // select visitor
            let visitor;
            switch(this.strategy.id) {
                case 1:
                    visitor = CallByValueLambdaVisitor;
                    break;
                case 2:
                    visitor = CallByNameLambdaVisitor;
                    break;
                default:
                    return ["", null];
            }
            let input, solution, steps = null;
            // parse input from editor-definitions
            // read all lines and skip empty ones
            let lastLine = this.$refs.editor_definitions.view.state.doc.lines;
            for(let i = 0; i < lastLine; i++) {
                input = this.$refs.editor_definitions.view.state.doc.text[i];
                if(input == null || input.length <= 0) {
                    continue;
                }
                input = input.replaceAll('λ', '\\lambda');
                let chars = new InputStream(input, true);
                let lexer;
                try {
                    lexer = new LambdaLexer(chars);
                    lexer.removeErrorListeners();
                    lexer.addErrorListener(new LambdaErrorListener());
                } catch(e) {
                    //console.log(e.message);
                    let msg = e.message.replaceAll('\\lambda', 'λ');
                    this.showToast(msg);
                    return ["", null];
                }
                let tokens = new CommonTokenStream(lexer);
                let parser;
                let tree;
                try {
                    parser = new LambdaParser(tokens);
                    parser.removeErrorListeners();
                    parser.addErrorListener(new LambdaErrorListener());
                    parser.buildParseTrees = true;
                    tree = parser.redex();
                } catch(e) {
                    //console.log(e.message);
                    let msg = e.message.replaceAll('\\lambda', 'λ');
                    this.showToast(msg);
                    return ["", null];
                }
                try {
                    [solution, steps] = new visitor(tree, definitions).visit(tree);
                } catch(e) {
                    console.error(e.message);
                    //let msg = e.message.replaceAll('\\lambda', 'λ');
                    //this.showToast(msg);
                    return ["", null];
                }
                // if steps == null -> term is definition
                if(steps == null) {
                    definitions.set(solution[0], solution[1]);
                } else {
                    break;
                }
            }
            // parse input from editor_redex
            input = this.$refs.editor_redex.view.state.doc.text[0];
            if(input != null && input.length > 0) {
                input = input.replaceAll('λ', '\\lambda');
                //var input = "Lx.Ly.x\n";
                let chars = new InputStream(input, true);
                let lexer;
                try {
                    lexer = new LambdaLexer(chars);
                    lexer.removeErrorListeners();
                    lexer.addErrorListener(new LambdaErrorListener());
                } catch(e) {
                    console.error(e);
                    return ["", null];
                }
                let tokens = new CommonTokenStream(lexer);
                let parser;
                let tree;
                let recursion;
                try {
                    parser = new LambdaParser(tokens);
                    parser.removeErrorListeners();
                    parser.addErrorListener(new LambdaErrorListener());
                    parser.buildParseTrees = true;
                    tree = parser.redex();
                } catch(e) {
                    //console.log(e.message);
                    let msg = e.message.replaceAll('\\lambda', 'λ');
                    this.showToast(msg);
                    return ["", null];
                }
                try {
                    [solution, steps, recursion] = new visitor(tree, definitions).visit(tree);
                } catch(e) {
                    console.info(e)
                    //console.info(e.message);
                    //let msg = e.message.replaceAll('\\lambda', 'λ');
                    //this.showToast(msg);
                    return ["", null];
                }
                if(recursion) {
                    this.showToast("Error: program took too long to execute - possible recursion");
                }
                if(solution == null) {
                    return ["", null];
                }
                
                for(let [key, value] of definitions) {
                    if(solution == value || solution.substring(1, solution.length - 1) == value) {
                        solution = key;
                        steps.push(solution);
                    }
                }
                solution = solution.replaceAll(' ', '~');
                solution = solution.replaceAll('\\lambda', '\\lambda ');
                let stepsLen = steps.length;
                for(let i = 0; i < stepsLen; i++) {
                    steps[i] = steps[i].replaceAll(' ', '~');
                    steps[i] = steps[i].replaceAll('\\lambda', '\\lambda ');
                }
                this.guessAllowed = true;
                this.formatGuessText(".guess-sol-message", "Try to guess the normal form of the term.", "black");
                this.formatGuessText(".guess-message", "Try to guess the next step of reduction.", "black");
                return [solution, steps];
            }

            return ["", null];
        },
        saveTextAsFile(fileName, editorView) {
            let input, textToWrite = "";
            input = editorView.state.doc.text[0];
            //let i = 1;
            let lastLine = editorView.state.doc.lines;
            for(let i = 0; i < lastLine; i++) {
                input = this.$refs.editor_definitions.view.state.doc.text[i];
                if(input == null || input.length <= 0) {
                    continue;
                }
                input = input.replaceAll('λ', '$\\lambda$');
                textToWrite = textToWrite + input + '\n';
                input = editorView.state.doc.text[i];
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
        importTextFromFile(editorView, inputId) {
            const [file] = document.querySelector(`#${inputId}[type=file]`).files;
            const reader = new FileReader();
            if(file) {
                reader.readAsText(file);
            }

            reader.addEventListener(
                "load",
                () => {
                    let fileContent = reader.result;
                    if(inputId === "upload-file-redex"){
                        // if user tries to load multiline file, accept only first line
                        if(fileContent.includes("\n")) {
                            fileContent = fileContent.substring(0, fileContent.indexOf("\n"));
                        }
                    }
                    fileContent = fileContent.replaceAll('$\\lambda$', '\\lambda');
                    let changes = [
                        { from: 0, to: editorView.state.doc.length, insert: "" },
                        { from: 0, insert: fileContent }
                    ];
                    editorView.dispatch({changes});
                    this.printGreekLetter(editorView);
                },
                false
            );
        },
        decrementVisibleLineNumber(nsteps, steps) {
            if(steps.length <= 0) {
                return nsteps;
            }
            if(nsteps > 1) {
                nsteps--;
                this.guessAllowed = true;
                if(!this.showSolution) {
                    this.formatGuessText(".guess-sol-message", "Try to guess the normal form of the term.", "black");
                }
                this.formatGuessText(".guess-message", "Try to guess the next step of reduction.", "black");
            }            
            if(nsteps <= 0) {
                this.guessAllowed = false;
                this.formatGuessText(".guess-sol-message", "", "black");
                this.formatGuessText(".guess-message", "", "black");
            }
            return nsteps;
        },
        incrementVisibleLineNumber(nsteps, steps) {
            if(nsteps < steps.length) {
                if(!this.showSolution) {
                    this.formatGuessText(".guess-sol-message", "Try to guess the normal form of the term.", "black");
                }
                this.formatGuessText(".guess-message", "Try to guess the next step of reduction.", "black");
                nsteps++;
            }            
            if(nsteps >= steps.length) {
                this.guessAllowed = false;
                this.formatGuessText(".guess-sol-message", "", "black");
                this.formatGuessText(".guess-message", "", "black");
            }
            return nsteps;
        },
        compareGuess(element, correct, guess) {
            /* build correct term tree */
            if(correct == null || correct.length <= 0) {
                return;
            }            
            correct = correct.replaceAll('~', ' ');
            correct = correct.replaceAll('λ', '\\lambda ');
            
            let chars = new InputStream(correct, true);
            let lexer;
            try {
                lexer = new LambdaLexer(chars);
                lexer.removeErrorListeners();
                lexer.addErrorListener(new LambdaErrorListener());
            } catch(e) {
                //console.log(e.message);
                let msg = e.message.replaceAll('\\lambda', 'λ');
                this.showToast(msg);
                return ["", null];
            }
            let tokens = new CommonTokenStream(lexer);
            let parser;
            let tree_correct;
            try {
                parser = new LambdaParser(tokens);
                parser.removeErrorListeners();
                parser.addErrorListener(new LambdaErrorListener());
                parser.buildParseTrees = true;
                tree_correct = parser.redex();
            } catch(e) {
                //console.log(e.message);
                let msg = e.message.replaceAll('\\lambda', 'λ');
                this.showToast(msg);
                return ["", null];
            }
            
            
            /* build guess term tree */
            if(guess == null || guess.length <= 0) {
                this.formatGuessText(element, "Invalid input!", "red");
                return;
            }
            guess = guess.replaceAll('λ', '\\lambda ');

            chars = new InputStream(guess, true);
            try {
                lexer = new LambdaLexer(chars);
                lexer.removeErrorListeners();
                lexer.addErrorListener(new LambdaErrorListener());
            } catch(e) {
                //console.log(e.message);
                let msg = e.message.replaceAll('\\lambda', 'λ');
                this.showToast(msg);
                return ["", null];
            }
            tokens = new CommonTokenStream(lexer);
            let tree_guess;
            try {
                parser = new LambdaParser(tokens);
                parser.removeErrorListeners();
                parser.addErrorListener(new LambdaErrorListener());
                parser.buildParseTrees = true;
                tree_guess = parser.redex();
            } catch(e) {
                //console.log(e.message);
                let msg = e.message.replaceAll('\\lambda', 'λ');
                this.showToast(msg);
                return ["", null];
            }


            let compareVisitor = new CompareLambdaTreesVisitor(tree_correct, tree_guess);
            let comparison = compareVisitor.visitRedex(tree_correct, tree_guess);

            if(comparison) {
                if(element === ".guess-sol-message") {
                    this.showSolution = true;
                } else if(element === ".guess-message") {
                    this.nsteps = this.steps ? this.incrementVisibleLineNumber(this.nsteps, this.steps) : this.nsteps;
                }
                this.formatGuessText(element, "Correct!", "green");
            } else {
                this.formatGuessText(element, "Wrong!", "red");
            }
        },
        formatGuessText(element, message, color) {
            if(element === ".guess-sol-message") {
                this.guessSolMessage = message;
            } else if(element === ".guess-message") {
                this.guessMessage = message;
            } else {
                return;
            }
            document.querySelector(element).style.color = color;
        },
    },
};
</script>

<style scoped></style>
