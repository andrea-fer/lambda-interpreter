<script>
import HelpBar from "./components/HelpBar.vue";
import Interpreter from "./components/Interpreter.vue";
import HamburgerMenu from "./components/HamburgerMenu.vue";
import Arrow from "./components/Arrow.vue";

export default {
    components: {
        HelpBar,
        Interpreter,
        HamburgerMenu,
        Arrow
    },
    data() {
        return {
            showHelp: window.innerWidth > 1024 ? true : false,
        }
    },
};
</script>

<template>
    <div id="content">
        <header>
            <HamburgerMenu id="show-help-btn" :show_help="this.showHelp" @showing-help="this.showHelp = $event"></HamburgerMenu>
            <h1 class="no-select">LAMBDA CALCULUS INTERPRETER</h1>
        </header>
        <div id="layout">
            <HelpBar v-if="this.showHelp" class="showing-help"></HelpBar>
            <HelpBar v-if="!this.showHelp" class="not-showing-help"></HelpBar>
            <Arrow :show_help="this.showHelp" @showing-help="this.showHelp = $event"></Arrow>
            <Interpreter/>
        </div>
    </div>
    <footer>
        <p class="no-select">2023</p>
    </footer>
</template>

<style scoped></style>
