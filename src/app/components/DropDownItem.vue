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
        padding: 1.2rem 0.07rem;
        background-color: #CBC5EA;
        width: 100%;
        color: black;
        text-align: center;
    }
</style>