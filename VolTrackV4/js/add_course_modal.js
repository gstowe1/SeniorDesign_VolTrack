import { CARD } from "./card.js";

export class ADD_COURSE_MODAL {
  constructor(EDITOR) {
    this.EDITOR = EDITOR
    this.selectedCourses = [];
    this.isStillNeeded = 1;
    this.column = null;
  }

  create(column) {
    const stillNeeded = this.EDITOR.MANAGER.getStillNeededClasses();
    // console.log(stillNeeded);
    this.column = column;
    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("modalBackdrop");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modalContainer");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modalHeader");
    modalContainer.appendChild(modalHeader);

    const headerBtnContainer = document.createElement("div");
    headerBtnContainer.classList.add("modalGroup");
    modalHeader.appendChild(headerBtnContainer);

    const StillNeedBtn = document.createElement("div");
    StillNeedBtn.classList.add("modalBtn", "modalSelected");
    StillNeedBtn.textContent = "Still Need";
    headerBtnContainer.appendChild(StillNeedBtn);

    const AllCoursesBtn = document.createElement("div");
    AllCoursesBtn.classList.add("modalBtn");
    AllCoursesBtn.textContent = "All Courses";
    headerBtnContainer.appendChild(AllCoursesBtn);

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("fa-solid", "fa-square-xmark", "fa-2xl");

    closeBtn.addEventListener("click", () => {
      this.selectedCourses = [];
      document.body.removeChild(this.backdrop);
    });

    modalHeader.appendChild(closeBtn);
    this.backdrop.appendChild(modalContainer);

    const modalSearch = document.createElement("input");
    modalSearch.type = "text";
    modalSearch.placeholder = "Search by Course ID";
    modalSearch.classList.add("modalSearch");
    modalContainer.appendChild(modalSearch);

    this.TableContainer = document.createElement("div");
    this.TableContainer.classList.add("modalTable");

    modalContainer.appendChild(this.TableContainer);
    this.stillNeededTable = new Table(this.EDITOR,this.selectedCourses);
    this.allCoursesTable = new Table(this.EDITOR,this.selectedCourses);

    const stillNeededTable = this.stillNeededTable.create();
    const allCoursesTable = this.allCoursesTable.create();
    const modalPillContainer = document.createElement("div");
    modalPillContainer.id = "pillContainer";
    modalPillContainer.classList.add("modalPillContainer");
    modalPillContainer.addEventListener("wheel", function (event) {
      const delta = event.deltaY || event.detail || event.wheelDelta;

      // Check the direction of the scroll and adjust the container's scrollLeft accordingly
      if (delta < 0) {
        modalPillContainer.scrollLeft -= 10; // scroll left by 50 pixels
      } else {
        modalPillContainer.scrollLeft += 10; // scroll right by 50 pixels
      }

      // Prevent the default scrolling behavior of the page
      event.preventDefault();
    });

    modalContainer.appendChild(modalPillContainer);

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modalFooter");
    modalContainer.appendChild(modalFooter);

    const modalApplyBtn = document.createElement("div");
    modalApplyBtn.textContent = "Apply";
    modalApplyBtn.classList.add("modalBtn", "applyBtn");

    modalApplyBtn.addEventListener("click", () => {
      this.createCards();
    });

    modalFooter.appendChild(modalApplyBtn);

    if (this.isStillNeeded) {
      this.TableContainer.appendChild(stillNeededTable);
      StillNeedBtn.classList.add("modalSelected");
      AllCoursesBtn.classList.remove("modalSelected");
      // this.stillNeededTable.populateTableBody(stillNeeded);
    } else {
      this.TableContainer.appendChild(allCoursesTable);
      StillNeedBtn.classList.remove("modalSelected");
      AllCoursesBtn.classList.add("modalSelected");
    }

    StillNeedBtn.addEventListener("click", () => {
      if (this.isStillNeeded == 0) {
        StillNeedBtn.classList.add("modalSelected");
        AllCoursesBtn.classList.remove("modalSelected");
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild(stillNeededTable);
        this.stillNeededTable.clear();
        this.isStillNeeded = 1;

        let data = stillNeeded;
        let filtered_data = data.filter((courseid) =>
          courseid.startsWith(modalSearch.value.toUpperCase())
        );
        if (modalSearch.value != "") {
          this.stillNeededTable.clear();
          this.stillNeededTable.populateTableBody(filtered_data);
        } else {
          //Populate stillneeded table with everthinng.
          this.stillNeededTable.clear();
          this.stillNeededTable.populateTableBody(data);
        }
      }
    });

    AllCoursesBtn.addEventListener("click", () => {
      if (this.isStillNeeded == 1) {
        StillNeedBtn.classList.remove("modalSelected");
        AllCoursesBtn.classList.add("modalSelected");
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild(allCoursesTable);
        this.isStillNeeded = 0;

        let data = Object.keys(this.EDITOR.masterData);
        let filtered_data = data.filter((courseid) =>
          courseid.startsWith(modalSearch.value.toUpperCase())
        );
        if (modalSearch.value != "") {
          this.allCoursesTable.clear();
          this.allCoursesTable.populateTableBody(filtered_data);
        } else {
          this.allCoursesTable.clear();
        }
      }
    });

    modalSearch.addEventListener("input", () => {
      const query = modalSearch.value.toUpperCase();

      //Query for stillneeded courses
      if (this.isStillNeeded == 1) {
        let data = stillNeeded;
        let filtered_data = data.filter((courseid) =>
          courseid.startsWith(query)
        );
        if (modalSearch.value != "") {
          this.stillNeededTable.clear();
          this.stillNeededTable.populateTableBody(filtered_data);
        } else {
          //Populate stillneeded table with everthinng.
          this.stillNeededTable.clear();
          this.stillNeededTable.populateTableBody(data);
        }
      }
      //Query for all courses
      else {
        let data = Object.keys(this.EDITOR.masterData);
        let filtered_data = data.filter((courseid) =>
          courseid.startsWith(query)
        );
        if (modalSearch.value != "") {
          this.allCoursesTable.clear();
          this.allCoursesTable.populateTableBody(filtered_data);
        } else {
          this.allCoursesTable.clear();
        }
      }
    });



    document.body.appendChild(this.backdrop);
  }
  createCards()
  {
    for(let i=0; i < this.selectedCourses.length; i++)
    {
      const card = new CARD(this.selectedCourses[i],"",this.EDITOR);
      this.EDITOR.addCard(this.column,card);
    }
    this.selectedCourses = [];
    document.body.removeChild(this.backdrop);
  }

}

class Table {
  constructor(EDITOR,selected) {
    this.EDITOR = EDITOR;
    this.master_object = this.EDITOR.masterData;
    this.completedCourses = this.EDITOR.MANAGER.completedClasses;
    this.selected = selected;
    // this.selected = [];
  }

  create() {
    const virtualTable = document.createElement("table");
    this.virtualTableBody = document.createElement("tbody");
    // virtualTableBody.id = id+'body';
    const virtualTableHeader = document.createElement("tr");

    virtualTable.classList.add("table", "table-striped", "table-fixed");

    virtualTableHeader.classList.add("tableHeader");

    const idHeader = document.createElement("th");
    idHeader.textContent = "Course ID";

    const titleHeader = document.createElement("th");
    titleHeader.textContent = "Title";

    const creditHeader = document.createElement("th");
    creditHeader.textContent = "Credit";

    const selectHeader = document.createElement("th");
    selectHeader.textContent = "Select";

    virtualTableHeader.appendChild(idHeader);
    virtualTableHeader.appendChild(titleHeader);
    virtualTableHeader.appendChild(creditHeader);
    virtualTableHeader.appendChild(selectHeader);

    virtualTable.appendChild(virtualTableHeader);
    virtualTable.appendChild(this.virtualTableBody);

    return virtualTable;
  }

  createRow(course) {
    // console.log(course);
    if(this.master_object[course])
    {
    const row = document.createElement("tr");
    row.classList.add("table_row");
    const idCell = document.createElement("td");
    const titleCell = document.createElement("td");
    titleCell.classList.add("titleCell");
    const creditCell = document.createElement("td");
    const selectCell = document.createElement("td");
    const selectCellButton = document.createElement("div");

    idCell.textContent = course;
    titleCell.textContent = this.master_object[course].name;
    creditCell.textContent = this.master_object[course].credit_hours;
    selectCell.appendChild(selectCellButton);
    selectCellButton.classList.add("selectBtn");
    selectCellButton.textContent = "Add";
    if(this.completedCourses.includes(course))
    {
      selectCellButton.style.pointerEvents = "none";
      selectCellButton.classList.add('disabled');
    }

    selectCellButton.addEventListener("click", () => {

      this.createPillContainer(course,selectCellButton);
      this.selected.push(course);
      selectCellButton.style.pointerEvents = "none";
      selectCellButton.classList.add('disabled');

    });

    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(creditCell);
    row.appendChild(selectCell);
    return row;
  }
  else{
    console.log(`FAILD:${course}`);
  }
  }

  populateTableBody(data) {
    for (let i = 0; i < data.length; i++) {
      this.virtualTableBody.appendChild(this.createRow(data[i]));
    }
  }

  clear() {
    this.virtualTableBody.innerHTML = "";
  }
  createPillContainer(course,btn) {
    const pill_container = document.getElementById('pillContainer');
    const pill = document.createElement("div");
    const pillLabel = document.createElement("label");
    const pillClose = document.createElement("i");

    pill.classList.add("pill");
    pillLabel.classList.add("pillLable");
    pillClose.classList.add("fa-solid", "fa-x", "fa-sm");

    pillLabel.textContent = course;

    pill.appendChild(pillLabel);
    pill.appendChild(pillClose);

    pillClose.addEventListener("click", () => {
      const rm_i = this.selected.findIndex((id) => id == course);
      btn.style.pointerEvents = "";
      btn.classList.remove('disabled');
      this.selected.splice(rm_i, 1);
      pillContainer.removeChild(pill);
    });

    pill_container.appendChild(pill);
  }
}
