function GrapholScape(file,container) {
  var highlight_color = '#1257D9';
  this.container = container;
  this.diagrams = [];
  this.xmlPredicates = [];
  this.predicates = '';
  this.actual_diagram = -1;
  
  

  this.cy = cytoscape({

    container:container, // container to render in

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
          'source_arrow_fill': 'data(arrow_fill)',
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
        selector: '[functional = 1]',
        style: {
          'border-width':5,
          'border-color': '#000',
          'border-style': 'double',
        }
      },

      {
        selector: '[functional = -1]',
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
          'text-margin-y': -5,
          'text-margin-x': -5,
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
          'line-color' : highlight_color,
          'source-arrow-color' : highlight_color,
          'target-arrow-color' : highlight_color,
          'width' : '4',
        }
      },
    ],

    layout: {
      name: 'preset',
    }

  });
  
  var reader = new FileReader();
  var this_graph = this; 
  reader.onloadend = function() {
    this_graph.init(reader.result);     
  }

  reader.readAsText(file);
  
}


GrapholScape.prototype.init = function(xmlString) {
  // reference to this object, used when adding event listeners
  var this_graph = this;
  
  var parser = new DOMParser();
  var xmlDocument = parser.parseFromString(xmlString, 'text/xml');

  this.diagrams = xmlDocument.getElementsByTagName('diagram');
  
  // diagram list
  var diagram_list = document.getElementById('diagram_list')
  
  var i=0;
  for(i=0; i<this.diagrams.length; i++) {
    var item = document.createElement('div');
    item.setAttribute('class','diagram_item');

    var name = this.diagrams[i].getAttribute('name');
    item.innerHTML = name;

    item.addEventListener('click',function () {
      this_graph.drawDiagram(this.innerHTML);
      toggleDiagramList();
    });

    document.getElementById('diagram_list').appendChild(item);
  }
 
  this.xmlPredicates = xmlDocument.getElementsByTagName('predicate');
  this.predicates = new HashTable(this.xmlPredicates.length);



  // Retrieving informations from all the diagrams
  var k=0;
  // Populating the predicates HashTable
  for (i=0; i<this.diagrams.length; i++) {
    var nodes = this.diagrams[i].getElementsByTagName('node');

    var element;
    for (k = 0; k < nodes.length; k++) {
      element = nodes[k];

      var nodo = {
          type : element.getAttribute('type'),
      };


      if (isPredicate(nodo)) {

        nodo.label = element.getElementsByTagName('label')[0].textContent;

        nodo.label = nodo.label.replace(/\r?\n|\r/g,""); // removing new_lines characters
        var key = nodo.label.concat(nodo.type);

        // if this predicate is already in the hashtable
        // then we add the id and the diagram identificator of this "istance"
        // So we will know the number of istances in the ontology for each predicate
        // and which diagram they referes to
        if (this.predicates.get(key) != null) {
          // overriding the node created previously with the one that's already in the hash table
          nodo = this.predicates.get(key);

          nodo.id.push(element.getAttribute('id'));
          nodo.diagrams.push(i);
        }
        else {
          // This is a new predicate, create the id and diagrams number array
          nodo.id = [];
          nodo.id.push(element.getAttribute('id'));
          nodo.diagrams = [];
          nodo.diagrams.push(i);
          this.predicates.insert(key,nodo);
        }
      }
    }
  }


  // Ontology Explorer Table Population
  var table = document.getElementById('predicates_list');

  for (i=0; i< this.predicates.size; i++) {

    if (this.predicates.storage[i] != null) {
      var current_node = this.predicates.storage[i];

      while(current_node) {
        //table.innerHTML += '<tr id="'+current_node.key+'"><td class="type_img"><img src="icons/ic_treeview_'+current_node.element.data.type+'_18dp_1x.png" /></td><td>'+current_node.element.data.label+'</td></tr>';


        var row = document.createElement('div');
        row.setAttribute("id",  current_node.key);
        row.setAttribute('class','predicate');

        var wrap = document.createElement('div');
        wrap.setAttribute("class","row");

        var col = document.createElement('span');
        var img  = document.createElement('img');
        img.setAttribute('src','icons/arrow_right_18dp.png');
        col.appendChild(img);
        wrap.appendChild(col);

        col = document.createElement('span');
        col.setAttribute('class','col type_img');
        img = document.createElement('img');
        var img_type_address = 'icons/ic_treeview_'+current_node.element.type+'_18dp_1x.png';
        img.setAttribute("src",img_type_address);
        col.appendChild(img);
        wrap.appendChild(col);


        col = document.createElement('div');
        col.setAttribute('class','col info');
        col.innerHTML = current_node.element.label;

        wrap.appendChild(col);
        row.appendChild(wrap);


        wrap.firstChild.addEventListener('click',function() {toggleSubRows(this);});

        var j=0;
        var sub_rows = document.createElement('div');
        sub_rows.setAttribute('class','sub_row_wrapper');
        for (j=0; j < current_node.element.id.length; j++) {



          var sub_row = document.createElement('div');
          sub_row.setAttribute('class','sub_row');

          sub_row.innerHTML = '- '+this.getDiagramName(current_node.element.diagrams[j])+' - '+current_node.element.id[j];
          sub_row.setAttribute("diagram",this.getDiagramName(current_node.element.diagrams[j]));
          sub_row.setAttribute("node_id",current_node.element.id[j]);

          var graph_obj = this;

          sub_row.addEventListener('click',function() {goTo(graph_obj,this);});

          sub_rows.appendChild(sub_row);
          row.appendChild(sub_rows);
        }

        table.appendChild(row);
        current_node = current_node.next;

      }
    }
  }
  
  
  // Showing UI modules
  var modules = document.getElementsByClassName('module');
  for(i=0; i < modules.length; i++) {
    modules[i].style.display = 'initial';
  }
  
  var zoom_in = document.getElementById('zoom_in');
  zoom_in.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()+0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    
  });
  
  var zoom_out = document.getElementById('zoom_out');
  zoom_out.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()-0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    
  });
};

GrapholScape.prototype.addNodesToGraph = function(nodes) {
  var element;
  var i;

  for (i=0; i<nodes.length; i++) {
    element = nodes[i];

    // Creating a JSON Object for the node to be added to the graph
    // Cytoscape's nodes has two sub-structures: data and position
    var nodo = {
      data: {
        id : element.getAttribute('id'),
        fillColor : element.getAttribute('color'),
        type : element.getAttribute('type'),
      },
      position: {
     }
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

    // Parsing de <geometry> child node of node
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

    // Impostazione delle funzionalità dei nodi di tipo role o attribute
    //  1 -> funzionale
    //  -1 -> inversamente funzionale
    //  2 -> funzionale e inversamente funzionale
    if (nodo.data.type == 'attribute' || nodo.data.type == 'role') {
      var label_no_break = nodo.data.label.replace(/\n/,'');

      var j;
      for (j = 0; j < this.xmlPredicates.length; j++) {
        if (label_no_break == this.xmlPredicates[j].getAttribute('name')) {
          if (this.xmlPredicates[j].getElementsByTagName('functional')[0].textContent == 1) {
            nodo.data.functional = 1;
          }

          // Se il nodo è un ruolo ed è inversamente funzionale, impostiamo 2 se è anche
          // funzionale.
          // -1 altrimenti
          if (nodo.data.type == 'role' && this.xmlPredicates[j].getElementsByTagName('inverseFunctional')[0].textContent == 1) {
            if (nodo.data.functional == 1) {
              nodo.data.functional = 2;

              //Creating nodes for the double style border effect

              var triangle_right = {
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
            else
              nodo.data.functional = -1;
          }
        }

      }
    }


    // If the node is both functional and inverse functional,
    // we added the double style border and changed the node height and width.
    // The label position is function of node's height and width so we set it
    // now, after those changes
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
        edge.data.label = 'instance Of';
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
  this.cy.remove('edge')

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


  node.style('border-color','#1257D9');
  node.style('border-width',5);

  setTimeout(function(){

    node.style('border-color','#000');
    if (node.data('functional') == 1)
      node.style('border-width',5);
    else if (node.data('functional') == -1)
      node.style('border-width',4);
    else
      node.style('border-width',1);
  }, 1500, node);

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
