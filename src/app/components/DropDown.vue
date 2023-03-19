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
    }

    .visible {
        cursor: pointer;
        padding: 0.6em 1.2em;
        margin: 0;
    }
</style>