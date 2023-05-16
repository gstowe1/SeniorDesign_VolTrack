export class NOTE_MODAL {
  constructor(set,saveState) {
    this.set = set;
    this.saveSate = saveState;
  }

  render(note) {
    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("modalBackdrop");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modalContainer");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modalHeaderFlexEnd");
    modalContainer.appendChild(modalHeader);



    const closeBtn = document.createElement("div");
    closeBtn.classList.add("fa-solid", "fa-square-xmark", "fa-2xl");

    closeBtn.addEventListener("click", () => {
      document.body.removeChild(this.backdrop);
    });

    modalHeader.appendChild(closeBtn);
    this.backdrop.appendChild(modalContainer);

    const noteEditor = document.createElement('textarea');
    if(note == '')
    {
        noteEditor.placeholder = "Add Note";
    }
    else
    {
        noteEditor.value = note;
        
    }

    noteEditor.classList.add('noteEditor');
    modalContainer.appendChild(noteEditor);

    
    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modalFooter");
    modalContainer.appendChild(modalFooter);

    const modalApplyBtn = document.createElement("div");
    modalApplyBtn.textContent = "Apply";
    modalApplyBtn.classList.add("modalBtn", "applyBtn");


    modalApplyBtn.addEventListener('click',() => {
        this.set(noteEditor.value);
        this.saveSate();
        document.body.removeChild(this.backdrop);
    });

    modalFooter.appendChild(modalApplyBtn);
    document.body.appendChild(this.backdrop);
    // this.backdrop.style.display = "none";
  }
}
