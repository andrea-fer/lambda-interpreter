// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import LambdaListener from './LambdaListener.js';
import LambdaVisitor from './LambdaVisitor.js';

const serializedATN = [4,1,7,82,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,26,8,1,1,
2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,35,8,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,
45,8,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,60,8,4,1,
4,1,4,5,4,64,8,4,10,4,12,4,67,9,4,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,
6,1,6,3,6,80,8,6,1,6,0,1,8,7,0,2,4,6,8,10,12,0,0,87,0,14,1,0,0,0,2,25,1,
0,0,0,4,34,1,0,0,0,6,44,1,0,0,0,8,59,1,0,0,0,10,68,1,0,0,0,12,79,1,0,0,0,
14,15,3,2,1,0,15,16,5,0,0,1,16,1,1,0,0,0,17,26,5,3,0,0,18,26,3,6,3,0,19,
26,3,8,4,0,20,21,5,5,0,0,21,22,3,2,1,0,22,23,5,6,0,0,23,26,1,0,0,0,24,26,
3,10,5,0,25,17,1,0,0,0,25,18,1,0,0,0,25,19,1,0,0,0,25,20,1,0,0,0,25,24,1,
0,0,0,26,3,1,0,0,0,27,35,3,6,3,0,28,35,3,8,4,0,29,35,5,3,0,0,30,31,5,5,0,
0,31,32,3,2,1,0,32,33,5,6,0,0,33,35,1,0,0,0,34,27,1,0,0,0,34,28,1,0,0,0,
34,29,1,0,0,0,34,30,1,0,0,0,35,5,1,0,0,0,36,37,5,4,0,0,37,38,5,3,0,0,38,
39,5,1,0,0,39,45,3,4,2,0,40,41,5,5,0,0,41,42,3,6,3,0,42,43,5,6,0,0,43,45,
1,0,0,0,44,36,1,0,0,0,44,40,1,0,0,0,45,7,1,0,0,0,46,47,6,4,-1,0,47,48,5,
3,0,0,48,60,3,2,1,0,49,50,3,12,6,0,50,51,3,2,1,0,51,60,1,0,0,0,52,53,3,6,
3,0,53,54,3,2,1,0,54,60,1,0,0,0,55,56,5,5,0,0,56,57,3,8,4,0,57,58,5,6,0,
0,58,60,1,0,0,0,59,46,1,0,0,0,59,49,1,0,0,0,59,52,1,0,0,0,59,55,1,0,0,0,
60,65,1,0,0,0,61,62,10,2,0,0,62,64,3,2,1,0,63,61,1,0,0,0,64,67,1,0,0,0,65,
63,1,0,0,0,65,66,1,0,0,0,66,9,1,0,0,0,67,65,1,0,0,0,68,69,5,3,0,0,69,70,
5,2,0,0,70,71,3,2,1,0,71,11,1,0,0,0,72,73,5,5,0,0,73,74,5,3,0,0,74,80,5,
6,0,0,75,76,5,5,0,0,76,77,3,12,6,0,77,78,5,6,0,0,78,80,1,0,0,0,79,72,1,0,
0,0,79,75,1,0,0,0,80,13,1,0,0,0,6,25,34,44,59,65,79];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class LambdaParser extends antlr4.Parser {

    static grammarFileName = "java-escape";
    static literalNames = [ null, "'.'", "'='", null, "'\\lambda'", "'('", 
                            "')'" ];
    static symbolicNames = [ null, null, null, "VARIABLE", "LAMBDA", "LPAR", 
                             "RPAR", "WS" ];
    static ruleNames = [ "redex", "term", "body", "abstraction", "application", 
                         "definition", "var" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = LambdaParser.ruleNames;
        this.literalNames = LambdaParser.literalNames;
        this.symbolicNames = LambdaParser.symbolicNames;
    }

    get atn() {
        return atn;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 4:
    	    		return this.application_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    application_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 2);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };




	redex() {
	    let localctx = new RedexContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, LambdaParser.RULE_redex);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 14;
	        this.term();
	        this.state = 15;
	        this.match(LambdaParser.EOF);
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



	term() {
	    let localctx = new TermContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, LambdaParser.RULE_term);
	    try {
	        this.state = 25;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 17;
	            this.match(LambdaParser.VARIABLE);
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 18;
	            this.abstraction();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 19;
	            this.application(0);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 20;
	            this.match(LambdaParser.LPAR);
	            this.state = 21;
	            this.term();
	            this.state = 22;
	            this.match(LambdaParser.RPAR);
	            break;

	        case 5:
	            this.enterOuterAlt(localctx, 5);
	            this.state = 24;
	            this.definition();
	            break;

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



	body() {
	    let localctx = new BodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, LambdaParser.RULE_body);
	    try {
	        this.state = 34;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 27;
	            this.abstraction();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 28;
	            this.application(0);
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 29;
	            this.match(LambdaParser.VARIABLE);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 30;
	            this.match(LambdaParser.LPAR);
	            this.state = 31;
	            this.term();
	            this.state = 32;
	            this.match(LambdaParser.RPAR);
	            break;

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



	abstraction() {
	    let localctx = new AbstractionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, LambdaParser.RULE_abstraction);
	    try {
	        this.state = 44;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 4:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 36;
	            this.match(LambdaParser.LAMBDA);
	            this.state = 37;
	            this.match(LambdaParser.VARIABLE);
	            this.state = 38;
	            this.match(LambdaParser.T__0);
	            this.state = 39;
	            this.body();
	            break;
	        case 5:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 40;
	            this.match(LambdaParser.LPAR);
	            this.state = 41;
	            this.abstraction();
	            this.state = 42;
	            this.match(LambdaParser.RPAR);
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


	application(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new ApplicationContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 8;
	    this.enterRecursionRule(localctx, 8, LambdaParser.RULE_application, _p);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 59;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 47;
	            this.match(LambdaParser.VARIABLE);
	            this.state = 48;
	            this.term();
	            break;

	        case 2:
	            this.state = 49;
	            this.var_();
	            this.state = 50;
	            this.term();
	            break;

	        case 3:
	            this.state = 52;
	            this.abstraction();
	            this.state = 53;
	            this.term();
	            break;

	        case 4:
	            this.state = 55;
	            this.match(LambdaParser.LPAR);
	            this.state = 56;
	            this.application(0);
	            this.state = 57;
	            this.match(LambdaParser.RPAR);
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 65;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,4,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new ApplicationContext(this, _parentctx, _parentState);
	                this.pushNewRecursionContext(localctx, _startState, LambdaParser.RULE_application);
	                this.state = 61;
	                if (!( this.precpred(this._ctx, 2))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                }
	                this.state = 62;
	                this.term(); 
	            }
	            this.state = 67;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,4,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	definition() {
	    let localctx = new DefinitionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, LambdaParser.RULE_definition);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 68;
	        this.match(LambdaParser.VARIABLE);
	        this.state = 69;
	        this.match(LambdaParser.T__1);
	        this.state = 70;
	        this.term();
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



	var_() {
	    let localctx = new VarContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, LambdaParser.RULE_var);
	    try {
	        this.state = 79;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 72;
	            this.match(LambdaParser.LPAR);
	            this.state = 73;
	            this.match(LambdaParser.VARIABLE);
	            this.state = 74;
	            this.match(LambdaParser.RPAR);
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 75;
	            this.match(LambdaParser.LPAR);
	            this.state = 76;
	            this.var_();
	            this.state = 77;
	            this.match(LambdaParser.RPAR);
	            break;

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


}

LambdaParser.EOF = antlr4.Token.EOF;
LambdaParser.T__0 = 1;
LambdaParser.T__1 = 2;
LambdaParser.VARIABLE = 3;
LambdaParser.LAMBDA = 4;
LambdaParser.LPAR = 5;
LambdaParser.RPAR = 6;
LambdaParser.WS = 7;

LambdaParser.RULE_redex = 0;
LambdaParser.RULE_term = 1;
LambdaParser.RULE_body = 2;
LambdaParser.RULE_abstraction = 3;
LambdaParser.RULE_application = 4;
LambdaParser.RULE_definition = 5;
LambdaParser.RULE_var = 6;

class RedexContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = LambdaParser.RULE_redex;
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	EOF() {
	    return this.getToken(LambdaParser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterRedex(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitRedex(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitRedex(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class TermContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = LambdaParser.RULE_term;
    }

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
	};

	application() {
	    return this.getTypedRuleContext(ApplicationContext,0);
	};

	LPAR() {
	    return this.getToken(LambdaParser.LPAR, 0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	RPAR() {
	    return this.getToken(LambdaParser.RPAR, 0);
	};

	definition() {
	    return this.getTypedRuleContext(DefinitionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitTerm(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class BodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = LambdaParser.RULE_body;
    }

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
	};

	application() {
	    return this.getTypedRuleContext(ApplicationContext,0);
	};

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	LPAR() {
	    return this.getToken(LambdaParser.LPAR, 0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	RPAR() {
	    return this.getToken(LambdaParser.RPAR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitBody(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitBody(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AbstractionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = LambdaParser.RULE_abstraction;
    }

	LAMBDA() {
	    return this.getToken(LambdaParser.LAMBDA, 0);
	};

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	body() {
	    return this.getTypedRuleContext(BodyContext,0);
	};

	LPAR() {
	    return this.getToken(LambdaParser.LPAR, 0);
	};

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
	};

	RPAR() {
	    return this.getToken(LambdaParser.RPAR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterAbstraction(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitAbstraction(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitAbstraction(this);
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
        this.ruleIndex = LambdaParser.RULE_application;
    }

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	var_() {
	    return this.getTypedRuleContext(VarContext,0);
	};

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
	};

	LPAR() {
	    return this.getToken(LambdaParser.LPAR, 0);
	};

	application() {
	    return this.getTypedRuleContext(ApplicationContext,0);
	};

	RPAR() {
	    return this.getToken(LambdaParser.RPAR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterApplication(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitApplication(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitApplication(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class DefinitionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = LambdaParser.RULE_definition;
    }

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterDefinition(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitDefinition(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitDefinition(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class VarContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = LambdaParser.RULE_var;
    }

	LPAR() {
	    return this.getToken(LambdaParser.LPAR, 0);
	};

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	RPAR() {
	    return this.getToken(LambdaParser.RPAR, 0);
	};

	var_() {
	    return this.getTypedRuleContext(VarContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.enterVar(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof LambdaListener ) {
	        listener.exitVar(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof LambdaVisitor ) {
	        return visitor.visitVar(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




LambdaParser.RedexContext = RedexContext; 
LambdaParser.TermContext = TermContext; 
LambdaParser.BodyContext = BodyContext; 
LambdaParser.AbstractionContext = AbstractionContext; 
LambdaParser.ApplicationContext = ApplicationContext; 
LambdaParser.DefinitionContext = DefinitionContext; 
LambdaParser.VarContext = VarContext; 
