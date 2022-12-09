// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';

// This class defines a complete generic visitor for a parse tree produced by lambdaParser.

export default class lambdaVisitor extends antlr4.tree.ParseTreeVisitor {

	// Visit a parse tree produced by lambdaParser#file_.
	visitFile_(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by lambdaParser#expression.
	visitExpression(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by lambdaParser#function_.
	visitFunction_(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by lambdaParser#application.
	visitApplication(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by lambdaParser#scope.
	visitScope(ctx) {
	  return this.visitChildren(ctx);
	}



}