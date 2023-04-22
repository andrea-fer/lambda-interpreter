<template>
<div id="editor_definitions">
    <div :ref="editorRef"></div>
</div>
</template>

<script>
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, 
    rectangularSelection, crosshairCursor, highlightActiveLine, keymap, scrollPastEnd } from '@codemirror/view';
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
            editorRef: 'editor_definitions',
            view: null
        };
    },
    mounted() {
        const state = EditorState.create({
// Church numerals 
    //doc: "0 = λs.λz.z\n1 = λs.z.s z\n2 = λs.λz.s(s z)\n3 = λs.λz.s(s(s z))\nadd = λm.λn.λs.λz.m s(n s z)\ntimes = λm.λn.m(add n)0\nsucc = λn.λs.λz.s(n s z)\niszero = λm.m(λx.false)true\ntimes 0 1\n",
            //doc: "0 = λs.λz.z\n1 = λs.z.s z\n2 = λs.λz.s(s z)\n3 = λs.λz.s(s(s z))\nadd = λm.λn.λs.λz.m s(n s z)\ntimes = λm.λn.m(add n)0\nsucc = λn.λs.λz.s(n s z)\niszero = λm.m(λx.false)true\nsucc (succ 0)\n",
            //doc: "0 = λs.λz.z\n1 = λs.z.s z\n2 = λs.λz.s(s z)\n3 = λs.λz.s(s(s z))\nadd = λm.λn.λs.λz.m s(n s z)\ntimes = λm.λn.m(add n)0\nsucc = λn.λs.λz.s(n s z)\niszero = λm.m(λx.false)true\nadd 1 (succ 1)\n",
            //doc: "0 = λs.λz.z\n1 = λs.z.s z\n2 = λs.λz.s(s z)\n3 = λs.λz.s(s(s z))\nadd = λm.λn.λs.λz.m s(n s z)\ntimes = λm.λn.m(add n)0\nsucc = λn.λs.λz.s(n s z)\niszero = λm.m(λx.false)true\nadd 1 1\n",
            //doc: "0 = λs.λz.z\n1 = λs.z.s z\n2 = λs.λz.s(s z)\n3 = λs.λz.s(s(s z))\nadd = λm.λn.λs.λz.m s(n s z)\ntimes = λm.λn.m(add n)0\nsucc = λn.λs.λz.s(n s z)\niszero = λm.m(λx.false)true\nadd 0 1\n",

    // Church booleans
            doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\nnot true\n",
            //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\nand true true\n",
            //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\nand true false\n",
            //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\nor true false\n",
            //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\ntest true v u\n",
            //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\ntest false v u\n",
        //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\nnot (not true)\n",
    //doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\nand false (not true)\n",

    // Simpler examples
            //doc:"abc = (λ x. λ y. x) a\n(λx. x)abc\n",
    //doc: "abcd = (λ x. λ y. x) a\n",   // Ly.a *                      // only definition
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
            extensions: [[
                lambdaLanguageSupport,
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
                scrollPastEnd(),
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
            parent: document.querySelector("#editor_definitions"),
      });
  },
    beforeUnmount() {
        this.view.destroy();
    },
};
</script>

<style>
#editor_definitions {
    height: 100%;
}

.cm-gutters {
    /*min-height: 0 !important;*/
    /* max-height: auto !important; */
}

.cm-content {
    padding-bottom: 0 !important;
}

.cm-editor { 
    height: 100%;
}
.cm-scroller { 
    overflow: auto;
}
</style>