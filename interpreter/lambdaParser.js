// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import lambdaListener from './lambdaListener.js';
import lambdaVisitor from './lambdaVisitor.js';

const serializedATN = [4,1,6,31,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
1,0,1,0,1,0,1,1,1,1,1,1,3,1,17,8,1,1,2,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,
3,1,4,1,4,1,4,0,0,5,0,2,4,6,8,0,0,27,0,10,1,0,0,0,2,16,1,0,0,0,4,18,1,0,
0,0,6,23,1,0,0,0,8,28,1,0,0,0,10,11,3,2,1,0,11,12,5,0,0,1,12,1,1,0,0,0,13,
17,5,5,0,0,14,17,3,4,2,0,15,17,3,6,3,0,16,13,1,0,0,0,16,14,1,0,0,0,16,15,
1,0,0,0,17,3,1,0,0,0,18,19,5,1,0,0,19,20,5,5,0,0,20,21,5,2,0,0,21,22,3,8,
4,0,22,5,1,0,0,0,23,24,5,3,0,0,24,25,3,2,1,0,25,26,3,2,1,0,26,27,5,4,0,0,
27,7,1,0,0,0,28,29,3,2,1,0,29,9,1,0,0,0,1,16];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class lambdaParser extends antlr4.Parser {

    static grammarFileName = "java-escape";
    static literalNames = [ null, "'L'", "'.'", "'('", "')'" ];
    static symbolicNames = [ null, null, null, null, null, "VARIABLE", "WS" ];
    static ruleNames = [ "file_", "expression", "function_", "application", 
                         "scope" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = lambdaParser.ruleNames;
        this.literalNames = lambdaParser.literalNames;
        this.symbolicNames = lambdaParser.symbolicNames;
    }

    get atn() {
        return atn;
    }



	file_() {
	    let localctx = new File_Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, lambdaParser.RULE_file_);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 10;
	        this.expression();
	        this.state = 11;
	        this.match(lambdaParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	expression() {
	    let localctx = new ExpressionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, lambdaParser.RULE_expression);
	    try {
	        this.state = 16;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 5:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 13;
	            this.match(lambdaParser.VARIABLE);
	            break;
	        case 1:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 14;
	            this.function_();
	            break;
	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 15;
	            this.application();
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	function_() {
	    let localctx = new Function_Context(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, lambdaParser.RULE_function_);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 18;
	        this.match(lambdaParser.T__0);
	        this.state = 19;
	        this.match(lambdaParser.VARIABLE);
	        this.state = 20;
	        this.match(lambdaParser.T__1);
	        this.state = 21;
	        this.scope();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	application() {
	    let localctx = new ApplicationContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, lambdaParser.RULE_application);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 23;
	        this.match(lambdaParser.T__2);
	        this.state = 24;
	        this.expression();
	        this.state = 25;
	        this.expression();
	        this.state = 26;
	        this.match(lambdaParser.T__3);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	scope() {
	    let localctx = new ScopeContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, lambdaParser.RULE_scope);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 28;
	        this.expression();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

lambdaParser.EOF = antlr4.Token.EOF;
lambdaParser.T__0 = 1;
lambdaParser.T__1 = 2;
lambdaParser.T__2 = 3;
lambdaParser.T__3 = 4;
lambdaParser.VARIABLE = 5;
lambdaParser.WS = 6;

lambdaParser.RULE_file_ = 0;
lambdaParser.RULE_expression = 1;
lambdaParser.RULE_function_ = 2;
lambdaParser.RULE_application = 3;
lambdaParser.RULE_scope = 4;

class File_Context extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = lambdaParser.RULE_file_;
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	EOF() {
	    return this.getToken(lambdaParser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterFile_(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitFile_(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
	        return visitor.visitFile_(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = lambdaParser.RULE_expression;
    }

	VARIABLE() {
	    return this.getToken(lambdaParser.VARIABLE, 0);
	};

	function_() {
	    return this.getTypedRuleContext(Function_Context,0);
	};

	application() {
	    return this.getTypedRuleContext(ApplicationContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterExpression(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitExpression(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
	        return visitor.visitExpression(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class Function_Context extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = lambdaParser.RULE_function_;
    }

	VARIABLE() {
	    return this.getToken(lambdaParser.VARIABLE, 0);
	};

	scope() {
	    return this.getTypedRuleContext(ScopeContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterFunction_(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitFunction_(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
	        return visitor.visitFunction_(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ApplicationContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = lambdaParser.RULE_application;
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterApplication(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitApplication(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
	        return visitor.visitApplication(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ScopeContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = lambdaParser.RULE_scope;
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterScope(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitScope(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
	        return visitor.visitScope(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




lambdaParser.File_Context = File_Context; 
lambdaParser.ExpressionContext = ExpressionContext; 
lambdaParser.Function_Context = Function_Context; 
lambdaParser.ApplicationContext = ApplicationContext; 
lambdaParser.ScopeContext = ScopeContext; 
