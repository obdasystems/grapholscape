GrapholScape.prototype.createUi = function () {
  // reference to this object, used when adding event listeners
  var this_graph = this;
  var i;

  // module : diagram list
  var module = document.createElement('div');
  var child = document.createElement('div');
  var img = document.createElement('i');
  var drop_down_icon = document.createElement('i');
  drop_down_icon.setAttribute('class','material-icons md-24');
  drop_down_icon.innerHTML = 'arrow_drop_down';


  module.setAttribute('id','diagram_name');
  module.setAttribute('class','module');

  // module head
  child.setAttribute('id','title');
  child.setAttribute('class','module_head');
  child.innerHTML = 'Select a diagram';
  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','diagram-list-button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(this)');

  child.appendChild(drop_down_icon);
  module.appendChild(child);

  // module dropdown div
  child = document.createElement('div');
  child.setAttribute('id','diagram_list');
  child.setAttribute('class','collapsible module_body');

  // adding diagrams in the dropdown div
  var item;
  for(i=0; i<this.diagrams.length; i++) {
    item = document.createElement('div');
    item.setAttribute('class','diagram_item');

    item.innerHTML = this.diagrams[i].getAttribute('name');

    item.addEventListener('click',function () {
      this_graph.drawDiagram(this.innerHTML);
      toggle(document.getElementById('diagram-list-button'));
    });

    child.appendChild(item);
  }

  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);

  // module : Explorer
  module= module.cloneNode(true);
  module.setAttribute('id','explorer');
  // module still have class = 'module' so we don't need to addd them
  var input = document.createElement('input');
  input.setAttribute('autocomplete','off');
  input.setAttribute('type','text');
  input.setAttribute('id','search');
  input.setAttribute('placeholder','Search Predicates...');
  input.setAttribute('onkeyup','search(this.value)');

  //module_head contains the input field
  module.firstElementChild.innerHTML='';
  module.firstElementChild.appendChild(input);
  // we need to modify the id of the module_button
  module.getElementsByClassName('module_button')[0].setAttribute('id','predicates-list-button');

  // dropdown div with predicates list
  module.removeChild(module.lastElementChild);
  child = document.createElement('div');
  child.setAttribute('id','predicates_list');
  child.setAttribute('class','collapsible module_body');

  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);

  // Ontology Explorer Table Population
  var j,row, wrap, col, img_type_address, sub_rows_wrapper, sub_row, element,nodes, key, label;

  this.predicates.forEach(function(predicate){
    label = predicate.data('label').replace(/\r?\n|\r/g,"");
    key = label.concat(predicate.data('type'));
    // If we already added this predicate to the list, we add it in the sub-rows
    if (document.getElementById(key) != null) {
      sub_rows_wrapper = document.getElementById(key).getElementsByClassName('sub_row_wrapper')[0];

      sub_row = document.createElement('div');
      sub_row.setAttribute('class','sub_row');

      sub_row.setAttribute("diagram",this.getDiagramName(predicate.data('diagram_id')));
      sub_row.setAttribute("node_id",predicate.id());
      sub_row.innerHTML = '- '+sub_row.getAttribute('diagram')+' - '+predicate.data('id_xml');

      sub_row.addEventListener('click',function() {goTo(this_graph,this);});

      sub_rows_wrapper.appendChild(sub_row);
    }
    // Else: this is a new predicate, we create its row and its first sub rows
    else {
      // row is the container of a row and a set of sub-rows
      row = document.createElement('div');
      row.setAttribute("id",key);
      row.setAttribute('class','predicate');

      // the "real" row
      wrap = document.createElement('div');
      wrap.setAttribute("class","row");

      // columns
      col = document.createElement('span');
      img  = document.createElement('i');
      img.setAttribute('class','no_highlight material-icons md-18')
      img.innerHTML = 'keyboard_arrow_right';
      col.appendChild(img);
      wrap.appendChild(col);

      col = document.createElement('span');
      col.setAttribute('class','col type_img');
      img = document.createElement('img');
      img_type_address = 'icons/ic_treeview_'+predicate.data('type')+'_18dp_1x.png';

      img.setAttribute("src",img_type_address);
      col.appendChild(img);
      wrap.appendChild(col);


      col = document.createElement('div');
      col.setAttribute('class','info');
      col.innerHTML = label;

      wrap.appendChild(col);
      row.appendChild(wrap);

      wrap.firstChild.addEventListener('click',function() {toggleSubRows(this);});
      wrap.getElementsByClassName('info')[0].addEventListener('click',function() {
        this_graph.showDetails(predicate);
        this_graph.cy.nodes().unselect();
      });

      sub_rows_wrapper = document.createElement('div');
      sub_rows_wrapper.setAttribute('class','sub_row_wrapper');

      sub_row = document.createElement('div');
      sub_row.setAttribute('class','sub_row');

      sub_row.setAttribute("diagram",this.getDiagramName(predicate.data('diagram_id')));
      sub_row.setAttribute("node_id",predicate.id());
      sub_row.innerHTML = '- '+sub_row.getAttribute('diagram')+' - '+predicate.data('id_xml');

      sub_row.addEventListener('click',function() {goTo(this_graph,this);});

      sub_rows_wrapper.appendChild(sub_row);
      row.appendChild(sub_rows_wrapper);
    }
    // Child = predicates list
    child.appendChild(row);
  },this);

  // zoom_tools
  module = document.createElement('div');
  module.setAttribute('id','zoom_tools');
  module.setAttribute('class','tooltip module');

  // zoom_in
  child = document.createElement('div');
  child.setAttribute('class','bottom_button');
  child.setAttribute('id','zoom_in');
  img = document.createElement('i');
  img.setAttribute('class','material-icons md-24');
  img.innerHTML = 'add';

  child.appendChild(img);
  child.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()+0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    var slider_value = Math.round(this_graph.cy.zoom()/this_graph.cy.maxZoom()*100);
    document.getElementById('zoom_slider').setAttribute('value',slider_value);
  });
  //child.onselectstart = function() { return false};
  module.appendChild(child);

  // tooltip
  child = document.createElement('span');
  child.setAttribute('class','tooltiptext');
  child.onclick = function() {toggle(this)};
  child.innerHTML = 'Toggle slider';

  module.appendChild(child);

  // slider
  child = document.createElement('div');
  child.setAttribute('class','collapsible');
  child.setAttribute('id','slider_body');

  input = document.createElement('input');
  input.setAttribute('id','zoom_slider');
  input.setAttribute('autocomplete','off');
  input.setAttribute('type','range');
  input.setAttribute('min','1');
  input.setAttribute('max','100');
  input.setAttribute('value','50');

  input.oninput = function() {
    var zoom_level = (this_graph.cy.maxZoom()/100) * this.value;
    this_graph.cy.zoom({
      level: zoom_level,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
  };

  child.appendChild(input);

  module.appendChild(child);
  module.appendChild(document.createElement("hr"));

  // zoom_out
  child = document.createElement('div');
  child.setAttribute('class','bottom_button');
  child.setAttribute('id','zoom_out');
  img = document.createElement('i');
  img.setAttribute('class','material-icons md-24');
  img.innerHTML = 'remove';

  child.appendChild(img);
  child.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()-0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    var slider_value = Math.round(this_graph.cy.zoom()/this_graph.cy.maxZoom()*100);
    document.getElementById('zoom_slider').setAttribute('value',slider_value);

  });
  //child.onselectstart = function() { return false};
  module.appendChild(child);

  // add zoom_tools module to the container
  this.container.appendChild(module);



  // Details
  module = document.createElement('div');
  module.setAttribute('id','details');
  module.setAttribute('class','module hide');

  // module head
  child = document.createElement('div');
  child.setAttribute('class','module_head');
  child.style.textAlign = 'center';
  child.innerHTML = 'Details';
  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','details_button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(this)');
  img = drop_down_icon.cloneNode(true);
  img.innerHTML = 'arrow_drop_up';
  child.appendChild(img);
  module.appendChild(child);

  // module body
  child = document.createElement('div');
  child.setAttribute('id','details_body');
  child.setAttribute('class','collapsible module_body');
  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);


  // filters
  module = document.createElement('div');
  module.setAttribute('id','filters');
  module.setAttribute('class','module');
  child = document.createElement('div');
  child.setAttribute('id','filter_body');
  child.setAttribute('class','bottom_window hide');

  child.innerHTML += ('<div style="text-align:center; margin-bottom:10px;"><strong>Filters</strong></div>');

  var aux = document.createElement('div');
  aux.setAttribute('class','filtr_option');
  var check_slider_wrap = document.createElement('label');
  check_slider_wrap.setAttribute('class','check_slider_wrap');
  input = document.createElement('input');
  input.setAttribute('id','attr_check');
  input.setAttribute('type','checkbox');
  input.setAttribute('checked','checked');
  var check_slider = document.createElement('span');
  check_slider.setAttribute('class','check_slider');

  check_slider_wrap.appendChild(input);
  check_slider_wrap.appendChild(check_slider);

  aux.appendChild(check_slider_wrap);

  var label = document.createElement('span');
  label.innerHTML = 'Attributes';
  label.setAttribute('class','filtr_text');
  aux.appendChild(label);
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','val_check');
  aux.lastElementChild.innerHTML = 'Value Domain';
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','indiv_check');
  aux.lastElementChild.innerHTML = 'Individuals';
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','forall_check');
  aux.lastElementChild.innerHTML = 'Universal Quantifier';
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','not_check');
  aux.lastElementChild.innerHTML = 'Not';
  child.appendChild(aux);

/*
  child.innerHTML = '<div class="filtr_option"><input id="attr_check" type="checkbox" checked /><label class="filtr_text">Attributes</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="val_check" type="checkbox" checked /><label class="filtr_text">Value Domain</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="indiv_check" type="checkbox" checked /><label class="filtr_text">Individuals</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="forall_check" type="checkbox" checked /><label class="filtr_text">Universal Quantifier</label></div>';
*/
  module.appendChild(child);
  module.innerHTML += '<div onclick="toggle(this)" class="bottom_button" title="filters"><i alt="filters" class="material-icons md-24"/>filter_list</i></div>';

  this.container.appendChild(module);

  var input;
  var elm = module.getElementsByClassName('filtr_option');

  for(i=0; i<elm.length; i++){
    input = elm[i].firstElementChild.firstElementChild;

    input.addEventListener('click', function() {
      this_graph.filter(this.id);
    });
  }


  // Center Button
  module = document.createElement('div');
  module.setAttribute('id','center_button');
  module.setAttribute('class','module bottom_button');
  module.setAttribute('title','reset');

  img = drop_down_icon.cloneNode(true);
  img.innerHTML = 'filter_center_focus';
  module.appendChild(img);

  module.addEventListener('click',function () {
    this_graph.cy.fit();
  });

  this.container.appendChild(module);


  // OWL2 TRANSLATOR
  module = document.createElement('div');
  module.setAttribute('id','owl_translator');
  module.setAttribute('class','hide module');

  // module body
  child = document.createElement('div');
  child.setAttribute('id','translator_body');
  child.setAttribute('class','module_body collapsible');
  aux = document.createElement('div');
  aux.setAttribute('id','owl_axiomes');
  child.appendChild(aux);
  module.appendChild(child);

  // module head
  child = document.createElement('div');
  child.setAttribute('class','module_head');
  child.innerHTML = 'OWL 2';

  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','translator-button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(this)');
  img = drop_down_icon.cloneNode(true);
  img.innerHTML = 'arrow_drop_down';
  child.appendChild(img);
  module.appendChild(child);

  this.container.appendChild(module);


  // ONTOLOGY INFOS
  module = document.createElement('div');
  module.setAttribute('id','onto_info');
  module.setAttribute('class','module');
  child = document.createElement('div');
  child.setAttribute('id','onto_info_body');
  child.setAttribute('class','bottom_window hide');

  // Name + Version
  child.innerHTML = '<div style="text-align:center; margin-bottom:10px;"><strong>Ontology Info</strong></div>\
  <table class="details_table">\
  <tr><th>Name</th><td>'+this.ontology_name+'</td></tr>\
  <tr><th>Version</th><td>'+this.ontology_version+'</td></tr></table>';

  // Prefixes Definiton
  child.innerHTML += '<div style="text-align:center; margin:10px 2px 0 2px; padding:5px; color:white; background-color:\
    '+this.highlight_color+'"><strong>IRI Prefixes Dictionary</strong></div>';

  aux = document.createElement('div');
  aux.setAttribute('id','prefixes_dict_list');
  var table = document.createElement('table');
  table.setAttribute('id','prefix_dict_table');
  var properties, property_value;
  var tr = document.createElement('tr');
  var prefix = document.createElement('th');
  var full_iri = document.createElement('td');

  if (this.default_iri) {
    prefix.innerHTML = '<em>Default</em>';
    full_iri.innerHTML = this.default_iri;

    tr.appendChild(prefix);
    tr.appendChild(full_iri);
    table.appendChild(tr);
  }

  if (this.iri_prefixes) {
    for(i=0; i<this.iri_prefixes.length; i++) {
      tr = document.createElement('tr');
      prefix = document.createElement('th');
      full_iri = document.createElement('td');

      var ignore_standard_iri = false;
      properties = this.iri_prefixes[i].parentNode.parentNode.getElementsByTagName('properties')[0];

      if (properties.childNodes.length > 0){
        for (j=0; j<properties.getElementsByTagName('property').length; j++) {
          property_value = properties.getElementsByTagName('property')[j].getAttribute('property_value');

          if (property_value) {
            switch (property_value) {
              case 'Standard_IRI':
                ignore_standard_iri = true;
                break;

              case 'Project_IRI':
                full_iri.classList.add('project_iri');
                break;
            }
          }
        }
      }

      if (!ignore_standard_iri) {
        prefix.innerHTML = this.iri_prefixes[i].getAttribute('prefix_value');
        full_iri.innerHTML = this.iri_prefixes[i].parentNode.parentNode.getAttribute('iri_value');

        tr.appendChild(prefix);
        tr.appendChild(full_iri);
        table.appendChild(tr);

      }
    }
  }

  child.appendChild(table);

  module.appendChild(child);
  module.innerHTML += '<div onclick="toggle(this)" class="bottom_button" title="Info"><i alt="info" class="material-icons md-24"/>info_outline</i></div>';
  this.container.appendChild(module);

  var icons = document.getElementsByClassName('material-icons');
  for (i = 0; i < icons.length; i++) {
    icons[i].onselectstart = function() {return false;};
  }


};
