import antlr4 from "antlr4";

export default class LambdaErrorListener extends antlr4.error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, errorMsg, e) {
        //console.error(`Line ${line}:${column} ${errorMsg}`);
        //throw Error(`Syntax Error on Line ${line}:${column} ${errorMsg}`);
        throw Error(`Syntax Error: ${errorMsg}`);
    }
}