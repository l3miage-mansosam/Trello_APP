<template>
  <span
    :class="[
      'badge',
      `bg-${variant}`,
      pill ? 'rounded-pill' : '',
      className
    ]"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AtomBadge',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark'
      ].includes(value)
    },
    pill: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  }
})
</script>