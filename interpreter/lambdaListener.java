// Generated from java-escape by ANTLR 4.11.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link lambdaParser}.
 */
public interface lambdaListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link lambdaParser#term}.
	 * @param ctx the parse tree
	 */
	void enterTerm(lambdaParser.TermContext ctx);
	/**
	 * Exit a parse tree produced by {@link lambdaParser#term}.
	 * @param ctx the parse tree
	 */
	void exitTerm(lambdaParser.TermContext ctx);
	/**
	 * Enter a parse tree produced by {@link lambdaParser#abstraction}.
	 * @param ctx the parse tree
	 */
	void enterAbstraction(lambdaParser.AbstractionContext ctx);
	/**
	 * Exit a parse tree produced by {@link lambdaParser#abstraction}.
	 * @param ctx the parse tree
	 */
	void exitAbstraction(lambdaParser.AbstractionContext ctx);
	/**
	 * Enter a parse tree produced by {@link lambdaParser#application}.
	 * @param ctx the parse tree
	 */
	void enterApplication(lambdaParser.ApplicationContext ctx);
	/**
	 * Exit a parse tree produced by {@link lambdaParser#application}.
	 * @param ctx the parse tree
	 */
	void exitApplication(lambdaParser.ApplicationContext ctx);
}