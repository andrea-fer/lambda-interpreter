<template>
<div id="editor-definitions">
    <div :ref="editorRef"></div>
</div>
</template>

<script>
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, 
    rectangularSelection, crosshairCursor, highlightActiveLine, keymap, scrollPastEnd, placeholder } from '@codemirror/view';
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
            editorRef: 'editor-definitions',
            view: null
        };
    },
    mounted() {
        const state = EditorState.create({
            doc: "",
// Church numerals 
doc: "0 = λs.λz.z\n1 = λs.λz.s z\n2 = λs.λz.s(s z)\n3 = λs.λz.s(s(s z))\nadd = λm.λn.λs.λz.m s(n s z)\ntimes = λm.λn.m(add n)0\nsucc = λn.λs.λz.s(n s z)\niszero = λm.m(λx.false)true\n",
   
    // Church booleans
//doc: "true = λx.λy.x\nfalse = λx.λy.y\ntest = λb.λc.λa.b c a\nand = λb.λc.b c false\nor = λb.λc.b true(c true false)\nnot = λb.b false true\n",
           extensions: [[
                placeholder('Type your definitions here...'),
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
            parent: document.querySelector("#editor-definitions"),
      });
  },
    beforeUnmount() {
        this.view.destroy();
    },
};
</script>

<style>
#editor-definitions {
    height: 79%;
}

/* .cm-gutters {
    min-height: 0 !important;
    max-height: auto !important;
} */

.cm-content {
    padding-bottom: 0 !important;
}

.cm-editor { 
    height: 100%;
    width: 100%;
}
.cm-scroller { 
    max-height: 100%;
    height: 100%;
    overflow: auto;
}
</style>