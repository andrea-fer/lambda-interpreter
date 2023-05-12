<template>
    <div class="code_input" :id="editorRef" @change = {handleChange}>
        <div :ref="editorRef"></div>
    </div>
</template>

<script>
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightSpecialChars, drawSelection, dropCursor, 
    rectangularSelection, crosshairCursor, keymap, placeholder } from '@codemirror/view';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, 
    bracketMatching, foldKeymap } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { LambdaLanguageSupport } from "../../lang-lambda";

const lambdaLanguageSupport = LambdaLanguageSupport();

export default {
    props: {
        placeholderText: String,
    },
    data() {
        return {
            editorRef: `editor-${Math.floor(Math.random() * 100000)}`,
            view: null
        }
    },
    mounted() {
        const state = EditorState.create({
            doc: "",
            //doc: "times 0 1",
        //doc: "succ (succ 0)",
        //doc: "add 1 (succ 1)",
            //doc: "add 1 1",
            //doc: "add 0 1",
            
            //doc: "not true",
            //doc: "and true true",
            //doc: "and true false",
            //doc: "or true false",
            //doc: "test true v u",
            //doc: "test false v u",
            //doc: "not (not true)",
            //doc: "and false (not true)",

            //doc: "(λ x. λ y. x) a",   // Ly.a *
            //doc: "(λx.x)(λz.z)(λb.b)a", // a *
            //doc: "(λx.x)((λy.y)z)",   // z *
            //doc: "(λz.z)(λy.y y)(λx.x a)",    // aa 
            //doc: "(λz.z) (λz.z z) (λz.z y)",    // yy 
            //doc: "(λx.λy.x y y)(λa.a)b",  // bb *
            //doc: "(λx.λy.x y y)(λa.a)",   // λy. (λa.a) y y *
            //doc: "(λx.λy.x y y) (λy.y) y",  // yy *
        //doc: "(λx.y)((λy.y y y)(λx.x x x))",                            // y * recursion
            //doc: "(λa.a)((λy.y y y)(λx.x))", // λx.x *
            //doc: "(λx.x x)(λy.y x)z", // xxz *
            //doc: "(λx.(λy.(x y))y)z",  // zy *
            //doc: "x y",
            //doc: "((λx.x x)(λy.y))(λy.y)",  // λy.y *
            //doc: "(λx.y)((λy.y y y)(λx.x a))", // y *
            //doc: "(λx.x)((λy.y y y)(λx.x a))", // a a (λx.x a) *
    //doc: "(((λx.λa.(x a))(λy.y))w)", //w *                           // needs alpha conversion
            //doc: "((a))",
            //doc: "((λx.x))",
            extensions: [[
                placeholder(this.placeholderText),
                lambdaLanguageSupport,
                EditorState.transactionFilter.of(tr => {
                    return tr.newDoc.lines > 1 ? [] : [tr]
                }),
                lineNumbers(),
                highlightSpecialChars(),
                history(),
                foldGutter(),
                drawSelection(),
                dropCursor(),
                EditorState.allowMultipleSelections.of(true),
                indentOnInput(),
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                bracketMatching(),
                closeBrackets(),
                autocompletion(),
                rectangularSelection(),
                crosshairCursor(),
                highlightSelectionMatches(),
                keymap.of([
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...searchKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...completionKeymap,
                    ...lintKeymap
                ]),
            ]],
        });

        this.view = new EditorView({
            state,
            parent: document.querySelector(`#${this.editorRef}`),
        });
    },
    beforeUnmount() {
        this.view.destroy();
    }
};

</script>

<style>

.code_input {
    background-color: #EAEAEA;
    flex: 1;
    height: 100%;
}

.code_input .cm-content {
    padding-top: 0.5em !important;
    /* s */
}

/* .code_input .cm-gutters .cm-lineNumbers .cm-gutterElement {
    display: none;
} */

.code_input .cm-gutters {
    display: none;
}

.editor_redex {
    height: 3em;
    max-height: 3em;
}

</style>