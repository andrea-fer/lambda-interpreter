<template>
    <div id="steps">
            <span v-for="(step, index) in steps" :key="index">
                <math-jax :latex="index+1 + '.step\\quad ' + step" :block="true"></math-jax>
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
    mjx-container[jax="SVG"][display="true"] {
        display: block;
        text-align: left !important;
    }
</style>