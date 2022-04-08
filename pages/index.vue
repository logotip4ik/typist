<template>
  <div>
    <pre>
      {{ data }}
    </pre>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('random-text', () =>
  $fetch('/api/get-random-text')
);
</script>
