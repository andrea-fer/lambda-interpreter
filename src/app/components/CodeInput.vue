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
}

.code_input .cm-gutters {
    display: none;
}

.editor_redex {
    height: 3em;
    max-height: 3em;
}

</style>