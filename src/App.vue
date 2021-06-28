<template>
  <h1>🎉 Typist 🎉</h1>
  <div class="main">
    <p>
      <span
        v-for="(letter, idx) in rawText"
        :key="idx"
        :class="{
          'curr-letter': idx === currLetter,
          'passed-letter': idx < currLetter,
          'wrong-letter': userText[idx] !== letter && idx < currLetter,
        }"
        >{{ letter }}
      </span>
    </p>
    <input ref="input" @input="addValue" />
  </div>
  <button @click="getText" class="restart">
    <span class="material-icons">autorenew</span>
  </button>
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
    const RANDOM_URL = 'https://api.quotable.io/random?minLength=50?maxLength=150';
    const ID_URL = 'https://api.quotable.io/quotes/';

    const input = ref(null);

    const loading = ref(true);
    const currLetter = ref(0);
    const userText = ref([]);
    const rawText = ref([]);

    const text = computed(() => rawText.value.join(''));

    function setQueryParams(quoteId) {
      const params = new URLSearchParams(window.location.search);
      params.set('q', encodeURI(quoteId));
      window.history.replaceState({}, '', `?${params.toString()}`);
    }

    function getText(encodeId) {
      loading.value = true;
      currLetter.value = 0;
      userText.value = [];
      const url = encodeId ? `${ID_URL}${decodeURI(encodeId)}` : RANDOM_URL;
      axios.get(url).then(({ data }) => {
        // eslint-disable-next-line
        setQueryParams(data._id);
        rawText.value = data.content.split('');
        loading.value = false;
        if (input.value) input.value.focus();
      });
    }

    function isWordsCorrect() {
      let isCorrect = true;
      for (let i = 0; i < rawText.value.slice(0, currLetter.value).length; i += 1) {
        if (userText.value[i] !== rawText.value[i]) {
          isCorrect = false;
          break;
        }
      }
      return isCorrect;
    }

    function addValue({ target, inputType, data }) {
      if (inputType === 'insertText') {
        userText.value.push(target.value[target.value.length - 1]);
        currLetter.value += 1;
        const isCorrect = isWordsCorrect();
        if (data === ' ' && isCorrect) input.value.value = '';
        if (currLetter.value > rawText.value.length && isCorrect) getText();
      } else if (inputType === 'deleteContentBackward') {
        currLetter.value -= 1;
        userText.value.pop();
      }
    }

    onMounted(() => {
      const params = new URLSearchParams(window.location.search);
      getText(params.get('q'));
      input.value.focus();
    });

    return {
      loading,
      text,
      rawText,
      currLetter,
      userText,
      getText,
      addValue,
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
    max-width: 700px;

    .passed-letter {
      background: rgba(lightgreen, 0.5);
    }
    .curr-letter {
      &::after {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: rgba(cyan, 1);
        animation: loading 1s infinite ease-out;
      }
    }
    .wrong-letter {
      // &::after {
      //   $dot-size: 10px;
      //   content: '';
      //   position: absolute;
      //   top: -3px;
      //   left: 50%;
      //   transform: translateX(-50%);
      //   height: $dot-size;
      //   width: $dot-size;
      //   border-radius: 50%;
      //   background: red;
      // }
      // outline: 2px solid rgba(red, 0.5);
      background: rgba($color: red, $alpha: 0.5) !important;
    }

    p {
      text-align: center;
      font-size: 30px;
      word-wrap: break-word;

      span {
        position: relative;
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
