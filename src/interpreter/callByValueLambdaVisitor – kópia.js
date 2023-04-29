import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "./LambdaLexer.js";
import LambdaVisitor from "./LambdaVisitor.js";
import LambdaParser from "./LambdaParser.js";

// Tree Traverser Class
export default class MyLambdaVisitor extends LambdaVisitor {

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
        ctx = ctx.getChild(0);
	    return this.visitTerm(ctx);
	}

	// Visit a parse tree produced by LambdaParser#term.
	visitTerm(ctx) {
        console.info("°°IN TERM°°");
        console.log("TERM IS : ", this.getBodyText(ctx));
        /* console.log(ctx.getChild(0).getChild(0).getChild(0) == null);
        console.log("Child(0) of ", ctx.getChild(0).getChild(0).getText(), " is null?");
        console.log(ctx.getChild(0).getChild(1).getChild(0).getChild(0) == null);
        console.log("Child(0) of ", ctx.getChild(0).getChild(1).getChild(0).getText(), " is null?");
        console.log(ctx.getChild(0).getText(), " -> ", ctx.getChild(0).VARIABLE().getText());
        console.log(ctx.getChild(0).getText(), " -> ", ctx.getChild(0).getChild(1).VARIABLE().getText());
        return [this.terms[0], this.terms]; */
        /* if(ctx.getChild(0).getText() == '(') {
            this.visitTerm(ctx.getChild(1));
        } */
        if(ctx.getChild(0) instanceof LambdaParser.DefinitionContext) {
            /* this.visitDefinition(ctx);
            let defs = [];
            for(let [key, value] of this.definitions) {
                console.log(value);
                defs.push(value);
            }
            return [this.getBodyText(ctx), defs]; */
            return this.visitDefinition(ctx);
        }

        /* for(let [key, value] of this.definitions) {
            console.log("°", key, ":", value, "°");
        } */

        let solution = ctx;
        console.log("SOLUTION: ", this.getBodyText(ctx), "type: ", solution.constructor.name);
        
        /* console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).constructor.name);
        console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).getText()); */
        while(solution.getChild(0) instanceof LambdaParser.ApplicationContext) {
            console.log("Solution parent: ", this.getBodyText(solution), ", type: ", solution.constructor.name);
            solution = this.visitApplication(solution.getChild(0));
            if(this.getBodyText(solution) == this.terms[this.terms.length - 1]) {
                console.log(" EVALUATION SHOULD STOP : ", this.getBodyText(solution), "==", this.terms[this.terms.length - 1]);
                break;
            }
            this.terms.push(this.getBodyText(solution));
            console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
            console.log("SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
            /* console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).constructor.name);
            console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).getText()); */
            /* if(solution.getChild(0).getChild(0) != null && !(solution.getChild(0).getChild(0) instanceof LambdaParser.AbstractionContext)) {
                break;
            } */
            /* let solutionText = this.getBodyText(solution);
            for(let [key, v] of this.definitions) {
                if(solutionText.includes(key)) {
                    const key_text = "\\b".concat(key).concat("\\b");
                    console.log("NEW Body: (before substitution)", solutionText);
                    const _key = new RegExp(key_text, "g");
                    solutionText = solutionText.replaceAll(_key, v);
                    // push to terms
                    this.terms.push(solutionText);
                }
            }
            solution = this.makeTree(solutionText);
            console.log("SUBSITUTIN: ", solutionText, "tpe: ", solution.constructor.name); */
        }

        //this.terms.push(solution.getText());
        //console.log(this.terms);
        //console.log("FINAL term type: ", solution.constructor.name);
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
            //body = ctx.getChild(3).getText();
            //console.info("Abstraction body: ", body);
            //console.info(ctx.getChild(3).getChild(0).constructor.name);
            //console.info("Abstraction parameter: ", param);
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope == '(') {
                bodyScope = ctx.getChild(3).getChild(1);
            }
            //if(bodyScope instanceof LambdaParser.AbstractionContext) {
                //console.log("Child parameter: ", this.visit(ctx.getChild(3).getChild(0))[0]);
                //let b = bodyScope.getChild(3).getText();
                //console.info("Child body: ", b);
                //bodyScope = bodyScope.getChild(3).getChild(0);
            //}
            console.log("*>* bodyScope type: ", bodyScope.constructor.name, ", (bodyScope= ", this.getBodyText(bodyScope));
            /* if(bodyScope instanceof LambdaParser.ApplicationContext) {
                body = bodyScope.getChild(0).getText().concat(' ').concat(bodyScope.getChild(1).getText());
            } else if(bodyScope.getChild(0) && bodyScope instanceof LambdaParser.TermContext && bodyScope.getChild(0) instanceof ApplicationContext) {
                body = bodyScope.getChild(0).getChild(0).getText().concat(' ').concat(bodyScope.getChild(0).getChild(1).getText());
            }
            else  {
                body = bodyScope.getText();
            } */

            body = this.getBodyText(bodyScope);
            
            console.log("> BODY: ", body);
        }
        return [param, body];

        //return this.visitChildren(ctx);
	}

    getBodyText(body) {
        if(body == null) {
            return;
        }
        if(body instanceof LambdaParser.TermContext) {
            body = body.getChild(0);
        }
        let brackets = false;
        if(body.getChild(0) != null  && body.getChild(0).getText() == '(') {
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
            //console.log("bodyText: ", bodyText);
            return bodyText; 
        }
        if(body instanceof LambdaParser.AbstractionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(body.getChild(2).getText()).concat(this.getBodyText(body.getChild(3)));
            if(brackets) {
                bodyText = '('.concat(bodyText).concat(')');
            }
            //console.log("bodyText: ", bodyText);
            return bodyText;
        }

        if(body instanceof LambdaParser.DefinitionContext) {
            let bodyText = body.getChild(0).getText().concat(body.getChild(1).getText()).concat(this.getBodyText(body.getChild(2)));
            //console.log("bodyText: ", bodyText);
            return bodyText;
        }

        if(body.getChild(0) == null) {
            //console.log("bodyText: ", body.getText());
            return body.getText();
        }

        return this.getBodyText(body.getChild(0));
        /* console.log(ctx.getChild(0).getChild(1).getChild(0).getChild(0) == null);
        if(body.VARIABLE()) {
            return body.VARIABLE().getText();
        } */
    }

	// Visit a parse tree produced by LambdaParser#application.
	visitApplication(ctx) {
        let leftChild = ctx.getChild(0);
        let rightChild = ctx.getChild(1);
        //let rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
        console.log("LEFT CHILD: ", this.getBodyText(leftChild));
        console.log("RIGHT CHILD: ", this.getBodyText(rightChild));
        let brackets = false;
        if(leftChild.getText() == '(') {
            leftChild = ctx.getChild(1).getChild(0);
            rightChild = ctx.getChild(1).getChild(1);
            console.log("new LEFT CHILD: ", this.getBodyText(leftChild));
            console.log("new RIGHT CHILD: ", this.getBodyText(rightChild));
            //rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
            brackets = true;
        }
        //let test = rightChild.getParent();
        //console.log(ctx.getChild(0).getText());
        console.log("In Child: ", this.getBodyText(leftChild), "type = ", leftChild.constructor.name);
        // if left child is application, go deeper in tree
        if(leftChild.getChild(0) == '(') {
            leftChild = leftChild.getChild(1);
        }
        let leftChildText = this.getBodyText(leftChild);
        console.log("**Left Child: (before substitution)", leftChildText);
        for(let [key, value] of this.definitions) {
            if(leftChildText.includes(key)) {
                const key_text = "\\b".concat(key).concat("\\b");
                const _key = new RegExp(key_text, "g");
                leftChildText = leftChildText.replaceAll(_key, value);
                console.log("**Left Child: (after substitution)", leftChildText);
                leftChild = this.makeTree(leftChildText).getChild(0);
                //this.terms.push(this.terms[this.terms.lenght - 1].replace(_key, value));
                //console.log("•(line 214)• Adding new term: ", this.terms[this.terms.length - 1]);
                break; 
            }
        }
        while(leftChild instanceof LambdaParser.ApplicationContext 
            && (leftChild.getChild(0) instanceof LambdaParser.ApplicationContext || leftChild.getChild(0) instanceof LambdaParser.AbstractionContext)) {
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
            if((leftChild instanceof LambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')
                && (leftChild.getChild(1).getChild(0).getChild(0) == null)) {
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
            //console.log("leftChild = ", this.getBodyText(leftChild), ", rightChild = ", this.getBodyText(rightChild));
            if(leftChild.getChild(0) instanceof LambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
            //let newChild = leftChild.getChild(0);
            if(leftChild instanceof LambdaParser.AbstractionContext) {
                //console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.getText());
            }
        }
        /* if(leftChild instanceof LambdaParser.TermContext) {
            console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.toStringTree());
            console.log("TREE 0 = ", leftChild.getChild(0).getChild(0).getText());
            console.log("TREE 1 = ", leftChild.getChild(0).getChild(1).getText());
            console.log("TREE 2 = ", leftChild.getChild(0).getChild(2).getText());
            myChild = leftChild.getChild(0);
        } else {
            console.log("CTX: ", ctx.getText(), "+ return value = ", leftChild);
        } */
        let [param, body] = [null, null];
        //console.log("LEFT CHILD TYPE: ", leftChild.constructor.name);
        //console.log("< TERM: ", leftChild.getText(), " > ", rightChild.getText());
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof LambdaParser.AbstractionContext)) {
            let newCTX = this.getBodyText(leftChild).concat(' ').concat(this.getBodyText(rightChild));
            return this.makeTree(newCTX);
        }
        
        //if left child is finally abstraction, apply value from right child to body
        //if(leftChild instanceof LambdaParser.AbstractionContext) {
            let abstraction = leftChild;
            //console.log("** LEFT CHILD = ", abstraction.getText());
            if(this.getBodyText(abstraction.getChild(0)) == '(') {
                abstraction = abstraction.getChild(1);
            }
            [param, body] = this.visitAbstraction(abstraction);
            console.log("Param: ", param, ", Body: ", body, "Of: ", this.getBodyText(abstraction));
            //console.log(rightChild.getChild(0).constructor.name);
            let value = this.getBodyText(rightChild);
            console.log("*** before: (leftChild): ", this.getBodyText(leftChild), ", ", leftChild.constructor.name);
            console.log("*** before: (rightChild): ", this.getBodyText(rightChild.getChild(0)), ", ", rightChild.getChild(0).constructor.name);
            while(rightChild.getChild(0) instanceof LambdaParser.ApplicationContext && this.maximumSteps > 0) {
                this.maximumSteps--;
                console.log("~~ evaluating right child: ", this.getBodyText(rightChild));
                let oldRightChild = rightChild.getChild(0);
                console.log("--oldRightChild: ", this.getBodyText(oldRightChild));
                rightChild = this.visitApplication(rightChild.getChild(0));
                value = this.getBodyText(rightChild);
                if(oldRightChild instanceof LambdaParser.ApplicationContext && !(oldRightChild.getChild(0) instanceof LambdaParser.TermContext) 
                && oldRightChild.getChild(0).getText() == '(' && this.makeTree(value).getChild(0).getChild(0) != null) {
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
                ctx = this.makeTree(newCtx);
                //leftChild = ctx.getChild(0);
                rightChild = ctx.getChild(0).getChild(1);
                /* if(this.getBodyText(rightChild) == '(') {
                    //leftChild = ctx.getChild(1).getChild(0);
                    console.log("HSAUFOPAJF", this.getBodyText(ctx.getChild(0)));
                    rightChild = ctx.getChild(0).getChild(2);
                    //rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
                } */
                console.log("--RightChild: ", this.getBodyText(rightChild));
                //rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
                newCtx = this.terms[this.terms.length - 1].replace(this.getBodyText(oldRightChild), value);
                if(this.terms[this.terms.length - 1] != newCtx) {
                    this.terms.push(newCtx);
                }
                console.log("•(line 339)• Adding new term: ", this.terms[this.terms.length - 1]);
                //rightChild = makeTree(this.terms[this.terms.length - 1]).getChild(0);
                //console.log("*** inside: (leftChild): ", this.getBodyText(leftChild.getChild(0)), ", ", leftChild.getChild(0).constructor.name);
                console.log("*** inside: (rightChild): ", this.getBodyText(rightChild.getChild(0)), ", ", rightChild.getChild(0).constructor.name);
            }
            /* if(value[0] == '(') {
                brackets = true;
            } */
            // using regex so that no substrings are replaced
            const reg_text = "\\b".concat(param).concat("\\b");
            const reg = new RegExp(reg_text, "g");
            console.log("< Body: ", body, " > Value: ", value);
            body = body.replaceAll(reg, value);

            /* if(!brackets) {
                body = '('+ body+ ')';
            } */
            console.log("NEW Body: ", body);
            let tree = this.makeTree(body);
            if(tree.getChild(0) instanceof LambdaParser.AbstractionContext) {
                tree = tree.getChild(0);
            }
            //console.log(">TREE PARENT: ", tree.constructor.name);
            //console.log(">TREE: ", tree.getChild(0).constructor.name);
            // return evaluated subtree to the parent
            return tree;
        //}
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

    // Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx) {
        ctx = ctx.getChild(0);
        console.log(this.getBodyText(ctx.getChild(0)), " = ", this.getBodyText(ctx.getChild(2)));
        console.log(this.getBodyText(ctx));
        //this.definitions.set(this.getBodyText(ctx.getChild(0)), this.getBodyText(ctx.getChild(2)));
        return [[this.getBodyText(ctx.getChild(0)), this.getBodyText(ctx.getChild(2))], null];
	}
}