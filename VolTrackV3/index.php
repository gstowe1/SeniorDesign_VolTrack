<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VolTrack - Home</title>

    <?php include_once "_header.php"; ?>
  </head>

  <link rel="stylesheet" href="css/index.css" />

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
            <h1>Welcome to VolTrack</h1>
            <p>Either create a new plan, or load in an exsiting plan</p>
            <div class="btn btn-primary" id="createBtn">Create Plan</div>  <div class="btn btn-secondary" id="loadBtn">Load Plan</div>
        </div>
    </div>
  </body>

  <script type="module" src="js/index.js"></script>

</html>
