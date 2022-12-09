import lambdaVisitor from "./lambdaVisitor.js";

export default class myLambdaVisitor extends lambdaVisitor {
    // Visit a parse tree produced by lambdaParser#file_.
    visitFile_(ctx) {
        return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by lambdaParser#expression.
    visitExpression(ctx) {
        return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by lambdaParser#function_.
    visitFunction_(ctx) {
        return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by lambdaParser#application.
    visitApplication(ctx) {
        return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by lambdaParser#scope.
    visitScope(ctx) {
        return this.visitChildren(ctx);
    }
}
