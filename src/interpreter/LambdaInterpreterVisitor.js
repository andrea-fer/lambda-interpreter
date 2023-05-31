import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "./LambdaLexer.js";
import LambdaVisitor from "./LambdaVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This tree traverser class defines parent visitor class which implements helper functions that all visitors share

export default class LambdaInterpreterVisitor extends LambdaVisitor {

    constructor(ctx, definitions) {
        super();
        this.term = this.getTreeText(ctx);
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
	    return this.visit(ctx);
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
                    let newCTX = this.terms[this.terms.length - 1].replace(this.getTreeText(oldCTX), this.getTreeText(ctx));
                    if(newCTX != this.terms[this.terms.length - 1]){
                        console.log("°", newCTX, "°");
                        this.terms.push(newCTX);
                        ctx = this.makeTree(newCTX);
                    }
                    oldCTX = ctx;
            }
        }
        let solution = ctx;
        
        while(solution != null && solution.getChild(0) instanceof LambdaParser.ApplicationContext) {
            if(this.isTimeout(this.startTime, this.maxTime)) {
                //console.log("Program took too long to execute...");
                return [null, null];
            }
            solution = this.visit(solution.getChild(0));
            if(solution == null) {
                break;
            }
            // removing unnecessary brackets
            if(solution.getChild(0).getChild(0) != null && solution.getChild(0).getChild(0).getText() == "(" 
            && solution.getChild(0).getChild(2) != null && solution.getChild(0).getChild(2).getText() == ")") {
                solution = this.makeTree(this.getTreeText(solution.getChild(0).getChild(1)));
            }
            if(this.getTreeText(solution) == this.terms[this.terms.length - 1]) {
                break;
            }
            console.log("°", this.getTreeText(solution), "°");
            this.terms.push(this.getTreeText(solution));
            if(this.definitions.has(this.getTreeText(solution))) {
                let value = this.makeTree(this.definitions.get(this.getTreeText(solution)));
                if(value.getChild(0) instanceof LambdaParser.ApplicationContext) {
                    solution = value;
                    if(this.terms[this.terms.length - 1] != this.getTreeText(solution)) {
                        console.log("°", this.getTreeText(solution), "°");
                        this.terms.push(this.getTreeText(solution));
                    }
                }
            }

            if(solution.getChild(0) != null && solution.getChild(0).getText() == '(' && solution.getChild(1) != null && solution.getChild(1) instanceof LambdaParser.AbstractionContext) {
                solution = solution.getChild(1);
                if(this.terms[this.terms.length - 1] != this.getTreeText(solution)) {
                    console.log("°", this.getTreeText(solution), "°");
                    this.terms.push(this.getTreeText(solution));
                }
            }

            if(solution instanceof LambdaParser.AbstractionContext) {
                let param = null;
                let body = null;
                if(this.isTimeout(this.startTime, this.maxTime)) {
                    //console.log("Program took too long to execute...");
                    return [null, null];
                }
                [param, body] = this.visitAbstraction(solution);

                let bodyText = body;
                for(let [key, value] of this.definitions) {
                    if(body != null && body.includes(key)) {
                        if(this.makeTree(value).getChild(0) instanceof LambdaParser.AbstractionContext) {
                            value = '(' + value + ')';
                        }
                        const key_text = "\\b".concat(key).concat("\\b");
                        const _key = new RegExp(key_text, "g");
                        bodyText = bodyText.replaceAll(_key, value);
                        solution = this.makeTree(bodyText).getChild(0);
                        let newCTX = this.terms[this.terms.length - 1].replace(body, bodyText);
                        if(this.terms[this.terms.length - 1] != newCTX) {
                            console.log("°", newCTX, "°");
                            this.terms.push(newCTX);
                        }
                        ctx = this.makeTree(newCTX).getChild(0);
                        solution = ctx;
                        if(this.isTimeout(this.startTime, this.maxTime)) {
                            //console.log("Program took too long to execute...");
                            return [null, null];
                        }
                        [param, body] = this.visit(solution);
                        if(body == null) {
                            return [null, null];
                        }
                        bodyText = body;
                    }
                }

                let tmpSolution = solution;
                let abstractionBody = body;
                if(body != null) {
                    while(tmpSolution instanceof LambdaParser.AbstractionContext) {
                        [param, bodyText] = this.visit(tmpSolution);
                        console.log("before maketree1", this.getTreeText(tmpSolution))
                        console.log("bodytext: <<", bodyText, ">>")
                        abstractionBody = this.makeTree(bodyText).getChild(0);
                        console.log("after maketree1", this.getTreeText(tmpSolution))
                        tmpSolution = abstractionBody;
                    }
                }

                if(body != null /* && body != this.getTreeText(abstractionBody) */) {
                    while(abstractionBody instanceof LambdaParser.ApplicationContext) {
                        let oldBody = abstractionBody;
                        abstractionBody = this.visit(abstractionBody);
                        let newSolutionText = this.getTreeText(solution).replace(this.getTreeText(oldBody), this.getTreeText(abstractionBody));
                        console.log("before maketree2", this.getTreeText(solution))
                        solution = this.makeTree(newSolutionText);
                        console.log("after maketree2", this.getTreeText(solution))
                        if(this.terms[this.terms.length - 1] != newSolutionText) {
                            console.log("°", newSolutionText, "°");
                            this.terms.push(newSolutionText);
                        }
                    }
                }

            }
        }
        // in case of recursion visit functions will return null
        if(solution == null) {
            //console.log("Recursion");
            // return last added term as a solution
            return [this.terms[this.terms.length - 1], this.terms, true];
        }
        // remove excess brackets
        if(solution.getChild(0) != null && solution.getChild(0).getText() == '(' && solution.getChild(1) != null && solution.getChild(1) instanceof LambdaParser.AbstractionContext) {
            solution = solution.getChild(1);
            if(this.terms[this.terms.length - 1] != this.getTreeText(solution)) {
                console.log("°", this.getTreeText(solution), "°");
                this.terms.push(this.getTreeText(solution));
            }
        }
        
        return [this.getTreeText(solution), this.terms];
	}

    // Visit a parse tree produced by LambdaParser#abstraction.
	visitAbstraction(ctx) {
        console.log("ctx in visitAbstraction:", this.getTreeText(ctx))
        if(ctx.getChild(0).getText() == '(') {
            ctx = ctx.getChild(1);
            console.log("NEW ctx in visitAbstraction:", this.getTreeText(ctx))
        }
        let param = null;
        let body = null;
        if(ctx.VARIABLE()) {
            param = ctx.VARIABLE().getText();
            let bodyScope = ctx.getChild(3).getChild(0);
            if(bodyScope == '(') {
                bodyScope = ctx.getChild(3).getChild(1);
            }

            body = this.getTreeText(bodyScope);
        }
        return [param, body];
	}

    // Visit a parse tree produced by LambdaParser#definition.
	visitDefinition(ctx) {
        ctx = ctx.getChild(0);
        return [[this.getTreeText(ctx.getChild(0)), this.getTreeText(ctx.getChild(2))], null];
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
    getTreeText(tree) {
        if(tree == null) {
            return;
        }
        if(tree instanceof LambdaParser.TermContext && tree.getChild(0) != null && tree.getChild(0).getText() != '(') {
            tree = tree.getChild(0);
        }
        let brackets = false;
        // in case of double brackets, e.g. application -> '(' application ')' -> '(' application ')'
        while(tree.getChild(0) != null  && tree.getChild(0).getText() == '(') {
            tree = tree.getChild(1);
            brackets = true;
        }
        if(tree instanceof LambdaParser.ApplicationContext) {
            let child_0 = this.getTreeText(tree.getChild(0));
            let child_1 = this.getTreeText(tree.getChild(1));
            let treeText = child_0.concat(' ').concat(child_1);
            if(brackets) {
                treeText = '('.concat(treeText).concat(')');
            }
            return treeText; 
        }
        if(tree instanceof LambdaParser.AbstractionContext) {
            let treeText = tree.getChild(0).getText().concat(tree.getChild(1).getText()).concat(tree.getChild(2).getText()).concat(this.getTreeText(tree.getChild(3)));
            if(brackets) {
                treeText = '('.concat(treeText).concat(')');
            }
            return treeText;
        }

        if(tree instanceof LambdaParser.DefinitionContext) {
            let treeText = tree.getChild(0).getText().concat(tree.getChild(1).getText()).concat(this.getTreeText(tree.getChild(2)));
            return treeText;
        }

        if(tree.getChild(0) == null) {
            return tree.getText();
        }

        return this.getTreeText(tree.getChild(0));
    }

    // helper function to track time of program execution
    isTimeout(startTime, maxTime) {
        // return true if time of program execution has exceeded maxTime
        return (new Date().getTime() > (startTime + maxTime));
    }
}