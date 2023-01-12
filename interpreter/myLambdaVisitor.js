import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "./lambdaLexer.js";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

// Tree Traverser Class
export default class myLambdaVisitor extends lambdaVisitor {

	// Visit a parse tree produced by lambdaParser#term.
	visitTerm(ctx) {
        /* if(ctx.VARIABLE()) {
            console.log("Output: ", ctx.VARIABLE().getText());
        } */
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

        //return this.visitChildren(ctx);
	}

	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx) {
        /* console.log("In application");
        let applicationLeftSide = ctx.getChild(0);
        let applicationRightSide = ctx.getChild(1);
        console.log("My LEFT child: ", applicationLeftSide.getText());
        console.log("My RIGHT child: ", applicationRightSide.getText());

        if(applicationLeftSide instanceof lambdaParser.ApplicationContext) {
            if(applicationLeftSide.getChild(0) == '(') {
                applicationRightSide = applicationLeftSide.getChild(1).getChild(1);
                applicationLeftSide = applicationLeftSide.getChild(1).getChild(0);
            }
        }

        console.log(">My LEFT child: ", applicationLeftSide.getText());
        console.log(">My RIGHT child: ", applicationRightSide.getText());

        let [param, body] = this.visitAbstraction(applicationLeftSide.getChild(1));
        console.log("APP Child parameter: ", param);
        console.info("APP Child body: ", body);

        let value = ctx.getChild(1).getText();
        console.log("APP Value: ", value);

        body = body.replaceAll(param, value);
        console.log("NEW BODY ", body);

        let abstractionTerm = applicationLeftSide.getChild(1).getChild(3).getChild(0);
        let newAbstraction = "";
        if(abstractionTerm instanceof lambdaParser.AbstractionContext) {
            let b = abstractionTerm.getChild(3).getText();
            console.info(">>APP Child body: ", b);
            console.log("> APP abstractionTerm = ", abstractionTerm.getText());
            newAbstraction = abstractionTerm.getText().replace(new RegExp(b + "$"), body);
            abstractionTerm = abstractionTerm.getChild(3).getChild(0).getText();
        }
        console.log("newAbstraction: ", newAbstraction); */

        console.log("In Child: ", ctx.getChild(0).getText(), "type = ", ctx.getChild(0).constructor.name);
        let leftChild = this.visit(ctx.getChild(0));
        let myChild = ctx.getChild(0);
        if(leftChild instanceof lambdaParser.TermContext) {
            console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.toStringTree());
            /* console.log("TREE 0 = ", leftChild.getChild(0).getChild(0).getText());
            console.log("TREE 1 = ", leftChild.getChild(0).getChild(1).getText());
            console.log("TREE 2 = ", leftChild.getChild(0).getChild(2).getText()); */
            myChild = leftChild.getChild(0);
        } else {
            console.log("CTX: ", ctx.getText(), "+ return value = ", leftChild);
        }
        let [param, body] = [null, null];
        if(myChild instanceof lambdaParser.AbstractionContext) {
            let abstraction = myChild;
            if(abstraction.getChild(0).getText() == '(') {
                abstraction = abstraction.getChild(1);
            }
            [param, body] = this.visitAbstraction(abstraction);
            console.log("Param: ", param, ", Body: ", body);
            let value = ctx.getChild(1).getText();
            body = body.replaceAll(param, value);
            let tree = this.makeTree(body);
            console.log(">TREE: ", tree.getChild(0).constructor.name);
            return tree;
        }

	    return "2";
	}

    makeTree(input) {
        var chars = new InputStream(input, true);
        var lexer = new lambdaLexer(chars);
        var tokens = new CommonTokenStream(lexer);
        var parser = new lambdaParser(tokens);

        parser.buildParseTrees = true;
        return parser.term();
    }
}