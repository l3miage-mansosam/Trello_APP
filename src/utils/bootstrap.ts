import { Dropdown } from 'bootstrap'

export function initBootstrapDropdowns() {
  const dropdownToggleList = document.querySelectorAll('[data-bs-toggle="dropdown"]')
  
  dropdownToggleList.forEach(dropdownToggle => {
    new Dropdown(dropdownToggle)
  })
}


export function initBootstrap() {
  initBootstrapDropdowns()
  
  
}