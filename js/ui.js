explorer_module = require('./ui/explorer_module.js')
diagram_list_module = require('./ui/diagram_list_module.js')
ui_utils = require('./ui/ui_utils.js')

function toggle(button) {

  if (button.classList.contains('bottom_button')) {
    var i=0;
    var windows = document.getElementsByClassName('bottom_window');
    for (i=0; i< windows.length; i++) {
      if (button.parentNode.getElementsByClassName('bottom_window')[0] != windows[i])
      windows[i].classList.add('hide');
    }

    button.parentNode.getElementsByClassName('bottom_window')[0].classList.toggle('hide');
  }
  else {
    var elm = button.parentNode.getElementsByClassName('collapsible')[0];

    if (elm.clientHeight == '0') {
      elm.style.maxHeight = '450px';
    }
    else {
      elm.style.maxHeight = '0';
    }

    if (button.classList.contains('module_button')) {
      var icon_innerHTML = button.firstElementChild.innerHTML;

      if (icon_innerHTML == 'arrow_drop_up') {
        button.firstElementChild.innerHTML = 'arrow_drop_down';
      }
      else if (icon_innerHTML =='arrow_drop_down'){
        button.firstElementChild.innerHTML = 'arrow_drop_up';
      }
    }

    if (elm.id == 'diagram_list' || elm.id == 'slider_body') {
      if (elm.clientWidth == '0') {
        elm.style.width = 'initial';
      }
      else {
        elm.style.width = '0';
      }
    }
    if (elm.id == 'slider_body')
      button.parentNode.getElementsByTagName('hr')[0].classList.toggle('hide');

  }
}


var createZoomTools = function(this_graph) {
  module = document.createElement("div");
  module.setAttribute("id", "zoom_tools");
  module.setAttribute("class", "tooltip module");

  // zoom_in
  child = document.createElement("div");
  child.setAttribute("class", "bottom_button");
  child.setAttribute("id", "zoom_in");
  img = document.createElement("i");
  img.setAttribute("class", "material-icons md-24");
  img.innerHTML = "add";

  child.appendChild(img);
  child.addEventListener("click", function() {
    this_graph.cy.zoom({
      level: this_graph.cy.zoom() + 0.08,
      renderedPosition: {
        x: this_graph.cy.width() / 2,
        y: this_graph.cy.height() / 2
      }
    });
    var slider_value = Math.round(
      this_graph.cy.zoom() / this_graph.cy.maxZoom() * 100
    );
    document.getElementById("zoom_slider").setAttribute("value", slider_value);
  });
  //child.onselectstart = function() { return false};
  module.appendChild(child);

  // tooltip
  child = document.createElement("span");
  child.setAttribute("class", "tooltiptext");
  child.onclick = function() {
    toggle(this);
  };
  child.innerHTML = "Toggle slider";

  module.appendChild(child);

  // slider
  child = document.createElement("div");
  child.setAttribute("class", "collapsible");
  child.setAttribute("id", "slider_body");

  input = document.createElement("input");
  input.setAttribute("id", "zoom_slider");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("type", "range");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", "50");

  input.oninput = function() {
    var zoom_level = this_graph.cy.maxZoom() / 100 * this.value;
    this_graph.cy.zoom({
      level: zoom_level,
      renderedPosition: {
        x: this_graph.cy.width() / 2,
        y: this_graph.cy.height() / 2
      }
    });
  };

  child.appendChild(input);

  module.appendChild(child);
  module.appendChild(document.createElement("hr"));

  // zoom_out
  child = document.createElement("div");
  child.setAttribute("class", "bottom_button");
  child.setAttribute("id", "zoom_out");
  img = document.createElement("i");
  img.setAttribute("class", "material-icons md-24");
  img.innerHTML = "remove";

  child.appendChild(img);
  child.addEventListener("click", function() {
    this_graph.cy.zoom({
      level: this_graph.cy.zoom() - 0.08,
      renderedPosition: {
        x: this_graph.cy.width() / 2,
        y: this_graph.cy.height() / 2
      }
    });
    var slider_value = Math.round(
      this_graph.cy.zoom() / this_graph.cy.maxZoom() * 100
    );
    document.getElementById("zoom_slider").setAttribute("value", slider_value);
  });
  //child.onselectstart = function() { return false};
  module.appendChild(child);

  // add zoom_tools module to the container
  this_graph.container.appendChild(module);
}


var createDetailsModule = function(this_graph) {
  // Details
  module = document.createElement("div");
  module.setAttribute("id", "details");
  module.setAttribute("class", "module hide");

  // module head
  child = document.createElement("div");
  child.setAttribute("class", "module_head");
  child.style.textAlign = "center";
  child.innerHTML = "Details";
  module.appendChild(child);

  // module button
  child = document.createElement("div");
  child.setAttribute("id", "details_button");
  child.setAttribute("class", "module_button");
  child.setAttribute("onclick", "toggle(this)");
  var drop_down_icon = document.createElement("i");
  drop_down_icon.setAttribute("class", "material-icons md-24");
  drop_down_icon.innerHTML = "arrow_drop_down";
  img = drop_down_icon.cloneNode(true);
  img.innerHTML = "arrow_drop_up";
  child.appendChild(img);
  module.appendChild(child);

  // module body
  child = document.createElement("div");
  child.setAttribute("id", "details_body");
  child.setAttribute("class", "collapsible module_body");
  module.appendChild(child);
  ui_utils.makeDraggable(module);
  this_graph.container.appendChild(module);
}


var createFilterModule = function(this_graph) {
    // filters
  module = document.createElement("div");
  module.setAttribute("id", "filters");
  module.setAttribute("class", "module");
  child = document.createElement("div");
  child.setAttribute("id", "filter_body");
  child.setAttribute("class", "bottom_window hide");

  child.innerHTML +=
    '<div style="text-align:center; margin-bottom:10px;"><strong>Filters</strong></div>';

  var aux = document.createElement("div");
  aux.setAttribute("class", "filtr_option");
  var check_slider_wrap = document.createElement("label");
  check_slider_wrap.setAttribute("class", "check_slider_wrap");
  input = document.createElement("input");
  input.setAttribute("id", "attr_check");
  input.setAttribute("type", "checkbox");
  input.setAttribute("checked", "checked");
  var check_slider = document.createElement("span");
  check_slider.setAttribute("class", "check_slider");

  check_slider_wrap.appendChild(input);
  check_slider_wrap.appendChild(check_slider);

  aux.appendChild(check_slider_wrap);

  var label = document.createElement("span");
  label.innerHTML = "Attributes";
  label.setAttribute("class", "filtr_text");
  aux.appendChild(label);
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute("id", "val_check");
  aux.lastElementChild.innerHTML = "Value Domain";
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute("id", "indiv_check");
  aux.lastElementChild.innerHTML = "Individuals";
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute("id", "forall_check");
  aux.lastElementChild.innerHTML = "Universal Quantifier";
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute("id", "not_check");
  aux.lastElementChild.innerHTML = "Not";
  child.appendChild(aux);

  /*
  child.innerHTML = '<div class="filtr_option"><input id="attr_check" type="checkbox" checked /><label class="filtr_text">Attributes</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="val_check" type="checkbox" checked /><label class="filtr_text">Value Domain</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="indiv_check" type="checkbox" checked /><label class="filtr_text">Individuals</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="forall_check" type="checkbox" checked /><label class="filtr_text">Universal Quantifier</label></div>';
  */ 
  module.appendChild(child);
  module.innerHTML +=
    '<div onclick="toggle(this)" class="bottom_button" title="filters"><i alt="filters" class="material-icons md-24"/>filter_list</i></div>';

  this_graph.container.appendChild(module);

  var input;
  var elm = module.getElementsByClassName("filtr_option");

  for (i = 0; i < elm.length; i++) {
    input = elm[i].firstElementChild.firstElementChild;

    input.addEventListener("click", function() {
      this_graph.filter(this.id);
    });
  }
}


var createCenterModule = function(this_graph) {
  module = document.createElement("div");
  module.setAttribute("id", "center_button");
  module.setAttribute("class", "module bottom_button");
  module.setAttribute("title", "reset");

  var drop_down_icon = document.createElement("i");
  drop_down_icon.setAttribute("class", "material-icons md-24");
  drop_down_icon.innerHTML = "arrow_drop_down";

  img = drop_down_icon.cloneNode(true);
  img.innerHTML = "filter_center_focus";
  module.appendChild(img);

  module.addEventListener("click", function() {
    this_graph.cy.fit();
  });

  this_graph.container.appendChild(module);
}


var createOwl2TranslatorModule = function (this_graph) {
  module = document.createElement("div");
  module.setAttribute("id", "owl_translator");
  module.setAttribute("class", "hide module");

  // module body
  child = document.createElement("div");
  child.setAttribute("id", "translator_body");
  child.setAttribute("class", "module_body collapsible");
  aux = document.createElement("div");
  aux.setAttribute("id", "owl_axiomes");
  child.appendChild(aux);
  module.appendChild(child);

  // module head
  child = document.createElement("div");
  child.setAttribute("class", "module_head");
  child.innerHTML = "OWL 2";

  module.appendChild(child);

  // module button
  child = document.createElement("div");
  child.setAttribute("id", "translator-button");
  child.setAttribute("class", "module_button");
  child.setAttribute("onclick", "toggle(this)");

  var drop_down_icon = document.createElement("i");
  drop_down_icon.setAttribute("class", "material-icons md-24");
  drop_down_icon.innerHTML = "arrow_drop_down";

  img = drop_down_icon.cloneNode(true);
  img.innerHTML = "arrow_drop_down";
  child.appendChild(img);
  module.appendChild(child);

  this_graph.container.appendChild(module);
}


var createOntologyInfo = function (this_graph) {
   module = document.createElement("div");
  module.setAttribute("id", "onto_info");
  module.setAttribute("class", "module");
  child = document.createElement("div");
  child.setAttribute("id", "onto_info_body");
  child.setAttribute("class", "bottom_window hide");

  // Name + Version
  child.innerHTML =
    '<div style="text-align:center; margin-bottom:10px;"><strong>Ontology Info</strong></div>\
  <table class="details_table">\
  <tr><th>Name</th><td>' +
    this.ontology_name +
    "</td></tr>\
  <tr><th>Version</th><td>" +
    this.ontology_version +
    "</td></tr></table>";

  // Prefixes Definiton
  child.innerHTML +=
    '<div class="table_header"><strong>IRI Prefixes Dictionary</strong></div>';

  aux = document.createElement("div");
  aux.setAttribute("id", "prefixes_dict_list");
  var table = document.createElement("table");
  table.setAttribute("id", "prefix_dict_table");
  var properties, property_value;
  var tr = document.createElement("tr");
  var prefix = document.createElement("th");
  var full_iri = document.createElement("td");

  if (this.default_iri) {
    prefix.innerHTML = "<em>Default</em>";
    full_iri.innerHTML =
      this.default_iri.getAttribute("iri_value") ||
      this.default_iri.textContent;

    properties = this.default_iri.getElementsByTagName("properties")[0];
    if (properties) {
      for (i = 0; i < properties.getElementsByTagName("property").length; i++) {
        property_value = properties
          .getElementsByTagName("property")
          [i].getAttribute("property_value");

        if (property_value == "Project_IRI") {
          full_iri.classList.add("project_iri");
        }
      }
    }
    tr.appendChild(prefix);
    tr.appendChild(full_iri);
    table.appendChild(tr);
  }

  if (this.iri_prefixes) {
    for (i = 0; i < this_graph.iri_prefixes.length; i++) {
      tr = document.createElement("tr");
      prefix = document.createElement("th");
      full_iri = document.createElement("td");

      var ignore_standard_iri = false;
      properties = this_graph.iri_prefixes[
        i
      ].parentNode.parentNode.getElementsByTagName("properties")[0];

      if (properties.childNodes.length > 0) {
        for (
          j = 0;
          j < properties.getElementsByTagName("property").length;
          j++
        ) {
          property_value = properties
            .getElementsByTagName("property")
            [j].getAttribute("property_value");

          if (property_value) {
            switch (property_value) {
              case "Standard_IRI":
                ignore_standard_iri = true;
                break;

              case "Project_IRI":
                full_iri.classList.add("project_iri");
                break;
            }
          }
        }
      }

      if (!ignore_standard_iri) {
        prefix.innerHTML = this_graph.iri_prefixes[i].getAttribute(
          "prefix_value"
        );
        full_iri.innerHTML = this_graph.iri_prefixes[
          i
        ].parentNode.parentNode.getAttribute("iri_value");

        tr.appendChild(prefix);
        tr.appendChild(full_iri);
        table.appendChild(tr);
      }
    }
  }

  child.appendChild(table);

  module.appendChild(child);
  module.innerHTML +=
    '<div onclick="toggle(this)" class="bottom_button" title="Info"><i alt="info" class="material-icons md-24"/>info_outline</i></div>';
  this_graph.container.appendChild(module);
}


var createUi = function(grapholscape) {
  // reference to this object, used when adding event listeners
  var this_graph = grapholscape;

  var i;

  module = diagram_list_module.createDiagramListModule(this_graph);
  explorer_module.createExplorerModule(this_graph, module);
  createZoomTools(this_graph);
  createDetailsModule(this_graph);
  createFilterModule(this_graph);
  createCenterModule(this_graph);
  createOwl2TranslatorModule(this_graph);
  createOntologyInfo(this_graph);
 

  var icons = document.getElementsByClassName("material-icons");
  for (i = 0; i < icons.length; i++) {
    icons[i].onselectstart = function() {
      return false;
    };
  }
  
};

module.exports = {
  createUi: createUi,
  toggle: toggle
};
