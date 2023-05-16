import {FILE} from "./fs.js";

const File = new FILE();

let data = JSON.parse(File.getStoredItem("JsonObj"));


const container = document.getElementById("container");
const head = document.getElementById('head');

const date = new Date();

head.textContent = `Degree Plan Created On ${date}`;


for(const semester of data.semesters) {

    const card = document.createElement('div');
    const card_body = document.createElement('div');
    const card_title = document.createElement('div');
    const semester_notes = document.createElement('div');
    const table = document.createElement("table");
  
    card.classList.add("card");
    card_body.classList.add("card-body");
    card_title.classList.add('card-title');
  
    semester_notes.classList.add('semester-notes');
  
    table.classList.add("table","table-striped","table-bordered",'my-1');
  
    card.appendChild(card_body);
    card_body.appendChild(card_title);
  
    card_title.textContent = semester.name;
  
    if(semester.note != "") {
      card_body.appendChild(semester_notes);
      semester_notes.textContent = semester.note;
    }
  
    card_body.appendChild(table);
  
    const theadRow = document.createElement("tr");
    const course = document.createElement("th");
    course.textContent = "Course";
    const courseNote = document.createElement("th");
    courseNote.textContent = "Notes";
  
    theadRow.appendChild(course);
    theadRow.appendChild(courseNote);
  
    table.appendChild(theadRow);
  
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
  
    for(let semester_course of semester.courses) {
      const courseRow = document.createElement("tr");
      const courseName = document.createElement("td");
      const courseNote = document.createElement("td");
      courseName.textContent = semester_course.id;
      courseNote.textContent = semester_course.note;
  
      courseRow.appendChild(courseName);
      courseRow.appendChild(courseNote);
      tbody.appendChild(courseRow);
    }
  
    container.appendChild(card);
  
  }
  


// for (const semester of data.semesters) {
//   const table = document.createElement("table");
//   table.classList.add("table", "table-striped", "table-bordered", "my-4");
  
//   const caption = document.createElement("caption");
//   caption.textContent = semester.name;
//   table.appendChild(caption);
  
//   const thead = document.createElement("thead");
//   const theadRow = document.createElement("tr");
//   const theadSemesterNote = document.createElement("th");
//   theadSemesterNote.textContent = "Semester Note";
//   const theadCourse = document.createElement("th");
//   theadCourse.textContent = "Course";
//   const theadCourseNote = document.createElement("th");
//   theadCourseNote.textContent = "Course Note";
//   theadRow.appendChild(document.createElement("th"));
//   theadRow.appendChild(theadCourse);
//   theadRow.appendChild(theadSemesterNote);
//   theadRow.appendChild(theadCourseNote);
//   thead.appendChild(theadRow);
//   table.appendChild(thead);
  
  
//   const semesterRow = document.createElement("tr");
//   const semesterName = document.createElement("td");
//   const semesterNote = document.createElement("td");
//   semesterName.textContent = semester.name;
//   semesterNote.textContent = semester.note;
//   semesterRow.appendChild(document.createElement("td"));
//   semesterRow.appendChild(document.createElement("td"));
//   semesterRow.appendChild(semesterNote);
//   semesterRow.appendChild(document.createElement("td"));
//   tbody.appendChild(semesterRow);
  
//   for (const course of semester.courses) {
//     const courseRow = document.createElement("tr");
//     const courseName = document.createElement("td");
//     const courseNote = document.createElement("td");
//     courseName.textContent = course.id;
//     courseNote.textContent = course.note;
//     courseRow.appendChild(document.createElement("td"));
//     courseRow.appendChild(courseName);
//     courseRow.appendChild(semesterNote.cloneNode());
//     courseRow.appendChild(courseNote);
//     tbody.appendChild(courseRow);
//   }
  
//   table.appendChild(tbody);
//   container.appendChild(table);
// }
