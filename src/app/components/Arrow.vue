<template>
    <div class="arrow-column">
        <div class="arrow" @click="transformLines(show_help)">
            <span id="arrow1"></span>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        show_help: Boolean
    },
    methods: {
        transformLines(show_help) {
            if(show_help) {
                document.querySelector("#arrow1").style.transform = "rotate(-135deg)"; 
            } else {
                document.querySelector("#arrow1").style.transform = "rotate(45deg)"; 
            } 
            this.$emit('showing-help', !show_help);
            console.log(show_help)
        }
    }
}
</script>

<style>

.arrow-column {
    height: 100%;
    background-color: #73628A;
    width: 38px;
}

.arrow {
    transform: translate(-50%, -50%);
    transform: rotate(90deg);
    cursor: pointer;
    display: block;
    height: 26px;
    width: 32px;
    z-index: 2;
}

.arrow span {
    display: block;
    width: 1.2vw;
    height: 1.2vw;
    border-bottom: 4px solid white;
    border-right: 4px solid white;
    transform: rotate(45deg);
    margin: -0.2em 1em;
    transition: transform 0.4s ease-in-out;
}

@media screen and (max-width: 1024px) {
    .arrow-column {
        display: none;
    }
}

@media screen and (max-width: 800px) {
    .arrow-column {
        display: none;
    }
}

</style>