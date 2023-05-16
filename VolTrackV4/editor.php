<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <?php include_once "_header.php"; ?>

    <script type="module" src="js/Editor.js"></script>

    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/card_2.css" />
    <link rel="stylesheet" href="css/addCourse copy.css" />

  </head>
  <body style="height: 100%; overflow-y: hidden">
    <div class="container mt-4 mb-4 shadow-lg" id="master-container">
      <div class="row h-100">
        <div class="col-lg-12 p-0 justify-content-between h-100">
          <div
            class="col-12 p-2 d-flex justify-content-between border-bottom border-1 align-items-center"
            id="board-header"
          >
            <div class="semester-nav-arrows ml-3">
              <i class="fa fa-chevron-left fa-2x" id="scroll-left"></i>
              <i class="fa fa-chevron-right fa-2x" id="scroll-right"></i>
            </div>
            <div>
              <div class="btn btn-secondary" id="addTerm">Add Term</div>
              <div class="btn btn-primary" id="save">Save</div>
            </div>
          </div>
          <div class="col-12" id="board"></div>
        </div>
      </div>
    </div>
  </body>
</html>
