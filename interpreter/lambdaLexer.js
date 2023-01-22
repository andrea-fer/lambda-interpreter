// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';


const serializedATN = [4,0,6,38,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,
7,4,2,5,7,5,1,0,1,0,1,1,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,3,1,3,1,4,
1,4,5,4,30,8,4,10,4,12,4,33,9,4,1,5,1,5,1,5,1,5,0,0,6,1,1,3,2,5,3,7,4,9,
5,11,6,1,0,3,1,0,97,122,3,0,48,57,65,90,97,122,3,0,9,10,13,13,32,32,38,0,
1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,1,
13,1,0,0,0,3,15,1,0,0,0,5,17,1,0,0,0,7,25,1,0,0,0,9,27,1,0,0,0,11,34,1,0,
0,0,13,14,5,40,0,0,14,2,1,0,0,0,15,16,5,41,0,0,16,4,1,0,0,0,17,18,5,92,0,
0,18,19,5,108,0,0,19,20,5,97,0,0,20,21,5,109,0,0,21,22,5,98,0,0,22,23,5,
100,0,0,23,24,5,97,0,0,24,6,1,0,0,0,25,26,5,46,0,0,26,8,1,0,0,0,27,31,7,
0,0,0,28,30,7,1,0,0,29,28,1,0,0,0,30,33,1,0,0,0,31,29,1,0,0,0,31,32,1,0,
0,0,32,10,1,0,0,0,33,31,1,0,0,0,34,35,7,2,0,0,35,36,1,0,0,0,36,37,6,5,0,
0,37,12,1,0,0,0,2,0,31,1,6,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class lambdaLexer extends antlr4.Lexer {

    static grammarFileName = "lambda.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'('", "')'", "'\\lambda'", "'.'" ];
	static symbolicNames = [ null, null, null, null, null, "VARIABLE", "WS" ];
	static ruleNames = [ "T__0", "T__1", "T__2", "T__3", "VARIABLE", "WS" ];

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
lambdaLexer.VARIABLE = 5;
lambdaLexer.WS = 6;



