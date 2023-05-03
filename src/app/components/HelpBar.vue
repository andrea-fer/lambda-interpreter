<template>
    <div id="help">
        <div class="lambda-calculus-info">
            <h2>LAMBDA CALCULUS SYNTAX</h2>
            <h3>Grammar Rules for Term <span v-katex="'$t$'"></span></h3>
            <p v-katex="'$ t := abstraction~|~application~|~variable $'"></p>
            <div class="example">
                <h4>Abstraction</h4>
                <p v-katex="'$ t :=  λx.t$'"></p>
                <h4>Application</h4>
                <p v-katex="'$ t :=  t~t$'"></p>
                <h4>Variable</h4>
                <p v-katex="'$ t := x$'"></p>
            </div>
        </div>

        <!-- <h3>Function Definition</h3>
        <p v-katex="'$ t :=  variable = t$'"></p> -->

        <div class="interpreter-info">
            <h2>EXAMPLES OF INPUT</h2>
            <div class="example">
                <p class="important">type \lambda to get λ</p>
            </div>
            <h3>Function Definition</h3>
            <div class="example">
                <p>id =  λx.x</p>
                <p>true =  λx.λy.x</p>
                <p>false =  λx.λy.y</p>
            </div>
            
            <h3>Lambda Reducible Term (Redex)</h3>
            <div class="example">
                <p>(λx.x) a</p>
                <p>id a</p>
                <p>true a b</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {    

}
</script>

<style scoped>

p, h2, h3, h4 {
    color: rgb(241, 241, 241);
    padding-left: 10px;
    padding-right: 10px;
}

h2 {
    font-size: 20px;
    padding-top: 10px;
    padding-bottom: 5px;
    text-shadow: 2px 2px 8px #350b6c;
}

h3 {
    padding-top: 10px;
    font-size: 18px;
    text-shadow: 2px 2px 8px #5d378f;
}

h4 {
    font-size: 16px;
}

p {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
}

#help {
    overflow: auto;
    resize: horizontal;
}
.important {
    text-shadow: 2px 2px 5px #000000;
}
.lambda-calculus-info, .interpreter-info {
    padding-bottom: 20px;
}

.example {
    padding-top: 8px;
    padding-left: 40px;
}

.showing-help {
    display: block;
}

.not-showing-help {
    display: block;
}
a
.help-btn-fixed-pos {
    position: fixed;
}

@media screen and (max-width: 1024px) { 
    .not-showing-help {
        display: none;
    }
    .showing-help {
        display: block;
        z-index: 4;
        position: fixed;
        width: 90vw !important;
    }
    .showing-help .help-logo {
        z-index: 4;
        position: fixed;
    }
    #help {
        resize: none;
    }
}

@media screen and (max-width: 800px) {
    .not-showing-help {
        display: none;
    }
    .showing-help {
        display: block;
        z-index: 4;
        position: fixed;
        width: 90vw !important;
    }
    .showing-help .help-logo {
        z-index: 4;
        position: fixed;
    }
    #help {
        resize: none;
    }
}
</style>