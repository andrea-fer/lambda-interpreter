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
            doc: "(λ x. λ y. x) a\n",   // Ly.a *
            //doc: "(Lx.x)(Lz.z)(Lb.b)a\n", // a *
            //doc: "(Lx.x)((Ly.y)z)\n",   // z *
            //doc: "(Lz.z) (Ly.y y) (Lx.x a)\n",    // aa 
            //doc: "(Lz.z) (Lz.z z) (Lz.z y)\n",    // yy 
            //doc: "(Lx.Ly.xyy)(La.a)b\n",  // bb *
            //doc: "(Lx.Ly.xyy)(La.a)\n",   // Ly. (La.a) y y *
            //doc: "(Lx.Ly.x y y) (Ly.y) y\n",  // yy *
            //doc: "(Lx.y)((Ly.yyy)(Lx.xxx))\n", // y *
            //doc: "(Lx.xx)(Ly.yx)z\n", // xxz *
            //doc: "(Lx.(Ly.(xy))y)z\n",  // zy *
            //doc: "((Lx.xx)(Ly.y))(Ly.y)\n",  // Ly.y *
            //doc: "(((Lx.Ly.(xy))(Ly.y))w)\n", //w *
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
