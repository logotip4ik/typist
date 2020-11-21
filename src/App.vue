<template>
  <h1>🎉 Typist 🎉</h1>
  <div class="main">
    <p>
      <span v-for="(word, idx) in textWords" :key="idx" :class="{ 'passed-word': idx < currWord }">
        <span :class="{ 'curr-word': idx === currWord }">{{ word }}</span>
        {{ ' ' }}
      </span>
    </p>
    <input ref="input" v-model="userInput" />
  </div>
  <button @click="getText" class="restart"><span class="material-icons">autorenew</span></button>
  <transition name="fade" mode="out-in">
    <div v-if="loading" class="overlay"></div>
  </transition>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'App',
  setup() {
    const URL = 'https://api.quotable.io/random?minLength=50?maxLength=150';

    const input = ref(null);

    const loading = ref(true);
    const currWord = ref(0);

    const textRaw = ref([]);
    const textWords = computed(() => textRaw.value.join('').split(' '));
    const text = computed(() => textRaw.value.join(''));

    function getText() {
      loading.value = true;
      axios.get(URL).then(({ data }) => {
        textRaw.value = data.content.split('');
        loading.value = false;
      });
    }

    const userInputRaw = ref('');
    const userInput = computed({
      get: () => userInputRaw.value,
      set: (val) => {
        if (val.slice(-1) === ' ') {
          if (textWords.value[currWord.value] === val.trim()) {
            userInputRaw.value = '';
            if (currWord.value === textWords.value.length - 1) {
              currWord.value = 0;
              getText();
            } else currWord.value += 1;
          }
          return;
        }
        userInputRaw.value = val;
      },
    });

    getText();

    onMounted(() => input.value.focus());

    return {
      loading,
      text,
      textWords,
      currWord,
      userInput,
      getText,
      input,
    };
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

  .restart {
    appearance: none;
    border: none;
    outline: none;
    background: transparent;
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: white;
    font-size: 36px;
    transition: color 150ms ease-out;

    &:hover,
    :focus {
      color: darken(white, 50);
    }
  }

  h1 {
    padding-top: 5rem;
    font-size: 60px;
    text-align: center;
    margin-bottom: 5rem;
  }

  .main {
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
    max-width: 700px;

    .passed-word {
      background: rgba(lightgreen, 0.5);
    }
    .curr-word {
      background: rgba(cyan, 0.4);
    }

    p {
      font-size: 30px;
      margin: 0 auto;
      max-width: 600px;
      line-height: 1.1;

      span {
        transition: background 100ms linear;
      }
    }

    input {
      color: white;
      padding: 1rem;
      margin-top: 5rem;
      font-size: 30px;
      width: 100%;
      appearance: none;
      background: transparent;
      border: none;
      box-shadow: 0 0 5px cyan;
      border-radius: 0.25rem;
      outline: none;
    }
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
