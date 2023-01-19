<template>
    <div id="editor"></div>
</template>

<script>
import { EditorView } from "../../node_modules/codemirror";
import { EditorState } from '@codemirror/state';
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, 
    rectangularSelection, crosshairCursor, highlightActiveLine, keymap, scrollPastEnd } from '@codemirror/view';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, 
    bracketMatching, foldKeymap } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';

export default {
    mounted() {
        window.view = new EditorView({
            //doc: "(Lx. Ly. x) a\n",
            //doc: "(Lx.x)(Lz.z)(Lb.b)a\n",
            //doc: "(Lx.x)((Ly.y)z)\n",
            doc: "(Lz.z) (Ly.y y) (Lx.x a)\n",
            //doc: "(Lx.Ly.xyy)(La.a)b\n",
            //(Lx.y)((Ly.yyy)(Lx.xxx))

            //(Lx.xx)(Ly.yx)z
            //(Lx.(Ly.(xy))y)z      (Lx.(Ly.xy)y)z
            //((Lx.xx)(Ly.y))(Ly.y)
            //(((Ly.Ly.(xy))(Ly.y))w)
            extensions: [[
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
            parent: document.querySelector("#editor"),
        });
    },
};
</script>

<style></style>
