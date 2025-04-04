<template>
  <i :class="['bi', `bi-${name}`, className]" :style="{ fontSize: size + 'px' }"></i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AtomIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 16
    },
    className: {
      type: String,
      default: ''
    }
  }
})
</script>