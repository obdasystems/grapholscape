ui_utils = require('./ui_utils.js')

var createExplorerModule = function (this_graph, module) {
  module = module.cloneNode(true);
  module.setAttribute("id", "explorer");
  // module still have class = 'module' so we don't need to addd them
  var input = document.createElement("input");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("type", "text");
  input.setAttribute("id", "search");
  input.setAttribute("placeholder", "Search Predicates...");
  input.setAttribute("onkeyup", "search(this.value)");

  //module_head contains the input field
  module.firstElementChild.innerHTML = "";
  module.firstElementChild.appendChild(input);
  // we need to modify the id of the module_button
  if (
    module.getElementsByClassName("module_button") != null &&
    module.getElementsByClassName("module_button") != undefined
  )
    module
      .getElementsByClassName("module_button")[0]
      .setAttribute("id", "predicates-list-button");

  // dropdown div with predicates list
  module.removeChild(module.lastElementChild);
  child = document.createElement("div");
  child.setAttribute("id", "predicates_list");
  child.setAttribute("class", "collapsible module_body");

  module.appendChild(child);
  ui_utils.makeDraggable(module);
  this_graph.container.appendChild(module);

  // Ontology Explorer Table Population
  var j,
    row,
    wrap,
    col,
    img_type_address,
    sub_rows_wrapper,
    sub_row,
    element,
    nodes,
    key,
    label;

  this_graph.predicates.forEach(function(predicate) {
    label = predicate.data("label").replace(/\r?\n|\r/g, "");
    key = label.concat(predicate.data("type"));
    // If we already added this predicate to the list, we add it in the sub-rows
    if (document.getElementById(key) != null) {
      sub_rows_wrapper = document
        .getElementById(key)
        .getElementsByClassName("sub_row_wrapper")[0];

      sub_row = document.createElement("div");
      sub_row.setAttribute("class", "sub_row");

      sub_row.setAttribute(
        "diagram",
        this_graph.getDiagramName(predicate.data("diagram_id"))
      );
      sub_row.setAttribute("node_id", predicate.id());
      sub_row.innerHTML =
        "- " +
        sub_row.getAttribute("diagram") +
        " - " +
        predicate.data("id_xml");

      sub_row.addEventListener("click", function() {
        goTo(this_graph, this);
      });

      sub_rows_wrapper.appendChild(sub_row);
    } else {
      // Else: this is a new predicate, we create its row and its first sub rows
      // row is the container of a row and a set of sub-rows
      row = document.createElement("div");
      row.setAttribute("id", key);
      row.setAttribute("class", "predicate");

      // the "real" row
      wrap = document.createElement("div");
      wrap.setAttribute("class", "row");

      // columns
      col = document.createElement("div");
      img = document.createElement("i");
      img.setAttribute("class", "no_highlight material-icons md-18");
      img.innerHTML = "keyboard_arrow_right";
      col.appendChild(img);
      wrap.appendChild(col);

      col = document.createElement("div");
      //col.setAttribute("class", "col type_img");
      img = document.createElement("div");
      img.innerHTML = predicate.data("type").charAt(0).toUpperCase();
      img.style.display = 'block';
      img.style.width = '1.2vw'
      img.style.height = '1.2vw'
      img.style.textAlign = 'center'
      img.style.verticalAlign = 'middle'
      img.style.lineHeight = '1.2vw';
      
      switch (img.innerHTML) {
        case 'C' : 
          lightColor = '#F9F3A6'
          darkColor = '#B08D00'
          break;
        case 'R' :
          lightColor = '#AACDE1'
          darkColor = '#065A85'
          break;
        case 'A' :
          lightColor = '#C7DAAD'
          darkColor = '#4B7900'
          break;
      }

      img.style.color = darkColor;
      img.style.backgroundColor = lightColor;
      img.style.border = '1px solid ' + darkColor;

      col.appendChild(img);
      wrap.appendChild(col);

      col = document.createElement("div");
      col.setAttribute("class", "info");
      col.innerHTML = label;

      wrap.appendChild(col);
      row.appendChild(wrap);

      wrap.firstChild.addEventListener("click", function() {
        toggleSubRows(this);
      });
      wrap
        .getElementsByClassName("info")[0]
        .addEventListener("click", function() {
          this_graph.showDetails(predicate);
          this_graph.cy.nodes().unselect();
        });

      sub_rows_wrapper = document.createElement("div");
      sub_rows_wrapper.setAttribute("class", "sub_row_wrapper");

      sub_row = document.createElement("div");
      sub_row.setAttribute("class", "sub_row");

      sub_row.setAttribute(
        "diagram",
        this_graph.getDiagramName(predicate.data("diagram_id"))
      );
      sub_row.setAttribute("node_id", predicate.id());
      sub_row.innerHTML =
        "- " +
        sub_row.getAttribute("diagram") +
        " - " +
        predicate.data("id_xml");

      sub_row.addEventListener("click", function() {
        goTo(this_graph, this);
      });

      sub_rows_wrapper.appendChild(sub_row);
      row.appendChild(sub_rows_wrapper);
    }
    // Child = predicates list
    child.appendChild(row);
  }, this);
}

module.exports = {
  createExplorerModule : createExplorerModule
}