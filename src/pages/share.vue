<template>
  <div class="container"></div>
</template>

<script lang="ts">
import { defineComponent, useAsync, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  // @ts-ignore
  head() {
    if (!this.response) return
    // @ts-ignore
    const { data } = this.response
    console.log(data)
    return {
      meta: [{ hid: 'og:image', property: 'og:image', content: data }],
    }
  },
  setup() {
    const { app } = useContext()
    const response = useAsync(() =>
      app.$axios.get('http://localhost:3000/api/ogp')
    )
    return {
      response,
    }
  },
})
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
