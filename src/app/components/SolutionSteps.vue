<template>
    <div id="steps">
            <span>
                <div id="line" v-for="index in nsteps" :key="index">
                    <p>{{index + '.step'}}</p>
                    <!-- {{ steps[index - 1] }} -->
                    <div v-katex="'$' + steps[index - 1] + '$'"></div>
                    <!-- <math-jax :latex="steps[index - 1]" :block="true"></math-jax> -->
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
    }

    #line p {
        padding: 0.6em 1.2em;
        background-color: rgba(193, 193, 193, 0.5);
        border-radius: 5px;

    }

    #line div {
        padding: 0.6em 1.2em;
    }

</style>