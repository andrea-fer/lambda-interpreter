<template>
    <div id="steps">
            <span>
                <div id="line" v-for="index in nsteps" :key="index">
                    {{index + '.step'}}
                    <math-jax :latex="steps[index - 1]" :block="true"></math-jax>
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
        },
        nsteps: {
            type: Number,
            default: 0,
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