<template>
    <div class="hamburger-lines" @click="show_help = !show_help; transformLines(!show_help)">
        <span class="line line1"></span>
        <span class="line line2"></span>
        <span class="line line3"></span>
    </div>  
</template>

<script>
export default {
    props: {
        show_help: Boolean
    },
    methods: {
        transformLines(show_help) {
            if(!show_help) {
                document.querySelector(".line1").style.transform = "rotate(45deg)"; 
                document.querySelector(".line2").style.transform = "scaleY(0)";
                document.querySelector(".line3").style.transform = "rotate(-45deg)";
            } else {
                document.querySelector(".line1").style.transform = "rotate(0deg)"; 
                document.querySelector(".line2").style.transform = "rotate(0deg)";
                document.querySelector(".line3").style.transform = "rotate(0deg)";
            } 
            //this.showing = !show_help;
            this.$emit('showing-help', show_help);
            console.log(show_help)
        }
    }
}
</script>

<style>
/* .checkbox {
  position: absolute;
  display: block;
  height: 32px;
  width: 32px;
  top: 20px;
  left: 20px;
  z-index: 5;
  opacity: 0;
  cursor: pointer;
} */

.hamburger-lines {
    display: block;
    height: 26px;
    width: 32px;
    position: absolute;
    top: 17px;
    left: 20px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.hamburger-lines .line {
    display: block;
    height: 4px;
    width: 100%;
    border-radius: 10px;
    background: #0e2431;
}

.hamburger-lines .line1 {
    transform-origin: 0% 0%;
    transition: transform 0.4s ease-in-out;
}

.hamburger-lines .line2 {
    transition: transform 0.2s ease-in-out;
}

.hamburger-lines .line3 {
    transform-origin: 0% 100%;
    transition: transform 0.4s ease-in-out;
}

.container input[type="checkbox"]:checked ~ .hamburger-lines .line1 {
    transform: rotate(45deg);
}

.container input[type="checkbox"]:checked ~ .hamburger-lines .line2 {
    transform: scaleY(0);
}

.container input[type="checkbox"]:checked ~ .hamburger-lines .line3 {
    transform: rotate(-45deg);
}
</style>