import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import lambdaLexer from "./lambdaLexer.js";
import lambdaVisitor from "./lambdaVisitor.js";
import lambdaParser from "./lambdaParser.js";

// Tree Traverser Class
export default class myLambdaVisitor extends lambdaVisitor {

    constructor(term) {
        super();
        this.term = term;
        this.terms = [];
        this.terms.push(term);
    }
	// Visit a parse tree produced by lambdaParser#term.
	visitTerm(ctx) {
        console.info("°°IN TERM°°");
        console.log("TERM IS : ", this.terms[0]);
        /* if(ctx.getChild(0).getText() == '(') {
            this.visitTerm(ctx.getChild(1));
        } */
        let solution = ctx;
        console.log("SOLUTION: ", solution.getText(), "type: ", solution.constructor.name);
        /* console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).constructor.name);
        console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).getText()); */
        while(solution.getChild(0) instanceof lambdaParser.ApplicationContext) {
            solution = this.visitApplication(solution.getChild(0));
            if(solution.getText() == this.terms[this.terms.length - 1]) {
                console.log(" EVALUATION SHOULD STOP : ", solution.getText(), "==", this.terms[this.terms.length - 1]);
                break;
            }
            this.terms.push(solution.getText());
            console.log("SOLUTION: ", solution.getText(), "type: ", solution.constructor.name);
            /* console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).constructor.name);
            console.log("SOLUTION.getChild(0).getChild(0): ", solution.getChild(0).getChild(0).getText()); */
            /* if(solution.getChild(0).getChild(0) != null && !(solution.getChild(0).getChild(0) instanceof lambdaParser.AbstractionContext)) {
                break;
            } */
        }
        //this.terms.push(solution.getText());
        //console.log(this.terms);
        //console.log("FINAL term type: ", solution.constructor.name);
        return [solution.getText(), this.terms];
	}

    // Visit a parse tree produced by lambdaParser#abstraction.
	visitAbstraction(ctx) {
        if(ctx.getText() == '(') {
            ctx = ctx.getChild(1).getChild(0);
        }
        console.log(ctx);
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
            body = bodyScope.getText();
        }
        return [param, body];

        //return this.visitChildren(ctx);
	}

	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx) {
        let leftChild = ctx.getChild(0);
        let rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
        console.log("LEFT CHILD: ", leftChild.getText());
        console.log("RIGHT CHILD: ", rightChild.getText());
        let brackets = false;
        if(leftChild.getText() == '(') {
            leftChild = ctx.getChild(1).getChild(0);
            rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
            brackets = true;
        }
        //let test = rightChild.getParent();
        //console.log(ctx.getChild(0).getText());
        console.log("In Child: ", leftChild.getText(), "type = ", leftChild.constructor.name);
        // if left child is application, go deeper in tree
        if(leftChild.getChild(0) == '(') {
            leftChild = leftChild.getChild(1);
        }
        while(leftChild instanceof lambdaParser.ApplicationContext 
            && (leftChild.getChild(0) instanceof lambdaParser.ApplicationContext || leftChild.getChild(0) instanceof lambdaParser.AbstractionContext)) {
            let oldLeftChild = leftChild;
            leftChild = this.visitApplication(leftChild);
            console.log("oldLeftChild: ", oldLeftChild.getText(), ", newLeftChild: ", leftChild.getText());
            console.log("CTX: ", ctx.getText());
            console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
            console.log("REPLACING: ", oldLeftChild.getText(), "WITH: ", leftChild.getText());
            let leftChildText = leftChild.getText(); 
            if(leftChild instanceof lambdaParser.AbstractionContext && leftChild.getChild(0).getText() != '(') {
                leftChildText = "(" + leftChildText + ")";

            }
            brackets = (leftChild.getChild(0).getText() == '(');
            console.log("Do I have brackets? ", brackets);
            console.log("NEW CTX: ", ctx.getText().replace(oldLeftChild.getText(), leftChildText)) ;
            ctx = this.makeTree(ctx.getText().replace(oldLeftChild.getText(), leftChildText)).getChild(0);
            leftChild = ctx.getChild(0);
            rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
            if(leftChild.getText() == '(') {
                leftChild = ctx.getChild(1).getChild(0);
                rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
            }
            this.terms.push(this.makeTree(this.terms[this.terms.length - 1].replace(oldLeftChild.getText(), leftChild.getText())).getChild(0).getText());
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
            return this.makeTree(leftChild.getText().concat(' ').concat(rightChild.getText()));
        }
        
        //if left child is finally abstraction, apply value from right child to body
        //if(leftChild instanceof lambdaParser.AbstractionContext) {
            let abstraction = leftChild;
            //console.log("** LEFT CHILD = ", abstraction.getText());
            if(abstraction.getChild(0).getText() == '(') {
                abstraction = abstraction.getChild(1);
            }
            [param, body] = this.visitAbstraction(abstraction);
            console.log("Param: ", param, ", Body: ", body, "Of: ", abstraction.getText());
            //console.log(rightChild.getChild(0).constructor.name);
            let value = rightChild.getText();
            while(rightChild.getChild(0) instanceof lambdaParser.ApplicationContext) {
                console.log("~~ evaluating right child: ", rightChild.getText());
                let oldRightChild = rightChild.getChild(0);
                rightChild = this.visitApplication(rightChild.getChild(0));
                value = rightChild.getText();
                console.log("oldRightChild: ", oldRightChild.getText(), ", newRightChild: ", rightChild.getText());
                console.log("CHANGING THIS TERM: ", this.terms[this.terms.length - 1]);
                console.log("REPLACING: ", oldRightChild.getText(), "WITH: ", value);
                console.log("NEW CTX:= ", ctx.getText().replace(oldRightChild.getText(), value));
                ctx = this.makeTree(ctx.getText().replace(oldRightChild.getText(), value)).getChild(0);
                leftChild = ctx.getChild(0);
                rightChild = ctx.getChild(1).getText() != ' ' ? ctx.getChild(1) : ctx.getChild(2);
                if(leftChild.getText() == '(') {
                    leftChild = ctx.getChild(1).getChild(0);
                    rightChild = ctx.getChild(1).getChild(1).getText() != ' ' ? ctx.getChild(1).getChild(1) : ctx.getChild(1).getChild(2);
                }
                this.terms.push(this.makeTree(this.terms[this.terms.length - 1].replace(oldRightChild.getText(), value)).getChild(0).getText());
            }
            /* if(value[0] == '(') {
                brackets = true;
            } */
            body = body.replaceAll(param, value);
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