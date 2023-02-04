grammar lambda;

term
    : VARIABLE | abstraction | application | '(' term ')'
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

VARIABLE
    : [a-z]
    ;

WS
   : [ \t\r\n] -> skip
   ;