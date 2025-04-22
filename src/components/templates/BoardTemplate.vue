<template>
  <div class="board-template">
    <organism-navbar
      :boards="boards"
      :current-board-id="currentBoardId"
      @create-board="$emit('create-board')"
      @select-board="$emit('select-board', $event)"
      @toggle-favorite="$emit('toggle-favorite', $event)"
    />
    
    <main class="board-content">
      <div class="board-header">
        <h2 class="board-title">{{ currentBoard ? currentBoard.title : 'Loading...' }}</h2>
      </div>
      
      <div class="board-lists">
        <organism-trello-list
          v-for="list in currentBoard?.lists"
          :key="list.id"
          :list="list"
          @delete-list="$emit('delete-list', $event)"
          @add-card="$emit('add-card', $event)"
          @update-card="$emit('update-card', $event)"
          @delete-card="$emit('delete-card', $event)"
          @move-card="$emit('move-card', $event)"
        />
        
        <div class="add-list">
          <div v-if="!showAddListForm">
            <atom-button
              variant="light"
              className="add-list-button"
              @click="showAddListForm = true"
            >
              <atom-icon name="plus" :size="16" className="me-1" />
              Add another list
            </atom-button>
          </div>
          
          <div v-else class="add-list-form card">
            <div class="card-body p-2">
              <div class="mb-2">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter list title..."
                  v-model="newListTitle"
                  ref="newListInput"
                  @keyup.enter="addList"
                />
              </div>
              <div class="d-flex">
                <atom-button
                  variant="primary"
                  className="me-2"
                  @click="addList"
                >
                  Add List
                </atom-button>
                <atom-button
                  variant="light"
                  @click="showAddListForm = false"
                >
                  Cancel
                </atom-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { Board } from '@/types'
import AtomButton from '../atoms/Button.vue'
import AtomIcon from '../atoms/Icon.vue'
import OrganismNavbar from '../organisms/Navbar.vue'
import OrganismTrelloList from '../organisms/TrelloList.vue'

export default defineComponent({
  name: 'TemplateBoard',
  components: {
    AtomButton,
    AtomIcon,
    OrganismNavbar,
    OrganismTrelloList
  },
  props: {
    boards: {
      type: Array as () => Board[],
      default: () => []
    },
    currentBoardId: {
      type: Number as () => number | undefined,
      required: false
    }
  },
  emits: [
    'create-board',
    'select-board',
    'toggle-favorite',
    'add-list',
    'delete-list',
    'add-card',
    'update-card',
    'delete-card',
    'move-card'
  ],
  setup(props, { emit }) {
    const showAddListForm = ref(false)
    const newListTitle = ref('')
    const newListInput = ref<HTMLInputElement | null>(null)
    
      const currentBoard = computed(() => {
        if (props.currentBoardId === undefined) return null
        return props.boards.find(board => board.id === props.currentBoardId) || null
      })
    
    const addList = () => {
      if (newListTitle.value.trim()) {
        emit('add-list', {
          boardId: props.currentBoardId,
          title: newListTitle.value.trim()
        })
        newListTitle.value = ''
        showAddListForm.value = false
      }
    }
    
    watch(showAddListForm, (newValue) => {
      if (newValue) {
        nextTick(() => {
          if (newListInput.value) {
            newListInput.value.focus()
          }
        })
      }
    })
    
    return {
      showAddListForm,
      newListTitle,
      newListInput,
      currentBoard,
      addList
    }
  }
})
</script>

<style scoped>
.board-template {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.board-content {
  flex: 1;
  padding: 1rem;
  overflow-x: auto;
}

.board-header {
  margin-bottom: 1rem;
}

.board-title {
  text-align: center;
  
  padding-bottom: 0.5rem;
  padding-left: 5rem;
  display: flex;
  align-items: center;
  color:rgb(236, 238, 242);
  font-size: 2rem;
  font-weight: 600;
  position: relative;

}


.board-lists {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-height: calc(100vh - 160px);
}

.add-list {
  min-width: 272px;
}

.add-list-button {
  background-color: rgba(255, 255, 255, 0.24);
  color: #172b4d;
  width: 272px;
  text-align: left;
  padding: 0.75rem;
  border-radius: 3px;
}

.add-list-button:hover {
  background-color: rgba(255, 255, 255, 0.32);
}

.add-list-form {
  width: 272px;
}
</style>