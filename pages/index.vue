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
      <input ref="input" class="main__input" @input="addValue" />
    </div>
    <button class="main__restart" @click="$nuxt.refresh">&#10226;</button>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, query }) {
    const RANDOM_URL =
      'https://api.quotable.io/random?minLength=50?maxLength=150'
    const ID_URL = 'https://api.quotable.io/quotes/'

    const url = query.q ? `${ID_URL}${decodeURI(query.q)}` : RANDOM_URL
    const { data } = await $axios.get(url)

    const rawText = data.content.split('')

    return { rawText, idText: data._id }
  },
  data: () => ({
    userText: [],
    currLetter: 0,
    numWords: 0,
  }),
  computed: {},
  mounted() {
    this.setQueryParam()
    this.$refs.input.focus()
  },
  methods: {
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
          console.log('finished')
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
  text-align: center;
  max-width: 700px;
  margin: 0 auto;

  &__header {
    padding-top: 5rem;
    font-size: 60px;
    text-align: center;
    margin-bottom: 5rem;
  }

  &__text p {
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
}
</style>
