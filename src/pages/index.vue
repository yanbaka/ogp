<template>
  <div class="container">
    <div>
      <Share />
      <div v-if="responseHello">
        {{ responseHello.data }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useAsync } from '@nuxtjs/composition-api';
import axios from 'axios';

export default defineComponent({
  setup() {
    const responseHello = useAsync(() =>
      axios.get('http://localhost:3000/api/hello')
    );
    return {
      responseHello,
    };
  },
});
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
