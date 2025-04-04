# Trello Clone App

A simple Trello clone built with Vue 3 and TypeScript.

## Features

- Create and manage boards
- Add, edit, and delete lists
- Add, edit, and delete cards
- Drag and drop cards between lists (future enhancement)

## Project Setup

```bash
# Navigate to the project directory
cd trello-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

- `src/components/`: Vue components
  - `BoardComponent.vue`: Main board component that contains lists
  - `ListComponent.vue`: Component for each list in the board
  - `CardComponent.vue`: Component for each card in a list
  - `NavBar.vue`: Navigation bar component
- `src/views/`: Vue views/pages
  - `BoardView.vue`: Main view that displays the board
- `src/router/`: Vue Router configuration
- `src/types.ts`: TypeScript type definitions
- `src/assets/`: Static assets and global CSS

## Technologies Used

- Vue 3: Progressive JavaScript framework
- TypeScript: Typed superset of JavaScript
- Vue Router: Official router for Vue.js
- Vite: Next generation frontend tooling

## Future Enhancements

- Drag and drop functionality for cards and lists
- User authentication
- Multiple boards
- Card labels and due dates
- Activity log
- Attachments