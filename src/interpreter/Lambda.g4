grammar Lambda;

redex
    : term EOF
    ;

term
    : VARIABLE | abstraction | application | LPAR term RPAR | definition
    ;

abstraction
    : LAMBDA VARIABLE '.' term
    | LPAR abstraction RPAR
    ;

application
    : VARIABLE term
    | abstraction term
    | application term
    | LPAR application RPAR
    ;

definition
    : VARIABLE '=' term
    ;

VARIABLE
    : [a-z0-9] [a-zA-Z0-9_]*
    ;

LAMBDA
    : '\\lambda'
    ;

LPAR
    : '('
    ;

RPAR
    : ')'
    ;

WS
   : [  \t\r\n] -> skip
   ;