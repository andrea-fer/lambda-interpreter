<template>
    <div id="help">
        <div class="help">
            <div class="heading">
                <h2>Help</h2>
            </div>
            <div class="example">
                <p>type \lambda to get λ</p>
            </div>
        </div>
        
        <div class="lambda-calculus-info">
            <div class="heading">
                <h2>Lambda Calculus Syntax</h2>
            </div>
            <div class="example">
                <div class="grammar_rule"><h4>Abstraction</h4><p v-katex="'$ t :=  λx.t$'"></p></div>
                <div class="grammar_rule"><h4>Application</h4><p v-katex="'$ t :=  t~t$'"></p></div>
                <div class="grammar_rule"><h4>Variable</h4><p v-katex="'$ ~~~~~t := x$'"></p></div>
            </div>
        </div>

        <div class="interpreter-info">
            <div class="heading">
                <h2>Examples</h2>
            </div>
            <h3>Function Definition</h3>
            <div class="example">
                <p>id =  λx.x</p>
                <p>true =  λx.λy.x</p>
                <p>false =  λx.λy.y</p>
            </div>
            
            <h3>Reducible Term (Redex)</h3>
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

.heading {
    height: 3em;
    background-color: #4C3D60;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

h2 {
    font-size: 20px;
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

.grammar_rule {
    display: flex;
    flex-direction: row;
}

.example {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 30px;
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