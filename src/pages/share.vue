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
    const id = app.context.route.query.id
    if (!process.client) return
    // const endpoint = `http://localhost:5000/create-ogp-ee39e/us-central1/api/ogp`
    const endpoint =
      'https://us-central1-create-ogp-ee39e.cloudfunctions.net/api/ogp'
    const response = useAsync(() =>
      app.$axios.get(endpoint, {
        params: {
          id: id,
        },
      })
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
