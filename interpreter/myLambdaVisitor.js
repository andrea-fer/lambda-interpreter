import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "./lambdaLexer.js";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

// Tree Traverser Class
export default class myLambdaVisitor extends lambdaVisitor {

	// Visit a parse tree produced by lambdaParser#term.
	visitTerm(ctx) {
        console.info("°°IN TERM°°");
	    return this.visit(ctx.getChild(0)).getText();
	}

    // Visit a parse tree produced by lambdaParser#abstraction.
	visitAbstraction(ctx) {
        let param = null;
        let body = null;
        if(ctx.VARIABLE()) {
            //console.log("In Abstraction: ", ctx.getChild(1).getText());
            param = ctx.VARIABLE().getText();
            //body = ctx.getChild(3).getText();
            //console.info("Abstraction body: ", body);
            //console.info(ctx.getChild(3).getChild(0).constructor.name);
            //console.info("Abstraction parameter: ", param);
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope instanceof lambdaParser.AbstractionContext) {
                //console.log("Child parameter: ", this.visit(ctx.getChild(3).getChild(0))[0]);
                //let b = bodyScope.getChild(3).getText();
                //console.info("Child body: ", b);
                bodyScope = bodyScope.getChild(3).getChild(0);
            }
            body = bodyScope.getText();
        }
        return [param, body];

        //return this.visitChildren(ctx);
	}

	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx) {
        let leftChild = ctx.getChild(0);
        let rightChild = ctx.getChild(1);
        //let test = rightChild.getParent();
        //console.log(ctx.getChild(0).getText());
        //console.log("In Child: ", leftChild.getText(), "type = ", leftChild.constructor.name);
        // if left child is application, go deeper in tree
        if(leftChild instanceof lambdaParser.ApplicationContext) {
            leftChild = this.visitApplication(ctx.getChild(0));
            //let newChild = leftChild.getChild(0);
            if(leftChild instanceof lambdaParser.AbstractionContext) {
                console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.getText());
            }
        }
        /* if(leftChild instanceof lambdaParser.TermContext) {
            console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.toStringTree());
            console.log("TREE 0 = ", leftChild.getChild(0).getChild(0).getText());
            console.log("TREE 1 = ", leftChild.getChild(0).getChild(1).getText());
            console.log("TREE 2 = ", leftChild.getChild(0).getChild(2).getText());
            myChild = leftChild.getChild(0);
        } else {
            console.log("CTX: ", ctx.getText(), "+ return value = ", leftChild);
        } */
        let [param, body] = [null, null];

        console.log("< TERM: ", leftChild.getText(), rightChild.getText());
        
        //if left child is finally abstraction, apply value from right child to body
        let abstraction = leftChild;
        //console.log("** LEFT CHILD = ", abstraction.getText());
        if(abstraction.getChild(0).getText() == '(') {
            abstraction = abstraction.getChild(1);
        }
        [param, body] = this.visitAbstraction(abstraction);
        //console.log("Param: ", param, ", Body: ", body);
        let value = ctx.getChild(1).getText();
        body = body.replaceAll(param, value);
        //console.log("NEW Body: ", body);
        let tree = this.makeTree(body);
        if(tree.getChild(0) instanceof lambdaParser.AbstractionContext) {
            tree = tree.getChild(0);
        }
        //console.log(">TREE PARENT: ", tree.constructor.name);
        //console.log(">TREE: ", tree.getChild(0).constructor.name);
        // return evaluated subtree to the parent
        return tree;

	    //return "2";
	}

    // helper function for creating a subtree
    makeTree(input) {
        var chars = new InputStream(input, true);
        var lexer = new lambdaLexer(chars);
        var tokens = new CommonTokenStream(lexer);
        var parser = new lambdaParser(tokens);

        parser.buildParseTrees = true;
        return parser.term();
    }
}