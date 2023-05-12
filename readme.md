# VolTrack

VolTrack is a degree plan editor that was built as a senior design project at the University of Tennessee. The purpose of this project was to create an editor that could assist both students and advisors in creating a degree plan. 

## Technologies Used

VolTrack was built using PHP, HTML, and Javascript. PHP was used for templating, while HTML was used for standard web pages. Javascript was the primary language used for the functionality of the degree planner, allowing for dynamic loading, error checking, and course viewing.

## Files

### PHP

- `_header.php`: serves as the templating file and contains links to packages such as Bootstrap, Font Awesome, and JQuery, as well as the navigation bar.
- `create_plan.php`: displays the create plan editor and allows users to generate a new degree plan.
- `editor.php`: the main editor where users can create a new plan or load an existing one.
- `index.php`: the home page which provides options to create a new degree plan or load an existing one.

### HTML

- `print.html`: a file for the print option that dynamically builds a custom page to display the degree plan in a readable format.

### Javascript

#### Index

- `index.js`: handles the buttons on the index page.

#### Modals

- `add_course_modal.js`: creates a pop-up that allows users to select from still needed courses or all courses.
- `add_semester_modal.js`: creates a pop-up that allows users to select a term to add to their degree plan.
- `note_modal.js`: creates a pop-up that allows users to create/edit a note.

#### Editor Elements

- `card.js`: responsible for creating course cards by fetching all necessary information from the course ID.
- `column.js`: responsible for creating columns.
- `editor.js`: the main file for the editor, weaving together the other files to create a functional degree plan editor.

#### Create Plan

- `create_js`: handles functionality for the `create_plan.php` page.

#### Manager

- `manager.js`: handles and tracks which classes have been completed and which have not.

## Usage

To use VolTrack, navigate to the `index.php` page. From here, you can choose to create a new degree plan or load an existing one. The editor allows you to add courses, semesters, and notes, and tracks which classes have been completed. The print option dynamically creates a page to display the degree plan in a readable format.

## Credits

VolTrack was created as a senior design project at the University of Tennessee by a team of students. 

<!-- ## License

This project is licensed under the MIT license. See `LICENSE` for more information. -->