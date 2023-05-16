import { NOTE_MODAL } from "./note_modal.js";
import { FILE } from "./fs.js";

export class CARD {
  constructor(courseid, notes, EDITOR) {
    // this.card = document.createElement("div");
    this.EDITOR = EDITOR;
    this.File = new FILE();
    this.master_data = this.File.getStoredItem("master_data");
    this.master_data = JSON.parse(this.master_data);
    this.setNote = this.setNote.bind(this);
    this.saveState = this.EDITOR.saveState;
    this.note_modal = new NOTE_MODAL(this.setNote,this.saveState);

    this.domPrereqsStatus = [];
    this.domCoreqsStatus = [];

    this.cardStatus = false;
    this.notes = notes;
    this.courseid = courseid;
    this.title = this.master_data[courseid].name;
    this.credits = this.master_data[courseid].credit_hours;
    this.prereqs = this.master_data[courseid].prereq;
    this.coreqs = this.master_data[courseid].coreq;

    this.create(
      this.courseid,
      this.title,
      this.credits,
      this.prereqs,
      this.coreqs,
      this.notes
    );
  }

  // This creates what the card should look like
  create(courseid, title, credits, prereqs, coreqs, notes) {
    const card = document.createElement("div");
    card.id = courseid;
    this.prereqs = prereqs;
    this.coreqs = coreqs;

    card.setAttribute("draggable", "true");
    card.classList.add("card");

    this.cardHeader = document.createElement("div");
    this.cardHeader.classList.add("card-header");

    const container = document.createElement("div");
    container.classList.add("space-between");
    this.cardIcon = document.createElement("i");
    this.cardDelete = document.createElement("i");
    this.cardDelete.classList.add("fa-solid", "fa-xmark", "fa-lg");

    container.appendChild(this.cardIcon);

    container.appendChild(this.cardDelete);

    if (notes == "") {
      this.cardIcon.classList.add("fa-regular");
    } else {
      this.cardIcon.classList.add("fa-solid");
    }
    this.cardIcon.classList.add("fa-note-sticky", "fa-md", "pointer");
    this.cardHeader.appendChild(container);

    const cardSubtitle = document.createElement("h4");
    cardSubtitle.classList.add("card-title");
    cardSubtitle.textContent = courseid;
    this.cardHeader.appendChild(cardSubtitle);

    const cardTitle = document.createElement("h4");
    cardTitle.classList.add("card-subtitle", "text-truncate", "text-muted");
    cardTitle.textContent = title;
    this.cardHeader.appendChild(cardTitle);

    const cardCredit = document.createElement("h6");
    cardCredit.classList.add("card-subtitle", "mb-2", "text-muted");
    cardCredit.textContent = "Credits: " + credits;
    this.cardHeader.appendChild(cardCredit);

    card.appendChild(this.cardHeader);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const prereqSubtitle = document.createElement("h6");
    prereqSubtitle.classList.add("card-subtitle", "text-muted");
    prereqSubtitle.textContent = "Prerequisites";
    cardBody.appendChild(prereqSubtitle);

    const prereqWrapper = document.createElement("div");
    prereqWrapper.classList.add("wrapper");

    prereqs.forEach((prereq) => {
      const prereqReqWrapper = document.createElement("div");
      prereqReqWrapper.classList.add("req-wrapper");

      const prereqStatus = document.createElement("div");
      prereqStatus.classList.add("req-status");
      this.domPrereqsStatus.push(prereqStatus);

      prereqReqWrapper.appendChild(prereqStatus);
      const prereqText = document.createElement("p");
      prereqText.classList.add("card-text");
      prereqReqWrapper.appendChild(prereqText);
      prereqWrapper.appendChild(prereqReqWrapper);

      prereq.forEach((name, index) => {
        if (index > 0) {
          prereqText.textContent += " or " + name;
        } else {
          prereqText.textContent = name;
        }
      });
    });

    cardBody.appendChild(prereqWrapper);

    const coreqSubtitle = document.createElement("h6");
    coreqSubtitle.classList.add("card-subtitle", "text-muted");
    coreqSubtitle.textContent = "Corequisites";
    cardBody.appendChild(coreqSubtitle);

    const coreqWrapper = document.createElement("div");
    coreqWrapper.classList.add("wrapper");

    coreqs.forEach((coreq) => {
      const coreqReqWrapper = document.createElement("div");
      coreqReqWrapper.classList.add("req-wrapper");

      const coreqStatus = document.createElement("div");
      coreqStatus.classList.add("req-status");
      this.domCoreqsStatus.push(coreqStatus);

      coreqReqWrapper.appendChild(coreqStatus);

      const coreqText = document.createElement("p");
      coreqText.classList.add("card-text");
      coreqReqWrapper.appendChild(coreqText);
      coreqWrapper.appendChild(coreqReqWrapper);

      coreq.forEach((name, index) => {
        if (index > 0) {
          coreqText.textContent += " or " + name;
        } else {
          coreqText.textContent = name;
        }
      });
    });

    cardBody.appendChild(coreqWrapper);
    card.appendChild(cardBody);

    this.cardHeader.addEventListener("click", () => {
      cardBody.style.display =
        cardBody.style.display === "block" ? "none" : "block";
      cardTitle.classList.toggle("text-truncate");
    });

    this.cardIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.note_modal.render(this.notes);
    });

    this.cardDelete.addEventListener("click", (e) => {
      e.stopPropagation();
      this.EDITOR.removeCard(this.getParentId, this);
    });

    this.domCard = card;
  }

  checkPrereqs() {
    const CARDS = this.EDITOR.CARDS;
    const CARDS_KEYS = Object.keys(CARDS);
    let count = 0;
    for (let i = 0; i < this.prereqs.length; i++) {
      let isSat = 0;
      for (let j = 0; j < this.prereqs[i].length; j++) {
        for (let k = 0;k < CARDS_KEYS.findIndex((key) => key == this.getParentId);k++) {
          let courses = CARDS[CARDS_KEYS[k]].map((card) => card.getId);
          if (courses.includes(this.prereqs[i][j])) {
            isSat = 1;
          }
        }
        if(isSat == 1)
        {
          this.domPrereqsStatus[i].classList.add("completedCircle");
          count++;
        }
        else
        {
          this.domPrereqsStatus[i].classList.remove("completedCircle");
        }
      }
    }

    if(this.prereqs.length <= count)
    return 1;
    return 0;
  }

  checkCoreqs() {
    const CARDS = this.EDITOR.CARDS;
    const CARDS_KEYS = Object.keys(CARDS);
    let count = 0;
    for (let i = 0; i < this.coreqs.length; i++) {
      let isSat = 0;
      for (let j = 0; j < this.coreqs[i].length; j++) {
        for (let k = 0;k <= CARDS_KEYS.findIndex((key) => key == this.getParentId);k++) {
          let courses = CARDS[CARDS_KEYS[k]].map((card) => card.getId);
          if (courses.includes(this.coreqs[i][j])) {
            isSat = 1;
          }
        }
        if(isSat == 1)
        {
          this.domCoreqsStatus[i].classList.add("completedCircle");
          count++;
        }
        else
        {
          this.domCoreqsStatus[i].classList.remove("completedCircle");
        }
      }
    }
    if(this.coreqs.length <= count)
    return 1;
    return 0;
  }

  check() {
    const prereqsPassed = this.checkPrereqs();
    const coreqsPassed = this.checkCoreqs();

    if (coreqsPassed && prereqsPassed) {
      this.cardHeader.classList.add("completed");
    } else {
      this.cardHeader.classList.remove("completed");
    }
  }

  setNote(note) {
    this.notes = note;
    if (note == "") {
      this.cardIcon.classList.replace("fa-solid", "fa-regular");
    } else {
      this.cardIcon.classList.replace("fa-regular", "fa-solid");
    }
  }

  get getParentId() {
    let card = document.getElementById(`${this.getId}`);
    return card.parentNode.id;
  }
  get getElement() {
    return this.domCard;
  }
  get getCredits() {
    return this.credits;
  }
  get getNote() {
    return this.notes;
  }

  get getId() {
    return this.domCard.id;
  }

  get getPrereqs() {
    return this.prereqs;
  }

  get getCoreqs() {
    return this.coreqs;
  }
}
