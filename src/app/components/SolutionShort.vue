<template>
    <div id="sol">
        <div v-katex="'$' + solution + '$'"></div>
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