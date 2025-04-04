<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <atom-input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :model-value="modelValue"
      :disabled="disabled"
      :required="required"
      :size="size"
      :class-name="inputClassName"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div v-if="helpText" class="form-text">{{ helpText }}</div>
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AtomInput from '../atoms/Input.vue'

export default defineComponent({
  name: 'MoleculeFormGroup',
  components: {
    AtomInput
  },
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    inputClassName: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
})
</script>