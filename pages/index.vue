<template>
  <div class="main">
    <h1 class="main__header">🎉 Typist 🎉</h1>
    <div class="main__text">
      <p>
        <span
          v-for="(letter, idx) in rawText"
          :key="idx"
          :class="{
            'curr-letter': idx === currLetter,
            'passed-letter': idx < currLetter,
            'wrong-letter': userText[idx] !== letter && idx < currLetter,
          }"
          >{{ letter }}</span
        >
      </p>
      <span class="main__text__info">
        <span>{{ currWPMText }}</span>
        <span>By - {{ authorText }}</span>
      </span>
      <input ref="input" class="main__input" @input="addValue" />
    </div>
    <button class="main__restart" @click="restart">&#10226;</button>
    <transition name="fade" mode="out-in">
      <span v-if="userText.length === 0" class="main__top-left">
        Start Typing
      </span>
      <span v-else class="main__top-left">
        {{ timerText }}
      </span>
    </transition>
  </div>
</template>

<script>
export default {
  transition: 'fade',
  async asyncData({ $axios, query }) {
    const RANDOM_URL =
      'https://api.quotable.io/random?minLength=50?maxLength=150'
    const ID_URL = 'https://api.quotable.io/quotes/'

    const url = query.q ? `${ID_URL}${decodeURI(query.q)}` : RANDOM_URL
    const { data } = await $axios.get(url)

    const rawText = data.content.split('')
    const authorText = data.author
    const idText = data._id

    return { rawText, idText, authorText }
  },
  data: () => ({
    userText: [],
    WPMs: [],
    currLetter: 0,
    numWords: 0,
    timer: 0,
    maxWPM: 0,
  }),
  head() {
    return {
      title: `Typist | ${this.authorText}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Try yourself at speed typing, quote from ${this.authorText}`,
        },
      ],
    }
  },
  computed: {
    summedWPMs() {
      const allWPMs = this.WPMs.reduce((acc, wpm) => acc + wpm, 0)
      return Math.round(allWPMs / this.WPMs.length)
    },
    timerText() {
      const h = Math.floor(this.timer / 3600)
      const m = Math.floor((this.timer % 3600) / 60)
      const s = Math.round(this.timer % 60)
      return [h, m > 9 ? m : h ? `0${m}` : m || '0', s > 9 ? s : `0${s}`]
        .filter(Boolean)
        .join(':')
    },
    currWPMText() {
      const WPM = Math.round(this.numWords / (this.timer / 60)) || 0
      if (WPM < Infinity) this.WPMs.push(WPM)
      if (WPM < Infinity && this.maxWPM < WPM) this.maxWPM = WPM
      return `${WPM} WPM`
    },
  },
  mounted() {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('q')) this.setQueryParam()
    this.setTimer()
    this.$refs.input.focus()
  },
  methods: {
    restart() {
      this.userText = []
      this.WPMs = []
      this.currLetter = 0
      this.numWords = 0
      this.timer = 0
      this.maxWPM = 0
      this.$refs.input.value = ''
      const params = new URLSearchParams(window.location.search)
      params.delete('q')
      window.history.replaceState({}, '', `?${params.toString()}`)
      this.$nuxt.refresh().then(() => {
        this.setQueryParam()
        this.$refs.input.focus()
      })
    },
    setTimer() {
      setInterval(() => {
        if (this.userText.length !== 0) this.timer += 1
      }, 999)
    },
    setQueryParam() {
      const params = new URLSearchParams(window.location.search)
      params.set('q', encodeURI(this.idText))
      window.history.replaceState({}, '', `?${params.toString()}`)
    },
    isWordsCorrect() {
      let isCorrect = true

      const range = this.rawText.slice(0, this.currLetter).length
      for (let i = 0; i < range; i += 1) {
        if (this.userText[i] !== this.rawText[i]) {
          isCorrect = false
          break
        }
      }
      return isCorrect
    },
    addValue({ target, inputType, data }) {
      if (inputType === 'insertText') {
        this.userText.push(target.value[target.value.length - 1])
        this.currLetter += 1
        const isCorrect = this.isWordsCorrect()
        if (data === ' ' && isCorrect) {
          this.$refs.input.value = ''
          this.numWords += 1
        }
        if (this.currLetter > this.rawText.length && isCorrect) {
          const data = {
            wpm: this.summedWPMs,
            text: this.rawText.join(''),
            author: this.authorText,
            time: this.timerText,
            maxWPM: this.maxWPM,
            shareLink: window.location.toString(),
          }
          this.$router.push({
            path: 'results',
            query: { res: JSON.stringify(data) },
          })
        }
      } else if (inputType === 'deleteContentBackward') {
        this.currLetter -= 1
        this.userText.pop()
      }
    },
  },
}
</script>

<style lang="scss">
.main {
  &__header {
    padding-top: 5rem;
    font-size: 60px;
    text-align: center;
    margin-bottom: 5rem;
  }

  &__text {
    p {
      text-align: center;
      font-size: 30px;
      word-wrap: break-word;

      span {
        position: relative;
        transition: background 100ms linear;

        &.passed-letter {
          background: rgba(lightgreen, 0.5);
        }
        &.curr-letter::after {
          content: ' ';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(cyan, 1);
          animation: loading 1s infinite ease-out;
        }
        &.wrong-letter {
          background: rgba($color: red, $alpha: 0.5);
        }
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
  &__restart {
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
    cursor: pointer;

    &:hover,
    :focus {
      color: darken(white, 50);
    }
  }
  &__top-left {
    position: fixed;
    top: 1rem;
    left: 1rem;
    color: rgba($color: whitesmoke, $alpha: 0.8);
    font-size: 1.2rem;
  }
}
</style>
