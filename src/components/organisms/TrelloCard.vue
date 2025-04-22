<template>
  <div
    class="card mb-2"
    :draggable="draggable"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="showCardDetails = true"
  >
    <div class="card-body p-2">
      <h6 class="card-title mb-1">{{ card.title }}</h6>
      <div v-if="card.description" class="d-flex align-items-center text-muted">
        <atom-icon name="card-text" :size="14" className="me-1" />
        <small>Description</small>
      </div>
    </div>
  </div>

  
  <molecule-modal
    :id="`card-modal-${card.id}`"
    :title="card.title"
    :show-save-button="false"
    ref="cardModal"
    @close="showCardDetails = false"
  >
    <div class="mb-3">
      <molecule-form-group
        :id="`card-title-${card.id}`"
        label="Title"
        v-model="editedTitle"
      />
    </div>
    
    <div class="mb-3">
      <label :for="`card-description-${card.id}`" class="form-label">Description</label>
      <textarea
        :id="`card-description-${card.id}`"
        class="form-control"
        v-model="editedDescription"
        rows="3"
      ></textarea>
    </div>
    
    <template #footer>
      <atom-button
        variant="danger"
        className="me-auto"
        @click="deleteCard"
      >
        Delete
      </atom-button>
      <atom-button
        variant="secondary"
        data-bs-dismiss="modal"
        @click="showCardDetails = false"
      >
        Close
      </atom-button>
      <atom-button
        variant="primary"
        @click="saveCard"
      >
        Save
      </atom-button>
    </template>
  </molecule-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Card } from '../../types'
import AtomIcon from '../atoms/Icon.vue'
import AtomButton from '../atoms/Button.vue'
import MoleculeModal from '../molecules/ModalComponent.vue'
import MoleculeFormGroup from '../molecules/FormGroup.vue'

export default defineComponent({
  name: 'OrganismTrelloCard',
  components: {
    AtomIcon,
    AtomButton,
    MoleculeModal,
    MoleculeFormGroup
  },
  props: {
    card: {
      type: Object as () => Card,
      required: true
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['dragstart', 'dragend', 'update:card', 'delete:card'],
  setup(props, { emit }) {
    const showCardDetails = ref(false)
    const cardModal = ref<any>(null)
    const editedTitle = ref(props.card.title)
    const editedDescription = ref(props.card.description)

    watch(() => props.card, (newCard) => {
      editedTitle.value = newCard.title
      editedDescription.value = newCard.description
    })

   
    watch(showCardDetails, (newValue) => {
      if (newValue && cardModal.value) {
        cardModal.value.show()
      }
    })

    const onDragStart = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', props.card.id.toString())
        emit('dragstart', event)
      }
    }

    const onDragEnd = (event: DragEvent) => {
      emit('dragend', event)
    }

    const saveCard = () => {
      emit('update:card', {
        ...props.card,
        title: editedTitle.value,
        description: editedDescription.value
      })
      showCardDetails.value = false
    }
      

    const deleteCard = () => {
      if (confirm('Are you sure you want to delete this card?')) {
        emit('delete:card', props.card.id)
       showCardDetails.value = false
      }
    }

    return {
      showCardDetails,
      cardModal,
      editedTitle,
      editedDescription,
      onDragStart,
      onDragEnd,
      saveCard,
      deleteCard
    }
  }
})
</script>