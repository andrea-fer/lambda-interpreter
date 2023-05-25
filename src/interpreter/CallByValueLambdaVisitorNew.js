import LambdaInterpreterVisitor from "./LambdaInterpreterVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This tree traverser class defines lambda calculus visitor for reduction strategy call-by-value

export default class CallByValueLambdaVisitor extends LambdaInterpreterVisitor {

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
        console.log("*****Redex is: ", ctx.getText());
        console.log("Redex type is: ", ctx.constructor.name);
        console.log("-------------------");
        ctx = ctx.getChild(0);
	    return this.visit(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx) {
        console.log("-------------------Call By Value----------------")
        console.log("°°TERM IS : ", super.getTreeText(ctx));
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
                    console.log("--brackets-- replacing in term, *", this.terms[this.terms.length - 1], "* this: '", super.getTreeText(oldCTX), "', with: '", super.getTreeText(ctx), "'")
                    let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldCTX), super.getTreeText(ctx));
                    if(newCTX != this.terms[this.terms.length - 1]){
                        console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                        this.terms.push(newCTX);
                        console.log("handling brackets newCTX = ", newCTX);
                        ctx = super.makeTree(newCTX);
                    }
                    oldCTX = ctx;
            }
        }
        let solution = ctx;
        console.log("SOLUTION: ", super.getTreeText(solution), "type: ", solution.constructor.name);
        
        while(solution != null && solution.getChild(0) instanceof LambdaParser.ApplicationContext) {
            console.log("Solution parent: ", super.getTreeText(solution), ", type: ", solution.constructor.name);
            if(super.isTimeout(this.startTime, this.maxTime)) {
                console.log("Program took too long to execute...");
                return [null, null];
            }
            solution = this.visit(solution.getChild(0));
            if(solution == null) {
                break;
            }
            // removing unnecessary brackets
            if(solution.getChild(0).getChild(0) != null && solution.getChild(0).getChild(0).getText() == "(" 
            && solution.getChild(0).getChild(2) != null && solution.getChild(0).getChild(2).getText() == ")") {
                //let solutionWObrackets = super.getTreeText(solution).slice(1, super.getTreeText(solution).length - 1);
                console.log("============================REMOVING BRACKETS");
                //solution = super.makeTree(solutionWObrackets);
                solution = super.makeTree(super.getTreeText(solution.getChild(0).getChild(1)));
            }
            if(super.getTreeText(solution) == this.terms[this.terms.length - 1]) {
                console.log(" EVALUATION SHOULD STOP : ", super.getTreeText(solution), "==", this.terms[this.terms.length - 1]);
                break;
            }
            console.log("> SOLUTION: ", super.getTreeText(solution), "type: ", solution.constructor.name);
            console.log("☺☺ pushing > ☺☺ '", super.getTreeText(solution), "'");
            this.terms.push(super.getTreeText(solution));
            console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
            console.log("SOLUTION: ", super.getTreeText(solution), "type: ", solution.constructor.name);
            //console.log("Does map contain ", super.getTreeText(solution), "?", this.definitions.has(super.getTreeText(solution)));
            if(this.definitions.has(super.getTreeText(solution))) {
                let value = super.makeTree(this.definitions.get(super.getTreeText(solution)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    if(this.terms[this.terms.length - 1] != super.getTreeText(solution)) {
                        console.log("☺☺ pushing > ☺☺ '", super.getTreeText(solution), "'");
                        this.terms.push(super.getTreeText(solution));
                    }
                    console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
                    console.log("SOLUTION: ", super.getTreeText(solution), "type: ", solution.constructor.name);
                }
            }

            if(solution.getChild(0) != null && solution.getChild(0).getText() == '(' && solution.getChild(1) != null && solution.getChild(1) instanceof LambdaParser.AbstractionContext) {
                console.log("!solution has brackets")
                solution = solution.getChild(1);
                console.log("new solution: ", super.getTreeText(solution))
                if(this.terms[this.terms.length - 1] != super.getTreeText(solution)) {
                    console.log("☺☺ pushing > ☺☺ '", super.getTreeText(solution), "'");
                    this.terms.push(super.getTreeText(solution));
                }
            }

            if(solution instanceof LambdaParser.AbstractionContext) {
                console.log()
                console.log("is abstraction");
                console.log()
                //this.visit(solution);
                let param = null;
                let body = null;
                if(super.isTimeout(this.startTime, this.maxTime)) {
                    console.log("Program took too long to execute...");
                    return [null, null];
                }
                [param, body] = this.visitAbstraction(solution);
                /* if(super.makeTree(body).getChild(0) instanceof LambdaParser.AbstractionContext) {
                    if(super.makeTree(body).getChild(0).getChild(0) != null && super.makeTree(body).getChild(0).getChild(0).getText() != '(') {
                        body = '(' + body + ')';
                    }
                } */
                console.log("--_param_-- ", param);
                console.log("--_body_-- ", body);
                let bodyText = body;
                for(let [key, value] of this.definitions) {
                    if(body != null && body.includes(key)) {
                        console.log("body ", body, " includes key ", key);
                        if(super.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                            value = '(' + value + ')';
                            console.log("**Body: (added brackets)", value);
                        }
                        const key_text = "\\b".concat(key).concat("\\b");
                        const _key = new RegExp(key_text, "g");
                        bodyText = bodyText.replaceAll(_key, value);
                        console.log("**Body: (after substitution)", bodyText);
                        let oldSolution = solution;
                        solution = super.makeTree(bodyText).getChild(0);
                        let newCTX = this.terms[this.terms.length - 1].replace(body, bodyText);
                        if(this.terms[this.terms.length - 1] != newCTX) {
                            console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                            this.terms.push(newCTX);
                        }
                        ctx = super.makeTree(newCTX).getChild(0);
                        solution = ctx;
                        if(super.isTimeout(this.startTime, this.maxTime)) {
                            console.log("Program took too long to execute...");
                            return [null, null];
                        }
                        [param, body] = this.visit(solution);
                        if(body == null) {
                            return [null, null];
                        }
                        bodyText = body;
                        //break; 
                    }
                }

                let tmpSolution = solution;
                console.log("$$$$ tmpSolution = ", super.getTreeText(tmpSolution))
                console.log("$$$$ tmpSolution type : ", tmpSolution.constructor.name)
                let abstractionBody = body;
                console.log("$$$$ body(before) : ", body)
                if(body != null) {
                    while(tmpSolution instanceof LambdaParser.AbstractionContext) {
                        [param, bodyText] = this.visit(tmpSolution);
                        abstractionBody = super.makeTree(bodyText).getChild(0);
                        console.log("$$$$ body : ", super.getTreeText(abstractionBody))
                        console.log("$$$$ body type : ", abstractionBody.constructor.name)
                        tmpSolution = abstractionBody;
                    }
                }

                if(body != null /* && body != super.getTreeText(abstractionBody) */) {
                    console.log("???? body : ", super.getTreeText(abstractionBody))
                    console.log("???? body type : ", abstractionBody.constructor.name)
                    while(abstractionBody instanceof LambdaParser.ApplicationContext) {
                        console.log("VISITING BODY")
                        abstractionBody = this.visit(abstractionBody);
                        //console.log("abtractionBody:", super.getTreeText(abstractionBody));
                        let newSolutionText = super.getTreeText(solution).replace(super.getTreeText(tmpSolution), super.getTreeText(abstractionBody));
                        solution = super.makeTree(newSolutionText);
                        if(this.terms[this.terms.length - 1] != newSolutionText) {
                            console.log("☺☺ pushing > ☺☺ '", newSolutionText, "'");
                            this.terms.push(newSolutionText);
                        }
                    }
                }

                /* let bodyCTX = solution.getChild(3).getChild(0);
                while(bodyCTX != null  && bodyCTX instanceof LambdaParser.AbstractionContext) {
                    [param, body] = this.visit(bodyCTX);
                    bodyCTX = bodyCTX.getChild(3).getChild(0);
                    if(bodyCTX != null && bodyCTX instanceof LambdaParser.ApplicationContext) {
                        let newBody = this.visit(bodyCTX);
                        let newCTX = this.terms[this.terms.length - 1].replace(body, newBody);
                        if(this.terms.length < this.maximumSteps){
                            this.terms.push(newCTX);
                        } else {
                            console.log("Recursion");
                            return null;
                        }
                    }
                } */
            }
            /* let leftChild = solution.getChild(0);
            if(leftChild.getText() == '(') {
                leftChild = solution.getChild(1).getChild(0);
            }
            console.log("°°°°°Term leftChild: ", super.getTreeText(leftChild));
            if(leftChild != null && this.definitions.has(super.getTreeText(leftChild))) {
                let value = super.makeTree(this.definitions.get(super.getTreeText(leftChild)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    this.terms.push(super.getTreeText(solution));
                    console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
                    console.log("SOLUTION: ", super.getTreeText(solution), "type: ", solution.constructor.name);
                }
            } */
        }
        // in case of recursion visit functions will return null
        if(solution == null) {
            console.log("Recursion");
            // return last added term as a solution
            return [this.terms[this.terms.length - 1], this.terms, true];
        }
        // remove excess brackets
        if(solution.getChild(0) != null && solution.getChild(0).getText() == '(' && solution.getChild(1) != null && solution.getChild(1) instanceof LambdaParser.AbstractionContext) {
            console.log("!solution has brackets")
            solution = solution.getChild(1);
            console.log("new solution: ", super.getTreeText(solution))
            if(this.terms[this.terms.length - 1] != super.getTreeText(solution)) {
                console.log("☺☺ pushing > ☺☺ '", super.getTreeText(solution), "'");
                this.terms.push(super.getTreeText(solution));
            }
        }
        
        return [super.getTreeText(solution), this.terms];
	}

    // Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx) {
        if(ctx.getText() == '(') {
            ctx = ctx.getChild(1).getChild(0);
        }
        console.log("CTX: ", super.getTreeText(ctx));
        let param = null;
        let body = null;
        if(ctx.VARIABLE()) {
            //console.log("In Abstraction: ", ctx.getChild(1).getText());
            param = ctx.VARIABLE().getText();
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope == '(') {
                bodyScope = ctx.getChild(3).getChild(1);
            }
            console.log("*>* bodyScope type: ", bodyScope.constructor.name, ", (bodyScope= ", super.getTreeText(bodyScope));

            body = super.getTreeText(bodyScope);

            // add brackets if body is abstraction
            /* if(bodyScope instanceof LambdaParser.AbstractionContext) {
                if(body.charAt(0) != '(') {
                    body = '(' + body + ')';
                }
            } */
            
            console.log("> BODY: ", body);
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
            console.log("eleminimated brackets....")
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
                console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
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
                console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                this.terms.push(newCTX);
            }
        }
        console.log("LEFT CHILD: ", super.getTreeText(leftChild), "; ", leftChild.constructor.name);
        //console.log("-> leftChild.getChild(0)", super.getTreeText(leftChild.getChild(0)));
        //console.log("--> leftChild.getChild(0).getChild(0) is null? ", leftChild.getChild(0).getChild(0) == null);
        console.log("RIGHT CHILD: ", super.getTreeText(rightChild), "; ", rightChild.constructor.name);

        // if left child is application, go deeper in tree
        if(leftChild.getChild(0) == '(') {
            leftChild = leftChild.getChild(1);
            brackets = true;
        }
        let leftChildText = super.getTreeText(leftChild);
        console.log("**Left Child: (before substitution)", leftChildText);
        
        if(!(leftChild instanceof LambdaParser.AbstractionContext) && !(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext)) {
            console.log()
            let left = leftChildText;
            if(leftChild.getChild(1) != null) {
                left = super.getTreeText(leftChild.getChild(0));
            }
            for(let [key, value] of this.definitions) {
                if(left.includes(key)) {
                    if(super.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                        value = '(' + value + ')';
                        console.log("**Left Child: (added brackets)", value);
                    }
                    const key_text = "\\b".concat(key).concat("\\b");
                    const _key = new RegExp(key_text, "g");
                    leftChildText = leftChildText.replaceAll(_key, value);
                    console.log("**Left Child: (after substitution)", leftChildText);
                    let oldLeftChild = leftChild;
                    leftChild = super.makeTree(leftChildText).getChild(0);
                    let newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldLeftChild), leftChildText);
                    console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                    this.terms.push(newCTX);
                    ctx = super.makeTree(newCTX).getChild(0);
                    break; 
                }
            }
            console.log()
        }
        while(leftChild instanceof LambdaParser.ApplicationContext 
            && ((leftChild.getChild(0) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
            || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            console.log(super.getTreeText(oldLeftChild), " = ", super.getTreeText(leftChild));
            console.log("<UPDATING OLD CHILD...");
            if(super.isTimeout(this.startTime, this.maxTime)) {
                console.log("Program took too long to execute...");
                return null;
            }
            let oldTerm = this.terms[this.terms.length - 1];
            leftChild = this.visit(leftChild);
            if(leftChild == null) {
                return null;
            }
            console.log("oldLeftChild: ", super.getTreeText(oldLeftChild), ", newLeftChild: ", super.getTreeText(leftChild));
            console.log("CTX: ", super.getTreeText(ctx));
            console.log("CHANGING THIS TERM: ", oldTerm);
            console.log("REPLACING: ", super.getTreeText(oldLeftChild), "WITH: ", super.getTreeText(leftChild));
            let leftChildText = super.getTreeText(leftChild); 
            console.log("leftChild before adding brackets = ", leftChildText);
            if(leftChild instanceof LambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
                leftChildText = "(" + leftChildText + ")";
            }
            console.log("leftChild after adding brackets = ", leftChildText);
            //brackets = (leftChild.getChild(0).getText() == '(');
            console.log("Do I have brackets? ", brackets);
            console.log("in term ", oldTerm, " replace '", super.getTreeText(oldLeftChild), "' with '", leftChildText, "'")
            let newCTX = oldTerm.replace(super.getTreeText(oldLeftChild), leftChildText);
            console.log(super.getTreeText(leftChild), " + ", super.getTreeText(rightChild), " = ", newCTX);
            //let newCTX = super.getTreeText(ctx).replace(super.getTreeText(oldLeftChild), leftChildText);
            console.log("NEW CTX: ", newCTX);
            console.log("NEW CTX: ", newCTX);
            console.log("REPLACING: ", super.getTreeText(oldLeftChild), "WITH: ", leftChildText, " - IN: ", this.terms[this.terms.length - 1]);
            ctx = super.makeTree(super.getTreeText(ctx).replace(super.getTreeText(oldLeftChild), leftChildText)).getChild(0);
            console.log("-----------ctx---------", super.getTreeText(ctx));
            //leftChild = ctx.getChild(0);
            //rightChild = ctx.getChild(1);
            if(rightChild instanceof LambdaParser.TermContext) {
                rightChild = rightChild.getChild(0);
            }
            //rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
            if((leftChild instanceof LambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')) {
                    console.log("leftChild = ", super.getTreeText(leftChild), ", rightChild = ", super.getTreeText(rightChild));
                    console.log("leftChild = ", leftChild.constructor.name, ", rightChild = ", rightChild.constructor.name);
                console.log("<< removing ()");
                let oldLeftChildText = super.getTreeText(leftChild);
                leftChild = leftChild.getChild(1);
                newCTX = super.getTreeText(ctx).replace(oldLeftChildText, super.getTreeText(leftChild));
                ctx = super.makeTree(newCTX).getChild(0);
                //rightChild = ctx.getChild(0).getChild(1).getChild(1);
                //rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
            }
            console.log("leftChild = ", super.getTreeText(leftChild), ", rightChild = ", super.getTreeText(rightChild));
            if(this.terms[this.terms.length - 1] != newCTX) {
                console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                this.terms.push(newCTX);
            } /* else {
                console.log("Recursion");
                return null;
            } */
            /* if(this.terms.length > this.s) {
                console.log("Recursion");
                return null;
            } */
            console.log("•(line 260)• Adding new term: ", this.terms[this.terms.length - 1]);
            /* console.log("new ctx: ", this.terms[this.terms.length - 1], super.makeTree(this.terms[this.terms.length - 1]).constructor.name);
            leftChild = super.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(0);
            rightChild = super.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(1); */
            if(rightChild instanceof LambdaParser.TermContext) {
                rightChild = rightChild.getChild(0);
            }
            console.log("leftChild = ", super.getTreeText(leftChild), ", rightChild = ", super.getTreeText(rightChild));
            if(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
            //let newChild = leftChild.getChild(0);
            if(leftChild instanceof LambdaParser.AbstractionContext) {
                //console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.getText());
            }
        }
        let [param, body] = [null, null];
       
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
            console.log("Left side is not Abstraction");
            let newCTX = super.getTreeText(leftChild).concat(' ').concat(super.getTreeText(rightChild));
            return super.makeTree(newCTX);
        }
        
        //if left child is finally abstraction, apply value from right child to body
        //if(leftChild instanceof LambdaParser.AbstractionContext) {
        let abstraction = leftChild;
        if(abstraction.getChild(0) != null && super.getTreeText(abstraction.getChild(0)) == '(') {
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
        if(super.makeTree(body).getChild(0) instanceof LambdaParser.AbstractionContext) {
            if(super.makeTree(body).getChild(0).getChild(0) != null && super.makeTree(body).getChild(0).getChild(0).getText() != '(') {
                body = '(' + body + ')';
            }
        }
        console.log("Param: ", param, ", Body: ", body, "Of: ", super.getTreeText(abstraction));
        //console.log(rightChild.getChild(0).constructor.name);
        let value = super.getTreeText(rightChild);
        console.log("*** before: (leftChild): ", super.getTreeText(leftChild), ", ", leftChild.constructor.name);
        console.log("*** before: (rightChild): ", super.getTreeText(rightChild), ", ", rightChild.constructor.name);
        while(rightChild instanceof LambdaParser.ApplicationContext) {
            // if the leftChild is variable or variable inside brackets, don't apply reduction
            if(rightChild.getChild(0).getText() == '(' 
                && rightChild.getChild(1).getChild(0).getChild(0) == null && rightChild.getChild(1).getChild(0) == null 
                && rightChild.getChild(2) != null &&  rightChild.getChild(2).getText() == ')'
                || rightChild.getChild(0).getText() != '(' && rightChild.getChild(0).getChild(0) == null
                && rightChild.getChild(1) == null) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(super.getTreeText(rightChild))
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                value = super.getTreeText(rightChild);
                break;
            }
            console.log("♠ rightChild: ", super.getTreeText(rightChild));
            console.log("♠ rightChild.constructor: ", rightChild.constructor.name);
            console.log("~~ evaluating right child: ", super.getTreeText(rightChild));
            let oldRightChild = rightChild;
            console.log("--oldRightChild: ", super.getTreeText(oldRightChild));
            if(super.isTimeout(this.startTime, this.maxTime)) {
                console.log("Program took too long to execute...");
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
                console.log(super.getTreeText(oldRightChild), "-", oldRightChild.constructor.name);
                value = '(' + value + ')';
                console.log("VALUE: ", value);
            }
            console.log("oldRightChild: ", super.getTreeText(oldRightChild), ", newRightChild: ", super.getTreeText(rightChild));
            console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
            console.log("REPLACING: ", super.getTreeText(oldRightChild), "WITH: ", value);
            console.log("NEW CTX:= ", super.getTreeText(ctx).replace(super.getTreeText(oldRightChild), value));
            // right child cannot evaluated any more
            if(super.getTreeText(oldRightChild) == value) {
                break;
            }
            /* let oldRightChildText = super.getTreeText(oldRightChild);
            let oldCtx = this.terms[this.terms.length - 1];
            let newCTX = oldCtx.replace(oldRightChildText, value);
            console.log("newCTX= ", newCTX);
            ctx = super.makeTree(newCTX);
            //leftChild = ctx.getChild(0);
            rightChild = ctx.getChild(0).getChild(1);
            value = super.getTreeText(rightChild);
        
            console.log("--RightChild: ", value);
            newCTX = this.terms[this.terms.length - 1].replace(super.getTreeText(oldRightChild), value);
            console.log("newCTX = ", this.terms[this.terms.length - 1], "replaced by: ", newCTX);
            console.log("newCTX = ", super.getTreeText(oldRightChild), "replaced by:(val) ", value);
            console.log("VALUE: ", value);
            if(this.terms[this.terms.length - 1] == newCTX) {
                break;
            }
            this.terms.push(newCTX);
            console.log("•(line 339)• Adding new term: ", this.terms[this.terms.length - 1]);
            console.log("*** inside: (rightChild): ", super.getTreeText(rightChild), ", ", rightChild.constructor.name); */

            let oldRightChildText = super.getTreeText(oldRightChild);
                //let oldCtx = this.terms[this.terms.length - 1];
                let newRightChild = oldRightChildText.replace(oldRightChildText, value);
                rightChild = super.makeTree(newRightChild);
                console.log("newRIGHTchild = ", super.getTreeText(rightChild));
                let newCTX = oldTerm.replace(oldRightChildText, value);
                console.log("newCTX= ", newCTX);
                if(this.terms[this.terms.length - 1] != newCTX) {
                    console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                    this.terms.push(newCTX);
                    //console.log("•(line 339)• Adding new term: ", this.terms[this.terms.length - 1]);
                    //break;
                }
                console.log("*** inside: (rightChild): ", super.getTreeText(rightChild), ", ", rightChild.constructor.name);
                if(rightChild instanceof LambdaParser.TermContext && rightChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    rightChild = rightChild.getChild(0);
                }
        }

        let val = value;
        let valueTree = super.makeTree(val).getChild(0);
        // if value is abstraction
        if(valueTree instanceof LambdaParser.AbstractionContext) {
            if(valueTree.getChild(0).getText() == '(') {
                valueTree = valueTree.getChild(1);
            }
            console.log("is abstraction")
            let p;
            [val, p] = this.visitAbstraction(valueTree);
        }

        // check if value is contained as a free variable in function body
        if(param != val) {
            console.log("param: ", param, "~ value: ", val);
            // check if alpha conversion is needed
            console.log("param: ", param, "~~ value: ", val);
            // replace every occurence of right side param in body with param0
            const reg_text_lambda = "\\b".concat('lambda').concat(val).concat("\\b");
            const reg_lambda = new RegExp(reg_text_lambda, "g");
            let lambdavalue0 = "lambda" + val + 0;
            let oldBody = body;
            let newBody = body;
            newBody = newBody.replaceAll(reg_lambda, lambdavalue0);
            // replace only bound variables in function body
            if(newBody != oldBody) {
                const reg_text_val = "\\b".concat(val).concat("\\b");
                const reg_val = new RegExp(reg_text_val, "g");
                let value0 = val + "0";
                console.log("< Body(alfa): ", body, " > Value: ", value0);
                newBody = newBody.replaceAll(reg_val, value0);
                let newCTX = this.terms[this.terms.length - 1].replace(oldBody, newBody);
                if(this.terms[this.terms.length - 1] != newCTX) {
                    console.log("☺☺ pushing > ☺☺ '", newCTX, "'");
                    this.terms.push(newCTX);
                }
                body = newBody;
            }
        }

        // using regex so that no substrings are replaced
        const reg_text = "\\b".concat(param).concat("\\b");
        const reg = new RegExp(reg_text, "g");
        console.log("< Body: ", body, " > Value: ", value);
        body = body.replaceAll(reg, value);
        body = body + excessRightChild;

        console.log("NEW Body: ", body);
        let tree = super.makeTree(body);
        console.log("tree: ", body);
        if(tree.getChild(0) instanceof LambdaParser.AbstractionContext) {
            tree = tree.getChild(0);
        }
        
        return tree;
        //}
	}

    // Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx) {
        ctx = ctx.getChild(0);
        console.log(super.getTreeText(ctx.getChild(0)), " = ", super.getTreeText(ctx.getChild(2)));
        console.log(super.getTreeText(ctx));
        //this.definitions.set(super.getTreeText(ctx.getChild(0)), super.getTreeText(ctx.getChild(2)));
        //console.log(ctx.getChild(2).getChild(0).constructor.name);
        //console.log()
        return [[super.getTreeText(ctx.getChild(0)), super.getTreeText(ctx.getChild(2))], null];
	}

}