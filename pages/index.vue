<template>
  <h1 class="main__header">🎉 Typist 🎉</h1>
</template>

<script>
export default {
  transition: 'fade',
  asyncData({ redirect }) {
    redirect('/text')
  },
}
</script>
