import {FILE} from "./fs.js";

const File = new FILE;
const loadBtn = document.getElementById("loadBtn");
const createBtn = document.getElementById("createBtn");

loadBtn.addEventListener('change', async () => {
  const file = loadBtn.files[0];
  if (!file) return;

  // Check that the file is a JSON file
  if (file.type !== 'application/json') {
    alert('Please select a JSON file.');
    return;
  }

  const fileReader = new FileReader();
  fileReader.readAsText(file);

  fileReader.onload = () => {
    const fileContents = JSON.parse(fileReader.result);
    localStorage.setItem('JsonObj', JSON.stringify(fileContents));
    window.location.href = 'editor.php';
  };

  fileReader.onerror = () => {
    console.error(fileReader.error);
  };
});

// loadBtn.addEventListener("click", () => {

 

//     const jsonObj = File.readJsonFromFile();
//     jsonObj.then(result =>{
//       File.setStorgeItem("JsonObj",JSON.stringify(result));
//       console.log(result);
//       window.location.href = 'editor.php';
//   });
    
// });
createBtn.addEventListener("click", () => {
  window.location.href = "create_plan.php";
});
