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
        background-color: #ccb4f7;
        padding: 0 1.2em !important;
        border-radius: 8px 8px 0 0;
    }

    .hidden li {
        list-style-type: none;
        padding: 0.6em 0;
        border-bottom: 1px solid #ccb4f7;
    }

    .hidden li:hover {
        border-bottom: 1px solid #876CAC;
    }

    .visible {
        cursor: pointer;
        width:  100%;
        z-index: 2;
        position: relative;
        height: inherit;
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