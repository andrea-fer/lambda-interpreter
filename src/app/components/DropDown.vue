<template>
    <button class="dropdown">
        <div class="visible" @click="show = !show">
            <span>
                <!-- <p>Strategy:</p> -->
                <p>{{ selected.name }} &#9660;</p>
            </span>
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
        padding: 0 1.2em !important;
        padding: 0.6em 1.2em;
        justify-content: start;
        height: 100%;
    }
    .hidden {
        margin: 0;
        z-index: 3;
        position: relative;
        top: 1px;
        padding: 0;
        width: 100%;
        box-shadow: 3px 3px 3px rgba(105, 105, 105, 0.4);
        background-color: #CBC5EA;
        padding: 0 1.2em !important;
    }

    .hidden li {
        list-style-type: none;
        padding: 0.6em 0;
        border-bottom: 1px solid #CBC5EA;
    }

    .hidden li:hover {
        /* background-color: #876CAC; */
        border-bottom: 1px solid #876CAC;
    }

    .visible {
        cursor: pointer;
        width:  100%;
        z-index: 2;
        position: relative;
        height: inherit;
        /* height: 3em; */
        
        /* margin-bottom: 5%; */
        /* display: flex;
        text-align: center;
        flex-direction: row;
        justify-content: center;
        align-items: center; */
        /* display: flex;
        text-align: center;
        flex-direction: column;
        justify-content: center;
        align-items: center; */
    }
    .visible span {
        position: relative;
        display: flex;
        text-align: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 3em;
    }
</style>