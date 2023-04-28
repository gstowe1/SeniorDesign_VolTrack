import {FILE} from "./fs.js";

const selectCompletedCourseInput = document.getElementById(
  "select_completed_course"
);
const selectTerm = document.getElementById("selectTerm");
const selectMajorMinorInput = document.getElementById("select_degree");
const selectCourseInput = document.getElementById("select_completed_course");
const errorContainer = document.getElementById("error");
const pillContainerMajorMinors = document.getElementById(
  "pill_container_majors"
);
const pillContainerCourses = document.getElementById("pill_container_courses");

const cancelBtn = document.getElementById("cancelBtn");
const createBtn = document.getElementById("createBtn");

const planName = document.getElementById("plan_name");
// These should be set by reading in a json file
const majors_minors = [
  "Industrial Engineering",
  "Computer Science",
  "Civil Engineering",
];
const courses = ["IE 204", "IE 422"];

createBtn.addEventListener("click", () => {
  createNewPlanJsonObject();
});

cancelBtn.addEventListener("click", () => {
  window.location.href = "index.php";
});

// These hold the values in which the use selected.
let selected_courses = [];
let selected_majors_minors = [];

// Function got from https://www.w3schools.com/howto/howto_js_autocomplete.asp#:~:text=How%20TO%20-%20Autocomplete%201%20Step%201%29%20Add,Step%205%29%20Initiate%20the%20Autocomplete%20Effect%20on%20%22myInput%22%3A
function autocomplete(inp, container, selected, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) {
          errorContainer.innerHTML = "";
          x[currentFocus].click();
          if (!selected.includes(inp.value)) {
            selected.push(inp.value);
            container.appendChild(createPill(inp.value, selected));
            inp.value = "";
          } else {
            errorContainer.innerHTML = inp.value + " is already selected";
            inp.value = "";
          }
        }
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

const addMajorsMinorsBtn = document.getElementById("addBtnDegrees");
const addCourseBtn = document.getElementById("addBtnCourses");

addMajorsMinorsBtn.addEventListener("click", () => {
  if (selectMajorMinorInput.value != "") {
    if (majors_minors.includes(selectMajorMinorInput.value)) {
      if (!selected_majors_minors.includes(selectMajorMinorInput.value)) {
        pillContainerMajorMinors.appendChild(
          createPill(selectMajorMinorInput.value, selected_majors_minors)
        );
        selected_majors_minors.push(selectMajorMinorInput.value);
        selectMajorMinorInput.value = "";
        errorContainer.innerHTML = "";
      } else {
        errorContainer.innerHTML =
          selectMajorMinorInput.value + " is already selected";
      }
    } else {
      errorContainer.innerHTML = selectMajorMinorInput.value + " is not valid";
    }
  }
});

addCourseBtn.addEventListener("click", () => {
  if (selectCourseInput.value != "") {
    if (courses.includes(selectCourseInput.value)) {
      if (!selected_courses.includes(selectCourseInput.value)) {
        pillContainerCourses.appendChild(
          createPill(selectCourseInput.value, selected_courses)
        );
        selected_courses.push(selectCourseInput.value);
        selectCourseInput.value = "";
        errorContainer.innerHTML = "";
      } else {
        errorContainer.innerHTML =
          selectCourseInput.value + " is already selected";
      }
    } else {
      errorContainer.innerHTML = selectCourseInput.value + " is not valid";
    }
  }
});

function createPill(val, array) {
  const pill = document.createElement("div");
  pill.classList.add("pill");
  const pill_text = document.createElement("div");
  pill_text.classList.add("pill-text");
  pill_text.innerHTML = val;
  const pill_delete = document.createElement("i");
  pill_delete.classList.add("fa-solid", "fa-x", "fa-md");
  pill.appendChild(pill_text);
  pill.appendChild(pill_delete);

  pill_delete.addEventListener("click", () => {
    const index = selected_majors_minors.indexOf(val);
    array.splice(index, 1);
    pill.parentElement.removeChild(pill);
  });
  return pill;
}

function addTerm() {
  const dropdown = document.getElementById("selectTerm");
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
    const option = document.createElement("option");
    option.text = terms[i].season + " " + terms[i].year;
    dropdown.appendChild(option);
  }
}

addTerm();
autocomplete(
  selectCompletedCourseInput,
  pillContainerCourses,
  selected_courses,
  courses
);
autocomplete(
  selectMajorMinorInput,
  pillContainerMajorMinors,
  selected_majors_minors,
  majors_minors
);

function createNewPlanJsonObject() {
 let obj = {
      planName: planName.value,
      semesters: [
        {
          name: selectTerm.value,
          "note": "",
          "courses": []
        },
      ],
      initalCompleteCourses: selected_courses,
    };

  const file = new FILE();

  file.setStorgeItem("JsonObj", JSON.stringify(obj));
  window.location.href = "editor.php";
}
