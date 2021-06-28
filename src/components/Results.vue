<template>
  <div class="container">
    <p class="text">Text: {{ results.text }}</p>
    <h1>WPM - {{ results.wpm }}</h1>
    <h3>max WPM - {{ results.maxWPM }}</h3>
    <h3>Time - {{ results.time }}</h3>
    <div class="buttons">
      <button class="button back" @click="$emit('toggle-view', { to: 'Typer', next: false })">
        Back
      </button>
      <button
        ref="nextButton"
        class="button next"
        @click="$emit('toggle-view', { to: 'Typer', next: true })"
      >
        Next
      </button>
    </div>
    <small>Type ENTER to go next</small>
  </div>
</template>

<script>
import { inject, onMounted, ref } from 'vue';

export default {
  setup() {
    const nextButton = ref(null);
    const results = inject('results');

    onMounted(() => {
      nextButton.value.focus();
    });

    return { results, nextButton };
  },
  emits: ['toggle-view'],
};
</script>

<style lang="scss">
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  max-width: 700px;
  padding: 1rem 0.5rem;
}
.text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: rgba($color: whitesmoke, $alpha: 0.7);
}
h1,
h3 {
  margin-bottom: 0.5rem;
}
.buttons {
  padding: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .button {
    border-radius: 0.25rem;
    color: white;
    font-weight: 600;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    transition: transform 100ms ease-out, box-shadow 100ms ease-out;

    &:hover,
    &:focus {
      transform: scale(1.05);
      box-shadow: 0 0 10px 0 rgba($color: whitesmoke, $alpha: 0.25);
    }
    &.back {
      background-color: rgb(168, 5, 86);
    }
    &.next {
      color: black;
      background-color: rgb(0, 255, 255);
    }
  }
}
small {
  color: rgba($color: whitesmoke, $alpha: 0.5);
}
</style>
