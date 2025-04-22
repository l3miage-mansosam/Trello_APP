<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <i class="fab fa-trello"></i> Trello Clone
    </div>
    <div class="navbar-boards">
      <div 
        v-for="board in boards" 
        :key="board.id" 
        class="board-item" 
        :class="{ active: board.id === currentBoardId }"
        @click="selectBoard(board.id)"
      >
        {{ board.title }}
        <i 
          class="fas" 
          :class="board.isFavorite ? 'fa-star' : 'fa-star-o'"
          @click.stop="toggleFavorite(board)"
        ></i>
      </div>
    </div>
    <div class="navbar-menu">
      <button @click="addBoard" class="btn btn-sm btn-light">
        <i class="fas fa-plus"></i> Create Board
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Board } from '../types'

export default defineComponent({
  name: 'NavBar',
  props: {
    boards: {
      type: Array as PropType<Board[]>,
      required: true
    },
    currentBoardId: {
      type: Number,
      default: null
    }
  },
  emits: ['add-board', 'select-board', 'update:board'],
  setup(props, { emit }) {
    const addBoard = () => {
      emit('add-board')
    }
    
    const selectBoard = (boardId: number) => {
      emit('select-board', boardId)
    }
    
    const toggleFavorite = (board: Board) => {
      const updatedBoard = { ...board, isFavorite: !board.isFavorite }
      emit('update:board', updatedBoard)
    }
    
    return {
      addBoard,
      selectBoard,
      toggleFavorite
    }
  }
})
</script>

<style scoped>
.navbar {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.navbar-brand i {
  margin-right: 8px;
}

.navbar-boards {
  display: flex;
  overflow-x: auto;
  max-width: 60%;
  margin: 0 20px;
}

.board-item {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 3px;
  margin-right: 10px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.board-item.active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

.board-item i {
  margin-left: 8px;
  color: #f8d347;
  opacity: 0.7;
}

.board-item i.fa-star {
  opacity: 1;
}

.btn {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.btn i {
  margin-right: 4px;
}
</style>