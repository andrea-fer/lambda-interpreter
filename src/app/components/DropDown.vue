<template>
    <button class="dropdown">
        <div class="visible" @click="show = !show">
            <p>Strategy</p>
            <p>{{ selected.name }}</p>
        </div>
        <ul class="hidden" v-if="show">
            <li v-for="option in options" :key="option.id" @click="select(option)">
                {{ option.name }}
            </li>
        </ul>
    </button>
</template>

<script>
export default {
    props: {
        title: String,
        selectedOption: String
    },
    data() {
        return {
            show: false,
            options: [
                {id: 1, name: 'Call by Value'},
                {id: 2, name: 'Call by Name'},
            ],
            selected: {id: 1, name: 'Call by Value'},
        };
    },
    methods: {
        select(option) {
            this.selected = option;
            this.show = false;
            this.$emit('option-selected', option);
        }
    }
};
</script>

<style scoped>

    .dropdown {
        padding: 0 !important;
        justify-content: start;
    }
    .hidden {
        margin: 0;
        z-index: 3;
        position: relative;
        top: 0;
        padding: 0;
        width: 100%;
        box-shadow: 3px 3px 3px rgba(105, 105, 105, 0.4);
        background-color: #CBC5EA;
    }

    .hidden li {
        list-style-type: none;
        padding: 0.6em 0;
    }

    .hidden li:hover {
        background-color: #876CAC;
    }

    .visible {
        cursor: pointer;
        width:  100%;
        z-index: 2;
        position: relative;
        /* height: 100%; */
        height: 3rem;
        padding: 0.3em 0;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>