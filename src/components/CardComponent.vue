<template>
  <div 
    class="card" 
    @click="showCardDetails = true"
    :draggable="draggable"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="card-title">{{ card.title }}</div>
    <div v-if="card.description" class="card-description">
      <i class="fas fa-align-left text-muted"></i>
    </div>
  </div>

  <!-- Card Details Modal -->
  <div v-if="showCardDetails" class="modal-backdrop" @click.self="showCardDetails = false">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-credit-card me-2"></i>
          {{ card.title }}
        </h5>
        <button @click="showCardDetails = false" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-section">
          <h6><i class="fas fa-align-left me-2"></i>Description</h6>
          <p v-if="card.description">{{ card.description }}</p>
          <p v-else class="text-muted">Add a more detailed description...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { Card } from '../types'

export default defineComponent({
  name: 'CardComponent',
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['dragstart', 'dragend'],
  setup(props, { emit }) {
    const showCardDetails = ref(false)
    
    const onDragStart = (event: DragEvent) => {
      emit('dragstart', event)
    }
    
    const onDragEnd = (event: DragEvent) => {
      emit('dragend', event)
    }

    return {
      showCardDetails,
      onDragStart,
      onDragEnd
    }
  }
})
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 8px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  cursor: pointer;
}

.card:hover {
  background-color: #f9f9f9;
}

.card-title {
  font-size: 14px;
  word-wrap: break-word;
}

.card-description {
  margin-top: 8px;
  font-size: 12px;
  color: #6b778c;
}

.text-muted {
  color: #6b778c;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
  z-index: 1000;
}

.modal-content {
  background-color: #f4f5f7;
  border-radius: 3px;
  width: 768px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25);
}

.modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #dfe1e6;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #6b778c;
}

.modal-body {
  padding: 16px;
}

.card-section {
  margin-bottom: 24px;
}

.card-section h6 {
  font-weight: 600;
  margin-bottom: 8px;
}

.me-2 {
  margin-right: 8px;
}
</style>