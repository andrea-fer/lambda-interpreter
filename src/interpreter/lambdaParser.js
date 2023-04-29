// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import LambdaListener from './LambdaListener.js';
import LambdaVisitor from './LambdaVisitor.js';

const serializedATN = [4,1,7,57,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,22,8,1,1,2,1,2,1,2,1,2,1,
2,1,2,1,2,1,2,3,2,32,8,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,44,
8,3,1,3,1,3,5,3,48,8,3,10,3,12,3,51,9,3,1,4,1,4,1,4,1,4,1,4,0,1,6,5,0,2,
4,6,8,0,0,59,0,10,1,0,0,0,2,21,1,0,0,0,4,31,1,0,0,0,6,43,1,0,0,0,8,52,1,
0,0,0,10,11,3,2,1,0,11,12,5,0,0,1,12,1,1,0,0,0,13,22,5,6,0,0,14,22,3,4,2,
0,15,22,3,6,3,0,16,17,5,1,0,0,17,18,3,2,1,0,18,19,5,2,0,0,19,22,1,0,0,0,
20,22,3,8,4,0,21,13,1,0,0,0,21,14,1,0,0,0,21,15,1,0,0,0,21,16,1,0,0,0,21,
20,1,0,0,0,22,3,1,0,0,0,23,24,5,3,0,0,24,25,5,6,0,0,25,26,5,4,0,0,26,32,
3,2,1,0,27,28,5,1,0,0,28,29,3,4,2,0,29,30,5,2,0,0,30,32,1,0,0,0,31,23,1,
0,0,0,31,27,1,0,0,0,32,5,1,0,0,0,33,34,6,3,-1,0,34,35,5,6,0,0,35,44,3,2,
1,0,36,37,3,4,2,0,37,38,3,2,1,0,38,44,1,0,0,0,39,40,5,1,0,0,40,41,3,6,3,
0,41,42,5,2,0,0,42,44,1,0,0,0,43,33,1,0,0,0,43,36,1,0,0,0,43,39,1,0,0,0,
44,49,1,0,0,0,45,46,10,2,0,0,46,48,3,2,1,0,47,45,1,0,0,0,48,51,1,0,0,0,49,
47,1,0,0,0,49,50,1,0,0,0,50,7,1,0,0,0,51,49,1,0,0,0,52,53,5,6,0,0,53,54,
5,5,0,0,54,55,3,2,1,0,55,9,1,0,0,0,4,21,31,43,49];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class LambdaParser extends antlr4.Parser {

    static grammarFileName = "java-escape";
    static literalNames = [ null, "'('", "')'", "'\\lambda'", "'.'", "'='" ];
    static symbolicNames = [ null, null, null, null, null, null, "VARIABLE", 
                             "WS" ];
    static ruleNames = [ "redex", "term", "abstraction", "application", 
                         "definition" ];

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
    	case 3:
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
	        this.state = 10;
	        this.term();
	        this.state = 11;
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
	        this.state = 21;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 13;
	            this.match(LambdaParser.VARIABLE);
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 14;
	            this.abstraction();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 15;
	            this.application(0);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 16;
	            this.match(LambdaParser.T__0);
	            this.state = 17;
	            this.term();
	            this.state = 18;
	            this.match(LambdaParser.T__1);
	            break;

	        case 5:
	            this.enterOuterAlt(localctx, 5);
	            this.state = 20;
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



	abstraction() {
	    let localctx = new AbstractionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, LambdaParser.RULE_abstraction);
	    try {
	        this.state = 31;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 3:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 23;
	            this.match(LambdaParser.T__2);
	            this.state = 24;
	            this.match(LambdaParser.VARIABLE);
	            this.state = 25;
	            this.match(LambdaParser.T__3);
	            this.state = 26;
	            this.term();
	            break;
	        case 1:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 27;
	            this.match(LambdaParser.T__0);
	            this.state = 28;
	            this.abstraction();
	            this.state = 29;
	            this.match(LambdaParser.T__1);
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
	    const _startState = 6;
	    this.enterRecursionRule(localctx, 6, LambdaParser.RULE_application, _p);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 43;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 34;
	            this.match(LambdaParser.VARIABLE);
	            this.state = 35;
	            this.term();
	            break;

	        case 2:
	            this.state = 36;
	            this.abstraction();
	            this.state = 37;
	            this.term();
	            break;

	        case 3:
	            this.state = 39;
	            this.match(LambdaParser.T__0);
	            this.state = 40;
	            this.application(0);
	            this.state = 41;
	            this.match(LambdaParser.T__1);
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 49;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new ApplicationContext(this, _parentctx, _parentState);
	                this.pushNewRecursionContext(localctx, _startState, LambdaParser.RULE_application);
	                this.state = 45;
	                if (!( this.precpred(this._ctx, 2))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                }
	                this.state = 46;
	                this.term(); 
	            }
	            this.state = 51;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
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
	    this.enterRule(localctx, 8, LambdaParser.RULE_definition);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 52;
	        this.match(LambdaParser.VARIABLE);
	        this.state = 53;
	        this.match(LambdaParser.T__4);
	        this.state = 54;
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


}

LambdaParser.EOF = antlr4.Token.EOF;
LambdaParser.T__0 = 1;
LambdaParser.T__1 = 2;
LambdaParser.T__2 = 3;
LambdaParser.T__3 = 4;
LambdaParser.T__4 = 5;
LambdaParser.VARIABLE = 6;
LambdaParser.WS = 7;

LambdaParser.RULE_redex = 0;
LambdaParser.RULE_term = 1;
LambdaParser.RULE_abstraction = 2;
LambdaParser.RULE_application = 3;
LambdaParser.RULE_definition = 4;

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

	term() {
	    return this.getTypedRuleContext(TermContext,0);
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

	VARIABLE() {
	    return this.getToken(LambdaParser.VARIABLE, 0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
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

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
	};

	application() {
	    return this.getTypedRuleContext(ApplicationContext,0);
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




LambdaParser.RedexContext = RedexContext; 
LambdaParser.TermContext = TermContext; 
LambdaParser.AbstractionContext = AbstractionContext; 
LambdaParser.ApplicationContext = ApplicationContext; 
LambdaParser.DefinitionContext = DefinitionContext; 
