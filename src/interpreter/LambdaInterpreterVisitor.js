import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "./LambdaLexer.js";
import LambdaVisitor from "./LambdaVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This tree traverser class defines parent visitor class which implements helper functions that all visitors share

export default class LambdaInterpreterVisitor extends LambdaVisitor {

    // Visit a parse tree produced by LambdaParser#redex.
	visitRedex(ctx) {
        return this.visitChildren(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx) {
        return this.visitChildren(ctx);
	}

    // Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx) {
        return this.visitChildren(ctx);
	}

	// Visit a parse tree produced by LambdaParser#application.
	visitApplication(ctx) {
        return this.visitChildren(ctx);
	}

    // Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx) {
        return this.visitChildren(ctx);
	}

    // helper function for creating a subtree
    makeTree(input) {
        let chars = new InputStream(input, true);
        let lexer = new LambdaLexer(chars);
        let tokens = new CommonTokenStream(lexer);
        let parser = new LambdaParser(tokens);

        parser.buildParseTrees = true;
        return parser.term();
    }

    // helper function for getting text from parse tree, without ignoring crutial whitespaces
    getTreeText(body) {
        if(body == null) {
            return;
        }
        if(body instanceof LambdaParser.TermContext && body.getChild(0) != null && body.getChild(0).getText() != '(') {
            body = body.getChild(0);
        }
        let brackets = false;
        // in case of double brackets, e.g. application -> '(' application ')' -> '(' application ')'
        while(body.getChild(0) != null  && body.getChild(0).getText() == '(') {
            body = body.getChild(1);
            brackets = true;
        }
        if(body instanceof LambdaParser.ApplicationContext) {
            let child_0 = this.getTreeText(body.getChild(0));
            let child_1 = this.getTreeText(body.getChild(1));
            let bodyText = child_0.concat(' ').concat(child_1);
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            return bodyText; 
        }
        if(body instanceof LambdaParser.AbstractionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(body.getChild(2).getText()).concat(this.getTreeText(body.getChild(3)));
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            return bodyText;
        }

        if(body instanceof LambdaParser.DefinitionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(this.getTreeText(body.getChild(2)));
            return bodyText;
        }

        if(body.getChild(0) == null) {
            return body.getText();
        }

        return this.getTreeText(body.getChild(0));
    }

    // helper function to track time of program execution
    isTimeout(startTime, maxTime) {
        // return true if time of program execution has exceeded maxTime
        return (new Date().getTime() > (startTime + maxTime));
    }
}