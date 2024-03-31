// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

const Template = `
<div class="container">
  <div class="to-do-wrapper">
    <h1 class="title">Angular To Do List</h1>
    <br>
    <div class="row">
      <span>Filter:</span>
      <button (click)="filter = 'all'">All</button>
      <button (click)="filter = 'active'">Active</button>
      <button (click)="filter = 'done'">Done</button> 
    </div>
    <div class="row">
      <input #newItem placeholder="Add an to-do item" type="text" (keyup.enter)="addItem(newItem.value); newItem.value=''"
        id="addItemInput" />
      <button (click)="addItem(newItem.value); newItem.value=''">Add</button>
    </div>

    <ul>
      @for (item of items; track item.id){
      <li>
        <div class="row">
          <input type="checkbox" [checked]="item.done" (change)="toggleItem(item.id)">
          @if ( currentlyEditedId == item.id ) {
            <input type="text" #editItem [value]="item.description" (keyup.enter)="saveItem(item.id, editItem.value)"/>
            <button (click)="saveItem(item.id, editItem.value)">Save</button>
          }
          @else {
            <div class="task-text" (click)="toggleEditable(item.id)">{{ item.description }}</div>
            <button (click)="removeItem(item.id)">Delete</button>
          }
        </div>
      </li>
      }
    </ul>
  </div>
</div>
`

const Styles = `
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
  display:flex;
  justify-content: center;
}
.to-do-wrapper {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.title {
  text-align: center;
}
.row {
  display: flex;
  gap:10px;
  margin: 1rem 0;
  justify-content: space-between;
  align-items: center;
}
ul{
  padding: 0;
}
li{
  width: 100%;
  height: 2rem;
  list-style: none;
}
input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
}
.task-text,
input[type="text"] {
  width: 100%;
  min-width:300px;
  padding: 0.5rem;
}
button {
  width: 5rem;
  padding: 0.5rem;
}
`

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: Template,
  styles: Styles
})
export class AppComponent {
  title = 'Todo';
  filter: "all" | "active" | "done" = "all";
  currentlyEditedId: number | null = null;

  allItems = [
    { id: 1, description: 'eat', done: true },
    { id: 2, description: 'sleep', done: false },
    { id: 3, description: 'play', done: false },
    { id: 4, description: 'laugh', done: false },
  ]

  get items() {
    return this.allItems
      .filter(
        this.filter === "all" ? item => item :
          this.filter === "active" ? item => !item.done :
            item => item.done,
      )
      .sort(
        this.sortById
      );
  }

  sortById(a: { id: number }, b: { id: number }) {
    return b.id - a.id;
  }

  addItem(description: string) {
    if(description.length > 0) {
      this.allItems.unshift({
        id: this.allItems.length +1,
        description,
        done: false,
      })
    }
  }

  saveItem(id:number, description: string) {
    const item = this.allItems.find((item) => item.id === id);
    if (item) {
      item.description = description;
    }
    this.currentlyEditedId = null; 
  }

  removeItem(id: number) {
    this.allItems = this.allItems.filter((item) => item.id !== id);
  }

  toggleItem(id: number) {
    this.allItems.filter((item) => {
      item.id === id ? item.done = !item.done : item.done;
    })
  }

  toggleEditable (id: number) {
    this.currentlyEditedId = this.currentlyEditedId === id ? null : id;
  }

}

