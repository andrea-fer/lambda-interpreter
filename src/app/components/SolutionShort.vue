<template>
    <div id="sol">
        <div v-katex="'$' + solution + '$'"></div>
        <!-- <math-jax :latex="solution" :block="true"></math-jax> -->
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
        margin: 0 !important;
        padding: 1em !important;
    }
</style>