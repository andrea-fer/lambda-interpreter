import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "./lambdaLexer.js";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

// Tree Traverser Class
export default class myLambdaVisitor extends lambdaVisitor {

    constructor(ctx) {
        super();
        this.term = this.getBodyText(ctx);
        this.terms = [];
        this.terms.push(this.term);
    }
	// Visit a parse tree produced by lambdaParser#term.
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
        let solution = ctx;
        console.log("SOLUTION: ", this.getBodyText(ctx), "type: ", solution.constructor.name);
        /* console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).constructor.name);
        console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).getText()); */
        while(solution.getChild(0) instanceof lambdaParser.ApplicationContext) {
            solution = this.visitApplication(solution.getChild(0));
            if(this.getBodyText(solution) == this.terms[this.terms.length - 1]) {
                console.log(" EVALUATION SHOULD STOP : ", this.getBodyText(solution), "==", this.terms[this.terms.length - 1]);
                break;
            }
            this.terms.push(this.getBodyText(solution));
            console.log("SOLUTION: ", this.getBodyText(solution), "type: ", solution.constructor.name);
            /* console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).constructor.name);
            console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).getText()); */
            /* if(solution.getChild(0).getChild(0) != null && !(solution.getChild(0).getChild(0) instanceof lambdaParser.AbstractionContext)) {
                break;
            } */
        }
        //this.terms.push(solution.getText());
        //console.log(this.terms);
        //console.log("FINAL term type: ", solution.constructor.name);
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
            //body = ctx.getChild(3).getText();
            //console.info("Abstraction body: ", body);
            //console.info(ctx.getChild(3).getChild(0).constructor.name);
            //console.info("Abstraction parameter: ", param);
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope == '(') {
                bodyScope = ctx.getChild(3).getChild(1);
            }
            //if(bodyScope instanceof lambdaParser.AbstractionContext) {
                //console.log("Child parameter: ", this.visit(ctx.getChild(3).getChild(0))[0]);
                //let b = bodyScope.getChild(3).getText();
                //console.info("Child body: ", b);
                //bodyScope = bodyScope.getChild(3).getChild(0);
            //}
            console.log("*>* bodyScope type: ", bodyScope.constructor.name, ", (bodyScope= ", this.getBodyText(bodyScope));
            /* if(bodyScope instanceof lambdaParser.ApplicationContext) {
                body = bodyScope.getChild(0).getText().concat(' ').concat(bodyScope.getChild(1).getText());
            } else if(bodyScope.getChild(0) && bodyScope instanceof lambdaParser.TermContext && bodyScope.getChild(0) instanceof ApplicationContext) {
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
        if(body instanceof lambdaParser.TermContext) {
            body = body.getChild(0);
        }
        let brackets = false;
        if(body.getChild(0) != null  && body.getChild(0).getText() == '(') {
            body = body.getChild(1);
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

        if(body.getChild(0) == null) {
            return body.getText();
        }

        return this.getBodyText(body.getChild(0));
        /* console.log(ctx.getChild(0).getChild(1).getChild(0).getChild(0) == null);
        if(body.VARIABLE()) {
            return body.VARIABLE().getText();
        } */
    }

	// Visit a parse tree produced by lambdaParser#application.
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
        while(leftChild instanceof lambdaParser.ApplicationContext 
            && (leftChild.getChild(0) instanceof lambdaParser.ApplicationContext || leftChild.getChild(0) instanceof lambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
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
            let newCTX = this.getBodyText(leftChild).concat(" ").concat(this.getBodyText(rightChild));
            console.log(this.getBodyText(leftChild), " + ", this.getBodyText(rightChild), " = ", newCTX);
            //let newCTX = this.getBodyText(ctx).replace(this.getBodyText(oldLeftChild), leftChildText);
            console.log("NEW CTX: ", newCTX);
            console.log("NEW CTX: ", newCTX);
            ctx = this.makeTree(newCTX).getChild(0);
            leftChild = ctx.getChild(0);
            rightChild = ctx.getChild(1);
            //rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
            if(leftChild.getText() == '(') {
                leftChild = ctx.getChild(1).getChild(0);
                rightChild = ctx.getChild(1).getChild(1);
                //rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
            }
            this.terms.push(this.getBodyText(this.makeTree(this.terms[this.terms.length - 1].replace(this.getBodyText(oldLeftChild), this.getBodyText(leftChild))).getChild(0)));
            if(leftChild.getChild(0) instanceof lambdaParser.ApplicationContext) {
                leftChild = leftChild.getChild(0);
            }
            //let newChild = leftChild.getChild(0);
            if(leftChild instanceof lambdaParser.AbstractionContext) {
                //console.log("CTX: ", ctx.getText(), "+ TREE = ", leftChild.getText());
            }
        }
        /* if(leftChild instanceof lambdaParser.TermContext) {
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
        if(!(leftChild instanceof lambdaParser.AbstractionContext)) {
            return this.makeTree(this.getBodyText(leftChild).concat(' ').concat(this.getBodyText(rightChild)));
        }
        
        //if left child is finally abstraction, apply value from right child to body
        //if(leftChild instanceof lambdaParser.AbstractionContext) {
            let abstraction = leftChild;
            //console.log("** LEFT CHILD = ", abstraction.getText());
            if(this.getBodyText(abstraction.getChild(0)) == '(') {
                abstraction = abstraction.getChild(1);
            }
            [param, body] = this.visitAbstraction(abstraction);
            console.log("Param: ", param, ", Body: ", body, "Of: ", this.getBodyText(abstraction));
            //console.log(rightChild.getChild(0).constructor.name);
            let value = this.getBodyText(rightChild);
            while(rightChild.getChild(0) instanceof lambdaParser.ApplicationContext) {
                console.log("~~ evaluating right child: ", this.getBodyText(rightChild));
                let oldRightChild = rightChild.getChild(0);
                rightChild = this.visitApplication(rightChild.getChild(0));
                value = this.getBodyText(rightChild);
                console.log("oldRightChild: ", this.getBodyText(oldRightChild), ", newRightChild: ", this.getBodyText(rightChild));
                console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
                console.log("REPLACING: ", this.getBodyText(oldRightChild), "WITH: ", value);
                console.log("NEW CTX:= ", this.getBodyText(ctx).replace(this.getBodyText(oldRightChild), value));
                ctx = this.makeTree(this.getBodyText(ctx).replace(this.getBodyText(oldRightChild), value)).getChild(0);
                leftChild = ctx.getChild(0);
                rightChild = ctx.getChild(1);
                //rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
                if(leftChild.getText() == '(') {
                    leftChild = ctx.getChild(1).getChild(0);
                    rightChild = ctx.getChild(1).getChild(1);
                    //rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
                }
                this.terms.push(this.getBodyText(this.makeTree(this.terms[this.terms.length - 1].replace(this.getBodyText(oldRightChild), value)).getChild(0)));
            }
            /* if(value[0] == '(') {
                brackets = true;
            } */
            const reg_text = "\\b".concat(param).concat("\\b");
            const reg = new RegExp(reg_text, "g");
            body = body.replaceAll(reg, value);
            /* if(!brackets) {
                body = '('+ body+ ')';
            } */
            console.log("NEW Body: ", body);
            let tree = this.makeTree(body);
            if(tree.getChild(0) instanceof lambdaParser.AbstractionContext) {
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
        let lexer = new lambdaLexer(chars);
        let tokens = new CommonTokenStream(lexer);
        let parser = new lambdaParser(tokens);

        parser.buildParseTrees = true;
        return parser.term();
    }
}