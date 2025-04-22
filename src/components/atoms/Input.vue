<template>
  <input
    :type="type"
    :class="[
      'form-control',
      size ? `form-control-${size}` : '',
      className
    ]"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value || '')"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AtomInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => [
        'text',
        'password',
        'email',
        'number',
        'search',
        'tel',
        'url'
      ].includes(value)
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['', 'sm', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
})
</script>