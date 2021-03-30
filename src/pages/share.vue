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
    const response = useAsync(() =>
      app.$axios.get(`${process.env.BASE_URL}/api/ogp`, {
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
