import antlr4 from "antlr4";

export default class LambdaErrorListener extends antlr4.error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, errorMsg, e) {
        throw Error(`Error: ${errorMsg}`);
    }
}