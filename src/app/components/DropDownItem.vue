<template>
  <a
    href="#"
    class="line"
  >
    <slot />
  </a>
</template>
<script>
export default {};
</script>

<style scoped>
    .line {
        display: block;
        z-index: 2;
        height: 5rem;
        background-color: #CBC5EA;
        width: 100%;
        color: black;
    }
</style>