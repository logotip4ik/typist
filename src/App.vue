<template>
  <transition name="fade" mode="out-in" appear>
    <component :is="view" @toggle-view="toggleView"></component>
  </transition>
  <transition name="fade" mode="out-in">
    <div v-if="loading" class="overlay"></div>
  </transition>
</template>

<script>
import { ref, provide } from 'vue';

import Typer from './components/Typer.vue';
import Results from './components/Results.vue';

export default {
  name: 'App',
  setup() {
    const results = ref({});
    const view = ref('Typer');
    const loading = ref(true);
    provide('loading', loading);
    provide('results', results);

    function toggleView(res) {
      if (res.data) results.value = res.data;
      if (res.next) results.value.getText();
      view.value = res.to;
    }

    return { loading, view, toggleView };
  },
  components: {
    Typer,
    Results,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
*,
::before,
::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  min-height: 100vh;
  font-family: Popins, sans-serif;
  background: #18181e;
  color: whitesmoke;
}
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #18181e;

  &::after {
    content: '';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background-color: cyan;
    border-radius: 50%;
    animation: loading 1s infinite;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes loading {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
