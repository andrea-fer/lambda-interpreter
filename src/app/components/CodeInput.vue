<template>
    <div class="code_input" :id="editorRef" @change = {handleChange}>
        <div :ref="editorRef"></div>
    </div>
</template>

<script>
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, 
    rectangularSelection, crosshairCursor, highlightActiveLine, keymap} from '@codemirror/view';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, 
    bracketMatching, foldKeymap } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { LambdaLanguageSupport } from "../../lang-lambda";

const lambdaLanguageSupport = LambdaLanguageSupport();

export default {
    data() {
        return {
            editorRef: `editor-${Math.floor(Math.random() * 100000)}`,
            view: null
        }
    },
    mounted() {
        const state = EditorState.create({
            //doc: "",
            //doc: "(λ x. λ y. x) a\n",   // Ly.a *
            //doc: "(λx.x)(λz.z)(λb.b)a\n", // a *
            //doc: "(λx.x)((λy.y)z)\n",   // z *
            //doc: "(λz.z)(λy.y y)(λx.x a)\n",    // aa 
            //doc: "(λz.z) (λz.z z) (λz.z y)\n",    // yy 
            //doc: "(λx.λy.x y y)(λa.a)b\n",  // bb *
            //doc: "(λx.λy.x y y)(λa.a)\n",   // λy. (λa.a) y y *
            //doc: "(λx.λy.x y y) (λy.y) y\n",  // yy *
    //doc: "(λx.y)((λy.y y y)(λx.x x x))\n",                            // y * recursion
            //doc: "(λa.a)((λy.y y y)(λx.x))\n", // λx.x *
            //doc: "(λx.x x)(λy.y x)z\n", // xxz *
            //doc: "(λx.(λy.(x y))y)z\n",  // zy *
            //doc: "x y\n",
            //doc: "((λx.x x)(λy.y))(λy.y)\n",  // λy.y *
            //doc: "(λx.y)((λy.y y y)(λx.x a))\n", // y *
            //doc: "(λx.x)((λy.y y y)(λx.x a))\n", // a a (λx.x a) *
    //doc: "(((λx.λy.(xy))(λy.y))w)\n", //w *                           // needs alpha conversion
            doc: "((a))",
            //doc: "((λx.x))",
            extensions: [[
                lambdaLanguageSupport,
                EditorState.transactionFilter.of(tr => {
                    return tr.newDoc.lines > 1 ? [] : [tr]
                }),
                lineNumbers(),
                highlightActiveLineGutter(),
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
                highlightActiveLine(),
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
    height: 90%;
}

</style>