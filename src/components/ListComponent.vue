<template>
  <div class="list" 
    @dragover.prevent="onDragOver"
    @dragenter.prevent
    @dragleave="onDragLeave"
    @drop="onDrop">
    <div class="list-header">
      {{ list.title }}
      <button @click="deleteList" class="delete-list-btn" title="Delete List">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="list-cards">
      <div class="card-drop-area" v-if="list.cards.length === 0 && isListDraggedOver" />
      <div v-for="(card, index) in list.cards" :key="card.id" class="card-wrapper">
        <div 
          class="card-drop-indicator"
          :class="{ 'active': dropTargetIndex === index }"
          @dragover.prevent="onCardDropAreaOver(index)"
          @drop="onCardDropAreaDrop(index, $event)"
        />
        <CardComponent 
  v-for="card in list.cards" 
  :key="card.id" 
  :card="card" 
  :draggable="true" 
  @dragstart="onDragStart" 
  @dragend="onDragEnd" 
/>
        <div 
          v-if="index === list.cards.length - 1"
          class="card-drop-indicator"
          :class="{ 'active': dropTargetIndex === list.cards.length }"
          @dragover.prevent="onCardDropAreaOver(list.cards.length)"
          @drop="onCardDropAreaDrop(list.cards.length, $event)"
        />
      </div>
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
    
    const isListDraggedOver = ref(false)
    const dropTargetIndex = ref(-1)
    
    const onDragStart = (event: DragEvent, cardId: number) => {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        
        const dragData = JSON.stringify({
          cardId,
          fromListId: props.list.id
        })
        
        event.dataTransfer.setData('application/json', dragData)
        
        document.body.classList.add('card-dragging')
      }
    }
    
    const onDragEnd = () => {
      isListDraggedOver.value = false
      dropTargetIndex.value = -1
      document.body.classList.remove('card-dragging')
    }
    
    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
      isListDraggedOver.value = true
      
      if (dropTargetIndex.value === -1) {
        dropTargetIndex.value = props.list.cards.length
      }
    }
    
    const onDragLeave = (event: DragEvent) => {
      const currentTarget = event.currentTarget as HTMLElement
      if (currentTarget && !currentTarget.contains(event.relatedTarget as Node)) {
        isListDraggedOver.value = false
        dropTargetIndex.value = -1
      }
    }
    
    const onCardDropAreaOver = (index: number) => {
      dropTargetIndex.value = index
    }
    
    const onCardDropAreaDrop = (index: number, event: DragEvent) => {
      onDropAtIndex(index, event)
    }
    
    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      
 
      if (dropTargetIndex.value === -1) {
        onDropAtIndex(props.list.cards.length, event)
      } else {
        onDropAtIndex(dropTargetIndex.value, event)
      }
    }
    
    const onDropAtIndex = (newIndex: number, event: DragEvent) => {
      if (!event.dataTransfer) return
      
      try {
        const jsonData = event.dataTransfer.getData('application/json')
        if (!jsonData) return
        
        const dragData = JSON.parse(jsonData)
        const cardId = dragData.cardId
        const fromListId = dragData.fromListId
        const toListId = props.list.id
        
        const cardIndex = props.list.cards.findIndex(c => c.id === cardId)
        
        if (fromListId === toListId && cardIndex !== -1 && newIndex > cardIndex) {
          newIndex--
        }
        
        if (fromListId === toListId && cardIndex === newIndex) {
          return
        }
        
        emit('move-card', cardId, fromListId, toListId, newIndex)
      } catch (error) {
        console.error('Error parsing drag data:', error)
      }
      
      isListDraggedOver.value = false
      dropTargetIndex.value = -1
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
      isListDraggedOver,
      dropTargetIndex,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragLeave,
      onCardDropAreaOver,
      onCardDropAreaDrop,
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
  min-height: 8px; 
}

.card-wrapper {
  position: relative;
}

.card-drop-area {
  height: 60px;
  background-color: rgba(0, 121, 191, 0.15);
  border-radius: 3px;
  margin-bottom: 8px;
  border: 2px dashed rgba(0, 121, 191, 0.3);
}

.card-drop-indicator {
  height: 2px;
  background-color: transparent;
  margin: 0;
  transition: height 0.2s ease, background-color 0.2s ease;
}

.card-drop-indicator.active {
  height: 8px;
  background-color: #0079bf;
  border-radius: 3px;
  margin: 4px 0;
}

body.card-dragging .list {
  background-color: #ebecf0;
}

body.card-dragging .card {
  cursor: grabbing;
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