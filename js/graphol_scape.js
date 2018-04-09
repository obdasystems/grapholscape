function GrapholScape(file,container,xmlstring) {
  this.highlight_color = 'rgb(81,149,199)';
  this.container = container;
  this.diagrams = [];
  this.xmlPredicates = [];
  this.actual_diagram = -1;

  var cy_container = document.createElement('div');
  cy_container.setAttribute('id','cy');
  this.container.appendChild(cy_container);
  this.cy = cytoscape({

    container:container.firstElementChild, // container to render in

    autoungrabify: true,
    wheelSensitivity: 0.4,


    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'height' : 'data(height)',
          'width' : 'data(width)',
          'background-color': 'data(fillColor)',
          'shape': 'data(shape)',
          'border-width': 1,
          'border-color': '#000',
          'border-style': 'solid',

          'font-size' : 12

        }
      },

      {
        selector: '[label]',
        style: {
          'label': 'data(label)',
          'text-margin-x' : 'data(labelXpos)',
          'text-margin-y' : 'data(labelYpos)',
          'text-wrap': 'wrap',
        }
      },

      {
        selector: 'edge',
        style: {

          'width': 1,
          'line-color': '#000',
          'target-arrow-color': '#000',
          'target-arrow-shape': 'data(target_arrow)',
          'target-arrow-fill': 'data(arrow_fill)',
          'line-style' : 'data(style)',
          'curve-style' : 'bezier',
          'arrow-scale' : 1.3,
        }
      },

      {
        selector: '[segment_distances]',
        style: {
          'curve-style': 'segments',
          "segment-distances": 'data(segment_distances)',
          'segment-weights' : 'data(segment_weights)',
          'edge-distances' : 'node-position',
        }
      },

      {
        selector: '[source_arrow]',
        style: {
          'source-arrow-color': '#000',
          'source-arrow-shape': 'data(source_arrow)',
          'source-arrow-fill': 'data(arrow_fill)',
        }

      },

      {
        selector: '[source_endpoint]',
        style: {
          'source-endpoint' : 'data(source_endpoint)',
        }
      },

      {
        selector: '[target_endpoint]',
        style: {
          'target-endpoint' : 'data(target_endpoint)',
        }
      },

      {
        selector: '[?functional][!inverseFunctional]',
        style: {
          'border-width':5,
          'border-color': '#000',
          'border-style': 'double',
        }
      },

      {
        selector: '[?inverseFunctional][!functional]',
        style: {
          'border-width':4,
          'border-color': '#000',
          'border-style': 'solid',
        }
      },

      {
        selector: '[edge_label]',
        style: {
          'label': 'data(edge_label)',
          'font-size' : 10,
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
        }
      },

      {
        selector: '[target_label]',
        style: {
          'target-label': 'data(target_label)',
          'font-size' : 10,
          'target-text-offset': 15,
          'target-text-margin-y': -5,
        }
      },

      {
        selector: '[shape_points]',
        style: {
          'shape-polygon-points': 'data(shape_points)',
        }
      },

      {
        selector: 'edge:selected',
        style: {
          'line-color' : this.highlight_color,
          'source-arrow-color' : this.highlight_color,
          'target-arrow-color' : this.highlight_color,
          'width' : '4',
          'z-index' : '100',
        }
      },

      {
        selector: 'node:selected',
        style: {
          'border-color' : this.highlight_color,
          'border-width' : '4',
          'z-index' : '100',
        }
      },
    ],

    layout: {
      name: 'preset',
    }

  });

  xmlstring = xmlstring || null;
  var this_graph = this;
  if (!xmlstring) {
    var reader = new FileReader();
    reader.onloadend = function() {
      this_graph.init(reader.result);
    }

    reader.readAsText(file);
  }
  else {
    this.init(xmlstring);
  }
  
  
  this.cy.on('select','.predicate', function (evt) {this_graph.showDetails(evt.target);});
  this.cy.on('tap',function(evt) {
    if (evt.target === this_graph.cy)
      document.getElementById('details').classList.add('hide');
  })
}


GrapholScape.prototype.init = function(xmlString) {
  // reference to this object, used when adding event listeners
  var this_graph = this;
  var i,k;
  
  var parser = new DOMParser();
  var xmlDocument = parser.parseFromString(xmlString, 'text/xml');
  this.diagrams = xmlDocument.getElementsByTagName('diagram');
  this.xmlPredicates = xmlDocument.getElementsByTagName('predicate');
  
  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length == 0) {
    this.default_iri = xmlDocument.getElementsByTagName('iri')[0].textContent;
  }
  else {
    this.iri_prefixes = xmlDocument.getElementsByTagName('prefix');

    var iri_list = xmlDocument.getElementsByTagName('iri');

    for(i=0; i< iri_list.length; i++) {
      if (iri_list[i].getElementsByTagName('prefix').length == 0) {
        this.default_iri = iri_list[i].getAttribute('iri_value');
        break;
      }
    }
  }

  // module : diagram list
  var module = document.createElement('div');
  var child = document.createElement('div');
  var img = document.createElement('img');
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
  child.setAttribute('onclick','toggle(id)');
  img.setAttribute('src','icons/drop_down_24dp.png');
  child.appendChild(img);
  module.appendChild(child);

  // module dropdown div
  child = document.createElement('div');
  child.setAttribute('id','diagram_list');
  child.setAttribute('class','hide');

  // adding diagrams in the dropdown div
  var item;
  for(i=0; i<this.diagrams.length; i++) {
    item = document.createElement('div');
    item.setAttribute('class','diagram_item');

    item.innerHTML = this.diagrams[i].getAttribute('name');

    item.addEventListener('click',function () {
      this_graph.drawDiagram(this.innerHTML);
      toggle('diagram-list-button');
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
  child.setAttribute('class','hide');
  
  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);
  
  // Ontology Explorer Table Population
  var j,row, wrap, col, img_type_address, sub_rows_wrapper, sub_row, element,nodes, key, label;
  
  for (i=0; i< this.diagrams.length; i++) {
    nodes = this.diagrams[i].getElementsByTagName('node');
    
    for(k=0; k < nodes.length; k++) {
      element = nodes[k];
      
      if (isPredicate(element)) {
        label = element.getElementsByTagName('label')[0].textContent;
        // Escaping new line characters
        label = label.replace(/\r?\n|\r/g,"");
        key = label.concat(element.getAttribute('type'));
        
        
        // If we already added this predicate to the list, we add it in the sub-rows
        if (document.getElementById(key) != null) {
          
          sub_rows_wrapper = document.getElementById(key).getElementsByClassName('sub_row_wrapper')[0];
          
          sub_row = document.createElement('div');
          sub_row.setAttribute('class','sub_row');

          sub_row.innerHTML = '- '+this.getDiagramName(i)+' - '+element.getAttribute('id');
          sub_row.setAttribute("diagram",this.getDiagramName(i));
          sub_row.setAttribute("node_id",element.getAttribute('id'));

          sub_row.addEventListener('click',function() {goTo(this_graph,this);});

          sub_rows_wrapper.appendChild(sub_row);
        }
        // Else: this is a new predicate, we create its row and its first sub rows
        else {
          // row is the container of a row and a set of sub-rows
          row = document.createElement('div');
          row.setAttribute("id",key);
          row.setAttribute('class','predicate');
          
          // the real row
          wrap = document.createElement('div');
          wrap.setAttribute("class","row");
          
          // columns
          col = document.createElement('span');
          img  = document.createElement('img');
          img.setAttribute('src','icons/arrow_right_18dp.png');
          col.appendChild(img);
          wrap.appendChild(col);

          col = document.createElement('span');
          col.setAttribute('class','col type_img');
          img = document.createElement('img');
          img_type_address = 'icons/ic_treeview_'+element.getAttribute('type')+'_18dp_1x.png';
          
          img.setAttribute("src",img_type_address);
          col.appendChild(img);
          wrap.appendChild(col);


          col = document.createElement('div');
          col.setAttribute('class','info');
          col.innerHTML = label;

          wrap.appendChild(col);
          row.appendChild(wrap);

          wrap.firstChild.addEventListener('click',function() {toggleSubRows(this);});

          sub_rows_wrapper = document.createElement('div');
          sub_rows_wrapper.setAttribute('class','sub_row_wrapper');
          
          sub_row = document.createElement('div');
          sub_row.setAttribute('class','sub_row');

          sub_row.innerHTML = '- '+this.getDiagramName(i)+' - '+element.getAttribute('id');
          sub_row.setAttribute("diagram",this.getDiagramName(i));
          sub_row.setAttribute("node_id",element.getAttribute('id'));

          sub_row.addEventListener('click',function() {goTo(this_graph,this);});

          sub_rows_wrapper.appendChild(sub_row);
          row.appendChild(sub_rows_wrapper);
          
        }
        // Child = predicates list
        child.appendChild(row);
      }        
    }
  }
  
  

  // tools
  module = document.createElement('div');
  module.setAttribute('id','tools');
  module.setAttribute('class','module');

  child = document.createElement('div');
  child.setAttribute('id','zoom_tools');
  child.setAttribute('class','tooltip module');

  // zoom_in
  var aux = document.createElement('div');
  aux.setAttribute('class','zoom_button');
  aux.setAttribute('id','zoom_in');
  aux.innerHTML = '+';

  aux.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()+0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    var slider_value = Math.round(this_graph.cy.zoom()/this_graph.cy.maxZoom()*100);
    document.getElementById('zoom_slider').setAttribute('value',slider_value);
  });
  aux.onselectstart = function() { return false};
  child.appendChild(aux);

  // tooltip
  aux = document.createElement('span');
  aux.setAttribute('class','tooltiptext');
  aux.setAttribute('onclick','showSlider()');
  aux.innerHTML = 'Toggle slider';

  child.appendChild(aux);

  // slider
  aux = document.createElement('div');
  aux.style.textAlign = 'center';
  input = document.createElement('input');
  input.setAttribute('id','zoom_slider');
  input.setAttribute('class','hide');
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

  aux.appendChild(input);

  child.appendChild(aux);

  // zoom_out
  aux = document.createElement('div');
  aux.setAttribute('class','zoom_button');
  aux.setAttribute('id','zoom_out');
  aux.innerHTML = '-';

  aux.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()-0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    var slider_value = Math.round(this_graph.cy.zoom()/this_graph.cy.maxZoom()*100);
    document.getElementById('zoom_slider').setAttribute('value',slider_value);

  });
  aux.onselectstart = function() { return false};
  child.appendChild(aux);

  // add zoom_tools to the tools module
  module.appendChild(child);
  // add tools module to the container
  this.container.appendChild(module);
  
  
  
  // Test : selected item
  module = document.createElement('div');
  module.setAttribute('id','details');
  module.setAttribute('class','module hide');

  // module head
  child = document.createElement('div');
  child.setAttribute('id','details_head');
  child.setAttribute('class','module_head');
  child.innerHTML = 'Details';
  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','details_button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(id)');
  img = document.createElement('img');
  img.setAttribute('src','icons/drop_down_24dp.png');
  child.appendChild(img);
  module.appendChild(child);
  
  // module body
  child = document.createElement('div');
  child.setAttribute('id','details_body');
  child.setAttribute('class','hide');
  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);
  
};

GrapholScape.prototype.addNodesToGraph = function(nodes) {
  var element;
  var i;

  for (i=0; i<nodes.length; i++) {
    element = nodes[i];

    // Creating a JSON Object for the node to be added to the graph
    var nodo = {
      data: {
        id : element.getAttribute('id'),
        fillColor : element.getAttribute('color'),
        type: element.getAttribute('type'),
      },
      position: {
      },
      
      classes : element.getAttribute('type'),
    };
    
    
    switch (nodo.data.type) {
      case 'concept' :
      case 'domain-restriction' :
      case 'range-restriction':
        nodo.data.shape = 'rectangle';
        break;

      case 'role' :
        nodo.data.shape = 'diamond';
        break;

      case 'attribute':
        nodo.data.shape = 'ellipse';
        break;

      case 'union':
      case 'disjoint-union' :
      case 'role-inverse' :
      case 'intersection' :
      case 'role-chain' :
      case 'complement' :
      case 'enumeration' :
      case 'datatype-restriction' :
        nodo.data.shape = 'hexagon';

        if (nodo.data.type == 'role-chain') {
          nodo.data.inputs = element.getAttribute('inputs').split(",");
        }
        break;

      case 'value-domain' :
      case 'property-assertion' :
        nodo.data.shape = 'roundrectangle';
        break;

      case 'individual' :
        nodo.data.shape = 'octagon';
        break;

      case 'facet' :
        nodo.data.shape = 'polygon';
        nodo.data.shape_points = '-0.9 -1 1 -1 0.9 1 -1 1';
        nodo.data.fillColor = '#ffffff';
        break;

      default:
        alert('tipo di nodo sconosciuto');
        break;
    }

    // Parsing the <geometry> child node of node
    // info = <GEOMETRY>
    var info = getFirstChild(element);

    nodo.data.width = parseInt(info.getAttribute('width'));
    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.width < 0)
      nodo.data.width = - nodo.data.width;


    nodo.data.height = parseInt(info.getAttribute('height'));
    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.height < 0)
      nodo.data.height = - nodo.data.height;

    // L'altezza dei facet è nulla nel file graphol, la impostiamo a 40
    if (nodo.data.type == 'facet') {
      nodo.data.height = 40;
    }

    nodo.position.x = parseInt(info.getAttribute('x'));
    nodo.position.y = parseInt(info.getAttribute('y'));

    // info = <LABEL>
    info = getNextSibling(info);

    // info = null se non esiste la label (è l'ultimo elemento)
    if (info != null) {
      nodo.data.label = info.textContent;
    }

    // Setting predicates properties
    if (isPredicate(element)) {
      
      nodo.classes += ' predicate';
      var label_no_break = nodo.data.label.replace(/\n/g,'');
      
      var node_iri,rem_chars,len_prefix
      // setting uri        
      if (element.getAttribute('remaining_characters') != null) {
        rem_chars = element.getAttribute('remaining_characters').replace(/\n/g,'');
        len_prefix = label_no_break.length - rem_chars.length;
        node_iri = label_no_break.substring(0,len_prefix-1);
        
        if(!node_iri)
          node_iri = this.default_iri;
        else {
          for (k=0; k < this.iri_prefixes.length; k++) {
            if (node_iri == this.iri_prefixes[k].getAttribute('prefix_value')) {
              node_iri = this.iri_prefixes[k].parentNode.parentNode.getAttribute('iri_value');
              break;
            }
          }
        }
      }
      else{
        node_iri = this.default_iri;
        rem_chars = label_no_break;
      }
      if (!node_iri.endsWith('/') && !node_iri.endsWith('#'))
        node_iri = node_iri+'/';

      nodo.data.iri = node_iri+rem_chars;
      
      
      var j, predicateXml;
      for (j = 0; j < this.xmlPredicates.length; j++) {
        predicateXml = this.xmlPredicates[j];
              
        if (label_no_break == predicateXml.getAttribute('name') && nodo.data.type == predicateXml.getAttribute('type')) {
          
          
          nodo.data.description = predicateXml.getElementsByTagName('description')[0].innerHTML;
          var start_body_index = nodo.data.description.indexOf('&lt;p');
          var end_body_index = nodo.data.description.indexOf('&lt;/body');
          
          nodo.data.description = nodo.data.description.substring(start_body_index,end_body_index);
          nodo.data.description = nodo.data.description.replace(/&lt;/g,'<');
          nodo.data.description = nodo.data.description.replace(/&gt;/g,'>');
          nodo.data.description = nodo.data.description.replace(/font-family:'monospace'/g,'');
          
          
          // Impostazione delle funzionalità dei nodi di tipo role o attribute
          if (nodo.data.type == 'attribute' || nodo.data.type == 'role') {
            nodo.data.functional = parseInt(predicateXml.getElementsByTagName('functional')[0].textContent);
          }
                    
          if (nodo.data.type == 'role') {
            nodo.data.inverseFunctional = parseInt(predicateXml.getElementsByTagName('inverseFunctional')[0].textContent);
            nodo.data.asymmetric = parseInt(predicateXml.getElementsByTagName('asymmetric')[0].textContent);
            nodo.data.irreflexive = parseInt(predicateXml.getElementsByTagName('irreflexive')[0].textContent);
            nodo.data.symmetric = parseInt(predicateXml.getElementsByTagName('symmetric')[0].textContent);
            nodo.data.transitive = parseInt(predicateXml.getElementsByTagName('transitive')[0].textContent);
          }

          if (nodo.data.functional == 1 && nodo.data.inverseFunctional == 1) {
            //Creating "fake" nodes for the double style border effect
            var triangle_right = {
              selectable:false,
              data : {
                height: nodo.data.height,
                width: nodo.data.width,
                fillColor: '#000',
                shape: 'polygon',
                shape_points: '0 -1 1 0 0 1',
              },
              position : {
                x: nodo.position.x,
                y: nodo.position.y,
              }
            };

            var triangle_left = {
              selectable:false,
              data : {
                height: nodo.data.height,
                width: nodo.data.width+2,
                fillColor: '#fcfcfc',
                shape: 'polygon',
                shape_points: '0 -1 -1 0 0 1',
              },
              position : {
                x: nodo.position.x,
                y: nodo.position.y,
              },
            };

            nodo.data.height -= 8;
            nodo.data.width -= 10;
            this.cy.add(triangle_right);
            this.cy.add(triangle_left);
          }
          break;
        }
      }
    }

    // If the node is both functional and inverse functional,
    // we added the double style border and changed the node height and width.
    // The label position is function of node's height and width so we set it
    // now after those changes.
    // info == null if label does not exist for this node
    if (info != null) {
      nodo.data.labelXpos = parseInt(info.getAttribute('x')) - nodo.position.x + 1;
      nodo.data.labelYpos = (parseInt(info.getAttribute('y')) - nodo.position.y) + (nodo.data.height+2)/2 + parseInt(info.getAttribute('height'))/4;

      // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
      // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
      if (nodo.data.type == 'facet') {
        nodo.data.label = nodo.data.label.replace('^^','\n\n');
        nodo.data.labelYpos = nodo.data.height;

        // Creating the top rhomboid for the grey background
        var top_rhomboid = {
          selectable:false,
          data: {
            height: nodo.data.height,
            width: nodo.data.width,
            fillColor: '#ddd',
            shape: 'polygon',
            shape_points: '-0.9 -1 1 -1 0.95 0 -0.95 0',
          },
          position : {
            x: nodo.position.x,
            y: nodo.position.y,
          },
        }

        // Setting the node transparent so the top_rhomboid will be visible
        nodo.style = {
          'background-opacity':0,
        };

        this.cy.add(top_rhomboid);
      }
    }

    this.cy.add(nodo);
  }  // End For
};

GrapholScape.prototype.addEdgesToGraph = function(edges) {
  var i;
  var arco;

  for(i=0; i < edges.length; i++) {

    arco = edges[i];
    var edge = {
      data : {
        target : arco.getAttribute('target'),
        source : arco.getAttribute('source'),
        id : arco.getAttribute('id'),
      }
    };

    switch (arco.getAttribute('type')) {
      case 'inclusion':
        edge.data.style = 'solid';
        edge.data.target_arrow = 'triangle';
        edge.data.arrow_fill = 'filled';
        break;

      case 'input':
        edge.data.style = 'dashed';
        edge.data.target_arrow = 'diamond';
        edge.data.arrow_fill = 'hollow';
        break;

      case 'equivalence':
        edge.data.style = 'solid';
        edge.data.source_arrow = 'triangle';
        edge.data.target_arrow = 'triangle';
        edge.data.arrow_fill = 'filled';
        break;

      case 'membership' :
        edge.data.style = 'solid';
        edge.data.target_arrow = 'triangle';
        edge.data.arrow_fill = 'filled';
        edge.data.edge_label = 'instance Of';
        break;

      default:
        alert('tipo di arco non implementato <'+arco.getAttribute('type')+'>');
        break;
    }


    // Prendiamo i nodi source e target
    var source = this.cy.getElementById(edge.data.source);
    var target = this.cy.getElementById(edge.data.target);


    // Impostiamo le label numeriche per gli archi che entrano nei role-chain
    // I role-chain hanno un campo <input> con una lista di id di archi all'interno
    // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
    // numerica che deve avere l'arco

    // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
    // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
    // la target_label in base alla posizione nella sequenza
    if (target.data('type') == 'role-chain') {
      var k=0;
      for (k=0; k < target.data('inputs').length; k++) {
        if (target.data('inputs')[k] == edge.data.id) {
          edge.data.target_label = k+1;
          break;
        }
      }
    }



    // info = <POINT>
    // Processiamo i breakpoints dell'arco
    // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
    var point = getFirstChild(arco);

    var breakpoints = [];
    var segment_weights = [];
    var segment_distances = [];

    var j;
    var count = 0;
    for (j=0; j< arco.childNodes.length; j++) {
      // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
      if (arco.childNodes[j].nodeType != 1)
        continue;

      breakpoints[count] = [];
      breakpoints[count].push(parseInt(point.getAttribute('x')));
      breakpoints[count].push(parseInt(point.getAttribute('y')));

      if (getNextSibling(point) != null) {
        point = getNextSibling(point);

        // Se il breakpoint in questione non è il primo
        // e non è l'ultimo, visto che ha un fratello,
        // allora calcoliamo peso e distanza per questo breakpoint
        // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
        if (count > 0) {
          var aux = getDistanceWeight(target.position(),source.position(),breakpoints[count]);

          segment_distances.push(aux[0]);
          segment_weights.push(aux[1]);
        }

        count++;
      }
      else
        break;
    }

    // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi
    if (count > 1) {
      edge.data.segment_distances = segment_distances;
      edge.data.segment_weights = segment_weights;
    }

    // Calcoliamo gli endpoints sul source e sul target
    // Se non sono centrati sul nodo vanno spostati sul bordo del nodo

    var source_endpoint = [];
    source_endpoint['x'] = breakpoints[0][0];
    source_endpoint['y'] = breakpoints[0][1];

    source_endpoint = getNewEndpoint(source_endpoint,source,breakpoints[1]);

    // Impostiamo l'endpoint solo se è diverso da zero
    // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
    if (source_endpoint['x'] != 0 || source_endpoint['y'] != 0) {
      edge.data.source_endpoint = [];
      edge.data.source_endpoint.push(source_endpoint['x']);
      edge.data.source_endpoint.push(source_endpoint['y']);
    }

    // Facciamo la stessa cosa per il target
    var target_endpoint = [];
    target_endpoint['x'] = breakpoints[breakpoints.length-1][0];
    target_endpoint['y'] = breakpoints[breakpoints.length-1][1];

    target_endpoint = getNewEndpoint(target_endpoint,target,breakpoints[breakpoints.length-2]);

    if (target_endpoint['x'] != 0 || target_endpoint['y'] != 0) {
      edge.data.target_endpoint = [];
      edge.data.target_endpoint.push(target_endpoint['x']);
      edge.data.target_endpoint.push(target_endpoint['y']);
    }

    this.cy.add(edge);
  }
};

GrapholScape.prototype.drawDiagram = function(diagram_name) {
  var diagram_id = this.getDiagramId(diagram_name);

  if (diagram_id < 0) {
    return null;
  }

  this.cy.remove('node');
  this.cy.remove('edge');

  this.addNodesToGraph(this.diagrams[diagram_id].getElementsByTagName('node'));
  this.addEdgesToGraph(this.diagrams[diagram_id].getElementsByTagName('edge'));

  this.cy.minZoom(0.05);
  this.cy.maxZoom(2.5);
  this.cy.fit();
  this.actual_diagram = diagram_id;
  document.getElementById('title').innerHTML = diagram_name;
  return true;
};

GrapholScape.prototype.getDiagramId = function(name) {
  var diagram_id = 0;

  for (diagram_id = 0; diagram_id < this.diagrams.length; diagram_id++) {
    if (this.diagrams[diagram_id].getAttribute('name') === name)
      return diagram_id;
  }

  return -1;
};

GrapholScape.prototype.getDiagramName = function(diagram_id) {
  return this.diagrams[diagram_id].getAttribute('name');
}

GrapholScape.prototype.centerOnNode = function(node_id, diagram, zoom) {

  // if we're not on the diagram of the node to center on, just draw it!
  if (this.actual_diagram != this.getDiagramId(diagram)) {
    this.drawDiagram(diagram);
  }


  var node = this.cy.getElementById(node_id);
  this.centerOnPosition(node.position('x'),node.position('y'),zoom);
  this.cy.collection(':selected').unselect();
  node.select();
}

GrapholScape.prototype.centerOnPosition = function (x_pos, y_pos, zoom) {
  this.cy.reset();

  var offset_x = this.cy.width() / 2;
  var offset_y = this.cy.height() / 2;

  x_pos -=  offset_x;
  y_pos -=  offset_y;

  this.cy.pan({
    x: -x_pos,
    y: -y_pos,
  });

  this.cy.zoom({
    level: zoom,
    renderedPosition : { x: offset_x, y: offset_y }
  });
}

GrapholScape.prototype.showDetails = function (target) {
  document.getElementById('details').classList.remove('hide');
    
  var body_details = document.getElementById('details_body');
  
  body_details.innerHTML = '<table class="details_table">\
  <tr><th>Name</th><td>'+target.data('label').replace('/\n/g','')+'</td></tr>\
  <tr><th>Type</th><td>'+target.data('type')+'</td></tr>\
  <tr><th>URI</th><td><a style="text-decoration:underline" href="'+target.data('iri')+'">'+target.data('iri')+'</a></td></tr></table>';
  
  if(target.data('type') == 'role' || target.data('type') == 'attribute') {
    
    if (target.data('functional'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Functional</span></div>';
    
    if (target.data('inverseFunctional'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Inverse Functional</span></div>';
    
    if (target.data('asymmetric'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Asymmetric</span></div>';
    
    if (target.data('irreflexive'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Irreflexive</span></div>';
    
    if (target.data('reflexive'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Asymmetric</span></div>';
    
    if (target.data('symmetric'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Symmetric</span></div>';
    
    if (target.data('transitive'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Transitive</span></div>';
    
    
  }
  
  
  if (target.data('description')) {
    body_details.innerHTML += '<div style="text-align:center; margin:10px 2px 0 2px; padding:5px; color:white; background-color:\
      '+this.highlight_color+'"><strong>Description</strong></div><div class="descr">'+target.data('description')+'</div>';
  }
}