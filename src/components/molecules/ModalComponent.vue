<template>
  <div
    class="modal fade"
    :id="id"
    tabindex="-1"
    :aria-labelledby="`${id}Label`"
    aria-hidden="true"
    ref="modalRef"
  >
    <div :class="['modal-dialog', size ? `modal-${size}` : '']">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${id}Label`">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="close"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <atom-button
              variant="secondary"
              data-bs-dismiss="modal"
              @click="close"
            >
              Close
            </atom-button>
            <atom-button
              v-if="showSaveButton"
              variant="primary"
              @click="save"
            >
              Save
            </atom-button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import AtomButton from '../atoms/Button.vue'

export default defineComponent({
  name: 'MoleculeModal',
  components: {
    AtomButton
  },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '',
      validator: (value: string) => ['', 'sm', 'lg', 'xl'].includes(value)
    },
    showSaveButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const modalRef = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null

    const show = () => {
      if (modalRef.value) {
        modalInstance = new Modal(modalRef.value)
        modalInstance.show()
      }
    }

    const hide = () => {
      if (modalInstance) {
        modalInstance.hide()
      }
    }

    const close = () => {
      emit('close')
    }

    const save = () => {
      emit('save')
      hide()
    }

    onMounted(() => {
      if (modalRef.value) {
        modalRef.value.addEventListener('hidden.bs.modal', close)
      }
    })

    onUnmounted(() => {
      if (modalRef.value) {
        modalRef.value.removeEventListener('hidden.bs.modal', close)
      }
    })

    return {
      modalRef,
      show,
      hide,
      close,
      save
    }
  }
})
</script>