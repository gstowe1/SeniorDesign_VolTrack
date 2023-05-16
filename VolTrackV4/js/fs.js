export class FILE {
  constructor() {}

  async saveJsonToFile(jsonObj, filename) {
    // Convert the JSON object to a JSON string
    // const jsonString = JSON.stringify(jsonObj);

    // Use the showSaveFilePicker() API to prompt the user to choose a location to save the file
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: "JSON files",
          accept: {
            "text/json": [".json"],
          },
        },
      ],
    });

    // Create a writable stream for the file and write the JSON string to it
    const writable = await fileHandle.createWritable();
    await writable.write(jsonObj);
    await writable.close();

    console.log(`Successfully saved JSON to file: ${filename}`);
  }

  async readJsonFromFile() {
    // Use the showOpenFilePicker() API to prompt the user to choose a file
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "JSON files",
          accept: {
            "text/json": [".json"],
          },
        },
      ],
    });

    // Use the FileReader API to read the file contents as a JSON string
    const file = await fileHandle.getFile();
    const reader = new FileReader();
    reader.readAsText(file);
    const jsonString = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    // Parse the JSON string into a JavaScript object
    const jsonObj = JSON.parse(jsonString);

    console.log(`Successfully read JSON from file: ${file.name}`);
    return jsonObj;
  }

  async fetchJsonFile(filename) {
    const resonse = await fetch(filename);
    const courses = await resonse.json();
    return courses;
  }

  setStorgeItem(name, obj) {
    localStorage.setItem(name, obj);
  }

  getStoredItem(name) {
    return localStorage.getItem(name);
  }

  getClassInfoById(object, id = "") {
    const classInfoForId = object[id];
    return classInfoForId;
  }
}
