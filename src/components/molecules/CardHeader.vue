<template>
  <div class="card-header d-flex justify-content-between align-items-center">
    <h5 class="card-title mb-0">{{ title }}</h5>
    <div class="card-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MoleculeCardHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  }
})
</script>