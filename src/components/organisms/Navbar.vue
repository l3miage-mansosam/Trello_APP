<template>
  <nav class="trello-navbar">
    <div class="trello-navbar-brand">
      <i class="fab fa-trello"></i> Trello Clone
    </div>
    <div class="trello-navbar-boards">
      <div 
        v-for="board in boards" 
        :key="board.id" 
        class="trello-board-item" 
        :class="{ active: board.id === currentBoardId }"
        @click="selectBoard(board.id)"
      >
        {{ board.title }}
        <i 
          class="fas" 
          :class="board.isFavorite ? 'fa-star' : 'fa-star-o'"
          @click.stop="toggleFavorite(board.id)"
        ></i>
      </div>
    </div>
    <div class="trello-navbar-menu">
      <button @click="createBoard" class="trello-btn">
        <i class="fas fa-plus"></i> Create Board
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Board } from '@/types'

export default defineComponent({
  name: 'OrganismNavbar',
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
  emits: ['create-board', 'select-board', 'toggle-favorite'],
  setup(props, { emit }) {
    const createBoard = () => {
      emit('create-board')
    }
    
    const selectBoard = (boardId: number) => {
      emit('select-board', boardId)
    }
    
    const toggleFavorite = (boardId: number) => {
      emit('toggle-favorite', boardId)
    }
    
    return {
      createBoard,
      selectBoard,
      toggleFavorite
    }
  }
})
</script>

<style>
.trello-navbar {
  background: linear-gradient(135deg, var(--primary-color), #0747a6);
  color: white;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.trello-navbar-brand {
  font-weight: bold;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.trello-navbar-brand:hover {
  transform: scale(1.05);
}

.trello-navbar-brand i {
  margin-right: 10px;
  font-size: 1.8rem;
}

.trello-navbar-boards {
  display: flex;
  overflow-x: auto;
  max-width: 60%;
  margin: 0 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.trello-navbar-boards::-webkit-scrollbar {
  height: 4px;
}

.trello-navbar-boards::-webkit-scrollbar-track {
  background: transparent;
}

.trello-navbar-boards::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.trello-board-item {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 8px 14px;
  border-radius: 4px;
  margin-right: 12px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.trello-board-item:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.trello-board-item.active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-left: 3px solid #ffeb3b;
}

.trello-board-item i {
  margin-left: 10px;
  color: #ffeb3b;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.trello-board-item i.fa-star {
  opacity: 1;
  transform: scale(1.2);
}

.trello-board-item:hover i {
  opacity: 1;
}

.trello-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.trello-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.trello-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.trello-btn i {
  margin-right: 6px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .trello-navbar {
    padding: 10px 16px;
  }
  
  .trello-navbar-brand {
    font-size: 1.4rem;
  }
  
  .trello-navbar-boards {
    max-width: 50%;
  }
  
  .trello-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>