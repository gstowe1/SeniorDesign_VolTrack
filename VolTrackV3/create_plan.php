<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VolTrack - Home</title>
    <script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="js/fs.js"></script>

    <?php include_once "_header.php"; ?>
</head>

<link rel="stylesheet" href="css/index.css" />
<link rel="stylesheet" href="css/create_plan.css">

<body style="height: 100%; overflow-y: hidden">
    <!-- <div class="container">
      <div class="d-flex w-100 justify-content-between align-items-center">
        <button type="button" id="backBtn" class="btn">
          <span class="fa fa-arrow-left"></span> Back
        </button>
        <span class="fa-solid fa-gear">
          <lable class="pl-1">Settings</lable>
        </span>
      </div>
    </div> -->
    <div class="container mt-4 mb-4 shadow-lg" id="master-container">
        <div id="board">
            <h1>Create a New Plan</h1>
            <div class="error-container" id='error'></div>
            <label for="plan_name">Plan name</label><br>
            <input type="text" name="plan_name" id="plan_name" /><br>

            <label for="plan_name">Select Start Term</label><br>
            <select id="selectTerm" > </select> <br>

            <label for="select_major">Select Major(s)/Minor(s)</label><br>
            
            <div class="group_flexbox">
                <div class="autocomplete">
                <input type="text" name="select_degree" id="select_degree" placeholder="Search by Name" />
                </div>
                <div class="btn btn-secondary addBtn" id="addBtnDegrees">Add</div>
            </div>
            <label for="select_major">Selected Major(s)/Minor(s)</label><br>
            <div class="pill_container" id="pill_container_majors"></div>
            <label for="select_completed_courses">Select Completed Courses</label><br>
            
            <div class="group_flexbox">
                <div class="autocomplete">
                    <input id="select_completed_course" type="text" placeholder="Select Course by ID">
                </div>
                <div class="btn btn-secondary addBtn" id="addBtnCourses">Add</div>
            </div>

            <label for="select_completed_courses">Selected Completed Courses</label><br>
            <div class="pill_container" id="pill_container_courses"></div>
            <div class="group_flexbox right_align">
                <div class="btn secondary-color" id='cancelBtn'>Cancel</div>
                <div class="btn btn-primary " id='createBtn'>Create</div>
            </div>
        </div>
    </div>
</body>

<script type="module" src="js/create_plan.js"></script>

</html>