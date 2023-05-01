<script>
import CodeEditor from "./components/CodeEditor.vue";
import SolutionShort from "./components/SolutionShort.vue"
import SolutionSteps from "./components/SolutionSteps.vue"
import CodeInput from "./components/CodeInput.vue"
import DropDown from "./components/DropDown.vue";
import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "../interpreter/LambdaLexer.js";
import LambdaParser from "../interpreter/LambdaParser.js";
import CallByValueLambdaVisitor from "../interpreter/CallByValueLambdaVisitor.js";
import CallByNameLambdaVisitor from "../interpreter/CallByNameLambdaVisitor.js";
import CompareLambdaTreesVisitor from "../interpreter/CompareLambdaTreesVisitor.js";
import LambdaErrorListener from "../interpreter/LambdaErrorListener.js";

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
        logDocs() {
            const doc1 = this.$refs.editor_redex.view.state.doc;
            const doc2 = this.$refs.editor_definitions.view.state.doc;
            const doc3 = this.$refs.editor_guess_sol.view.state.doc;
            const doc4 = this.$refs.editor_guess.view.state.doc;
            console.log("Doc Redex:", doc1.toString());
            console.log("Doc Definitions:", doc2.toString());
            console.log("Doc Guess Solution:", doc3.toString());
            console.log("Doc Guess Step:", doc4.toString());
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
            /* reset member variables */
            this.sol = '';
            this.steps = '';
            this.nsteps = 0;
            this.guessAllowed = false;
            this.showSolution = false;
            this.formatGuessText(".guess_message", "", "black");
            this.formatGuessText(".guess_message", "", "black");
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
            /* let lastLine = view.state.doc.lines;
            console.log("lastLine: ", lastLine); */
            let input, solution, steps = null;
            let i = 0;
            // parse input from editor_definitions
            do {
                input = this.$refs.editor_definitions.view.state.doc.text[i++];
                if(input == null || input.length <= 0) {
                    console.log(input)
                    /* console.log("input is null ", input == null)
                    console.log("input len ", input.length)
                    console.log("break") */
                    break;
                }
                console.log(input.length);
                input = input.replaceAll('λ', '\\lambda');
                //var input = "Lx.Ly.x\n";
                let chars = new InputStream(input, true);
                let lexer;
                try {
                    lexer = new LambdaLexer(chars);
                    lexer.removeErrorListeners();
                    lexer.addErrorListener(new LambdaErrorListener());
                } catch(e) {
                    console.info(e);
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
                    console.error(e);
                    return ["", null];
                }
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
                try {
                    parser = new LambdaParser(tokens);
                    parser.removeErrorListeners();
                    parser.addErrorListener(new LambdaErrorListener());
                    parser.buildParseTrees = true;
                    tree = parser.redex();
                    console.log("Tree : ", tree.getText());
                } catch(e) {
                    console.info(e);
                    return ["", null];
                }

                /* for(let [key, value] of definitions) {
                        console.log("*", key, ":", value, "*");
                } */
                [solution, steps] = new visitor(tree, definitions).visitRedex(tree);
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
                this.guessAllowed = true;
                this.formatGuessText(".guess_sol_message", "Try to guess the normal form of the term.", "black");
                this.formatGuessText(".guess_message", "Try to guess the next step of reduction.", "black");
                console.log("Long solution = ", steps);
                return [solution, steps];
            }
            console.log(input)
            /* console.log("input is null ", input == null)
            console.log("input len ", input.length)
            console.log("exit func") */
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
        decrementVisibleLineNumber(nsteps, steps) {
            if(steps.length <= 0) {
                return nsteps;
            }
            if(nsteps > 1) {
                nsteps--;
                this.guessAllowed = true;
                if(!this.showSolution) {
                    this.formatGuessText(".guess_sol_message", "Try to guess the normal form of the term.", "black");
                }
                this.formatGuessText(".guess_message", "Try to guess the next step of reduction.", "black");
            }            
            if(nsteps <= 0) {
                this.guessAllowed = false;
                this.formatGuessText(".guess_sol_message", "", "black");
                this.formatGuessText(".guess_message", "", "black");
            }
            return nsteps;
        },
        incrementVisibleLineNumber(nsteps, steps) {
            if(nsteps < steps.length) {
                if(!this.showSolution) {
                    this.formatGuessText(".guess_sol_message", "Try to guess the normal form of the term.", "black");
                }
                this.formatGuessText(".guess_message", "Try to guess the next step of reduction.", "black");
                nsteps++;
            }            
            if(nsteps >= steps.length) {
                this.guessAllowed = false;
                this.formatGuessText(".guess_sol_message", "", "black");
                this.formatGuessText(".guess_message", "", "black");
            }
            return nsteps;
        },
        compareGuess(element, correct, guess) {
            /* build correct term tree */
            //let correct = "(\\lambda z.z) (\\lambda z.z z) (\\lambda z.z y)";
            //let correct = "(\\lambda x.x) ((\\lambda x.x a) (\\lambda x.x a) (\\lambda x.x a))";
            if(correct == null || correct.length <= 0) {
                return;
            }            
            correct = correct.replaceAll('~', ' ');
            correct = correct.replaceAll('λ', '\\lambda ');
            
            console.log("Correct Solution: ", correct);
            
            let chars = new InputStream(correct, true);
            let lexer;
            try {
                lexer = new LambdaLexer(chars);
                lexer.removeErrorListeners();
                lexer.addErrorListener(new LambdaErrorListener());
            } catch(e) {
                console.info(e);
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
                console.info(e);
                return ["", null];
            }
            
            
            /* build guess term tree */
            if(guess == null || guess.length <= 0) {
                this.formatGuessText(element, "Invalid input!", "red");
                return;
            }
            console.log("Guess: ", guess);
            guess = guess.replaceAll('λ', '\\lambda ');

            chars = new InputStream(guess, true);
            try {
                lexer = new LambdaLexer(chars);
                lexer.removeErrorListeners();
                lexer.addErrorListener(new LambdaErrorListener());
            } catch(e) {
                console.info(e);
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
                console.info(e);
                return ["", null];
            }


            let compareVisitor = new CompareLambdaTreesVisitor(tree_correct, tree_guess);
            let comparison = compareVisitor.visitRedex(tree_correct, tree_guess);

            if(comparison) {
                console.log("Comparison: ", comparison);
                console.log(correct, " = ", guess);
                console.log("tree_correct = tree_guess");
                if(element === ".guess_sol_message") {
                    this.showSolution = true;
                } else if(element === ".guess_message") {
                    this.nsteps = this.steps ? this.incrementVisibleLineNumber(this.nsteps, this.steps) : this.nsteps;
                }
                this.formatGuessText(element, "Correct!", "green");
                /* this.formatGuessText(".guess_message", "", "black");           
                this.guessAllowed = false; */
            } else {
                console.log("Comparison: ", comparison);
                console.log(correct, " != ", guess);
                console.log("tree_correct != tree_guess");
                this.formatGuessText(element, "Wrong!", "red");
            }
        },
        formatGuessText(element, message, color) {
            if(element === ".guess_sol_message") {
                this.guessSolMessage = message;
            } else if(element === ".guess_message") {
                this.guessMessage = message;
            } else {
                return;
            }
            document.querySelector(element).style.color = color;
        },
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
                    <button>
                        <label for="upload-file-definitions">Upload Definitions</label>
                        <input type="file" @change="importTextFromFile(this.$refs.editor_definitions.view, 'upload-file-definitions')" accept=".txt" id="upload-file-definitions"/>
                    </button>
                    <button @click="saveTextAsFile('lambda_kalkul_definitions', this.$refs.editor_definitions.view)">Save Definitions</button>
                </div>
                <CodeEditor ref="editor_definitions" @keyup="printGreekLetter($event, this.$refs.editor_definitions.view)"></CodeEditor>
                <div class="btn_heading_row">
                    <DropDown @option-selected="strategy = $event"></DropDown>
                    <button id="evaluate_btn" @click="[sol, steps] = printSolution(), nsteps = steps ? 1 : 0"><span>EVALUATE </span></button>
                    <!-- <button @click="logDocs">Log Docs</button> -->
                    <!-- <button>Strategy<br>call-by-value</button> -->
                </div>
                <CodeInput class="editor_redex" ref="editor_redex" @keyup="printGreekLetter($event, this.$refs.editor_redex.view)"></CodeInput>
                <div class="btn_heading_row">
                    <button>
                        <label for="upload-file-redex">Upload Redex</label>
                        <input type="file" @change="importTextFromFile(this.$refs.editor_redex.view, 'upload-file-redex')" accept=".txt" id="upload-file-redex"/>
                    </button>
                    <button @click="saveTextAsFile('lambda_kalkul_redex', this.$refs.editor_redex.view)">Save Redex</button>
                </div>
            </div>
            <div id="results">
                <div class="btn_heading_row">
                    <p id="solution_txt">SOLUTION</p>
                    <button :disabled="!this.sol" @click="showSolution = !showSolution; if(showSolution) formatGuessText('.guess_sol_message', '', 'black'); else formatGuessText('.guess_sol_message', 'Try to guess the normal form of the term.', 'black');">
                        <p v-if="showSolution">Hide</p>
                        <p v-if="!showSolution">Show</p>
                    </button>
                </div>
                <div id="solution_short">
                    <SolutionShort v-if="showSolution" :solution="sol"></SolutionShort>
                </div>
                <div class="guess_sol_message">
                    <p>{{ this.guessSolMessage }}</p>
                </div>
                <div class="btn_heading_row">
                    <CodeInput class="editor_sol_guess" ref="editor_guess_sol" @keyup="printGreekLetter($event, this.$refs.editor_guess_sol.view)"></CodeInput>
                    <!-- <button @click="this.compareGuess(this.sol, this.$refs.editor_guess_sol.view.doc.toString())">Test</button> -->
                    <button :disabled="this.showSolution || (this.steps && this.nsteps == this.steps.length)" @click="this.compareGuess('.guess_sol_message', this.sol, this.$refs.editor_guess_sol.view.state.doc.toString())">Try</button>
                </div>
                <div class="btn_heading_row" id="steps_heading">
                    <p id="step_by_step_txt">Step-by-step</p>
                    <button :disabled="!this.steps || nsteps <= 1" @click="nsteps = steps ? decrementVisibleLineNumber(nsteps, steps) : null">Previous</button>
                    <button :disabled="!this.steps || nsteps >= steps.length" @click="nsteps = steps ? incrementVisibleLineNumber(nsteps, steps) : null">Next</button>
                    <button :disabled="!this.steps || nsteps >= steps.length" @click="nsteps = steps ? steps.length : 0; this.guessAllowed = false; this.formatGuessText('.guess_sol_message', '', 'black'); this.formatGuessText('.guess_message', '', 'black')">View All</button>
                </div>
                <div id="solution_steps">
                    <SolutionSteps :steps="steps" :nsteps="nsteps"></SolutionSteps>
                </div>
                <div class="guess_message">
                    <p>{{ this.guessMessage }}</p>
                </div>
                <div class="btn_heading_row">
                    <p id="step_count">{{ (steps && nsteps < steps.length) ? (nsteps + 1 + '.step') : '' }}</p>
                    <CodeInput class="editor_step_guess" ref="editor_guess" @keyup="printGreekLetter($event, this.$refs.editor_guess.view)"></CodeInput>
                    <button :disabled="!this.guessAllowed" @click="this.compareGuess('.guess_message',this.steps[nsteps], this.$refs.editor_guess.view.state.doc.toString())">Try</button>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <p>2023</p>
    </footer>
</template>

<style scoped></style>
