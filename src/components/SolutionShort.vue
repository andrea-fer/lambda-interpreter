<template>
    <p>
        {{ solution }}
    </p>
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

</style>