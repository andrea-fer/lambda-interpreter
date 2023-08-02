import LambdaInterpreterVisitor from "./LambdaInterpreterVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This tree traverser class defines lambda calculus visitor for reduction strategy call-by-value

export default class CallByValueLambdaVisitor extends LambdaInterpreterVisitor {

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
            && leftChild.getChild(1).getChild(0).getChild(0) == null && leftChild.getChild(1).getChild(1) == null) {
            leftChild = leftChild.getChild(1);
            let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), super.getTreeText(leftChild));
            if(newCTX != this.terms[this.terms.length - 1]){
                this.terms.push(newCTX);
            }
        }
        // if right child is term, select its child
        if(rightChild instanceof LambdaParser.TermContext) {
            rightChild = rightChild.getChild(0);
        }

        // if right child consists of more applications, select the first one
        let excessRightChild = "";
        if(rightChild instanceof LambdaParser.ApplicationContext && rightChild.getChild(1) != null
        && rightChild.getChild(0) != null && rightChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
            excessRightChild = " " + super.getTreeText(rightChild.getChild(1));
            rightChild = rightChild.getChild(0);
        }
        let oldRightChild = rightChild;
        while(rightChild.getChild(0) != null && rightChild.getChild(0).getText() == '(' 
            && rightChild.getChild(2) != null && rightChild.getChild(2).getText() == ')' 
            && rightChild.getChild(3) instanceof LambdaParser.ApplicationContext
            && rightChild.getChild(3) == null) {
            rightChild = rightChild.getChild(1);
            let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldRightChild), super.getTreeText(rightChild));
            if(newCTX != this.terms[this.terms.length - 1]) {
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
                    const _key = new RegExp(key_text);
                    leftChildText = leftChildText.replace(_key, value);
                    let oldLeftChild = leftChild;
                    leftChild = super.makeTree(leftChildText).getChild(0);
                    let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), leftChildText);
                    if(newCTX != this.terms[this.terms.length - 1]) {
                        this.terms.push(newCTX);
                    }
                    ctx = super.makeTree(newCTX).getChild(0);
                    break; 
                }
            }
        }
        
        while((leftChild instanceof LambdaParser.ApplicationContext) 
            && (leftChild.getChild(0) != null) 
            && ((leftChild.getChild(0) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
                || (leftChild.getChild(1) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(1).getChild(0) != null))
                || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            let oldLeftChildText = super.getTreeText(oldLeftChild);
            if(super.isTimeout(this.startTime, this.maxTime)) {
                return null;
            }
            let oldTerm = this.terms[this.terms.length - 1];
            leftChild = this.visit(leftChild);
            if(leftChild == null) {
                return null;
            }
            let leftChildText = super.getTreeText(leftChild); 
            if(leftChild instanceof LambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
                leftChildText = "(" + leftChildText + ")";
            }
            let newCTX = oldTerm.replace(oldLeftChildText, leftChildText);
            ctx = super.makeTree(super.getTreeText(ctx).replace(super.getTreeText(oldLeftChild), leftChildText)).getChild(0);
            let ctxText = super.getTreeText(ctx);
            if(rightChild instanceof LambdaParser.TermContext) {
                rightChild = rightChild.getChild(0);
            }
            if((leftChild instanceof LambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')) {
                let oldLeftChildText = super.getTreeText(leftChild);
                leftChild = leftChild.getChild(1);
                brackets = true;
                newCTX = super.getTreeText(ctx).replace(oldLeftChildText, super.getTreeText(leftChild));
                ctx = super.makeTree(newCTX).getChild(0);
            }

            // if left side is not abstraction, we are not implementing substitution
            if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
                //let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
                if(oldTerm != this.terms[this.terms.length - 1]) {
                    let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild).concat(excessRightChild));
                    return super.makeTree(newCTX);
                }
                return super.makeTree(newCTX);
            }

            if(this.terms[this.terms.length - 1] != newCTX) {
                this.terms.push(newCTX);
            } 
            if(rightChild instanceof LambdaParser.TermContext) {
                rightChild = rightChild.getChild(0);
            }
            if(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
        }
        let [param, body] = [null, null];
        
        //if left child is finally abstraction, apply value from right child to body
        let abstraction = leftChild;
        if(abstraction.getChild(0) != null && super.getTreeText(abstraction.getChild(0)) == '(') {
            abstraction = abstraction.getChild(1);
            brackets = true;
        }
        if(super.isTimeout(this.startTime, this.maxTime)) {
            return null;
        }
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof LambdaParser.AbstractionContext)) {

            if(!(rightChild instanceof LambdaParser.ApplicationContext)) {
                let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
                return super.makeTree(newCTX);
            }

            // evaluate right child
            let value = super.getTreeText(rightChild);
            while(rightChild instanceof LambdaParser.ApplicationContext) {
                // if the leftChild is variable or variable inside brackets, don't apply reduction
                if(rightChild.getChild(0).getText() == '(' 
                    && rightChild.getChild(1).getChild(0).getChild(0) == null && rightChild.getChild(1).getChild(0) == null 
                    && rightChild.getChild(2) != null &&  rightChild.getChild(2).getText() == ')'
                    || rightChild.getChild(0).getText() != '(' && rightChild.getChild(0).getChild(0) == null
                    && rightChild.getChild(1) == null) {
                    value = super.getTreeText(rightChild);
                    break;
                }

                // if term is application containing undefined variables, don't apply reduction
                if(rightChild.getChild(0).getText() == '(' 
                    && rightChild.getChild(1).getChild(0).getChild(0) == null 
                    && rightChild.getChild(1).getChild(1).getChild(0).getChild(0) == null 
                    && rightChild.getChild(2) != null &&  rightChild.getChild(2).getText() == ')') {
                    let defined = false;
                    let variable = super.getTreeText(rightChild.getChild(1).getChild(0));
                    let variable2 = super.getTreeText(rightChild.getChild(1).getChild(1).getChild(0));
                    // try to find variable in definitions
                    for(let [key, value] of this.definitions) {
                        if(variable.includes(key) || variable2.includes(key)) {
                            defined = true;
                        }
                    }
                    if(!defined) {
                        value = super.getTreeText(rightChild);
                        if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
                            let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
                            return super.makeTree(newCTX);
                        }
                        break;
                    }
                }

                let oldRightChild = rightChild;
                if(super.isTimeout(this.startTime, this.maxTime)) {
                    return null;
                }
                let oldTerm = this.terms[this.terms.length - 1];
                rightChild = this.visit(rightChild);
                if(rightChild == null) {
                    return null;
                }
                value = super.getTreeText(rightChild);
                if(oldRightChild instanceof LambdaParser.ApplicationContext && !(oldRightChild.getChild(0) instanceof LambdaParser.TermContext) 
                && oldRightChild.getChild(0).getText() == '(' && oldRightChild.getChild(2).getText() == ')' && super.makeTree(value).getChild(0).getChild(0) != null) {
                    value = '(' + value + ')';
                }
                // if left side is not abstraction, we are not implementing substitution
                if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
                    //let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
                    return super.makeTree(super.getTreeText(ctx).replace(super.getTreeText(oldRightChild), value));
                }
                // right child cannot evaluated any more
                if(super.getTreeText(oldRightChild) == value) {
                    break;
                }
                let oldRightChildText = super.getTreeText(oldRightChild);
                //let oldCtx = this.terms[this.terms.length - 1];
                let newRightChild = oldRightChildText.replace(oldRightChildText, value);
                rightChild = super.makeTree(newRightChild);
                let newCTX = oldTerm.replace(oldRightChildText, value);
                if(this.terms[this.terms.length - 1] != newCTX) {
                    this.terms.push(newCTX);
                }
                if(rightChild instanceof LambdaParser.TermContext && rightChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    rightChild = rightChild.getChild(0);
                }
        }

        }
        [param, body] = this.visit(abstraction);
        if(body == null) {
            return null;
        }
        if(super.makeTree(body).getChild(0) instanceof LambdaParser.AbstractionContext) {
            if(super.makeTree(body).getChild(0).getChild(0) != null 
            && super.makeTree(body).getChild(0).getChild(0).getText() != '(') {
                body = '(' + body + ')';
            }
        }
        let value = super.getTreeText(rightChild);

        let val = value;        
        // check if value is contained as a free variable in function body
        if(param != val) {
            // check if alpha conversion is needed
            // replace every occurence of right side param in body with param0
            const reg_text_lambda = "\\b".concat('lambda').concat(val).concat("\\b");
            const reg_lambda = new RegExp(reg_text_lambda, "g");
            let lambdavalue0 = "lambda" + val + "_0";
            let oldBody = body;
            let newBody = body;
            newBody = newBody.replaceAll(reg_lambda, lambdavalue0);
            // replace only bound variables in function body
            if(newBody != oldBody) {
                const reg_text_val = "\\b".concat(val).concat("\\b");
                const reg_val = new RegExp(reg_text_val, "g");
                let value0 = val + "_0";
                newBody = newBody.replaceAll(reg_val, value0);
                let newCTX = this.terms[this.terms.length - 1].replace(oldBody, newBody);
                if(this.terms[this.terms.length - 1] != newCTX) {
                    this.terms.push(newCTX);
                }
                body = newBody;
            }
        } 

        // using regex so that no substrings are replaced
        const reg_text = "\\b".concat(param).concat("\\b");
        const reg = new RegExp(reg_text, "g");
        body = body.replaceAll(reg, value);
        body = body + excessRightChild;
        if(brackets 
        && super.makeTree(body).getChild(0).getChild(0) != null && super.makeTree(body).getChild(0).getChild(0).getText() != '('
        /* && super.makeTree(body).getChild(0).getChild(1) != null && super.makeTree(body).getChild(0).getChild(1) instanceof LambdaParser.ApplicationContext
        && super.makeTree(body).getChild(0).getChild(2) != null && super.makeTree(body).getChild(0).getChild(2).getText() != ')' */) {
            body = '(' + body + ')';
        }

        let tree = super.makeTree(body);
        if(tree.getChild(0) instanceof LambdaParser.AbstractionContext) {
            tree = tree.getChild(0);
        }
        
        return tree;
	}
}