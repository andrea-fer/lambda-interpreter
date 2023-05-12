import LambdaInterpreterVisitor from "./LambdaInterpreterVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This tree traverser class defines lambda calculus visitor for reduction strategy call-by-name

export default class CallByNameLambdaVisitor extends LambdaInterpreterVisitor {

    constructor(ctx, definitions) {
        super();
        this.term = super.getTreeText(ctx);
        this.terms = [];
        this.terms.push(this.term);
        this.definitions = definitions;
        this.startTime = new Date().getTime();
        this.maxTime = 3000;
    }
    // Visit a parse tree produced by LambdaParser#redex.
    // ctx.getChild(0) = Term
    // ctx.getChild(1) = EOF
	visitRedex(ctx) {
        ctx = ctx.getChild(0);
	    return this.visitTerm(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx) {
        if(ctx.getChild(0) instanceof LambdaParser.DefinitionContext) {
            return this.visitDefinition(ctx);
        }
        if(ctx.getChild(0) instanceof LambdaParser.ApplicationContext) {
            let oldCTX = ctx.getChild(0);
            while(oldCTX.getChild(0) != null && oldCTX.getChild(0).getText() == '(' 
                && oldCTX.getChild(2) != null && oldCTX.getChild(2).getText() == ')' 
                && oldCTX.getChild(1) instanceof LambdaParser.ApplicationContext
                && oldCTX.getChild(3) == null) {
                    ctx = oldCTX.getChild(1);
                    let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldCTX), super.getTreeText(ctx));
                    if(newCTX != this.terms[this.terms.length - 1]){
                        this.terms.push(newCTX);
                        ctx = super.makeTree(newCTX);
                    }
                    oldCTX = ctx;
            }
        }
        let solution = ctx;
        
        while(solution != null && solution.getChild(0) instanceof LambdaParser.ApplicationContext) {
            if(super.isTimeout(this.startTime, this.maxTime)) {
                return [null, null];
            }
            solution = this.visit(solution.getChild(0));
            if(solution == null) {
                break;
            }
            // removing unnecessary brackets
            if(solution.getChild(0).getChild(0) != null && solution.getChild(0).getChild(0).getText() == "(" 
            && solution.getChild(0).getChild(2) != null && solution.getChild(0).getChild(2).getText() == ")") {
                solution = super.makeTree(super.getTreeText(solution.getChild(0).getChild(1)));
            }
            if(super.getTreeText(solution) == this.terms[this.terms.length - 1]) {
                break;
            }
            this.terms.push(super.getTreeText(solution));
            if(this.definitions.has(super.getTreeText(solution))) {
                let value = super.makeTree(this.definitions.get(super.getTreeText(solution)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    this.terms.push(super.getTreeText(solution));
                }
            }

            if(solution instanceof LambdaParser.AbstractionContext) {
                let param = null;
                let body = null;
                if(super.isTimeout(this.startTime, this.maxTime)) {
                    return [null, null];
                }
                [param, body] = this.visit(solution);
                let bodyText = body;
                for(let [key, value] of this.definitions) {
                    if(body != null && body.includes(key)) {
                        if(super.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                            value = '(' + value + ')';
                        }
                        const key_text = "\\b".concat(key).concat("\\b");
                        const _key = new RegExp(key_text, "g");
                        bodyText = bodyText.replaceAll(_key, value);
                        let oldSolution = solution;
                        solution = super.makeTree(bodyText).getChild(0);
                        let newCTX = this.terms[this.terms.length - 1].replace(body, bodyText);
                        this.terms.push(newCTX);
                        ctx = super.makeTree(newCTX).getChild(0);
                        solution = ctx;
                        if(super.isTimeout(this.startTime, this.maxTime)) {
                            return [null, null];
                        }
                        [param, body] = this.visit(solution);
                        if(body == null) {
                            return [null, null];
                        }
                        bodyText = body;
                    }
                }
            }
        }
        // in case of recursion visit functions will return null
        if(solution == null) {
            console.log("Recursion");
            // return last added term as a solution
            return [this.terms[this.terms.length - 1], this.terms];
        }
        return [super.getTreeText(solution), this.terms];
	}

    // Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx) {
        if(ctx.getText() == '(') {
            ctx = ctx.getChild(1).getChild(0);
        }
        let param = null;
        let body = null;
        if(ctx.VARIABLE()) {
            param = ctx.VARIABLE().getText();
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope == '(') {
                bodyScope = ctx.getChild(3).getChild(1);
            }

            body = super.getTreeText(bodyScope);

        }
        return [param, body];

	}

	// Visit a parse tree produced by LambdaParser#application.
	visitApplication(ctx) {
        let leftChild = ctx.getChild(0);
        let rightChild = ctx.getChild(1);
        let brackets = false;
        if(leftChild.getText() == '(') {
            leftChild = ctx.getChild(1).getChild(0);
            rightChild = ctx.getChild(1).getChild(1);
            brackets = true;
        }
        let oldLeftChild = leftChild;
        while(leftChild.getChild(0) != null && leftChild.getChild(0).getText() == '(' 
            && leftChild.getChild(2) != null && leftChild.getChild(2).getText() == ')' 
            && leftChild.getChild(1) instanceof LambdaParser.ApplicationContext
            && leftChild.getChild(3) == null) {
            leftChild = leftChild.getChild(1);
            let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), super.getTreeText(leftChild));
            if(newCTX != this.terms[this.terms.length - 1]){
                this.terms.push(newCTX);
            }
        }
        let oldRightChild = rightChild;
        while(rightChild.getChild(0) != null && rightChild.getChild(0).getText() == '(' 
            && rightChild.getChild(2) != null && rightChild.getChild(2).getText() == ')' 
            && rightChild.getChild(3) instanceof LambdaParser.ApplicationContext
            && rightChild.getChild(3) == null) {
            rightChild = rightChild.getChild(1);
            let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldRightChild), super.getTreeText(rightChild));
            if(newCTX != this.terms[this.terms.length - 1]){
                this.terms.push(newCTX);
            }
        }

        // if left child is application, go deeper in tree
        if(leftChild.getChild(0) == '(') {
            leftChild = leftChild.getChild(1);
            brackets = true;
        }
        let leftChildText = super.getTreeText(leftChild);
        
        if(!(leftChild instanceof LambdaParser.AbstractionContext) && !(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext)) {
            let left = leftChildText;
            if(leftChild.getChild(1) != null) {
                left = super.getTreeText(leftChild.getChild(0));
            }
            for(let [key, value] of this.definitions) {
                if(left.includes(key)) {
                    if(super.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                        value = '(' + value + ')';
                    }
                    const key_text = "\\b".concat(key).concat("\\b");
                    const _key = new RegExp(key_text, "g");
                    leftChildText = leftChildText.replaceAll(_key, value);
                    let oldLeftChild = leftChild;
                    leftChild = super.makeTree(leftChildText).getChild(0);
                    let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), leftChildText);
                    this.terms.push(newCTX);
                    ctx = super.makeTree(newCTX).getChild(0);
                    break; 
                }
            }
        }
        while(leftChild instanceof LambdaParser.ApplicationContext 
            && ((leftChild.getChild(0) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
            || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            if(super.isTimeout(this.startTime, this.maxTime)) {
                console.log("Program took too long to execute...");
                return null;
            }
            leftChild = this.visit(leftChild);
            if(leftChild == null) {
                return null;
            }
            let leftChildText = super.getTreeText(leftChild); 
            if(leftChild instanceof LambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
                leftChildText = "(" + leftChildText + ")";
            }
            let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), leftChildText);
            ctx = super.makeTree(newCTX).getChild(0);
            leftChild = ctx.getChild(0);
            rightChild = ctx.getChild(1);
            if((leftChild instanceof LambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')) {
                let oldLeftChildText = super.getTreeText(leftChild);
                leftChild = ctx.getChild(0).getChild(1);
                newCTX = newCTX.replace(oldLeftChildText, super.getTreeText(leftChild));
                ctx = super.makeTree(newCTX).getChild(0);
            }
            if(this.terms[this.terms.length - 1] != newCTX) {
                this.terms.push(newCTX);
            }
            leftChild = super.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(0);
            rightChild = super.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(1);
            if(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
        }
        let [param, body] = [null, null];
       
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
            let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
            return super.makeTree(newCTX);
        }
        
        //if left child is finally abstraction, apply value from right child to body
        let abstraction = leftChild;
        if(super.getTreeText(abstraction.getChild(0)) == '(') {
            abstraction = abstraction.getChild(1);
        }
        if(super.isTimeout(this.startTime, this.maxTime)) {
            console.log("Program took too long to execute...");
            return null;
        }
        [param, body] = this.visit(abstraction);
        if(body == null) {
            return null;
        }
        let value = super.getTreeText(rightChild);
        
        // using regex so that no substrings are replaced
        const reg_text = "\\b".concat(param).concat("\\b");
        const reg = new RegExp(reg_text, "g");
        body = body.replaceAll(reg, value);

        let tree = super.makeTree(body);
        if(tree.getChild(0) instanceof LambdaParser.AbstractionContext) {
            tree = tree.getChild(0);
        }
        
        return tree;
	}

    // Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx) {
        ctx = ctx.getChild(0);
        return [[super.getTreeText(ctx.getChild(0)), super.getTreeText(ctx.getChild(2))], null];
	}

}