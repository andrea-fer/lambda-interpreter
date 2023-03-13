// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';


const serializedATN = [4,0,7,36,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,
7,4,2,5,7,5,2,6,7,6,1,0,1,0,1,1,1,1,1,2,1,2,1,3,1,3,1,4,1,4,1,5,1,5,5,5,
28,8,5,10,5,12,5,31,9,5,1,6,1,6,1,6,1,6,0,0,7,1,1,3,2,5,3,7,4,9,5,11,6,13,
7,1,0,3,1,0,97,122,3,0,48,57,65,90,97,122,3,0,9,10,13,13,32,32,36,0,1,1,
0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,
1,0,0,0,1,15,1,0,0,0,3,17,1,0,0,0,5,19,1,0,0,0,7,21,1,0,0,0,9,23,1,0,0,0,
11,25,1,0,0,0,13,32,1,0,0,0,15,16,5,40,0,0,16,2,1,0,0,0,17,18,5,41,0,0,18,
4,1,0,0,0,19,20,5,76,0,0,20,6,1,0,0,0,21,22,5,46,0,0,22,8,1,0,0,0,23,24,
5,61,0,0,24,10,1,0,0,0,25,29,7,0,0,0,26,28,7,1,0,0,27,26,1,0,0,0,28,31,1,
0,0,0,29,27,1,0,0,0,29,30,1,0,0,0,30,12,1,0,0,0,31,29,1,0,0,0,32,33,7,2,
0,0,33,34,1,0,0,0,34,35,6,6,0,0,35,14,1,0,0,0,2,0,29,1,6,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class lambdaLexer extends antlr4.Lexer {

    static grammarFileName = "lambda.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'('", "')'", "'L'", "'.'", "'='" ];
	static symbolicNames = [ null, null, null, null, null, null, "VARIABLE", 
                          "WS" ];
	static ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "VARIABLE", 
                      "WS" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    }

    get atn() {
        return atn;
    }
}

lambdaLexer.EOF = antlr4.Token.EOF;
lambdaLexer.T__0 = 1;
lambdaLexer.T__1 = 2;
lambdaLexer.T__2 = 3;
lambdaLexer.T__3 = 4;
lambdaLexer.T__4 = 5;
lambdaLexer.VARIABLE = 6;
lambdaLexer.WS = 7;



