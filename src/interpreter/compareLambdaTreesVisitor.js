// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import LambdaVisitor from "./LambdaVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This class defines a complete visitor for comparing two parse trees semantically

export default class CompareLambdaTreesVisitor extends LambdaVisitor {

    constructor(ctx1, ctx2) {
        super();
        this.ctx1 = ctx1;
        this.ctx2 = ctx2;
    }

    getBodyText(body) {
        if(body == null) {
            return;
        }
        if(body instanceof LambdaParser.TermContext) {
            body = body.getChild(0);
        }
        let brackets = false;
        // in case of double brackets, e.g. application -> '(' application ')' -> '(' application ')'
        while(body.getChild(0) != null  && body.getChild(0).getText() == '(') {
            body = body.getChild(1);
            brackets = true;
        }
        if(body instanceof LambdaParser.ApplicationContext) {
            let child_0 = this.getBodyText(body.getChild(0));
            let child_1 = this.getBodyText(body.getChild(1));
            let bodyText = child_0.concat(' ').concat(child_1);
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            return bodyText; 
        }
        if(body instanceof LambdaParser.AbstractionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(body.getChild(2).getText()).concat(this.getBodyText(body.getChild(3)));
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            return bodyText;
        }

        if(body instanceof LambdaParser.DefinitionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(this.getBodyText(body.getChild(2)));
            return bodyText;
        }

        if(body.getChild(0) == null) {
            return body.getText();
        }

        return this.getBodyText(body.getChild(0));
    }

    // Visit a parse tree produced by LambdaParser#redex.
	visitRedex(ctx) {
        ctx = ctx.getChild(0);
	    return this.visitTerm(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx1, ctx2) {
        console.log("-----------------comparing-----------------")
        if(ctx1 == null || ctx2 == null) {
            console.log("--line 64")
            return false;
        }
        if(!(ctx1 instanceof LambdaParser.TermContext) || !(ctx2 instanceof LambdaParser.TermContext)) {
            console.log("--line 68")
            return false;
        }
        while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
            && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
            && ctx1.getChild(1) instanceof LambdaParser.TermContext) {
            ctx1 = ctx1.getChild(1);
        }
        while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
            && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
            && ctx2.getChild(1) instanceof LambdaParser.TermContext) {
            ctx2 = ctx2.getChild(1);
        }
        if(ctx1.getChild(0).getChild(0) == null && ctx2.getChild(0).getChild(0) == null) { 
            if(this.getBodyText(ctx1) == this.getBodyText(ctx2)) {
                console.log("--line 83")
                console.log(this.getBodyText(ctx1), ' == ', this.getBodyText(ctx2))
                return true;
            }
        }
        this.ctx1 = ctx1.getChild(0) != null ? ctx1.getChild(0) : ctx1;
        this.ctx2 = ctx2.getChild(0) != null ? ctx2.getChild(0) : ctx2;
        /* console.log(this.getBodyText(ctx1), ' != ', this.getBodyText(ctx2))
	    return false; */
        let comparison = this.visitChildren(ctx1, ctx2);
        console.log("Is it really the same? ", comparison);
        return comparison[0];
	}


	// Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx1, ctx2) {
        ctx1 = this.ctx1;
        ctx2 = this.ctx2;
        if(ctx1 != null) {
            console.log(ctx1);
            console.log(this.getBodyText(ctx1));
        } else {console.log("ctx1 is null")}
        if(ctx2 != null) {
            console.log(ctx2);
            console.log(this.getBodyText(ctx2));
        } else {console.log("ctx2 is null")}
        if(ctx1 == null || ctx2 == null) {
            console.log("--line 111")
            return false;
        }
        /* console.log(ctx1.constructor.name)
        console.log(ctx2.constructor.name) */
        if(!(ctx1 instanceof LambdaParser.AbstractionContext) || !(ctx2 instanceof LambdaParser.AbstractionContext)) {
            console.log("--line 116")
            return false;
        }
        while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
            && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
            && ctx1.getChild(1) instanceof LambdaParser.AbstractionContext) {
            ctx1 = ctx1.getChild(1);
        }
        while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
            && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
            && ctx2.getChild(1) instanceof LambdaParser.AbstractionContext) {
            ctx2 = ctx2.getChild(1);
        }
        if(this.getBodyText(ctx1) == this.getBodyText(ctx2)) {
            console.log("--line 131")
            console.log(this.getBodyText(ctx1), ' == ', this.getBodyText(ctx2))
            this.ctx1 = ctx1;
            this.ctx2 = ctx2;
            return true;
        }
        console.log("--line 135")
        console.log(this.getBodyText(ctx1), ' != ', this.getBodyText(ctx2))
	    return false;
	}


	// Visit a parse tree produced by LambdaParser#application.
	visitApplication(ctx1, ctx2) {
        ctx1 = this.ctx1;
        ctx2 = this.ctx2;
	    if(ctx1 == null || ctx2 == null) {
            console.log("--line 146")
            return false;
        }
        /* console.log(ctx1.constructor.name)
        console.log(ctx2.constructor.name) */
        if(!(ctx1 instanceof LambdaParser.ApplicationContext) || !(ctx2 instanceof LambdaParser.ApplicationContext)) {
            return false;
        }
        while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
            && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
            && ctx1.getChild(1) instanceof LambdaParser.ApplicationContext) {
            ctx1 = ctx1.getChild(1);
        }
        while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
            && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
            && ctx2.getChild(1) instanceof LambdaParser.ApplicationContext) {
            ctx2 = ctx2.getChild(1);
        }
        if(ctx1.getChild(0) != null && ctx1.getChild(0) instanceof LambdaParser.ApplicationContext
            && ctx1.getChild(1) != null && ctx1.getChild(1) instanceof LambdaParser.TermContext) {
                ctx1 = ctx1.getChild(0);
            while(ctx1.getChild(0) != null && ctx1.getChild(0).getText() == '(' 
                && ctx1.getChild(2) != null && ctx1.getChild(2).getText() == ')' 
                && ctx1.getChild(1) instanceof LambdaParser.ApplicationContext) {
                ctx1 = ctx1.getChild(1);
            }
        }

        if(ctx2.getChild(0) != null && ctx2.getChild(0) instanceof LambdaParser.ApplicationContext
            && ctx2.getChild(1) != null && ctx2.getChild(1) instanceof LambdaParser.TermContext) {
                ctx2 = ctx2.getChild(0);
            while(ctx2.getChild(0) != null && ctx2.getChild(0).getText() == '(' 
                && ctx2.getChild(2) != null && ctx2.getChild(2).getText() == ')' 
                && ctx2.getChild(1) instanceof LambdaParser.ApplicationContext) {
                ctx2 = ctx2.getChild(1);
            }
        }

        if(this.getBodyText(ctx1) == this.getBodyText(ctx2)) {
            console.log("--line 163")
            console.log(this.getBodyText(ctx1), ' == ', this.getBodyText(ctx2))
            this.ctx1 = ctx1;
            this.ctx2 = ctx2;
            return true;
        }
        console.log("--line 167")
        console.log(this.getBodyText(ctx1), ' != ', this.getBodyText(ctx2))
	    return false;
	}


	// Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx1, ctx2) {
	    return false;
	}

}