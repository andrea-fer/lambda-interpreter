grammar Lambda;

redex
    : term EOF
    ;

term
    : VARIABLE | abstraction | application | LPAR term RPAR | definition
    ;

body
    : abstraction | application | VARIABLE | LPAR term RPAR
    ;
    
abstraction
    : LAMBDA VARIABLE '.' body
    | LPAR abstraction RPAR
    ;

application
    : VARIABLE term
    | var term
    | abstraction term
    | application term
    | LPAR application RPAR
    ;

definition
    : VARIABLE '=' term
    ;

/* special case of variable in brackets */
var
    : LPAR VARIABLE RPAR
    | LPAR var RPAR
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