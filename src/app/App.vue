<script>
import HelpBar from "./components/HelpBar.vue";
import Interpreter from "./components/Interpreter.vue";
import HamburgerMenu from "./components/HamburgerMenu.vue";

export default {
    components: {
        HelpBar,
        Interpreter,
        HamburgerMenu
    },
    data() {
        return {
            showHelp: false,
        }
    },
};
</script>

<template>
    <div id="content">
        <header>
<!--             <button id="show-help-btn" @click="this.showHelp = !this.showHelp">
                <img src="./assets/help.svg" class="help-logo" alt="Show help"/>
            </button> -->
            <HamburgerMenu @show_help="this.showHelp" @showing-help="this.showHelp = $event"></HamburgerMenu>
            <h1 class="no-select">LAMBDA CALCULUS INTERPRETER</h1>
        </header>
        <div id="layout">
            <HelpBar v-if="this.showHelp" class="showing-help"></HelpBar>
            <HelpBar v-if="!this.showHelp" class="not-showing-help"></HelpBar>
        <Interpreter/>
        </div>
    </div>
    <footer>
        <p class="no-select">2023</p>
    </footer>
</template>

<style scoped></style>
