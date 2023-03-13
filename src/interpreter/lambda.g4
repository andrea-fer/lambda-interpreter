grammar lambda;

term
    : VARIABLE | abstraction | application | '(' term ')' | definition
    ;

abstraction
    : 'L' VARIABLE '.' term
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
    : [a-z] [a-zA-Z0-9]*
    ;

WS
   : [ \t\r\n] -> skip
   ;