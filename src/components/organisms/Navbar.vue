<template>
  <nav-bar
    :boards="boards"
    :current-board-id="currentBoardId"
    @add-board="$emit('create-board')"
    @select-board="$emit('select-board', $event)"
    @update:board="$emit('toggle-favorite', $event.id)"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Board } from '../../types'
import NavBar from '../../components/NavBar.vue'

export default defineComponent({
  name: 'OrganismNavbar',
  components: {
    NavBar
  },
  props: {
    boards: {
      type: Array as PropType<Board[]>,
      default: () => []
    },
    currentBoardId: {
      type: Number,
      required: true
    }
  },
  emits: ['create-board', 'select-board', 'toggle-favorite']
})
</script>