<template>
    <div id="steps">
            <span>
                <div id="line" v-for="(step, index) in steps" :key="index">
                    {{ index + 1 + '.step'}}
                    <math-jax :latex="step" :block="true"></math-jax>
                </div>
            </span>
    </div>
</template>

<script>
export default {
    props: {
        steps: {
            type: Array[String],
            default: '',
        }
    }
}
</script>

<style>
    #line {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 1em;
    }

    mjx-container[jax="SVG"][display="true"] {
        display: block;
        text-align: left !important;
    }
</style>