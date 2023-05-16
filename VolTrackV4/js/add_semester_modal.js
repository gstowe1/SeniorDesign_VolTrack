import { COLUMN } from "./column.js";

export class ADD_SEMESTER_MODAL {
  constructor(EDITOR) {
    this.EDITOR = EDITOR;
  }
  render() {
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

    this.dropdown = this.addTerm();
    modalContainer.appendChild(this.dropdown);

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modalFooter");
    modalContainer.appendChild(modalFooter);

    const modalApplyBtn = document.createElement("div");
    modalApplyBtn.textContent = "Apply";
    modalApplyBtn.classList.add("modalBtn", "applyBtn");

    modalApplyBtn.addEventListener("click", () => {
      const column  = new COLUMN(this.dropdown.value,"", this.EDITOR);
      this.EDITOR.addColumn(column);
      this.EDITOR.sort();
      document.body.removeChild(this.backdrop);
    });

    modalFooter.appendChild(modalApplyBtn);
    document.body.appendChild(this.backdrop);
    // this.backdrop.style.display = "none";
  }

  addTerm() {
    const dropdown = document.createElement("select");
    dropdown.classList.add("dropdown");
    var today = new Date();
    var currentYear = today.getFullYear();
    var minYear = currentYear - 3;
    var maxYear = currentYear + 6;
    var terms = [];
    for (var year = minYear; year <= maxYear; year++) {
      terms.push({ season: "Fall", year: year });
      terms.push({ season: "Winter", year: year + 1 });
      terms.push({ season: "Spring", year: year + 1 });
      terms.push({ season: "Summer", year: year + 1 });
    }

    for (var i = 0; i < terms.length; i++) {
        const semesters = Object.keys(this.EDITOR.COLUMNS);
        if(semesters.findIndex(columns => columns == (terms[i].season + " " + terms[i].year)) == -1)
        {
          const option = document.createElement("option");
          option.text = terms[i].season + " " + terms[i].year;
          dropdown.appendChild(option);
        }
    }

    return dropdown;


  }
}
