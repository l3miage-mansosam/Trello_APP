declare module 'bootstrap' {
  export class Dropdown {
    constructor(element: Element, options?: any);
    static getInstance(element: Element): Dropdown | null;
    toggle(): void;
    show(): void;
    hide(): void;
    update(): void;
    dispose(): void;
  }
  
  export class Modal {
    constructor(element: Element, options?: any);
    static getInstance(element: Element): Modal | null;
    toggle(): void;
    show(): void;
    hide(): void;
    handleUpdate(): void;
    dispose(): void;
  }
}