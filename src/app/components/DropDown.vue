<template>
  <button class="dropdown">
    <div
      class="visible"
      v-html="title"
      @click="show = !show"
    ></div>
    <div
      class="hidden"
      v-if="show"
    >
      <slot />
    </div>
</button>
</template>
<script>
import { ref } from "vue";
export default {
  props: ["title"],
  setup(props) {
    const show = ref(false);
    return {
      show,
    };
  },
};
</script>

<style scoped>

    .dropdown {
        padding: 0 !important;
    }
    .hidden {
        margin: 0;
        z-index: 3;
        position: relative;
        width: 100%;
    }

    .visible {
        cursor: pointer;
        width:  100%;
        height: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>