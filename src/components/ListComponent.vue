<template>
  <div class="list" 
    @dragover.prevent
    @drop="onDrop">
    <div class="list-header">
      {{ list.title }}
      <button @click="deleteList" class="delete-list-btn" title="Delete List">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="list-cards">
      <CardComponent 
        v-for="card in list.cards" 
        :key="card.id" 
        :card="card"
        :draggable="true"
        @dragstart="(event) => onDragStart(event, card.id)"
        @dragend="onDragEnd"
      />
    </div>
    <div v-if="!showAddCard" @click="showAddCard = true" class="add-card-btn">
      <i class="fas fa-plus"></i> Add a card
    </div>
    <div v-else class="add-card-form">
      <textarea 
        v-model="newCardTitle" 
        placeholder="Enter a title for this card..." 
        class="form-control"
        ref="newCardInput"
        @keyup.enter="addCard"
      ></textarea>
      <div class="add-card-actions">
        <button @click="addCard" class="btn btn-primary btn-sm">Add Card</button>
        <button @click="showAddCard = false" class="btn btn-light btn-sm ms-2">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from 'vue'
import CardComponent from './CardComponent.vue'
import { List } from '../types'

export default defineComponent({
  name: 'ListComponent',
  components: {
    CardComponent
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true
    }
  },
  emits: ['add-card', 'delete-list', 'move-card'],
  setup(props, { emit }) {
    const showAddCard = ref(false)
    const newCardTitle = ref('')
    const newCardInput = ref<HTMLTextAreaElement | null>(null)
    
    const deleteList = () => {
      if (confirm(`Are you sure you want to delete the list "${props.list.title}"?`)) {
        emit('delete-list', props.list.id)
      }
    }
    
    // Drag and drop functionality
    const onDragStart = (event: DragEvent, cardId: number) => {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('cardId', cardId.toString())
        event.dataTransfer.setData('fromListId', props.list.id.toString())
      }
    }
    
    const onDragEnd = () => {
      // Clean up if needed
    }
    
    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      
      if (event.dataTransfer) {
        const cardId = parseInt(event.dataTransfer.getData('cardId'))
        const fromListId = parseInt(event.dataTransfer.getData('fromListId'))
        const toListId = props.list.id
        
        // Calculate the drop index based on the position
        // For simplicity, we'll just append to the end of the list
        const newIndex = props.list.cards.length
        
        // Only emit if we're actually moving between lists or positions
        if (fromListId !== toListId || newIndex !== props.list.cards.findIndex(c => c.id === cardId)) {
          emit('move-card', cardId, fromListId, toListId, newIndex)
        }
      }
    }

    const addCard = () => {
      if (newCardTitle.value.trim()) {
        emit('add-card', props.list.id, newCardTitle.value.trim())
        newCardTitle.value = ''
        showAddCard.value = false
      }
    }

    onMounted(() => {
      if (showAddCard.value && newCardInput.value) {
        newCardInput.value.focus()
      }
    })

    return {
      showAddCard,
      newCardTitle,
      newCardInput,
      addCard,
      deleteList,
      onDragStart,
      onDragEnd,
      onDrop
    }
  }
})
</script>

<style scoped>
.list {
  background-color: #ebecf0;
  border-radius: 3px;
  width: 272px;
  min-width: 272px;
  margin-right: 10px;
  padding: 10px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.list-header {
  font-weight: bold;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-list-btn {
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 8px;
  opacity: 0.6;
}

.delete-list-btn:hover {
  opacity: 1;
  color: #172b4d;
}

.list-cards {
  margin-bottom: 10px;
}

.add-card-btn {
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  color: #172b4d;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.add-card-btn:hover {
  background-color: rgba(0, 0, 0, 0.16);
}

.add-card-form {
  margin-top: 10px;
}

.form-control {
  border: 2px solid #0079bf;
  border-radius: 3px;
  padding: 8px;
  width: 100%;
  resize: none;
  height: 60px;
}

.add-card-actions {
  margin-top: 10px;
  display: flex;
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