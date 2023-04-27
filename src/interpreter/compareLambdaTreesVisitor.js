// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import lambdaLexer from "./lambdaLexer.js";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

// This class defines a complete visitor for comparing two parse trees semantically

export default class compareLambdaTreesVisitor extends lambdaVisitor {

    constructor(ctx1, ctx2) {
        super();
        this.ctx1 = ctx1;
        this.ctx2 = ctx2;
    }

    getBodyText(body) {
        if(body == null) {
            return;
        }
        if(body instanceof lambdaParser.TermContext) {
            body = body.getChild(0);
        }
        let brackets = false;
        // in case of double brackets, e.g. application -> '(' application ')' -> '(' application ')'
        while(body.getChild(0) != null  && body.getChild(0).getText() == '(') {
            body = body.getChild(1);
            brackets = true;
        }
        if(body instanceof lambdaParser.ApplicationContext) {
            let child_0 = this.getBodyText(body.getChild(0));
            let child_1 = this.getBodyText(body.getChild(1));
            let bodyText = child_0.concat(' ').concat(child_1);
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            return bodyText; 
        }
        if(body instanceof lambdaParser.AbstractionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(body.getChild(2).getText()).concat(this.getBodyText(body.getChild(3)));
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            return bodyText;
        }

        if(body instanceof lambdaParser.DefinitionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(this.getBodyText(body.getChild(2)));
            return bodyText;
        }

        if(body.getChild(0) == null) {
            return body.getText();
        }

        return this.getBodyText(body.getChild(0));
    }

	// Visit a parse tree produced by lambdaParser#term.
	visitTerm(ctx1, ctx2) {
        console.log("-----------------comparing-----------------")
        if(ctx1 == null || ctx2 == null) {
            return false;
        }
        if(!(ctx1 instanceof lambdaParser.TermContext) || !(ctx2 instanceof lambdaParser.TermContext)) {
            return false;
        }
        while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
            && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
            && ctx1.getChild(1) instanceof lambdaParser.TermContext) {
            ctx1 = ctx1.getChild(1);
        }
        while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
            && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
            && ctx2.getChild(1) instanceof lambdaParser.TermContext) {
            ctx2 = ctx2.getChild(1);
        }
        if(ctx1.getChild(0).getChild(0) == null && ctx2.getChild(0).getChild(0) == null) { 
            if(this.getBodyText(ctx1) == this.getBodyText(ctx2)) {
                console.log(this.getBodyText(ctx1), ' == ', this.getBodyText(ctx2))
                return true;
            }
        }
        /* console.log(this.getBodyText(ctx1), ' != ', this.getBodyText(ctx2))
	    return false; */
        let comparison = this.visitChildren(ctx1, ctx2);
        console.log("Is it really the same? ", comparison[0]);
        return comparison;
	}


	// Visit a parse tree produced by lambdaParser#abstraction.
	visitAbstraction(ctx1, ctx2) {
        if(ctx1 == null || ctx2 == null) {
            return false;
        }
        if(!(ctx1 instanceof lambdaParser.AbstractionContext) || !(ctx2 instanceof lambdaParser.AbstractionContext)) {
            return false;
        }
        while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
            && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
            && ctx1.getChild(1) instanceof lambdaParser.AbstractionContext) {
            ctx1 = ctx1.getChild(1);
        }
        while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
            && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
            && ctx2.getChild(1) instanceof lambdaParser.AbstractionContext) {
            ctx2 = ctx2.getChild(1);
        }
        if(this.getBodyText(ctx1) == this.getBodyText(ctx2)) {
            console.log(this.getBodyText(ctx1), ' == ', this.getBodyText(ctx2))
            return true;
        }
        console.log(this.getBodyText(ctx1), ' != ', this.getBodyText(ctx2))
	    return false;
	}


	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx1, ctx2) {
	    if(ctx1 == null || ctx2 == null) {
            return false;
        }
        if(!(ctx1 instanceof lambdaParser.ApplicationContext) || !(ctx2 instanceof lambdaParser.ApplicationContext)) {
            return false;
        }
        while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
            && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
            && ctx1.getChild(1) instanceof lambdaParser.ApplicationContext) {
            ctx1 = ctx1.getChild(1);
        }
        while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
            && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
            && ctx2.getChild(1) instanceof lambdaParser.ApplicationContext) {
            ctx2 = ctx2.getChild(1);
        }
        if(this.getBodyText(ctx1) == this.getBodyText(ctx2)) {
            console.log(this.getBodyText(ctx1), ' == ', this.getBodyText(ctx2))
            return true;
        }
        console.log(this.getBodyText(ctx1), ' != ', this.getBodyText(ctx2))
	    return false;
	}


	// Visit a parse tree produced by lambdaParser#definition.
	visitDefinition(ctx1, ctx2) {
	    return false;
	}



}