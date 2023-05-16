import { FILE } from "./fs.js";

export class MANAGER
{
  constructor(EDITOR)
  {
    this.EDITOR = EDITOR;
    this.FILE = new FILE();

    this.completed_courses = [];
    this.class_exception_overrides={};
  
    this.parsed_data = JSON.parse(this.FILE.getStoredItem('majors_minors'));
    this.init();
  }

  init()
  {
    for(var i in this.parsed_data){
      this.parsed_data[i]["class_list"] = this.parsed_data[i]["available"].split(";");
    }
  } 

  addToCompletedCourses(course)
  {
     this.completed_courses.push(course);
  }
  removeFromCompletedCourses(course)
  {
    this.completed_courses = this.completed_courses.filter(value => value != course)
  }

  dfs(location,graph,path,visited_list){
    if(visited_list[location]==1){
      return null;
    }
    visited_list[location]=1;
    path.push(location);
    if(location=="dst"){
      return path;
    }
    for(let i in graph[location]){
      if(visited_list[i]==0){
        if(graph[location][i].weight>0){
          let tmp = this.dfs(i,graph,path,visited_list)
          if(tmp!=null){
            return tmp;
          }
        }
      }
    }
    path.pop()
    return null;
  }

  determine_completed_requirements(completed_classes){
    let graph = {};
  
  
    //create the dst and src node in the graph
    graph["dst"]={};
    graph["src"]={};
  
    //add the completed classes into the graph connected to the src node
    for(let class_name of completed_classes){
      graph["-"+class_name+"-class"]={};
      graph["src"]["-"+class_name+"-class"]={weight:Infinity};
      graph["-"+class_name+"-class"]["src"]={weight:Infinity};
    }
  
    //add the requirements for the class to the graph connected to the destination node
    for(let class_requirement in this.parsed_data){
      graph[class_requirement]={};
      graph["dst"][class_requirement]={weight:0};
      graph[class_requirement]["dst"]={weight:parseInt(this.parsed_data[class_requirement]["count"])};
    }
  
    //create the connections between the completed classes and requirements
    for(let class_requirement in this.parsed_data){
      let info = this.parsed_data[class_requirement];
      let prepend="";
      prepend=info["shared_group"]; //handle the case where we can't double count a class
  
      //loop through the classes that complete a requirement
      for(let class_option of info["class_list"]){
  
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
      for(let node_in_graph in graph){
        visited_list[node_in_graph]=0;
      }
      //find an augmenting path
      var tmp = this.dfs("src",graph,[],visited_list);
  
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
  
    return graph;
  }


  get completedClasses()
  {
    return this.completed_courses;
  }
 
  getStillNeededClasses()
  {

    const classes = this.array_of_names_from_parsed(this.parsed_data);
    const notCompleted = classes.filter(value => !this.is_completed(value,this.determine_completed_requirements(this.completedClasses)));
    let stillNeeded = [];
    for(let i = 0; i < notCompleted.length; i++)
    {
      for(let j = 0; j < this.parsed_data[notCompleted[i]]["class_list"].length; j++)
      {
        let value = this.parsed_data[notCompleted[i]]["class_list"][j];

        if(value != "")
        {
          console.log(value)
          stillNeeded.push(value);
        }
      }
    }
    // stillNeeded = stillNeeded.filter(value => value.trim() != "");

    return stillNeeded;

  } 
  
  array_of_names_from_parsed(parsed_data){
    let return_value =[];
  
    for(let i in this.parsed_data){
      return_value.push(this.parsed_data[i]["Name"]);
    }
    return return_value;
  }

  is_completed(requirement,graph){
    let completed = graph["dst"][requirement].weight;
    return completed >= this.parsed_data[requirement]["count"];
  }



}