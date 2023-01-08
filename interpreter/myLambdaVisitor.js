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
            //body = ctx.getChild(3).getText();
            //console.info("Abstraction body: ", body);
            //console.info(ctx.getChild(3).getChild(0).constructor.name);
            console.info("Abstraction parameter: ", param);
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope instanceof lambdaParser.AbstractionContext) {
                //console.log("Child parameter: ", this.visit(ctx.getChild(3).getChild(0))[0]);
                let b = bodyScope.getChild(3).getText();
                console.info("Child body: ", b);
                bodyScope = bodyScope.getChild(3).getChild(0);
            }
            body = bodyScope.getText();
        }
        return [param, body];
	}

	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx) {
        console.log("In application");
        let applicationLeftSide = ctx.getChild(0).getText();
        let applicationRightSide = ctx.getChild(1).getText();
        console.log("My child: ", applicationLeftSide, applicationRightSide);

        let [param, body] = this.visitAbstraction(ctx.getChild(0).getChild(1));
        console.log("APP Child parameter: ", param);
        console.info("APP Child body: ", body);

        let value = ctx.getChild(1).getText();
        console.log("APP Value: ", value);

        body = body.replaceAll(param, value);
        console.log("NEW BODY ", body);

        let abstractionTerm = ctx.getChild(0).getChild(1).getChild(3).getChild(0);
        let newAbstraction = "";
        if(abstractionTerm instanceof lambdaParser.AbstractionContext) {
            let b = abstractionTerm.getChild(3).getText();
            console.info(">>APP Child body: ", b);
            console.log("> APP abstractionTerm = ", abstractionTerm.getText());
            newAbstraction = abstractionTerm.getText().replace(new RegExp(b + "$"), body);
            abstractionTerm = abstractionTerm.getChild(3).getChild(0).getText();
        }
        console.log("newAbstraction: ", newAbstraction);


	    return this.visitChildren(ctx);
	}
}