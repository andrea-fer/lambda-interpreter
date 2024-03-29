// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';


const serializedATN = [4,0,7,42,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,
7,4,2,5,7,5,2,6,7,6,1,0,1,0,1,1,1,1,1,2,1,2,5,2,22,8,2,10,2,12,2,25,9,2,
1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,5,1,5,1,6,1,6,1,6,1,6,0,0,7,1,
1,3,2,5,3,7,4,9,5,11,6,13,7,1,0,3,2,0,48,57,97,122,4,0,48,57,65,90,95,95,
97,122,4,0,9,10,13,13,32,32,160,160,42,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,
0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,1,15,1,0,0,0,3,17,1,
0,0,0,5,19,1,0,0,0,7,26,1,0,0,0,9,34,1,0,0,0,11,36,1,0,0,0,13,38,1,0,0,0,
15,16,5,46,0,0,16,2,1,0,0,0,17,18,5,61,0,0,18,4,1,0,0,0,19,23,7,0,0,0,20,
22,7,1,0,0,21,20,1,0,0,0,22,25,1,0,0,0,23,21,1,0,0,0,23,24,1,0,0,0,24,6,
1,0,0,0,25,23,1,0,0,0,26,27,5,92,0,0,27,28,5,108,0,0,28,29,5,97,0,0,29,30,
5,109,0,0,30,31,5,98,0,0,31,32,5,100,0,0,32,33,5,97,0,0,33,8,1,0,0,0,34,
35,5,40,0,0,35,10,1,0,0,0,36,37,5,41,0,0,37,12,1,0,0,0,38,39,7,2,0,0,39,
40,1,0,0,0,40,41,6,6,0,0,41,14,1,0,0,0,2,0,23,1,6,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class LambdaLexer extends antlr4.Lexer {

    static grammarFileName = "Lambda.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'.'", "'='", null, "'\\lambda'", "'('", 
                         "')'" ];
	static symbolicNames = [ null, null, null, "VARIABLE", "LAMBDA", "LPAR", 
                          "RPAR", "WS" ];
	static ruleNames = [ "T__0", "T__1", "VARIABLE", "LAMBDA", "LPAR", "RPAR", 
                      "WS" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    }

    get atn() {
        return atn;
    }
}

LambdaLexer.EOF = antlr4.Token.EOF;
LambdaLexer.T__0 = 1;
LambdaLexer.T__1 = 2;
LambdaLexer.VARIABLE = 3;
LambdaLexer.LAMBDA = 4;
LambdaLexer.LPAR = 5;
LambdaLexer.RPAR = 6;
LambdaLexer.WS = 7;



