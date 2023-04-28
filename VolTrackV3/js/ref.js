var student_info={
    completed_classes:[],
    class_exception_overrides:{},
  };
  
  
  var parsed_data=null;
  
  function get_class_prereq_string(class_id){
    let tmp = class_list[class_id]["prereq"];
    let return_string = "";
    if(tmp.length == 0){
      return "There are no Prereqs";
    }
    for( let and_count=0; and_count< tmp.length;and_count++){
      for(let or_count=0;or_count<tmp[and_count].length;or_count++){
        return_string+=tmp[and_count][or_count];
        if(or_count==tmp[and_count].length-2){
          return_string += " or ";
        }else if(or_count<tmp[and_count].length-2){
          return_string += ", ";
        }
      }
      if(and_count<tmp.length-1){
        return_string += " and ";
      }
    }
    return return_string;
  }
  
  function get_class_coreq_string(class_id){
    let tmp = class_list[class_id]["coreq"];
    let return_string = "";
    if(tmp.length == 0){
      return "There are no Coreqs";
    }
    for( let and_count=0; and_count< tmp.length;and_count++){
      for(let or_count=0;or_count<tmp[and_count].length;or_count++){
        return_string+=tmp[and_count][or_count];
        if(or_count==tmp[and_count].length-2){
          return_string += " or ";
        }else if(or_count<tmp[and_count].length-2){
          return_string += ", ";
        }
      }
      if(and_count<tmp.length-1){
        return_string += " and ";
      }
    }
    return return_string;
  }
  
  function array_of_names_from_parsed(parsed_data){
    let return_value =[];
  
    for(i in parsed_data){
      return_value.push(parsed_data[i]["Name"]);
    }
    return return_value;
  }
  
  function add_exception(){
    let class_input = document.getElementById("exceptionClass").value;
    let requirement = document.getElementById("exceptionRequirement").value;
    document.getElementById("exceptionClass").value="";
    document.getElementById("exceptionRequirement").value="";
  
    for(i in parsed_data){
      if(parsed_data[i]["Name"]==requirement){
        if(student_info.class_exception_overrides[i]){
          student_info.class_exception_overrides[i].push(class_input);
        }
        else{
          student_info.class_exception_overrides[i]=[class_input];
        }
        break;
      }
    }
    update_view();
  
  }
  
  function upload_student(){
    document.getElementById("input_file").files[0].text().then((value)=>{
      student_info=JSON.parse(value);
      update_view();
    });
  }
  
  function fill_class_table(){
    let class_id = document.getElementById("myInput").value.toUpperCase();
    let return_string = "";
    if(class_list[class_id]){
      let class_info=class_list[class_id];
      return_string="<tr><td colspan=\"2\">";
      return_string+=class_info["name"];
      return_string+="</td></tr>"
      return_string+="<tr><td colspan=\"2\">";
      return_string+=class_info["description"];
      return_string+="</td></tr>"
      return_string+="<tr><td>Pre-reqs</td><td>";
      return_string+=get_class_prereq_string(class_id);
      return_string+="</td></tr>"
      return_string+="<tr><td>CO-reqs</td><td>";
      return_string+=get_class_coreq_string(class_id);
      return_string+="</td></tr>"
    }
    document.getElementById("class_info").innerHTML=return_string;
  }
  
  
  function array_intersection(array1,array2){
      return array1.filter(value => array2.includes(value));
  }
  
  function main(){
      autocomplete(document.getElementById("myInput"), Object.keys(class_list));
      autocomplete(document.getElementById("exceptionClass"), Object.keys(class_list));
      document.getElementById("add_name").onclick=add_to_list;
      document.getElementById("add_exception").onclick=add_exception;
      document.getElementById("upload").onclick=upload_student;
      document.getElementById("download").onclick=()=>{downloadObjectAsJson(student_info,"student")};
      document.getElementById("myInput").oninput=()=>{fill_class_table()};
      fetch('./ie.json')
      .then(response => response.text())
      .then(textString => {
          parsed_data = JSON.parse(textString);
          for(i in parsed_data){
              parsed_data[i]["class_list"]=parsed_data[i]["available"].split(";");
          }
          console.log(parsed_data);
          autocomplete(document.getElementById("exceptionRequirement"), array_of_names_from_parsed(parsed_data));
      });
      return;
  }
  
  
  function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  
  function check_requirements(){
      //let graph;
      for(i in parsed_data){
          parsed_data[i]["completed"] = array_intersection(parsed_data[i]["class_list"],student_info.completed_classes);
          if(student_info.class_exception_overrides[i]){
            parsed_data[i]["completed"]= parsed_data[i]["completed"].concat(array_intersection(student_info.class_exception_overrides[i],student_info.completed_classes));
          }
      }
  }
  
  function fill_completion_tables(){
      let complete_string="<tr><td>Program</td><td>Name</td><td>Number Needed</td><td>Number Completed</td><tr>";
      let incomplete_string="<tr><td>Program</td><td>Name</td><td>Number Needed</td><td>Number Completed</td><tr>";
      for(i in parsed_data){
          let td=parsed_data[i];
          let tmp_string="<tr>";
          tmp_string+="<td>"+td["Program"]+"</td>";
          tmp_string+="<td>"+td["Name"]+"</td>";
          tmp_string+="<td>"+td["count"]+"</td>";
          tmp_string+="<td>"+td["completed"]+"</td>";
          //tmp_string+="<td>"+td["completed"].join(",")+"</td>";
          tmp_string+="</td>"
          if(td["completed"]>=parseInt(td["count"])){
              complete_string+=tmp_string;
          }else{
              incomplete_string+=tmp_string;
          }
      }
  
  
      document.getElementById("complete_table").innerHTML=complete_string;
      document.getElementById("incomplete_table").innerHTML=incomplete_string;
  }
  
  function fill_completed_table(){
      let fill_string ="";
      for(let i =0;i<student_info.completed_classes.length;i++){
          console.log(student_info.completed_classes[i]);
          fill_string+="<tr><td>"+student_info.completed_classes[i]+"</td></tr>";
      }
      document.getElementById("completed_class_table").innerHTML=fill_string;
  }
  
  function update_view(){
      fill_completed_table();
      //check_requirements();
      determine_completed_requirements(student_info.completed_classes);
      fill_completion_tables();
  }
  
  function add_to_list(){
      let input = document.getElementById("myInput").value;
      document.getElementById("myInput").value="";
      if(class_list[input]){
          student_info.completed_classes.push(input);
      }
      update_view();
  }
  
  
  function add_math(){
      fetch('./math.json')
      .then(response => response.text())
      .then(textString => {
          let tmp_parsed_data = JSON.parse(textString);
          for(i in tmp_parsed_data){
              tmp_parsed_data[i]["class_list"]=tmp_parsed_data[i]["available"].split(";");
          }
          parsed_data=Object.assign({},tmp_parsed_data,parsed_data);
          //parsed_data=parsed_data.concat(tmp_parsed_data);
          update_view();
      });
  }
  
  
  //simple recursive dfs to find the augmenting paths
  //technically a bfs would certainly be more effecient, but this was easier to write
  function dfs(location,graph,path,visited_list){
    //console.log(location);
    if(visited_list[location]==1){
      return null;
    }
    visited_list[location]=1;
    path.push(location);
    if(location=="dst"){
      return path;
    }
    for(i in graph[location]){
      if(visited_list[i]==0){
        if(graph[location][i].weight>0){
          let tmp = dfs(i,graph,path,visited_list)
          if(tmp!=null){
            return tmp;
          }
        }
      }
    }
    path.pop()
    return null;
  }
  
  //generate a graph representing the completed classses to do the network flow
  function determine_completed_requirements(completed_classes){
    let graph = {};
  
  
    //create the dst and src node in the graph
    graph["dst"]={};
    graph["src"]={};
  
    //add the completed classes into the graph connected to the src node
    for(class_name of completed_classes){
      graph["-"+class_name+"-class"]={};
      graph["src"]["-"+class_name+"-class"]={weight:Infinity};
      graph["-"+class_name+"-class"]["src"]={weight:Infinity};
    }
  
    //add the requirements for the class to the graph connected to the destination node
    for(class_requirement in parsed_data){
      graph[class_requirement]={};
      graph["dst"][class_requirement]={weight:0};
      graph[class_requirement]["dst"]={weight:parseInt(parsed_data[class_requirement]["count"])};
    }
  
    //create the connections between the completed classes and requirements
    for(class_requirement in parsed_data){
      let info = parsed_data[class_requirement];
      let prepend="";
      prepend=info["shared_group"]; //handle the case where we can't double count a class
  
      //loop through the classes that complete a requirement
      for(class_option of info["class_list"]){
  
        //if the class exists we create the connection
        if(graph["-"+class_option+"-class"]){
  
          //handle making an extra node in the graph for the requirements that can't share
          if(info["shared_group"]!=""){
            if(!graph[prepend+"-"+class_option+"-class"]){
              graph[prepend+"-"+class_option+"-class"]={};
            }
            graph[prepend+"-"+class_option+"-class"][class_option+"-class"]={weight:0};
            graph[class_option+"-class"][prepend+"-"+class_option+"-class"]={weight:1};
          }
  
  
          graph[prepend+"-"+class_option+"-class"][class_requirement]={weight:1};
          graph[class_requirement][prepend+"-"+class_option+"-class"]={weight:0};
        }
      }
    }
  
  
    //Implement the ford-fulkerson network flow
    for(;;){
      let visited_list={};
      //make the visited list empty
      for(node_in_graph in graph){
        visited_list[node_in_graph]=0;
      }
      //find an augmenting path
      var tmp = dfs("src",graph,[],visited_list);
  
      //if null is returned there are no more augmenting paths, and the algorithm is done
      if(tmp==null){
        break;
      }
  
      //go along the augmenting path updating the weights
      for(let i=1;i<tmp.length;i++){
        graph[tmp[i-1]][tmp[i]].weight-=1;
        graph[tmp[i]][tmp[i-1]].weight+=1;
      }
    }
  
    //code I needed for the demo that probably does not fit the format for the rest
    //of the project
    /*
    for(i in parsed_data){
      let completed = graph["dst"][i].weight;
      parsed_data[i]["completed"]=completed;
    }*/
    return graph;
  }
  
  function is_completed(requirement,graph){
      let completed = graph["dst"][requirement].weight;
      return completed >= parsed_data[requirement]["count"];
  }
  
  
  window.onload=main;