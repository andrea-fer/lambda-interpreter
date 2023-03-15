import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "./lambdaLexer.js";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

// Tree Traverser Class
export default class myLambdaVisitor extends lambdaVisitor {

    constructor(ctx, definitions) {
        super();
        this.term = this.getBodyText(ctx);
        this.terms = [];
        this.terms.push(this.term);
        this.maximumSteps = 20;
        this.definitions = definitions;
    }
	// Visit a parse tree produced by lambdaParser#term.
	visitTerm(ctx) {
        console.log("°°TERM IS : ", this.getBodyText(ctx));
        if(ctx.getChild(0) instanceof lambdaParser.DefinitionContext) {
            return this.visitDefinition(ctx);
        }

        let solution = ctx;
        console.log("SOLUTION: ", this.getBodyText(ctx), "type: ", solution.constructor.name);
        
        while(solution.getChild(0) instanceof lambdaParser.ApplicationContext) {
            console.log("Solution parent: ", this.getBodyText(solution), ", type: ", solution.constructor.name);
            solution = this.visitApplication(solution.getChild(0));
            if(this.getBodyText(solution) == this.terms[this.terms.length - 1]) {
                console.log(" EVALUATION SHOULD STOP : ", this.getBodyText(solution), "==", this.terms[this.terms.length - 1]);
                break;
            }
            console.log("> SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
            this.terms.push(this.getBodyText(solution));
            console.log("•(line 60)• Adding new term: ", this.terms[this.terms.length - 1]);
            console.log("SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
        }
        return [this.getBodyText(solution), this.terms];
	}

    // Visit a parse tree produced by lambdaParser#abstraction.
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
            
            console.log("> BODY: ", body);
        }
        return [param, body];

        //return this.visitChildren(ctx);
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
            console.log("zatvorka");
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

	// Visit a parse tree produced by lambdaParser#application.
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
                break; 
            }
        }
        while(leftChild instanceof lambdaParser.ApplicationContext 
            && ((leftChild.getChild(0) instanceof lambdaParser.ApplicationContext && (leftChild.getChild(0).getChild(0) != null))
            || leftChild.getChild(0) instanceof lambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            console.log(this.getBodyText(oldLeftChild), " = ", this.getBodyText(leftChild));
            console.log("<UPDATING OLD CHILD...");
            leftChild = this.visitApplication(leftChild);
            console.log("oldLeftChild: ", this.getBodyText(oldLeftChild), ", newLeftChild: ", this.getBodyText(leftChild));
            console.log("CTX: ", this.getBodyText(ctx));
            console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
            console.log("REPLACING: ", this.getBodyText(oldLeftChild), "WITH: ", this.getBodyText(leftChild));
            let leftChildText = this.getBodyText(leftChild); 
            if(leftChild instanceof lambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
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
            if((leftChild instanceof lambdaParser.ApplicationContext) && (leftChild.getChild(0).getText() == '(')) {
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
            if(leftChild.getChild(0) instanceof lambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
            //let newChild = leftChild.getChild(0);
            if(leftChild instanceof lambdaParser.AbstractionContext) {
                //console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.getText());
            }
        }
        let [param, body] = [null, null];
       
        // if left side is not abstraction, we are not implementing substitution
        if(!(leftChild instanceof lambdaParser.AbstractionContext)) {
            console.log("Left side is not Abstraction");
            let newCTX = this.getBodyText(leftChild).concat(' ').concat(this.getBodyText(rightChild));
            return this.makeTree(newCTX);
        }
        
        //if left child is finally abstraction, apply value from right child to body
        //if(leftChild instanceof lambdaParser.AbstractionContext) {
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
            while(rightChild.getChild(0) instanceof lambdaParser.ApplicationContext && this.maximumSteps > 0) {
                this.maximumSteps--;
                console.log("~~ evaluating right child: ", this.getBodyText(rightChild));
                let oldRightChild = rightChild.getChild(0);
                console.log("--oldRightChild: ", this.getBodyText(oldRightChild));
                rightChild = this.visitApplication(rightChild.getChild(0));
                value = this.getBodyText(rightChild);
                if(oldRightChild instanceof lambdaParser.ApplicationContext && !(oldRightChild.getChild(0) instanceof lambdaParser.TermContext) 
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
            if(tree.getChild(0) instanceof lambdaParser.AbstractionContext) {
                tree = tree.getChild(0);
            }
           
            return tree;
        //}
	}

    // helper function for creating a subtree
    makeTree(input) {
        let chars = new InputStream(input, true);
        let lexer = new lambdaLexer(chars);
        let tokens = new CommonTokenStream(lexer);
        let parser = new lambdaParser(tokens);

        parser.buildParseTrees = true;
        return parser.term();
    }

    // Visit a parse tree produced by lambdaParser#definition.
	visitDefinition(ctx) {
        ctx = ctx.getChild(0);
        console.log(this.getBodyText(ctx.getChild(0)), " = ", this.getBodyText(ctx.getChild(2)));
        console.log(this.getBodyText(ctx));
        //this.definitions.set(this.getBodyText(ctx.getChild(0)), this.getBodyText(ctx.getChild(2)));
        return [[this.getBodyText(ctx.getChild(0)), this.getBodyText(ctx.getChild(2))], null];
	}
}