<template>
    <div id="sol">
        <math-jax :latex="solution" :block="true"></math-jax>
    </div>
</template>

<script>
export default {
    props: {
        solution: {
            type: String,
            default: '',
        }
    }
}
</script>

<style>
    mjx-container[jax="SVG"][display="true"] {
        display: block;
        text-align: left !important;
        margin: 1em 1em !important;
    }
</style>