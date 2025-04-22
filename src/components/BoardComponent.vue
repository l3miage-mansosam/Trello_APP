<template>
  <div class="board-container">
    <div v-if="board" class="board-title">
      <h2>{{ board.title }}</h2>
      <button 
        @click="toggleFavorite" 
        class="favorite-btn" 
        :class="{ 'is-favorite': board.isFavorite }"
        title="Toggle favorite"
      >
        <i class="fas" :class="board.isFavorite ? 'fa-star' : 'fa-star-o'"></i>
      </button>
    </div>
    <ListComponent 
      v-for="list in board.lists" 
      :key="list.id" 
      :list="list"
      @add-card="addCard"
      @delete-list="deleteList"
      @move-card="moveCard"
    />
    <div class="add-list-container">
      <div v-if="!showAddList" @click="showAddList = true" class="add-list-btn">
        <i class="fas fa-plus"></i> Add another list
      </div>
      <div v-else class="add-list-form">
        <input 
          v-model="newListTitle" 
          type="text" 
          placeholder="Enter list title..." 
          class="form-control"
          ref="newListInput"
          @keyup.enter="addList"
        >
        <div class="add-list-actions">
          <button @click="addList" class="btn btn-primary btn-sm">Add List</button>
          <button @click="showAddList = false" class="btn btn-light btn-sm ms-2">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import ListComponent from './ListComponent.vue'
import { List, Card, Board } from '../types'

export default defineComponent({
  name: 'BoardComponent',
  components: {
    ListComponent
  },
  props: {
    board: {
      type: Object as PropType<Board>,
      required: true
    }
  },
  emits: ['update:board'],
  setup(props, { emit }) {

    const showAddList = ref(false)
    const newListTitle = ref('')
    const newListInput = ref<HTMLInputElement | null>(null)
    
    const boardCopy = computed(() => {
      return JSON.parse(JSON.stringify(props.board))
    })
    
    const toggleFavorite = () => {
      const updatedBoard = { ...props.board, isFavorite: !props.board.isFavorite }
      emit('update:board', updatedBoard)
    }

    const addList = () => {
      if (newListTitle.value.trim()) {
        const updatedBoard = { ...props.board }
        const newId = Math.max(0, ...updatedBoard.lists.map(list => list.id)) + 1
        updatedBoard.lists.push({
          id: newId,
          title: newListTitle.value.trim(),
          cards: []
        })
        emit('update:board', updatedBoard)
        newListTitle.value = ''
        showAddList.value = false
      }
    }

    const deleteList = (listId: number) => {
      const updatedBoard = { ...props.board }
      const index = updatedBoard.lists.findIndex(list => list.id === listId)
      if (index !== -1) {
        updatedBoard.lists.splice(index, 1)
        emit('update:board', updatedBoard)
      }
    }

    const addCard = (listId: number, cardTitle: string) => {
      const updatedBoard = { ...props.board }
      const list = updatedBoard.lists.find(l => l.id === listId)
      if (list) {
        const newId = Math.max(0, ...updatedBoard.lists.flatMap(l => l.cards.map(c => c.id))) + 1
        list.cards.push({
          id: newId,
          title: cardTitle,
          description: ''
        })
        emit('update:board', updatedBoard)
      }
    }

    const moveCard = (cardId: number, fromListId: number, toListId: number, newIndex: number) => {
      const updatedBoard = { ...props.board }
      
      const sourceList = updatedBoard.lists.find(l => l.id === fromListId)
      if (!sourceList) return
      
      const cardIndex = sourceList.cards.findIndex(c => c.id === cardId)
      if (cardIndex === -1) return
      
      const [movedCard] = sourceList.cards.splice(cardIndex, 1)
      
      const destList = updatedBoard.lists.find(l => l.id === toListId)
      if (!destList) {
        sourceList.cards.splice(cardIndex, 0, movedCard)
        return
      }
      
      destList.cards.splice(newIndex, 0, movedCard)
      
      emit('update:board', updatedBoard)
    }

    return {
      showAddList,
      newListTitle,
      newListInput,
      addList,
      deleteList,
      addCard,
      moveCard,
      toggleFavorite
    }
  }
})
</script>

<style scoped>
.board-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.board-title h2 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
}

.favorite-btn {
  background: none;
  border: none;
  color: #f8d347;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.7;
}

.favorite-btn:hover {
  opacity: 1;
}

.favorite-btn.is-favorite {
  opacity: 1;
}

.board-container {
  display: flex;
  overflow-x: auto;
  padding: 20px;
  height: calc(100vh - 60px);
  align-items: flex-start;
  background-image: url("/assets/backround.jpg");
  background-size: cover;
  background-position: center;
}

.add-list-container {
  min-width: 272px;
  margin-right: 10px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  padding: 10px;
  height: fit-content;
}

.add-list-btn {
  cursor: pointer;
  padding: 10px;
  color: #172b4d;
}

.add-list-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
}

.add-list-form {
  background-color: #ebecf0;
  border-radius: 3px;
  padding: 10px;
}

.add-list-actions {
  margin-top: 10px;
  display: flex;
}

.form-control {
  border: 2px solid #0079bf;
  border-radius: 3px;
  padding: 8px;
  width: 100%;
}

.btn-primary {
  background-color: #0079bf;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
}

.btn-light {
  background-color: rgba(0, 0, 0, 0.08);
  color: #172b4d;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
}

.ms-2 {
  margin-left: 8px;
}
</style>
