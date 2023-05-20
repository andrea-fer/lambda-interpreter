import antlr4 from "antlr4";
const { CommonTokenStream, InputStream } = antlr4;
import LambdaLexer from "./LambdaLexer.js";
import LambdaVisitor from "./LambdaVisitor.js";
import LambdaParser from "./LambdaParser.js";

// This tree traverser class defines parent visitor class which implements helper functions that all visitors share

export default class LambdaInterpreterVisitor extends LambdaVisitor {

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