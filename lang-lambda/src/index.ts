import { parser } from "./syntax.grammar";
import {
    LRLanguage,
    LanguageSupport,
    indentNodeProp,
    foldNodeProp,
    foldInside,
    delimitedIndent,
} from "@codemirror/language";
import { completeFromList } from "@codemirror/autocomplete";
import { styleTags, tags as t } from "@lezer/highlight";

export const lezerLambdaLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Application: delimitedIndent({ closing: ")", align: false }),
            }),
            foldNodeProp.add({
                Application: foldInside,
            }),
            styleTags({
                Name: t.variableName,
                Boolean: t.bool,
                String: t.string,
                LineComment: t.lineComment,
                "( )": t.paren,
                Lambda: t.keyword,
                ".": t.keyword,
                AbstractionArg: t.literal,
            }),
        ],
    }),
    languageData: {
        commentTokens: { line: "//" },
    },
});

const completions = lezerLambdaLanguage.data.of({
    autocomplete: completeFromList([
        { label: "\\lambda", type: "keyword" },
    ]),
});

export function LambdaLanguageSupport() {
    return new LanguageSupport(lezerLambdaLanguage, [completions]);
}
