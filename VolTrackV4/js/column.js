import { NOTE_MODAL } from "./note_modal.js";
//This should work simular to the card class in the since that it creates a column. it should hold the cards.
export class COLUMN {
  constructor(name, note,EDITOR) {
    this.EDITOR = EDITOR;
    this.title = name;
    this.note = note;
    this.setNote = this.setNote.bind(this);
    this.saveState = this.EDITOR.saveState;
    this.note_modal = new NOTE_MODAL(this.setNote,this.saveState);
    this.modal = this.EDITOR.Add_Course_Modal;
    this.totalCredits = 0;
    this.render();
  }

  render() {
    const column = document.createElement("div");
    column.id = this.title;
    column.classList.add("column");

    const columnHeader = document.createElement("div");
    columnHeader.classList.add("column-header");

    column.appendChild(columnHeader);

    const columnNote = document.createElement("div");
    columnNote.classList.add("column-note");
    this.columnNoteIcon = document.createElement("i");
    this.columnDelete = document.createElement("i");
    this.columnDelete.classList.add("fa-solid","fa-xmark","fa-lg");

    if (this.note == "") {
      this.columnNoteIcon.classList.add("fa-regular");
    } else {
      this.columnNoteIcon.classList.add("fa-solid");
    }

    this.columnNoteIcon.classList.add("fa-note-sticky", "pointer");
    this.domColumnNoteIcon = columnNote;

    this.columnNoteIcon.addEventListener("click", () => {
      this.note_modal.render(this.note);
    });

    columnHeader.appendChild(columnNote);
    columnNote.appendChild(this.columnNoteIcon);
    columnNote.appendChild(this.columnDelete);

    const columnTitle = document.createElement("div");
    columnTitle.classList.add("column-title");
    columnTitle.innerText = this.title;

    columnHeader.appendChild(columnTitle);

    const columnTotalCredits = document.createElement("div");
    columnTotalCredits.classList.add("column-total-credit");
    columnTotalCredits.innerText = `Total Credits: ${this.totalCredits}`;

    this.domColumnTotalCredits = columnTotalCredits;

    columnHeader.appendChild(columnTotalCredits);

    const columnAddCourseBtn = document.createElement("div");
    columnAddCourseBtn.classList.add("column-add-course");
    columnAddCourseBtn.innerText = "Add Course";

    columnHeader.appendChild(columnAddCourseBtn);



    columnHeader.addEventListener("contextmenu", (e)=>{
      e.preventDefault();
      console.log("Context Menu For", this.getTitle);
    });

    this.domColumn = column;
    columnAddCourseBtn.addEventListener("click", () => {
      this.modal.create(this);
    });

    this.columnDelete.addEventListener('click',()=>
    {
      this.EDITOR.removeColumn(this.getId);
    })


  }

  setNote(note) {
    this.note = note;
    if (note == "") {
      this.columnNoteIcon.classList.replace("fa-solid", "fa-regular");
    } else {
      this.columnNoteIcon.classList.replace("fa-regular", "fa-solid");
    }
  }
  
  

  appendChild(cardElement) {
    this.domColumn.appendChild(cardElement);
  }

  removeChild(cardElement) {
    this.domColumn.removeChild(cardElement);
  }
  //This returns  the dom element for the column.
  get getElement() {
    return this.domColumn;
  }
  get getId() {
    return this.title;
  }
  get getTitle() {
    return this.title;
  }
  get getNote() {
    return this.note;
  }
  get getCards() {
    return this.cards;
  }


  set setTotalCredit(amount)
  {
    this.totalCredits = amount;
    this.domColumnTotalCredits.innerText =`Total Credits: ${amount}`;
    console.log(amount);
  }
  get getTotalCredits()
  {
    return this.totalCredits;
  }
  



}
