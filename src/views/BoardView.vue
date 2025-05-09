<template>
  <div>
    <NavBar 
      @add-board="createNewBoard" 
      :boards="boards" 
      :currentBoardId="currentBoardId"
      @select-board="selectBoard"
    />
    <BoardComponent 
      v-if="currentBoard" 
      :board="currentBoard" 
      @update:board="updateBoard" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import BoardComponent from '../components/BoardComponent.vue'
import { Board } from '../types.ts'

export default defineComponent({
  name: 'BoardView',
  components: {
    NavBar,
    BoardComponent
  },
  setup() {
    const boards = ref<Board[]>([])
    const currentBoardId = ref<number | null>(null)
    
    const currentBoard = computed(() => {
      if (currentBoardId.value === null) return null
      return boards.value.find(board => board.id === currentBoardId.value) || null
    })
    
    const loadFromLocalStorage = () => {
      const savedBoards = localStorage.getItem('trello-boards')
      if (savedBoards) {
        boards.value = JSON.parse(savedBoards)
        const favoriteBoard = boards.value.find(board => board.isFavorite)
        currentBoardId.value = favoriteBoard ? favoriteBoard.id : (boards.value.length > 0 ? boards.value[0].id : null)
      } else {
        createDefaultBoard()
      }
    }
    
    watch(boards, (newBoards) => {
      localStorage.setItem('trello-boards', JSON.stringify(newBoards))
    }, { deep: true })
    
    const createDefaultBoard = () => {
      const newBoard: Board = {
        id: 1,
        title: 'My First Board',
        createdAt: Date.now(),
        lists: [
          {
            id: 1,
            title: 'To Do',
            cards: [
              { id: 1, title: 'Learn Vue 3', description: 'Study Vue 3 composition API' },
              { id: 2, title: 'Build a Trello clone', description: 'Create a simple Trello clone with Vue 3' }
            ]
          },
          {
            id: 2,
            title: 'In Progress',
            cards: [
              { id: 3, title: 'Setup project', description: 'Initialize Vue 3 project with TypeScript' }
            ]
          },
          {
            id: 3,
            title: 'Done',
            cards: [
              { id: 4, title: 'Project planning', description: 'Plan the Trello clone project structure' }
            ]
          }
        ]
      }
      
      boards.value.push(newBoard)
      currentBoardId.value = newBoard.id
    }
    
    const createNewBoard = () => {
      const boardName = prompt('Enter a name for your new board:')
      if (!boardName) return
      
      const newId = Math.max(0, ...boards.value.map(board => board.id)) + 1
      const newBoard: Board = {
        id: newId,
        title: boardName,
        createdAt: Date.now(),
        lists: [
          {
            id: 1,
            title: 'To Do',
            cards: []
          }
        ]
      }
      
      boards.value.push(newBoard)
      currentBoardId.value = newBoard.id
    }
    
    const selectBoard = (boardId: number) => {
      currentBoardId.value = boardId
    }
    
    const updateBoard = (updatedBoard: Board) => {
      const index = boards.value.findIndex(board => board.id === updatedBoard.id)
      if (index !== -1) {
        boards.value[index] = updatedBoard
      }
    }
    // c'est pour le raffrichement de la page et aussi pour la persistance des données
    onMounted(() => {
      loadFromLocalStorage()
    })
    
    return {
      boards,
      currentBoardId,
      currentBoard,
      createNewBoard,
      selectBoard,
      updateBoard
    }
  }
})
</script>