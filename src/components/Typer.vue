<template>
  <div>
    <h1 class="header">🎉 Typist 🎉</h1>
    <div class="main">
      <p class="main__text">
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
      <span class="main__info">
        <span>{{ currWPMText }}</span>
        <span>By - {{ authorText }}</span></span
      >
      <input ref="input" class="main__input" @input="addValue" />
    </div>
    <button @click="() => getText()" class="restart-button">
      <span class="material-icons">autorenew</span>
    </button>
    <transition name="fade" mode="out-in">
      <span v-if="userText.length === 0" class="top-left">
        Start Typing
      </span>
      <span v-else class="top-left">
        {{ timerText }}
      </span>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line
import { ref, computed, onMounted, inject } from 'vue';
import axios from 'axios';

export default {
  name: 'App',
  setup(_, { emit }) {
    const RANDOM_URL = 'https://api.quotable.io/random?minLength=50?maxLength=150';
    const ID_URL = 'https://api.quotable.io/quotes/';

    const input = ref(null);

    const loading = inject('loading');
    const currLetter = ref(0);
    const numWords = ref(0);
    const userText = ref([]);
    const rawText = ref([]);
    const authorText = ref('');
    const timer = ref(0);
    const WPMs = ref([]);
    const maxWPM = ref(0);

    const summedWPMs = computed(() => {
      const allWPMs = WPMs.value.reduce((acc, wpm) => acc + wpm, 0);
      return Math.round(allWPMs / WPMs.value.length);
    });
    const currWPMText = computed(() => {
      const WPM = Math.round(numWords.value / (timer.value / 60)) || 0;
      if (WPM < Infinity) WPMs.value.push(WPM);
      if (WPM < Infinity && maxWPM.value < WPM) maxWPM.value = WPM;
      return `${WPM} WPM`;
    });
    const timerText = computed(() => {
      const h = Math.floor(timer.value / 3600);
      const m = Math.floor((timer.value % 3600) / 60);
      const s = Math.round(timer.value % 60);
      // eslint-disable-next-line no-nested-ternary
      return [h, m > 9 ? m : h ? `0${m}` : m || '0', s > 9 ? s : `0${s}`].filter(Boolean).join(':');
    });
    const text = computed(() => rawText.value.join(''));

    function setQueryParams(quoteId) {
      const params = new URLSearchParams(window.location.search);
      params.set('q', encodeURI(quoteId));
      window.history.replaceState({}, '', `?${params.toString()}`);
    }

    function getText(encodeId) {
      loading.value = true;
      currLetter.value = 0;
      timer.value = 0;
      numWords.value = 0;
      userText.value = [];
      WPMs.value = [];
      maxWPM.value = 0;
      const url = encodeId ? `${ID_URL}${decodeURI(encodeId)}` : RANDOM_URL;
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then(({ data }) => {
            // eslint-disable-next-line
            setQueryParams(data._id);
            authorText.value = data.author;
            rawText.value = data.content.split('');
            loading.value = false;
            if (input.value) input.value.focus();
            resolve();
          })
          .catch(reject);
      });
    }
    function setTimer() {
      setInterval(() => {
        if (userText.value.length !== 0) timer.value += 1;
      }, 999);
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
        if (data === ' ' && isCorrect) {
          input.value.value = '';
          numWords.value += 1;
        }
        if (currLetter.value > rawText.value.length && isCorrect) {
          emit('toggle-view', {
            data: {
              wpm: summedWPMs,
              text: text.value,
              author: authorText,
              time: timerText.value,
              maxWPM,
              getText,
            },
            to: 'Results',
          });
        }
      } else if (inputType === 'deleteContentBackward') {
        currLetter.value -= 1;
        userText.value.pop();
      }
    }

    onMounted(() => {
      const params = new URLSearchParams(window.location.search);
      getText(params.get('q'));
      input.value.focus();
      setTimer();
    });

    return {
      text,
      rawText,
      currLetter,
      userText,
      authorText,
      timerText,
      currWPMText,
      getText,
      addValue,
      input,
    };
  },
  emits: ['toggle-view'],
};
</script>

<style lang="scss">
.header {
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
  .curr-letter::after {
    content: ' ';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(cyan, 1);
    animation: loading 1s infinite ease-out;
  }
  .wrong-letter {
    background: rgba($color: red, $alpha: 0.5);
  }

  &__text {
    text-align: center;
    font-size: 30px;
    word-wrap: break-word;

    span {
      position: relative;
      transition: background 100ms linear;
    }
  }
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-style: italic;
    margin-top: 1rem;
    color: rgba($color: whitesmoke, $alpha: 0.6);
  }
  &__input {
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

.top-left {
  position: fixed;
  top: 1rem;
  left: 1rem;
  color: rgba($color: whitesmoke, $alpha: 0.8);
  font-size: 1.2rem;
  &.blicking-text {
    font-size: 1rem;
    color: rgba($color: whitesmoke, $alpha: 0.6);
    animation: loading 3s infinite;
  }
}
.restart-button {
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
