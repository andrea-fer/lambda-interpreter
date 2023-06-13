<template>
    <div id="steps">
            <span>
                <div id="line" v-for="index in nsteps" :key="index">
                    <div class="line-number">
                        <p class="no-select">{{index + '.step'}}</p>
                    </div>
                    <div class="reduction-step" v-katex="'$' + steps[index - 1] + '$'"></div>
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

    #line div {
        flex-shrink: 0;
    }

    #line p {
        padding: 0.6em 0;
        background-color: rgba(193, 193, 193, 0.5);
        /* border-radius: 5px; */
        text-align: center;
    }

    #line .line-number {
        width: 5.5em;
        text-align: center;
    }

    #line .reduction-step {
        padding: 0.6em 1.2em;
    }

</style>