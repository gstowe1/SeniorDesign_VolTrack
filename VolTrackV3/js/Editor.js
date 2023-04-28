//These are to create a card element and the columns
import { CARD } from "./card.js";
import { COLUMN } from "./column.js";

//These are to create a madal in order to allow the ability to add courses and colunms (semesters)
import { ADD_COURSE_MODAL } from "./add_course_modal.js";
import { ADD_SEMESTER_MODAL } from "./add_semester_modal.js";

//This is use to load and save information to file stoarge and manage the data
import { FILE } from "./fs.js";
//Manager should allow to add, remove card in a data structure and allow the ability to check the status.
import { MANAGER } from "./manager.js";

class EDITOR {
  constructor() {
    this.File = new FILE();
    this.MANAGER = new MANAGER(this);
    this.saveState = this.saveState.bind(this);
    this.Add_Course_Modal = new ADD_COURSE_MODAL(this);
    this.Add_Semester_Modal = new ADD_SEMESTER_MODAL(this);

    this.master_data = null;

    this.board = document.getElementById('board');
    this.COLUMNS = {};
    this.CARDS = {};
  }

  async onLoad() {
    this.master_data = await this.File.fetchJsonFile("!master/class_info.json");
    this.File.setStorgeItem("master_data", JSON.stringify(this.master_data));

    let editor_data = this.File.getStoredItem("JsonObj");
    editor_data = JSON.parse(editor_data);

    for(let i = 0; i < editor_data.initalCompleteCourses.length; i++)
    {
      this.MANAGER.addToCompletedCourses(editor_data.initalCompleteCourses[i]);
    }

    //Work on the ability to have multiple majors and minors selected.
    //Just load ie data for demo.

    const majors_minors = await this.File.fetchJsonFile("!master/ie.json");
    this.File.setStorgeItem("majors_minors", JSON.stringify(majors_minors));

    const columns = editor_data.semesters;

    for (let i = 0; i < columns.length; i++) {
      let column = new COLUMN(
        columns[i].name,
        columns[i].note,
        this
      );
      this.addColumn(column);

      let cards = columns[i].courses;
      for (let j = 0; j < cards.length; j++) {
        let card = null;
        if (cards[j].note == null) {
          card = new CARD(cards[j].id, "", this);
        } else {
          card = new CARD(cards[j].id, cards[j].note, this);
        }
        this.addCard(column, card);
      }
    }

    const saveBtn = document.getElementById("save");
    const addTermBtn = document.getElementById("addTerm");

    saveBtn.addEventListener("click", () => {
      this.saveJson();
    });

    addTermBtn.addEventListener("click", () =>
      this.Add_Semester_Modal.render()
    );


    
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  sort() {
    let columns = this.COLUMNS;
    let cards = this.CARDS;
    let sortedColumns = {};
    let sortedCards = {};
    const board = this.board;

    function compare(column, sorted) {
      for(let i = 0; i < column.length; i++)
      {
          if(column[i].getTitle != sorted[i].getTitle)
          {
              return false;
          }
      }
      return true;
    }
    function sortColumn() {
    
      let classDict = Object.keys(columns);
      classDict.sort(function (a, b) {
        // Extract the year and season from each key
        var aTitleParts = a.split(" ");
        var bTitleParts = b.split(" ");
        var aYear = parseInt(aTitleParts[1]);
        var bYear = parseInt(bTitleParts[1]);
        var aSeason = aTitleParts[0];
        var bSeason = bTitleParts[0];

        // Compare the years first
        if (aYear < bYear) {
          return -1;
        } else if (aYear > bYear) {
          return 1;
        } else {
          // If the years are equal, compare the seasons
          const season = { Spring: 0, Summer: 1, Fall: 2, Winter: 3 };
          if (season[aSeason] < season[bSeason]) {
            return -1;
          } else {
            return 1;
          }
        }
      });

      // Create a new dictionary with the sorted keys
      for (var i = 0; i < classDict.length; i++) {
        var key = classDict[i];
        sortedColumns[key] = columns[key];
        sortedCards[key] = cards[key];
      }

    }
    
    function updateBoard() {
      sortColumn();
      if(!compare(Object.keys(columns),Object.keys(sortedColumns)));
      { 
        columns = sortedColumns;
        board.innerHTML = "";
        for(let column in columns)
        {
          board.appendChild(columns[column].getElement);
        }

      }
    }

    updateBoard();
    this.COLUMNS = sortedColumns;
    this.CARDS = sortedCards;
  }

  addCard(column, card) {
    
    this.CARDS[column.getId].push(card);
    this.addTotalCredit(column,card);
    this.initializeDragObject(card);
    this.MANAGER.addToCompletedCourses(card.getId);
    column.appendChild(card.getElement);
    this.check();
  }
  removeCard(column, card) {
    const cardIndex = this.CARDS[column].findIndex(value => value.getId == card.getId);
    this.CARDS[column].splice(cardIndex,1);
    this.subTotalCedit(this.COLUMNS[column],card);
    this.COLUMNS[column].removeChild(card.getElement);
    this.MANAGER.removeFromCompletedCourses(card.getId);
    this.check();
  }

  addColumn(column) {
    
    this.CARDS[column.getId] = [];
    this.COLUMNS[column.getId] = column;
    this.initalizeDropArea(column);
    this.board.appendChild(column.getElement);
    this.saveState();
  }
  removeColumn(column) {
    this.board.removeChild(this.COLUMNS[column].getElement);
    delete this.COLUMNS[column];
    for(let i = 0; i < this.CARDS[column].length; i++)
    {
      this.MANAGER.removeFromCompletedCourses(this.CARDS[column][i].getId);
    }
    delete this.CARDS[column];
    this.check();
  }

  check()
  {

    for(let card in this.CARDS)
    {
      for(let i of this.CARDS[card])
      {
        i.check();
      }

    }
    this.saveState();

  }


  addTotalCredit(column, card) {
    const currentCreditAmount = parseInt(column.getTotalCredits);
    column.setTotalCredit = currentCreditAmount + parseInt(card.getCredits);
  }

  subTotalCedit(column, card) {
    const currentCreditAmount = parseInt(column.getTotalCredits);
    column.setTotalCredit = currentCreditAmount - parseInt(card.getCredits);
  }


  Move(from_column_id, too_column_id, card) {
    const cardIndex = this.CARDS[from_column_id].findIndex(value => value.getId == card.getId);
    this.CARDS[from_column_id].splice(cardIndex,1);
  
    this.CARDS[too_column_id].push(card);

    

    this.subTotalCedit(this.COLUMNS[from_column_id], card);
    this.addTotalCredit(this.COLUMNS[too_column_id], card);

  }

  initalizeDropArea(column) {
    const element = column.getElement;

    element.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    element.addEventListener("drop", (event) => {
      this.Move(
        event.dataTransfer.getData("from"),
        column.getId,
        this.card_object
      );
      element.appendChild(this.element_object);
      this.check();
    });
  }

  initializeDragObject(card) {
    const element = card.getElement;

    element.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("from", event.target.parentElement.id);
      this.element_object = event.target;
      this.card_object = card;
      setTimeout(() => {
        event.target.style.opacity = "0.5";
      }, 0);
    });

    element.addEventListener("dragend", (event) => {
      this.element_object = null;
      this.card_object = null;

      setTimeout(() => {
        event.target.style.opacity = "1.0";
      }, 0);
    });
  }


  saveJson()
  {
    const JsonObj = JSON.parse(this.File.getStoredItem("JsonObj"));
    let obj = {
      planName: JsonObj.planName,
      semesters: [],
      initalCompleteCourses: JsonObj.initalCompleteCourses,
    };

    for(let column in this.COLUMNS){
      let semesterName = this.COLUMNS[column].getTitle;
      let semesterNote = this.COLUMNS[column].getNote;
      let semesterCards = this.CARDS[column];
      let semesterObj = {
        name: semesterName,
        note: semesterNote,
        courses: [],
      };
      for (let j = 0; j < semesterCards.length; j++) {
        let course = {
          id: semesterCards[j].getId,
          note: semesterCards[j].getNote,
          // override: semesterCards[j].override
        };

        semesterObj.courses.push(course);
      }
      obj.semesters.push(semesterObj);
    }
    this.File.setStorgeItem("JsonObj", JSON.stringify(obj));
    this.File.saveJsonToFile(this.File.getStoredItem("JsonObj"), JsonObj.planName);

  }


saveState()
{
  const JsonObj = JSON.parse(this.File.getStoredItem("JsonObj"));
    let obj = {
      planName: JsonObj.planName,
      semesters: [],
      initalCompleteCourses: JsonObj.initalCompleteCourses,
    };

    for(let column in this.COLUMNS){
      let semesterName = this.COLUMNS[column].getTitle;
      let semesterNote = this.COLUMNS[column].getNote;
      let semesterCards = this.CARDS[column];
      let semesterObj = {
        name: semesterName,
        note: semesterNote,
        courses: [],
      };
      for (let j = 0; j < semesterCards.length; j++) {
        let course = {
          id: semesterCards[j].getId,
          note: semesterCards[j].getNote,
          // override: semesterCards[j].override
        };

        semesterObj.courses.push(course);
      }
      obj.semesters.push(semesterObj);
    }
    this.File.setStorgeItem("JsonObj", JSON.stringify(obj));
}
  
 printInfo() {

  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'print.html';
  document.body.appendChild(iframe);
  iframe.onload = function() {
    iframe.contentWindow.print();
  };
  
}


  set masterData(data)
  {
    this.master_data = data;
  }
  get masterData()
  {
    return this.master_data;
  }

}

function initialization() {
  const board = document.getElementById("board");
  const masterContainer = document.getElementById("master-container");
  const boardHeader = document.getElementById("board-header");

  board.style.height =
    masterContainer.offsetHeight - boardHeader.offsetHeight + "px";

  window.addEventListener("resize", initialization);
}

initialization();
const editor = new EDITOR();


document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // prevent the default "Save As" dialog from appearing
    // call your save function here
    editor.saveJson();
  }
  if (event.ctrlKey && event.key === 'p') {
    event.preventDefault(); // prevent the default "Save As" dialog from appearing
    // call your save function here
    editor.printInfo();
  }

});
editor.onLoad();
