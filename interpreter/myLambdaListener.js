import antlr4 from "antlr4";
import lambdaLexer from "./lambdaLexer.js";
import lambdaParser from "./lambdaParser.js";
import lambdaListener from "./lambdaListener.js";

export default class myLambdaListener extends lambdaListener {
    constructor(res) {
        super();
        this.res = res;
    }

    // Enter a parse tree produced by lambdaParser#file_.
    enterFile_(ctx) {
        this.res.write("started reading");
    }

    // Exit a parse tree produced by lambdaParser#file_.
    exitFile_(ctx) {
        this.res.write("stopped reading");
    }

    // Enter a parse tree produced by lambdaParser#expression.
    enterExpression(ctx) {
        this.res.write("starting expression");
    }

    // Exit a parse tree produced by lambdaParser#expression.
    exitExpression(ctx) {
        this.res.write("ending expression");
    }

    // Enter a parse tree produced by lambdaParser#function_.
    enterFunction_(ctx) {
        this.res.write("start of function: LAMBDA", ctx.VARIABLE(), ".");
    }

    // Exit a parse tree produced by lambdaParser#function_.
    exitFunction_(ctx) {
        this.res.write("end of function");
    }

    // Enter a parse tree produced by lambdaParser#application.
    enterApplication(ctx) {
        this.res.write("start of application");
    }

    // Exit a parse tree produced by lambdaParser#application.
    exitApplication(ctx) {
        this.res.write("end of application");
    }

    // Enter a parse tree produced by lambdaParser#scope.
    enterScope(ctx) {
        this.res.write("start of scope");
    }

    // Exit a parse tree produced by lambdaParser#scope.
    exitScope(ctx) {
        this.res.write("end of scope");
    }
}
