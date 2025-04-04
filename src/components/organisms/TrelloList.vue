<template>
  <div
    class="card trello-list"
    @dragover.prevent
    @drop="onDrop"
  >
    <molecule-card-header :title="list.title">
      <template #actions>
        <button
          type="button"
          class="btn-close"
          aria-label="Delete list"
          @click="confirmDeleteList"
        ></button>
      </template>
    </molecule-card-header>
    
    <div class="card-body p-2">
      <div class="list-cards">
        <organism-trello-card
          v-for="card in list.cards"
          :key="card.id"
          :card="card"
          @dragstart="(event) => onCardDragStart(event, card.id)"
          @dragend="onCardDragEnd"
          @update:card="updateCard"
          @delete:card="deleteCard"
        />
      </div>
      
      <div class="mt-2">
        <div v-if="!showAddForm">
          <atom-button
            variant="light"
            class="w-100 text-start"
            @click="showAddForm = true"
          >
            <atom-icon name="plus" :size="16" className="me-1" />
            Add a card
          </atom-button>
        </div>
        
        <div v-else class="add-card-form">
          <div class="mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Enter card title..."
              v-model="newCardTitle"
              ref="newCardInput"
              @keyup.enter="addCard"
            />
          </div>
          <div class="d-flex">
            <atom-button
              variant="primary"
              className="me-2"
              @click="addCard"
            >
              Add Card
            </atom-button>
            <atom-button
              variant="light"
              @click="showAddForm = false"
            >
              Cancel
            </atom-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import { List, Card } from '@/types'
import AtomButton from '../atoms/Button.vue'
import AtomIcon from '../atoms/Icon.vue'
import MoleculeCardHeader from '../molecules/CardHeader.vue'
import OrganismTrelloCard from './TrelloCard.vue'

export default defineComponent({
  name: 'OrganismTrelloList',
  components: {
    AtomButton,
    AtomIcon,
    MoleculeCardHeader,
    OrganismTrelloCard
  },
  props: {
    list: {
      type: Object as () => List,
      required: true
    }
  },
  emits: ['delete-list', 'add-card', 'update-card', 'delete-card', 'move-card'],
  setup(props, { emit }) {
    const showAddForm = ref(false)
    const newCardTitle = ref('')
    const newCardInput = ref<HTMLInputElement | null>(null)
    
    // For drag and drop
    const draggedCardId = ref<number | null>(null)
    
    const confirmDeleteList = () => {
      if (confirm(`Are you sure you want to delete the list "${props.list.title}"?`)) {
        emit('delete-list', props.list.id)
      }
    }
    
    const addCard = () => {
      if (newCardTitle.value.trim()) {
        emit('add-card', {
          listId: props.list.id,
          title: newCardTitle.value.trim()
        })
        newCardTitle.value = ''
        // Keep the form open for adding multiple cards
      }
    }
    
    const updateCard = (updatedCard: Card) => {
      emit('update-card', updatedCard)
    }
    
    const deleteCard = (cardId: number) => {
      emit('delete-card', {
        listId: props.list.id,
        cardId
      })
    }
    
    const onCardDragStart = (event: DragEvent, cardId: number) => {
      // Set the card ID directly
      draggedCardId.value = cardId
      
      // Also set it in the dataTransfer object for the drop handler
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', cardId.toString())
      }
    }
    
    const onCardDragEnd = () => {
      draggedCardId.value = null
    }
    
    const onDrop = (event: DragEvent) => {
      if (event.dataTransfer) {
        const cardId = parseInt(event.dataTransfer.getData('text/plain'), 10)
        if (!isNaN(cardId) && draggedCardId.value === cardId) {
          emit('move-card', {
            cardId,
            targetListId: props.list.id,
            targetIndex: props.list.cards.length // Add to the end of the list
          })
        }
      }
    }
    
    // Focus the input when the add form is shown
    watch(showAddForm, (newValue) => {
      if (newValue) {
        nextTick(() => {
          if (newCardInput.value) {
            newCardInput.value.focus()
          }
        })
      }
    })
    
    return {
      showAddForm,
      newCardTitle,
      newCardInput,
      confirmDeleteList,
      addCard,
      updateCard,
      deleteCard,
      onCardDragStart,
      onCardDragEnd,
      onDrop
    }
  }
})
</script>

<style scoped>
.trello-list {
  width: 272px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.list-cards {
  overflow-y: auto;
  max-height: calc(100vh - 210px);
}

.add-card-form {
  padding: 4px 0;
}
</style>