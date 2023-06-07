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
            && leftChild.getChild(3) == null) {
            leftChild = leftChild.getChild(1);
            let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), super.getTreeText(leftChild));
            if(newCTX != this.terms[this.terms.length - 1]){
                console.log("*", newCTX, "*");
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
            if(newCTX != this.terms[this.terms.length - 1]){
                console.log("*", newCTX, "*");
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
                    //console.log("before: ", leftChildText);
                    leftChildText = leftChildText.replace(_key, value);
                    //console.log("before: ", leftChildText);
                    let oldLeftChild = leftChild;
                    leftChild = super.makeTree(leftChildText).getChild(0);
                    //console.log("substituing: ", key, " in: ", this.terms[this.terms.length - 1], " for: ", leftChildText);
                    let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), leftChildText);
                    console.log("*", newCTX, "*");
                    this.terms.push(newCTX);
                    ctx = super.makeTree(newCTX).getChild(0);
                    break; 
                }
            }
        }
        while(leftChild instanceof LambdaParser.ApplicationContext 
            && ((leftChild.getChild(0) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
            || (leftChild.getChild(1) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(1).getChild(0) != null))
            || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            if(super.isTimeout(this.startTime, this.maxTime)) {
                //console.log("Program took too long to execute...");
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
            let newCTX = oldTerm.replace(super.getTreeText(oldLeftChild), leftChildText);
            ctx = super.makeTree(super.getTreeText(ctx).replace(super.getTreeText(oldLeftChild), leftChildText)).getChild(0);
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
            if(this.terms[this.terms.length - 1] != newCTX) {
                console.log("*", newCTX, "*");
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
       
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof LambdaParser.AbstractionContext) && !(rightChild instanceof LambdaParser.ApplicationContext)) {
            let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
            return super.makeTree(newCTX);
        } else if(leftChild instanceof LambdaParser.AbstractionContext) {
            let abstraction = leftChild;
            if(abstraction.getChild(0) != null && super.getTreeText(abstraction.getChild(0)) == '(') {
                abstraction = abstraction.getChild(1);
                brackets = true;
            }
            if(super.isTimeout(this.startTime, this.maxTime)) {
                //console.log("Program took too long to execute...");
                return null;
            }
            [param, body] = this.visit(abstraction);
            if(body == null) {
                return null;
            }
            if(super.makeTree(body).getChild(0) instanceof LambdaParser.AbstractionContext) {
                if(super.makeTree(body).getChild(0).getChild(0) != null && super.makeTree(body).getChild(0).getChild(0).getText() != '(') {
                    body = '(' + body + ')';
                }
            }
        }
        let value = super.getTreeText(rightChild);
        /* if(rightChild instanceof LambdaParser.ApplicationContext) {
            let rightTerm = super.makeTree(value);
            value = this.visit(rightTerm)[0];
            rightChild = super.makeTree(value).getChild(0);
        } */
        while(rightChild instanceof LambdaParser.ApplicationContext) {
            //console.log("...rightChild <", super.getTreeText(rightChild), "> is application...(evaluating rightChild)");
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
                //console.log("Program took too long to execute...");
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
                return super.makeTree(super.getTreeText(ctx).replace(super.getTreeText(oldRightChild), value));
            }
            // right child cannot evaluated any more
            if(super.getTreeText(oldRightChild) == value) {
                break;
            }

            let oldRightChildText = super.getTreeText(oldRightChild);
            let newRightChild = oldRightChildText.replace(oldRightChildText, value);
            rightChild = super.makeTree(newRightChild).getChild(0);
            let newCTX = oldTerm.replace(oldRightChildText, value);
            if(this.terms[this.terms.length - 1] != newCTX) {
                console.log("*", newCTX, "*");
                this.terms.push(newCTX);
            }
            if(rightChild instanceof LambdaParser.TermContext && rightChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                rightChild = rightChild.getChild(0);
            }
            
            if(rightChild instanceof LambdaParser.AbstractionContext) {
                // find the deepest abstraction and evaluate the body
                console.log("RIGHT CHILD IS ABSTRACTION", super.getTreeText(rightChild))
                let param = null;
                let body = null;
                if(this.isTimeout(this.startTime, this.maxTime)) {
                    //console.log("Program took too long to execute...");
                    return [null, null];
                }
                //console.log("--rightchild constructor: ", rightChild.constructor.name);
                //console.log("•first visitAbstraction with rightChild: ", super.getTreeText(rightChild))
                [param, body] = super.visitAbstraction(rightChild);
                //console.log("hee")
                //console.log("abstraction param:", param, "| abstraction body:", body);

                let bodyText = body;
                let tmpRightChild;
                if(body != null) {
                    tmpRightChild = super.makeTree(body).getChild(0);
                } else {
                    return [null, null];
                }
                //let abstractionBody = body;
                
                while(tmpRightChild instanceof LambdaParser.AbstractionContext) {
                    console.log("•second visitAbstraction with tmpRightChild: ", super.getTreeText(tmpRightChild))
                    let p;
                    let b;
                    [p, b] = super.visitAbstraction(tmpRightChild);
                    console.log("....")
                    console.log("•AFTER second visitAbstraction with tmpRightChild: ", super.getTreeText(tmpRightChild))
                    //console.log("before maketree1", this.getTreeText(tmpSolution))
                    //console.log("bodytext: <<", bodyText, ">>")
                    tmpRightChild = super.makeTree(b);
                    if(tmpRightChild instanceof LambdaParser.TermContext) {
                        tmpRightChild = tmpRightChild.getChild(0);
                    }
                    console.log("rightChild is still abstraction: <", super.getTreeText(tmpRightChild), ">", tmpRightChild.constructor.name);
                    //console.log("after maketree1", this.getTreeText(tmpSolution))
                    //abstractionBody = bodyText;
                    bodyText = b;
                }

                //if(body != null/*  && body != bodyText */) {
                    while(tmpRightChild instanceof LambdaParser.ApplicationContext) {
                        console.log("RIGHT CHILD IS APPLICATION")
                        let oldBody = bodyText;
                        let abstractionBody = this.visit(tmpRightChild).getChild(0);
                        console.log("after evaluating abstractionBody");
                        console.log("in: ", super.getTreeText(tmpRightChild), "replacing: ", oldBody, "with: ", super.getTreeText(abstractionBody));
                        let newRightChild = super.getTreeText(tmpRightChild).replace(oldBody, super.getTreeText(abstractionBody));
                        console.log("newrightchild: ", newRightChild)
                        let newCTX = this.terms[this.terms.length - 1].replace(this.getTreeText(rightChild), newRightChild);
                        console.log("newCTX: ", newCTX);
                        tmpRightChild = abstractionBody;
                        if(this.terms[this.terms.length - 1] != newCTX) {
                            console.log("°", newCTX, "°");
                            this.terms.push(newCTX);
                        } else {
                            break;
                        }
                    }
                    value = newRightChild;
                //}

            }
        }

        //console.log("---rightChild <", super.getTreeText(rightChild), "> is NOT application---(not evaluating rightChild)");

        let val = value;
        let valueTree = super.makeTree(val).getChild(0);
        // if value is abstraction
        if(valueTree instanceof LambdaParser.AbstractionContext) {
            if(valueTree.getChild(0).getText() == '(') {
                valueTree = valueTree.getChild(1);
            }
            let p;
            [val, p] = this.visitAbstraction(valueTree);
        }

        // check if value on the right is a function definition
        for(let [key, v] of this.definitions) {
            if(v == value || value.substring(1, value.length - 1) == v) {
                let oldValue = value;
                value = key;
                val = value;
                let newCTX = this.terms[this.terms.length - 1].replace(oldValue, value);
                if(this.terms[this.terms.length - 1] != newCTX) {
                    console.log("°", newCTX, "°");
                    this.terms.push(newCTX);
                } else {
                    break;
                }
            }
        }

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
                    console.log("*", newCTX, "*");
                    this.terms.push(newCTX);
                }
                body = newBody;
            }
        }

        // using regex so that no substrings are replaced
        const reg_text = "\\b".concat(param).concat("\\b");
        const reg = new RegExp(reg_text, "g");
        body = body.replaceAll(reg, value);
        console.log("~new tree:~", body);
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