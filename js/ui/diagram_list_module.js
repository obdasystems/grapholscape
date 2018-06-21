ui_utils = require('./ui_utils.js')

var createDiagramListModule = function(this_graph) {
  // module : diagram list
  var module = document.createElement("div");
  var child = document.createElement("div");
  var img = document.createElement("i");
  var drop_down_icon = document.createElement("i");
  drop_down_icon.setAttribute("class", "material-icons md-24");
  drop_down_icon.innerHTML = "arrow_drop_down";

  module.setAttribute("id", "diagram_name");
  module.setAttribute("class", "module");

  // module head
  child.setAttribute("id", "title");
  child.setAttribute("class", "module_head");
  child.innerHTML = "Select a diagram";
  module.appendChild(child);

  // module button
  child = document.createElement("div");
  child.setAttribute("id", "diagram-list-button");
  child.setAttribute("class", "module_button");
  child.setAttribute("onclick", "toggle(this)");

  child.appendChild(drop_down_icon);
  module.appendChild(child);

  // module dropdown div
  child = document.createElement("div");
  child.setAttribute("id", "diagram_list");
  child.setAttribute("class", "collapsible module_body");

  // adding diagrams in the dropdown div
  var item;
  for (i = 0; i < this_graph.diagrams.length; i++) {
    item = document.createElement("div");
    item.setAttribute("class", "diagram_item");

    item.innerHTML = this_graph.diagrams[i].getAttribute("name");

    
    item.addEventListener("click", function() {
      this_graph.drawDiagram(this.innerHTML);
      toggle(document.getElementById("diagram-list-button"));
    });

    child.appendChild(item);
  }

  module.appendChild(child);
  ui_utils.makeDraggable(module);
  this_graph.container.appendChild(module);

  return module;
}

module.exports = {
	createDiagramListModule : createDiagramListModule
}