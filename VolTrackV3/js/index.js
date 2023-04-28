import {FILE} from "./fs.js";

const File = new FILE;
const loadBtn = document.getElementById("loadBtn");
const createBtn = document.getElementById("createBtn");

loadBtn.addEventListener("click", () => {
    const jsonObj = File.readJsonFromFile();
    jsonObj.then(result =>{
      File.setStorgeItem("JsonObj",JSON.stringify(result));
      console.log(result);
      window.location.href = 'editor.php';
  });
    
});
createBtn.addEventListener("click", () => {
  window.location.href = "create_plan.php";
});
