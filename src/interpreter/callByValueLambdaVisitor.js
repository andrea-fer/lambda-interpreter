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
        this.maximumSteps = 20;
        this.definitions = definitions;
    }
    // Visit a parse tree produced by LambdaParser#redex.
	visitRedex(ctx) {
        console.log("*****Redex is: ", ctx.getText());
        console.log("Redex type is: ", ctx.constructor.name);
        console.log("-------------------");
        ctx = ctx.getChild(0);
	    return this.visitTerm(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx) {
        console.log("-------------------Call By Value----------------")
        console.log("°°TERM IS : ", this.getBodyText(ctx));
        if(ctx.getChild(0) instanceof LambdaParser.DefinitionContext) {
            return this.visitDefinition(ctx);
        }

        let solution = ctx;
        console.log("SOLUTION: ", this.getBodyText(ctx), "type: ", solution.constructor.name);
        
        while(solution.getChild(0) instanceof LambdaParser.ApplicationContext) {
            console.log("Solution parent: ", this.getBodyText(solution), ", type: ", solution.constructor.name);
            solution = this.visitApplication(solution.getChild(0));
            // removing unnecessary brackets
            if(solution.getChild(0).getChild(0) != null && solution.getChild(0).getChild(0).getText() == "(" 
            && solution.getChild(0).getChild(2) != null && solution.getChild(0).getChild(2).getText() == ")") {
                //let solutionWObrackets = this.getBodyText(solution).slice(1, this.getBodyText(solution).length - 1);
                console.log("============================REMOVING BRACKETS");
                //solution = this.makeTree(solutionWObrackets);
                solution = this.makeTree(this.getBodyText(solution.getChild(0).getChild(1)));
            }
            if(this.getBodyText(solution) == this.terms[this.terms.length - 1]) {
                console.log(" EVALUATION SHOULD STOP : ", this.getBodyText(solution), "==", this.terms[this.terms.length - 1]);
                break;
            }
            console.log("> SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
            this.terms.push(this.getBodyText(solution));
            console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
            console.log("SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
            //console.log("Does map contain ", this.getBodyText(solution), "?", this.definitions.has(this.getBodyText(solution)));
            if(this.definitions.has(this.getBodyText(solution))) {
                let value = this.makeTree(this.definitions.get(this.getBodyText(solution)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    this.terms.push(this.getBodyText(solution));
                    console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
                    console.log("SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
                }
            }

            if(solution instanceof LambdaParser.AbstractionContext) {
                console.log()
                console.log("is abstraction");
                console.log()
                this.visitAbstraction(solution);
            }
            /* let leftChild = solution.getChild(0);
            if(leftChild.getText() == '(') {
                leftChild = solution.getChild(1).getChild(0);
            }
            console.log("°°°°°Term leftChild: ", this.getBodyText(leftChild));
            if(leftChild != null && this.definitions.has(this.getBodyText(leftChild))) {
                let value = this.makeTree(this.definitions.get(this.getBodyText(leftChild)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    this.terms.push(this.getBodyText(solution));
                    console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
                    console.log("SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
                }
            } */
        }
        return [this.getBodyText(solution), this.terms];
	}

    // Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx) {
        if(ctx.getText() == '(') {
            ctx = ctx.getChild(1).getChild(0);
        }
        console.log("CTX: ", this.getBodyText(ctx));
        let param = null;
        let body = null;
        if(ctx.VARIABLE()) {
            //console.log("In Abstraction: ", ctx.getChild(1).getText());
            param = ctx.VARIABLE().getText();
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope == '(') {
                bodyScope = ctx.getChild(3).getChild(1);
            }
            console.log("*>* bodyScope type: ", bodyScope.constructor.name, ", (bodyScope= ", this.getBodyText(bodyScope));

            body = this.getBodyText(bodyScope);

            /* if(bodyScope instanceof LambdaParser.AbstractionContext) {
                for(let [key, value] of this.definitions) {
                    if(body.includes(key)) {
                        body = this.getBodyText(this.visit(bodyScope));
                    }
                }
            }    */
            
            console.log("> BODY: ", body);
        }
        return [param, body];

        //return this.visitChildren(ctx);
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
        console.log("LEFT CHILD: ", this.getBodyText(leftChild), "; ", leftChild.constructor.name);
        //console.log("-> leftChild.getChild(0)", this.getBodyText(leftChild.getChild(0)));
        //console.log("--> leftChild.getChild(0).getChild(0) is null? ", leftChild.getChild(0).getChild(0) == null);
        console.log("RIGHT CHILD: ", this.getBodyText(rightChild));

        // if left child is application, go deeper in tree
        if(leftChild.getChild(0) == '(') {
            leftChild = leftChild.getChild(1);
            brackets = true;
        }
        let leftChildText = this.getBodyText(leftChild);
        console.log("**Left Child: (before substitution)", leftChildText);
        
        if(!(leftChild instanceof LambdaParser.AbstractionContext) && !(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext)) {
            console.log()
            let left = leftChildText;
            if(leftChild.getChild(1) != null) {
                left = this.getBodyText(leftChild.getChild(0));
            }
            for(let [key, value] of this.definitions) {
                if(left.includes(key)) {
                    if(this.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                        value = '(' + value + ')';
                        console.log("**Left Child: (added brackets)", value);
                    }
                    const key_text = "\\b".concat(key).concat("\\b");
                    const _key = new RegExp(key_text, "g");
                    leftChildText = leftChildText.replaceAll(_key, value);
                    console.log("**Left Child: (after substitution)", leftChildText);
                    let oldLeftChild = leftChild;
                    leftChild = this.makeTree(leftChildText).getChild(0);
                    let newCTX = this.terms[this.terms.length - 1].replace(this.getBodyText(oldLeftChild), leftChildText);
                    this.terms.push(newCTX);
                    ctx = this.makeTree(newCTX).getChild(0);
                    break; 
                }
            }
            console.log()
        }
        while(leftChild instanceof LambdaParser.ApplicationContext 
            && ((leftChild.getChild(0) instanceof LambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
            || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            console.log(this.getBodyText(oldLeftChild), " = ", this.getBodyText(leftChild));
            console.log("<UPDATING OLD CHILD...");
            leftChild = this.visitApplication(leftChild);
            console.log("oldLeftChild: ", this.getBodyText(oldLeftChild), ", newLeftChild: ", this.getBodyText(leftChild));
            console.log("CTX: ", this.getBodyText(ctx));
            console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
            console.log("REPLACING: ", this.getBodyText(oldLeftChild), "WITH: ", this.getBodyText(leftChild));
            let leftChildText = this.getBodyText(leftChild); 
            if(leftChild instanceof LambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
                leftChildText = "(" + leftChildText + ")";
            }
            brackets = (leftChild.getChild(0).getText() == '(');
            console.log("Do I have brackets? ", brackets);
            let newCTX = this.terms[this.terms.length - 1].replace(this.getBodyText(oldLeftChild), leftChildText);
            console.log(this.getBodyText(leftChild), " + ", this.getBodyText(rightChild), " = ", newCTX);
            //let newCTX = this.getBodyText(ctx).replace(this.getBodyText(oldLeftChild), leftChildText);
            console.log("NEW CTX: ", newCTX);
            console.log("NEW CTX: ", newCTX);
            console.log("REPLACING: ", this.getBodyText(oldLeftChild), "WITH: ", leftChildText, " - IN: ", this.terms[this.terms.length - 1]);
            ctx = this.makeTree(newCTX).getChild(0);
            leftChild = ctx.getChild(0);
            rightChild = ctx.getChild(1);
            //rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
            if((leftChild instanceof LambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')) {
                    console.log("leftChild = ", this.getBodyText(leftChild), ", rightChild = ", this.getBodyText(rightChild));
                    console.log("leftChild = ", leftChild.constructor.name, ", rightChild = ", rightChild.constructor.name);
                console.log("<< removing ()");
                let oldLeftChildText = this.getBodyText(leftChild);
                leftChild = ctx.getChild(0).getChild(1);
                newCTX = newCTX.replace(oldLeftChildText, this.getBodyText(leftChild));
                ctx = this.makeTree(newCTX).getChild(0);
                //rightChild = ctx.getChild(0).getChild(1).getChild(1);
                //rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
            }
            console.log("leftChild = ", this.getBodyText(leftChild), ", rightChild = ", this.getBodyText(rightChild));
            if(this.terms[this.terms.length - 1] != newCTX) {
                this.terms.push(newCTX);
            }
            console.log("•(line 260)• Adding new term: ", this.terms[this.terms.length - 1]);
            console.log("new ctx: ", this.terms[this.terms.length - 1], this.makeTree(this.terms[this.terms.length - 1]).constructor.name);
            leftChild = this.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(0);
            rightChild = this.makeTree(this.terms[this.terms.length - 1]).getChild(0).getChild(1);
            console.log("leftChild = ", this.getBodyText(leftChild), ", rightChild = ", this.getBodyText(rightChild));
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
            let newCTX = this.getBodyText(leftChild).concat(' ').concat(this.getBodyText(rightChild));
            return this.makeTree(newCTX);
        }
        
        //if left child is finally abstraction, apply value from right child to body
        //if(leftChild instanceof LambdaParser.AbstractionContext) {
            let abstraction = leftChild;
            if(this.getBodyText(abstraction.getChild(0)) == '(') {
                abstraction = abstraction.getChild(1);
            }
            [param, body] = this.visitAbstraction(abstraction);
            console.log("Param: ", param, ", Body: ", body, "Of: ", this.getBodyText(abstraction));
            //console.log(rightChild.getChild(0).constructor.name);
            let value = this.getBodyText(rightChild);
            console.log("*** before: (leftChild): ", this.getBodyText(leftChild), ", ", leftChild.constructor.name);
            console.log("*** before: (rightChild): ", this.getBodyText(rightChild.getChild(0)), ", ", rightChild.getChild(0).constructor.name);
            while(rightChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                // if the leftChild is Variable, don't apply reduction
                if(rightChild.getChild(0).getChild(0).getText() == '(' && rightChild.getChild(0).getChild(1).getChild(0).getChild(0) == null
                    || rightChild.getChild(0).getChild(0).getText() != '(' && rightChild.getChild(0).getChild(0).getChild(0) == null) {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    console.log(this.getBodyText(rightChild.getChild(0)))
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    value = this.getBodyText(rightChild);
                    break;
                }
                console.log("♠ rightChild.getChild(0): ", this.getBodyText(rightChild.getChild(0)));
                console.log("♠ rightChild.constructor: ", rightChild.getChild(0).constructor.name);
                console.log("~~ evaluating right child: ", this.getBodyText(rightChild));
                let oldRightChild = rightChild.getChild(0);
                console.log("--oldRightChild: ", this.getBodyText(oldRightChild));
                rightChild = this.visitApplication(rightChild.getChild(0));
                value = this.getBodyText(rightChild);
                if(oldRightChild instanceof LambdaParser.ApplicationContext && !(oldRightChild.getChild(0) instanceof LambdaParser.TermContext) 
                && oldRightChild.getChild(0).getText() == '(' && oldRightChild.getChild(2).getText() == ')' && this.makeTree(value).getChild(0).getChild(0) != null) {
                    console.log(this.getBodyText(oldRightChild), "-", oldRightChild.constructor.name);
                    value = '(' + value + ')';
                    console.log("VALUE: ", value);
                }
                console.log("oldRightChild: ", this.getBodyText(oldRightChild), ", newRightChild: ", this.getBodyText(rightChild));
                console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
                console.log("REPLACING: ", this.getBodyText(oldRightChild), "WITH: ", value);
                console.log("NEW CTX:= ", this.getBodyText(ctx).replace(this.getBodyText(oldRightChild), value));
                let oldRightChildText = this.getBodyText(oldRightChild);
                let oldCtx = this.terms[this.terms.length - 1];
                let newCtx = oldCtx.replace(oldRightChildText, value);
                console.log("newCTX= ", newCtx);
                ctx = this.makeTree(newCtx);
                //leftChild = ctx.getChild(0);
                rightChild = ctx.getChild(0).getChild(1);
                value = this.getBodyText(rightChild);
            
                console.log("--RightChild: ", value);
                newCtx = this.terms[this.terms.length - 1].replace(this.getBodyText(oldRightChild), value);
                console.log("newCTX = ", this.terms[this.terms.length - 1], "replaced by: ", newCtx);
                console.log("newCTX = ", this.getBodyText(oldRightChild), "replaced by:(val) ", value);
                console.log("VALUE: ", value);
                if(this.terms[this.terms.length - 1] == newCtx) {
                    break;
                }
                this.terms.push(newCtx);
                console.log("•(line 339)• Adding new term: ", this.terms[this.terms.length - 1]);
                console.log("*** inside: (rightChild): ", this.getBodyText(rightChild), ", ", rightChild.constructor.name);
            }

            // using regex so that no substrings are replaced
            const reg_text = "\\b".concat(param).concat("\\b");
            const reg = new RegExp(reg_text, "g");
            console.log("< Body: ", body, " > Value: ", value);
            body = body.replaceAll(reg, value);

            console.log("NEW Body: ", body);
            let tree = this.makeTree(body);
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
        console.log(this.getBodyText(ctx.getChild(0)), " = ", this.getBodyText(ctx.getChild(2)));
        console.log(this.getBodyText(ctx));
        //this.definitions.set(this.getBodyText(ctx.getChild(0)), this.getBodyText(ctx.getChild(2)));
        //console.log(ctx.getChild(2).getChild(0).constructor.name);
        //console.log()
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