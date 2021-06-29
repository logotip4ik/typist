<template>
  <div class="main">
    <p class="text">Text: {{ results.text }}</p>
    <h1>WPM - {{ results.wpm }}</h1>
    <h3>max WPM - {{ results.maxWPM }}</h3>
    <h3>Time - {{ results.time }}</h3>
    <div class="buttons">
      <button
        class="button back"
        @click="() => $router.push(results.shareLink)"
      >
        Back
      </button>
      <button
        class="button share"
        @click="() => copyTextToClipboard(results.shareLink)"
      >
        Share Text Link
      </button>
      <button
        class="button share"
        @click="() => copyTextToClipboard(currentPath)"
      >
        Share Results
      </button>
      <button
        ref="nextButton"
        class="button next"
        @click="() => $router.push({ path: '/', query: { q: '' } })"
      >
        Next
      </button>
    </div>
    <small>Type ENTER to go next</small>
  </div>
</template>

<script>
export default {
  transition: 'fade',
  asyncData({ query, redirect, req }) {
    if (!query.res) return redirect('/')
    return {
      results: JSON.parse(query.res),
      hostname: req ? req.headers.host : null,
    }
  },
  head() {
    return {
      title: `${this.results.wpm}WPM | ${this.results.time}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `I finished text from ${this.authorText} for ${this.results.time} seconds. Let's see how would you do!`,
        },
      ],
    }
  },
  computed: {
    currentPath() {
      if (this.hostname)
        return `https://${this.hostname}${this.$route.fullPath}`
      return window.location.toString()
    },
  },
  mounted() {
    this.$refs.nextButton.focus()
  },
  methods: {
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text

      // Avoid scrolling to bottom
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (err) {}

      document.body.removeChild(textArea)
    },
    copyTextToClipboard(text) {
      if (!navigator.clipboard) return this.fallbackCopyTextToClipboard(text)
      navigator.clipboard.writeText(text)
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
    transition: transform 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
      box-shadow 100ms ease-out;

    &:hover,
    &:focus {
      transform: scale3d(1.05, 1.05, 1.05);
      box-shadow: 0 0 10px 0 rgba($color: whitesmoke, $alpha: 0.25);
    }
    &.share {
      background-color: rgb(3, 0, 182);
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
