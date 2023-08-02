import LambdaInterpreterVisitor from "./LambdaInterpreterVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This class defines a complete visitor for comparing two parse trees semantically

export default class CompareLambdaTreesVisitor extends LambdaInterpreterVisitor {

    constructor(ctx1, ctx2) {
        super();
        this.ctx1 = ctx1;
        this.ctx2 = ctx2;
    }

    // Visit a parse tree produced by LambdaParser#redex.
	visitRedex(ctx1, ctx2) {
        ctx1 = ctx1.getChild(0);
        ctx2 = ctx2.getChild(0);
        this.ctx1 = ctx1;
        this.ctx2 = ctx2;
	    return this.visitTerm(ctx1, ctx2);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx1, ctx2) {
        if(ctx1 == null || ctx2 == null) {
            return false;
        }
        if(!(ctx1 instanceof LambdaParser.TermContext) || !(ctx2 instanceof LambdaParser.TermContext)) {
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
            if(super.getTreeText(ctx1) == super.getTreeText(ctx2)) {
                return true;
            }
        }
        this.ctx1 = ctx1.getChild(0) != null ? ctx1.getChild(0) : ctx1;
        this.ctx2 = ctx2.getChild(0) != null ? ctx2.getChild(0) : ctx2;
        let comparison = this.visitChildren(ctx1, ctx2);
        return comparison[0];
	}


	// Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx1, ctx2) {
        ctx1 = this.ctx1;
        ctx2 = this.ctx2;
        if(ctx1 == null || ctx2 == null) {
            return false;
        }
        if(!(ctx1 instanceof LambdaParser.AbstractionContext) || !(ctx2 instanceof LambdaParser.AbstractionContext)) {
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
        if(super.getTreeText(ctx1) == super.getTreeText(ctx2)) {
            this.ctx1 = ctx1;
            this.ctx2 = ctx2;
            return true;
        }
	    return false;
	}


	// Visit a parse tree produced by LambdaParser#application.
	visitApplication(ctx1, ctx2) {
        ctx1 = this.ctx1;
        ctx2 = this.ctx2;
	    if(ctx1 == null || ctx2 == null) {
            return false;
        }
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

        if(super.getTreeText(ctx1) == super.getTreeText(ctx2)) {
            this.ctx1 = ctx1;
            this.ctx2 = ctx2;
            return true;
        }
	    return false;
	}


	// Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx1, ctx2) {
	    return false;
	}

}