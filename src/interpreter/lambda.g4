grammar Lambda;

redex
    : term EOF
    ;

term
    : VARIABLE | abstraction | application | '(' term ')' | definition
    ;

abstraction
    : '\\lambda' VARIABLE '.' term
    | '(' abstraction ')'
    ;

application
    : VARIABLE term
    | abstraction term
    | application term
    | '(' application ')'
    ;

definition
    : VARIABLE '=' term
    ;

VARIABLE
    : [a-zA-Z0-9] [a-zA-Z0-9]*
    ;

WS
   : [ \t\r\n] -> skip
   ;