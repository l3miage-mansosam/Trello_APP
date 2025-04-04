import { Dropdown } from 'bootstrap'

/**
 * Initialize Bootstrap dropdowns on the page
 */
export function initBootstrapDropdowns() {
  // Find all dropdown toggle elements
  const dropdownToggleList = document.querySelectorAll('[data-bs-toggle="dropdown"]')
  
  // Initialize each dropdown
  dropdownToggleList.forEach(dropdownToggle => {
    new Dropdown(dropdownToggle)
  })
}

/**
 * Initialize all Bootstrap components
 */
export function initBootstrap() {
  initBootstrapDropdowns()
  
  // Add other component initializations as needed
}