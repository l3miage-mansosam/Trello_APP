<template>
  <template-board
    :boards="boards"
    :current-board-id="currentBoardId"
    @create-board="createBoard"
    @select-board="selectBoard"
    @toggle-favorite="toggleFavorite"
    @add-list="addList"
    @delete-list="deleteList"
    @add-card="addCard"
    @update-card="updateCard"
    @delete-card="deleteCard"
    @move-card="moveCard"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { Board, List, Card } from '@/types'
import TemplateBoard from '../components/templates/BoardTemplate.vue'

export default defineComponent({
  name: 'PageBoard',
  components: {
    TemplateBoard
  },
  setup() {
    const boards = ref<Board[]>([])
    const currentBoardId = ref<number>(0)
    
    // Load boards from localStorage
    const loadFromLocalStorage = () => {
      const savedBoards = localStorage.getItem('trello-boards')
      if (savedBoards) {
        boards.value = JSON.parse(savedBoards)
        
        // Set current board to the first board or the first favorite
        if (boards.value.length > 0) {
          const favoriteBoard = boards.value.find(board => board.isFavorite)
          currentBoardId.value = favoriteBoard ? favoriteBoard.id : boards.value[0].id
        }
      } else {
        // Create a default board if none exists
        createDefaultBoard()
      }
    }
    
    // Create a default board
    const createDefaultBoard = () => {
      const defaultBoard: Board = {
        id: 1,
        title: 'My First Board',
        lists: [
          {
            id: 1,
            title: 'To Do',
            cards: [
              { id: 1, title: 'Learn Vue 3', description: 'Study the Composition API' },
              { id: 2, title: 'Build a Trello clone', description: 'Create a Trello clone with Vue 3' }
            ]
          },
          {
            id: 2,
            title: 'In Progress',
            cards: [
              { id: 3, title: 'Setup project', description: 'Initialize the project with Vite and Vue 3' }
            ]
          },
          {
            id: 3,
            title: 'Done',
            cards: [
              { id: 4, title: 'Project planning', description: 'Plan the project structure and features' }
            ]
          }
        ],
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
      
      boards.value = [defaultBoard]
      currentBoardId.value = defaultBoard.id
      saveToLocalStorage()
    }
    
    // Save boards to localStorage
    const saveToLocalStorage = () => {
      localStorage.setItem('trello-boards', JSON.stringify(boards.value))
    }
    
    // Watch for changes to save to localStorage
    watch(boards, () => {
      saveToLocalStorage()
    }, { deep: true })
    
    // Board operations
    const createBoard = () => {
      const boardName = prompt('Enter board name:')
      if (boardName && boardName.trim()) {
        const newBoard: Board = {
          id: Date.now(),
          title: boardName.trim(),
          lists: [
            {
              id: Date.now() + 1,
              title: 'To Do',
              cards: []
            }
          ],
          isFavorite: false,
          createdAt: new Date().toISOString()
        }
        
        boards.value.push(newBoard)
        currentBoardId.value = newBoard.id
      }
    }
    
    const selectBoard = (boardId: number) => {
      currentBoardId.value = boardId
    }
    
    const toggleFavorite = (boardId: number) => {
      const board = boards.value.find(b => b.id === boardId)
      if (board) {
        board.isFavorite = !board.isFavorite
      }
    }
    
    // List operations
    const addList = ({ boardId, title }: { boardId: number, title: string }) => {
      const board = boards.value.find(b => b.id === boardId)
      if (board) {
        const newList: List = {
          id: Date.now(),
          title,
          cards: []
        }
        board.lists.push(newList)
      }
    }
    
    const deleteList = (listId: number) => {
      const board = boards.value.find(b => b.id === currentBoardId.value)
      if (board) {
        board.lists = board.lists.filter(list => list.id !== listId)
      }
    }
    
    // Card operations
    const addCard = ({ listId, title }: { listId: number, title: string }) => {
      const board = boards.value.find(b => b.id === currentBoardId.value)
      if (board) {
        const list = board.lists.find(l => l.id === listId)
        if (list) {
          const newCard: Card = {
            id: Date.now(),
            title,
            description: ''
          }
          list.cards.push(newCard)
        }
      }
    }
    
    const updateCard = (updatedCard: Card) => {
      const board = boards.value.find(b => b.id === currentBoardId.value)
      if (board) {
        for (const list of board.lists) {
          const cardIndex = list.cards.findIndex(c => c.id === updatedCard.id)
          if (cardIndex !== -1) {
            list.cards[cardIndex] = updatedCard
            break
          }
        }
      }
    }
    
    const deleteCard = ({ listId, cardId }: { listId: number, cardId: number }) => {
      const board = boards.value.find(b => b.id === currentBoardId.value)
      if (board) {
        const list = board.lists.find(l => l.id === listId)
        if (list) {
          list.cards = list.cards.filter(card => card.id !== cardId)
        }
      }
    }
    
    const moveCard = ({ cardId, targetListId, targetIndex }: { cardId: number, targetListId: number, targetIndex: number }) => {
      const board = boards.value.find(b => b.id === currentBoardId.value)
      if (board) {
        // Find the card and its source list
        let sourceList: List | undefined
        let card: Card | undefined
        
        for (const list of board.lists) {
          const cardIndex = list.cards.findIndex(c => c.id === cardId)
          if (cardIndex !== -1) {
            sourceList = list
            card = { ...list.cards[cardIndex] }
            list.cards.splice(cardIndex, 1)
            break
          }
        }
        
        // Add the card to the target list
        if (card && sourceList) {
          const targetList = board.lists.find(l => l.id === targetListId)
          if (targetList) {
            targetList.cards.splice(targetIndex, 0, card)
          } else {
            // If target list not found, put the card back
            sourceList.cards.push(card)
          }
        }
      }
    }
    
    // Load data on mount
    onMounted(() => {
      loadFromLocalStorage()
    })
    
    return {
      boards,
      currentBoardId,
      createBoard,
      selectBoard,
      toggleFavorite,
      addList,
      deleteList,
      addCard,
      updateCard,
      deleteCard,
      moveCard
    }
  }
})
</script>