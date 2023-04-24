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

<style></style>