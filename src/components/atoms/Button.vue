<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      size ? `btn-${size}` : '',
      block ? 'btn-block w-100' : '',
      className
    ]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AtomButton',
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
        'dark',
        'link',
        'outline-primary',
        'outline-secondary',
        'outline-success',
        'outline-danger',
        'outline-warning',
        'outline-info',
        'outline-light',
        'outline-dark'
      ].includes(value)
    },
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['', 'sm', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
})
</script>