import { keymap } from "@codemirror/view";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

export default class myLambdaVisitor extends lambdaVisitor {
    // Visit a parse tree produced by lambdaParser#term.
	visitTerm(ctx) {
        if(ctx.VARIABLE()) {
            console.log("Output: ", ctx.VARIABLE().getText());
        }
	    return this.visitChildren(ctx);
	}

    // Visit a parse tree produced by lambdaParser#abstraction.
	visitAbstraction(ctx) {
        let param = null;
        let body = null;
        if(ctx.VARIABLE()) {
            console.log("In Abstraction: ", ctx.getChild(1).getText());
            param = ctx.VARIABLE().getText();
            console.info("Abstraction parameter: ", param);
            body = ctx.getChild(3).getText();
            console.info("Abstraction body: ", body);
            //console.info(ctx.getChild(3).getChild(0).constructor.name);
            let bodyScope = ctx.getChild(3).getChild(0);
            /* if(bodyScope instanceof lambdaParser.AbstractionContext) {
                //console.log("Child parameter: ", this.visit(ctx.getChild(3).getChild(0))[0]);
                let b = bodyScope.getChild(3).getText();
                console.error("Child body: ", b);
                bodyScope = ctx.getChild(3).getChild(0);
            } */
        }
        return this.visitChildren(ctx), param, body;
	}

	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx) {
        console.log("In application");
        console.log("My child: ", ctx.getChild(0).getText(), ctx.getChild(1).getText());

        let p, b = this.visitAbstraction(ctx.getChild(0).getChild(1));
        console.log("APP Child parameter: ", p);
        console.error("APP Child body: ", b);
	    return this.visitChildren(ctx);
	}
}
