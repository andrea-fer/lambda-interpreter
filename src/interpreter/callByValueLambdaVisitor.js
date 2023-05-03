import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "./LambdaLexer.js";
import LambdaVisitor from "./LambdaVisitor.js";
import LambdaParser from "./LambdaParser.js";

// Tree Traverser Class
export default class CallByValueLambdaVisitor extends LambdaVisitor {

    constructor(ctx, definitions) {
        super();
        this.term = this.getBodyText(ctx);
        this.terms = [];
        this.terms.push(this.term);
        this.maximumSteps = 30;
        this.definitions = definitions;
    }
    // Visit a parse tree produced by LambdaParser#redex.
	visitRedex(ctx) {
        ctx = ctx.getChild(0);
	    return this.visitTerm(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx) {
        if(ctx.getChild(0) instanceof LambdaParser.DefinitionContext) {
            return this.visitDefinition(ctx);
        }

        let solution = ctx;
        
        while(solution != null && solution.getChild(0) instanceof LambdaParser.ApplicationContext) {
            solution = this.visit(solution.getChild(0));
            if(solution == null) {
                break;
            }
            // removing unnecessary brackets
            if(solution.getChild(0).getChild(0) != null && solution.getChild(0).getChild(0).getText() == "(" 
            && solution.getChild(0).getChild(2) != null && solution.getChild(0).getChild(2).getText() == ")") {
                //let solutionWObrackets = this.getBodyText(solution).slice(1, this.getBodyText(solution).length - 1);
                solution = this.makeTree(this.getBodyText(solution.getChild(0).getChild(1)));
            }
            if(this.getBodyText(solution) == this.terms[this.terms.length - 1]) {
                break;
            }
            if(this.terms.length < this.maximumSteps) {
                this.terms.push(this.getBodyText(solution));
            } else {
                return [this.getBodyText(solution), this.terms];
            }
            if(this.definitions.has(this.getBodyText(solution))) {
                let value = this.makeTree(this.definitions.get(this.getBodyText(solution)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    if(this.terms.length < this.this.maximumSteps) {
                        this.terms.push(this.getBodyText(solution));
                    } else {
                        return [this.getBodyText(solution), this.terms];
                    }
                }
            }

            if(solution instanceof LambdaParser.AbstractionContext) {
                this.visit(solution);
            }

        }
        // in case of recursion visit functions will return null
        if(solution == null) {
            // return last added term as a solution
            return [this.terms[this.terms.length - 1], this.terms];
        }
        return [this.getBodyText(solution), this.terms];
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

            body = this.getBodyText(bodyScope);
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

        // if left child is application, go deeper in tree
        if(leftChild.getChild(0) == '(') {
            leftChild = leftChild.getChild(1);
            brackets = true;
        }
        let leftChildText = this.getBodyText(leftChild);
        
        if(!(leftChild instanceof LambdaParser.AbstractionContext) && !(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext)) {
            let left = leftChildText;
            if(leftChild.getChild(1) != null) {
                left = this.getBodyText(leftChild.getChild(0));
            }
            for(let [key, value] of this.definitions) {
                if(left.includes(key)) {
                    if(this.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                        value = '(' + value + ')';
                    }
                    const key_text = "\\b".concat(key).concat("\\b");
                    const _key = new RegExp(key_text, "g");
                    leftChildText = leftChildText.replaceAll(_key, value);
                    let oldLeftChild = leftChild;
                    leftChild = this.makeTree(leftChildText).getChild(0);
                    let newCTX = this.terms[this.terms.length - 1].replace(this.getBodyText(oldLeftChild), leftChildText);
                    if(this.terms.length < this.maximumSteps){
                        this.terms.push(newCTX);
                    } else {
                        return null;
                    }
                    ctx = this.makeTree(newCTX).getChild(0);
                    break; 
                }
            }
        }
        while(leftChild != null && leftChild instanceof LambdaParser.ApplicationContext 
            && ((leftChild.getChild(0) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
            || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            leftChild = this.visit(leftChild);
            if(leftChild == null) {
                return null;
            }
            let leftChildText = this.getBodyText(leftChild); 
            if(leftChild instanceof LambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
                leftChildText = "(" + leftChildText + ")";
            }
            brackets = (leftChild.getChild(0).getText() == '(');
            let newCTX = this.terms[this.terms.length - 1].replace(this.getBodyText(oldLeftChild), leftChildText);
            ctx = this.makeTree(newCTX).getChild(0);
            leftChild = ctx.getChild(0);
            rightChild = ctx.getChild(1);
            if((leftChild instanceof LambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')) {
                let oldLeftChildText = this.getBodyText(leftChild);
                leftChild = ctx.getChild(0).getChild(1);
                newCTX = newCTX.replace(oldLeftChildText, this.getBodyText(leftChild));
                ctx = this.makeTree(newCTX).getChild(0);
            }
            if(this.terms[this.terms.length - 1] != newCTX) {
                this.terms.push(newCTX);
            } else {
                return null;
            }
            if(this.terms.length > this.maximumSteps) {
                return null;
            }
            leftChild = this.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(0);
            rightChild = this.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(1);
            if(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
        }
        let [param, body] = [null, null];
       
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
            let newCTX = this.getBodyText(leftChild).concat(' ').concat(this.getBodyText(rightChild));
            return this.makeTree(newCTX);
        }
        
        //if left child is finally abstraction, apply value from right child to body
            let abstraction = leftChild;
            if(this.getBodyText(abstraction.getChild(0)) == '(') {
                abstraction = abstraction.getChild(1);
            }
            [param, body] = this.visit(abstraction);
            let value = this.getBodyText(rightChild);
            while(rightChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                // if the leftChild is Variable, don't apply reduction
                if(rightChild.getChild(0).getChild(0).getText() == '(' && rightChild.getChild(0).getChild(1).getChild(0).getChild(0) == null
                    || rightChild.getChild(0).getChild(0).getText() != '(' && rightChild.getChild(0).getChild(0).getChild(0) == null) {
                    value = this.getBodyText(rightChild);
                    break;
                }
                let oldRightChild = rightChild.getChild(0);
                rightChild = this.visit(rightChild.getChild(0));
                if(rightChild == null) {
                    return null;
                }
                value = this.getBodyText(rightChild);
                if(oldRightChild instanceof LambdaParser.ApplicationContext && !(oldRightChild.getChild(0) instanceof LambdaParser.TermContext) 
                && oldRightChild.getChild(0).getText() == '(' && oldRightChild.getChild(2).getText() == ')' && this.makeTree(value).getChild(0).getChild(0) != null) {
                    value = '(' + value + ')';
                }
                let oldRightChildText = this.getBodyText(oldRightChild);
                let oldCtx = this.terms[this.terms.length - 1];
                let newCTX = oldCtx.replace(oldRightChildText, value);
                ctx = this.makeTree(newCTX);
                rightChild = ctx.getChild(0).getChild(1);
                value = this.getBodyText(rightChild);
            
                newCTX = this.terms[this.terms.length - 1].replace(this.getBodyText(oldRightChild), value);
                if(this.terms[this.terms.length - 1] == newCTX) {
                    break;
                }
                if(this.terms.length < this.maximumSteps){
                    this.terms.push(newCTX);
                } else {
                    return null;
                }
            }

            // using regex so that no substrings are replaced
            const reg_text = "\\b".concat(param).concat("\\b");
            const reg = new RegExp(reg_text, "g");
            body = body.replaceAll(reg, value);

            let tree = this.makeTree(body);
            if(tree.getChild(0) instanceof LambdaParser.AbstractionContext) {
                tree = tree.getChild(0);
            }
           
            return tree;
	}

    // Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx) {
        ctx = ctx.getChild(0);
        return [[this.getBodyText(ctx.getChild(0)), this.getBodyText(ctx.getChild(2))], null];
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
    getBodyText(body) {
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
}