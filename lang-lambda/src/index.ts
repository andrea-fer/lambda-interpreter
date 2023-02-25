import {parser} from "./syntax.grammar";
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language";
import {completeFromList} from "@codemirror/autocomplete";
import {styleTags, tags as t} from "@lezer/highlight";

export const lambdaCalculusLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Application: delimitedIndent({ closing: ")", align: false }),
            }),
            foldNodeProp.add({
                Application: foldInside,
            }),
            styleTags({
                Variable: t.variableName,
                "( )": t.paren,
                Lambda: t.keyword,
                ".": t.keyword,
            }),
        ],
    })
});

const completions = lambdaCalculusLanguage.data.of({
    autocomplete: completeFromList([
        { label: "\\lambda", type: "keyword" },
    ]),
});

export function LambdaLanguageSupport() {
    return new LanguageSupport(lambdaCalculusLanguage, [completions]);
}
