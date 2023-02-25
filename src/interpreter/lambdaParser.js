// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import lambdaListener from './lambdaListener.js';
import lambdaVisitor from './lambdaVisitor.js';

const serializedATN = [4,1,6,45,2,0,7,0,2,1,7,1,2,2,7,2,1,0,1,0,1,0,1,0,
1,0,1,0,1,0,3,0,14,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,24,8,1,1,2,1,
2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,36,8,2,1,2,1,2,5,2,40,8,2,10,2,12,
2,43,9,2,1,2,0,1,4,3,0,2,4,0,0,48,0,13,1,0,0,0,2,23,1,0,0,0,4,35,1,0,0,0,
6,14,5,5,0,0,7,14,3,2,1,0,8,14,3,4,2,0,9,10,5,1,0,0,10,11,3,0,0,0,11,12,
5,2,0,0,12,14,1,0,0,0,13,6,1,0,0,0,13,7,1,0,0,0,13,8,1,0,0,0,13,9,1,0,0,
0,14,1,1,0,0,0,15,16,5,3,0,0,16,17,5,5,0,0,17,18,5,4,0,0,18,24,3,0,0,0,19,
20,5,1,0,0,20,21,3,2,1,0,21,22,5,2,0,0,22,24,1,0,0,0,23,15,1,0,0,0,23,19,
1,0,0,0,24,3,1,0,0,0,25,26,6,2,-1,0,26,27,5,5,0,0,27,36,3,0,0,0,28,29,3,
2,1,0,29,30,3,0,0,0,30,36,1,0,0,0,31,32,5,1,0,0,32,33,3,4,2,0,33,34,5,2,
0,0,34,36,1,0,0,0,35,25,1,0,0,0,35,28,1,0,0,0,35,31,1,0,0,0,36,41,1,0,0,
0,37,38,10,2,0,0,38,40,3,0,0,0,39,37,1,0,0,0,40,43,1,0,0,0,41,39,1,0,0,0,
41,42,1,0,0,0,42,5,1,0,0,0,43,41,1,0,0,0,4,13,23,35,41];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class lambdaParser extends antlr4.Parser {

    static grammarFileName = "java-escape";
    static literalNames = [ null, "'('", "')'", "'L'", "'.'" ];
    static symbolicNames = [ null, null, null, null, null, "VARIABLE", "WS" ];
    static ruleNames = [ "term", "abstraction", "application" ];

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

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 2:
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




	term() {
	    let localctx = new TermContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, lambdaParser.RULE_term);
	    try {
	        this.state = 13;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 6;
	            this.match(lambdaParser.VARIABLE);
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 7;
	            this.abstraction();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 8;
	            this.application(0);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 9;
	            this.match(lambdaParser.T__0);
	            this.state = 10;
	            this.term();
	            this.state = 11;
	            this.match(lambdaParser.T__1);
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
	    this.enterRule(localctx, 2, lambdaParser.RULE_abstraction);
	    try {
	        this.state = 23;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 3:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 15;
	            this.match(lambdaParser.T__2);
	            this.state = 16;
	            this.match(lambdaParser.VARIABLE);
	            this.state = 17;
	            this.match(lambdaParser.T__3);
	            this.state = 18;
	            this.term();
	            break;
	        case 1:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 19;
	            this.match(lambdaParser.T__0);
	            this.state = 20;
	            this.abstraction();
	            this.state = 21;
	            this.match(lambdaParser.T__1);
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
	    const _startState = 4;
	    this.enterRecursionRule(localctx, 4, lambdaParser.RULE_application, _p);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 35;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 26;
	            this.match(lambdaParser.VARIABLE);
	            this.state = 27;
	            this.term();
	            break;

	        case 2:
	            this.state = 28;
	            this.abstraction();
	            this.state = 29;
	            this.term();
	            break;

	        case 3:
	            this.state = 31;
	            this.match(lambdaParser.T__0);
	            this.state = 32;
	            this.application(0);
	            this.state = 33;
	            this.match(lambdaParser.T__1);
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 41;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new ApplicationContext(this, _parentctx, _parentState);
	                this.pushNewRecursionContext(localctx, _startState, lambdaParser.RULE_application);
	                this.state = 37;
	                if (!( this.precpred(this._ctx, 2))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                }
	                this.state = 38;
	                this.term(); 
	            }
	            this.state = 43;
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


}

lambdaParser.EOF = antlr4.Token.EOF;
lambdaParser.T__0 = 1;
lambdaParser.T__1 = 2;
lambdaParser.T__2 = 3;
lambdaParser.T__3 = 4;
lambdaParser.VARIABLE = 5;
lambdaParser.WS = 6;

lambdaParser.RULE_term = 0;
lambdaParser.RULE_abstraction = 1;
lambdaParser.RULE_application = 2;

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
        this.ruleIndex = lambdaParser.RULE_term;
    }

	VARIABLE() {
	    return this.getToken(lambdaParser.VARIABLE, 0);
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

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
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
        this.ruleIndex = lambdaParser.RULE_abstraction;
    }

	VARIABLE() {
	    return this.getToken(lambdaParser.VARIABLE, 0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	abstraction() {
	    return this.getTypedRuleContext(AbstractionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.enterAbstraction(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof lambdaListener ) {
	        listener.exitAbstraction(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof lambdaVisitor ) {
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
        this.ruleIndex = lambdaParser.RULE_application;
    }

	VARIABLE() {
	    return this.getToken(lambdaParser.VARIABLE, 0);
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




lambdaParser.TermContext = TermContext; 
lambdaParser.AbstractionContext = AbstractionContext; 
lambdaParser.ApplicationContext = ApplicationContext; 
