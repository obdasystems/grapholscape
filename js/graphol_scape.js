function GrapholScape(file,container,xmlstring) {
  this.highlight_color = 'rgb(81,149,199)';
  this.container = container;
  this.diagrams = [];
  this.actual_diagram = -1;  
  this.disjoint_arr = [];

  this.container.style.fontSize = '14px';
  this.container.style.color = '#666';
  var cy_container = document.createElement('div');
  cy_container.setAttribute('id','cy');
  this.container.appendChild(cy_container);
  
  this.cy = cytoscape({

    container:container.firstElementChild, // container to render in

    autoungrabify: true,
    wheelSensitivity: 0.4,
    maxZoom: 2.5,
    minZoom: 0.02,

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
          'font-size' : 12,
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
          'edge-distances': 'node-position',
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
      {
        selector: '.filtered',
        style: {
          'display':'none',
        },
      },
      {
        selector: '.facet',
        style: {
          'background-opacity':0,
        }
      }
    ],

    layout: {
      name: 'preset',
    }

  });

  this.cy_aux = cytoscape();
  this.predicates;

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

  this.cy.on('select','*',function (evt) {
    if(!evt.target.hasClass('predicate')) {
      document.getElementById('details').classList.add('hide');
      
      if (evt.target.isEdge() && (evt.target.data('type') == 'inclusion' || evt.target.data('type') == 'equivalence' )) {
        document.getElementById('owl_translator').classList.remove('hide');
        document.getElementById('owl_axiomes').innerHTML = this_graph.edgeToOwlString(evt.target);

        this_graph.disjoint_arr.forEach(disj_node => {
          document.getElementById('owl_axiomes').innerHTML += '<br />'+this_graph.nodeToOwlString(disj_node,true);
        });

        this_graph.disjoint_arr = [];
      }
      else if (evt.target.isNode() && evt.target.data('type') != 'value-domain' && evt.target.data('type') != 'facet') {
        document.getElementById('owl_translator').classList.remove('hide');
        document.getElementById('owl_axiomes').innerHTML = this_graph.nodeToOwlString(evt.target);

        this_graph.disjoint_arr.forEach(disj_node => {
          document.getElementById('owl_axiomes').innerHTML += '<br />'+this_graph.nodeToOwlString(disj_node,true);
        });
        
        this_graph.disjoint_arr = [];
      }
      else {
        document.getElementById('owl_translator').classList.add('hide');
      }
    }
    else {
      document.getElementById('owl_translator').classList.add('hide');
    }
  });

  this.cy.on('tap',function(evt) {
    if (evt.target === this_graph.cy) {
      document.getElementById('details').classList.add('hide');
      document.getElementById('owl_translator').classList.add('hide');

      var i,button;
      var collapsible_elms = document.getElementsByClassName('collapsible');
      for (i=0; i<collapsible_elms.length; i++) {
        if (collapsible_elms[i].id == 'details_body' || collapsible_elms[i].id == 'translator_body')
          continue;
        
        if (collapsible_elms[i].clientHeight != 0) {
          toggle(collapsible_elms[i]);
        }
      }
    }
  });
}


GrapholScape.prototype.init = function(xmlString) {
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

  var nodes,edges,item,array_json_elems,cnt;
  this.collection = this.cy_aux.collection();

  for (i=0; i< this.diagrams.length; i++) {
    array_json_elems = [];

    nodes = this.diagrams[i].getElementsByTagName('node');
    edges = this.diagrams[i].getElementsByTagName('edge');
    cnt = 0;
    // Create JSON for each node to be added to the collection
    for (k=0; k<nodes.length; k++) {
      array_json_elems.push(this.NodeXmlToJson(nodes[k]));

      if (array_json_elems[cnt].data.type === 'facet' || (array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {
        this.addFakeNodes(array_json_elems);
        cnt += array_json_elems.length - cnt;
      }
      else
        cnt++;
    }
    this.collection = this.collection.union(this.cy_aux.collection(array_json_elems));

    array_json_elems = [];
    for (k=0; k<edges.length; k++) {
      array_json_elems.push(this.EdgeXmlToJson(edges[k]));
    }

    this.collection = this.collection.union(this.cy_aux.collection(array_json_elems));
    
    
  }
  // traverse the graph and retrieve the real identity for neutral nodes
  this.getIdentityForNeutralNodes();

  this.predicates = this.collection.filter('.predicate').sort(function(a,b) {
    return a.data('label').localeCompare(b.data('label'));
  });

  this.createUi();
  this.drawDiagram(this.getDiagramName(0));
};

GrapholScape.prototype.drawDiagram = function(diagram_name) {
  var diagram_id = this.getDiagramId(diagram_name);

  if (diagram_id < 0) {
    console.log('Error: diagram not found');
    return null;
  }

  this.cy.remove('*');

  var selector = '[diagram_id = '+diagram_id+']';
  
  this.cy.add(this.collection.filter(selector));
  
  this.cy.fit();
  this.actual_diagram = diagram_id;
  document.getElementById('title').innerHTML = diagram_name;
  return true;
};

GrapholScape.prototype.getDiagramId = function(name) {
  var diagram_id;

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
  <tr><th>IRI</th><td><a style="text-decoration:underline" href="'+target.data('iri')+'">'+target.data('iri')+'</a></td></tr></table>';

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

GrapholScape.prototype.NodeXmlToJson = function(element) {
  // Creating a JSON Object for the node to be added to the collection
  var diagram_id = this.getDiagramId(element.parentNode.getAttribute('name'));
  var label_no_break;

  var nodo = {
    data: {
      id_xml : element.getAttribute('id'),
      diagram_id : diagram_id,
      id : element.getAttribute('id')+'_'+diagram_id,
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
      nodo.data.shape = 'rectangle';
      nodo.data.identity = 'concept';
      break;
    
    case 'range-restriction':
      nodo.data.shape = 'rectangle';
      nodo.data.identity = 'neutral';
      break;

    case 'role' :
      nodo.data.shape = 'diamond';
      nodo.data.identity = 'role';
      break;

    case 'attribute':
      nodo.data.shape = 'ellipse';
      nodo.data.identity = 'attribute';      
      break;

    case 'union':
    case 'disjoint-union' :
    case 'complement' :
    case 'intersection' :
    case 'enumeration' :
      nodo.data.shape = 'hexagon';
      nodo.data.identity = 'neutral';
      break;

    case 'role-inverse' :
    case 'role-chain' :
      nodo.data.shape = 'hexagon';
      nodo.data.identity = 'role';
      if (nodo.data.type == 'role-chain') {
        nodo.data.inputs = element.getAttribute('inputs').split(",");
      }
      break;

    case 'datatype-restriction' :  
      nodo.data.shape = 'hexagon';
      nodo.data.identity = 'value_domain';
      break;

    case 'value-domain' :
      nodo.data.shape = 'roundrectangle';
      nodo.data.identity = 'value_domain';
      break;

    case 'property-assertion' :
      nodo.data.shape = 'roundrectangle';
      nodo.data.identity = 'neutral';
      break;

    case 'individual' :
      nodo.data.shape = 'octagon';
      nodo.data.identity = 'individual';
      break;

    case 'facet' :
      nodo.data.shape = 'polygon';
      nodo.data.shape_points = '-0.9 -1 1 -1 0.9 1 -1 1';
      nodo.data.fillColor = '#ffffff';
      nodo.data.identity = 'facet';
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
    nodo.data.labelXpos = parseInt(info.getAttribute('x')) - nodo.position.x + 1;
    nodo.data.labelYpos = (parseInt(info.getAttribute('y')) - nodo.position.y) + (nodo.data.height+2)/2 + parseInt(info.getAttribute('height'))/4;
    label_no_break = nodo.data.label.replace(/\n/g,'');
  }

  // Setting predicates properties
  if (isPredicate(element)) {

    nodo.classes += ' predicate';
    

    var node_iri,rem_chars,len_prefix,node_prefix_iri;
    // setting uri
    if (element.getAttribute('remaining_characters') != null) {
      rem_chars = element.getAttribute('remaining_characters').replace(/\n/g,'');
      len_prefix = label_no_break.length - rem_chars.length;
      node_prefix_iri = label_no_break.substring(0,len_prefix);

      if(node_prefix_iri == ':' || !node_prefix_iri)
        node_iri = this.default_iri;
      else {
        for (k=0; k < this.iri_prefixes.length; k++) {
          if (node_prefix_iri == this.iri_prefixes[k].getAttribute('prefix_value')+':') {
            node_iri = this.iri_prefixes[k].parentNode.parentNode.getAttribute('iri_value');
            break;
          }
        }
      }
    }
    else{
      node_iri = this.default_iri;
      node_prefix_iri = '';
      rem_chars = label_no_break;
    }

    if (!node_iri.endsWith('/') && !node_iri.endsWith('#'))
      node_iri = node_iri+'/';

    nodo.data.remaining_chars = rem_chars;
    nodo.data.prefix_iri = node_prefix_iri;
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
        nodo.data.description = nodo.data.description.replace(/&amp;/g,'&');
        nodo.data.description = nodo.data.description.replace(/font-size:0pt/g,'font-size:inherit');

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
        break;
      }
    }
  }
  else {
    // Set prefix and remaining chars for non-predicate nodes 
    // owl.js use this informations for all nodes 
    nodo.data.prefix_iri = '';
    nodo.data.remaining_chars = label_no_break;

    if (nodo.data.type == 'value-domain' || nodo.data.type == 'facet') {
      nodo.data.prefix_iri = label_no_break.split(':')[0]+':';
      nodo.data.remaining_chars = label_no_break.split(':')[1];
    }
  }
  
  return nodo;
};

GrapholScape.prototype.EdgeXmlToJson = function(arco) {
  var diagram_id = this.getDiagramId(arco.parentNode.getAttribute('name'));
  var k;

  var edge = {
    data : {
      target : arco.getAttribute('target')+'_'+diagram_id,
      source : arco.getAttribute('source')+'_'+diagram_id,
      id : arco.getAttribute('id')+'_'+diagram_id,
      id_xml: arco.getAttribute('id'),
      diagram_id : diagram_id,
      type : arco.getAttribute('type'),
    }
  };

  switch (edge.data.type) {
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
  var source = this.collection.getElementById(edge.data.source);
  var target = this.collection.getElementById(edge.data.target);


  // Impostiamo le label numeriche per gli archi che entrano nei role-chain
  // I role-chain hanno un campo <input> con una lista di id di archi all'interno
  // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
  // numerica che deve avere l'arco

  // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
  // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
  // la target_label in base alla posizione nella sequenza
  if (target.data('type') == 'role-chain') {
    for (k=0; k < target.data('inputs').length; k++) {
      if (target.data('inputs')[k] == edge.data.id_xml) {
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

  return edge;
}

GrapholScape.prototype.addFakeNodes = function(array_json_elems) {

  var nodo = array_json_elems[array_json_elems.length-1];

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
        diagram_id: nodo.data.diagram_id,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      },
    };

    var bottom_rhomboid = {
      selectable:false,
      data: {
        height: nodo.data.height,
        width: nodo.data.width,
        fillColor: '#fff',
        shape: 'polygon',
        shape_points: '-0.95 0 0.95 0 0.9 1 -1 1',
        diagram_id: nodo.data.diagram_id,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      },
    };

    array_json_elems[array_json_elems.length-1] = top_rhomboid;
    array_json_elems.push(bottom_rhomboid);
    array_json_elems.push(nodo);
    return;
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
        diagram_id: nodo.data.diagram_id,
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
        diagram_id: nodo.data.diagram_id,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      },
    };

    var old_labelXpos = nodo.data.labelXpos;
    var old_labelYpos = nodo.data.labelYpos;

    nodo.data.height -= 8;
    nodo.data.width -= 10;
    // If the node is both functional and inverse functional,
    // we added the double style border and changed the node height and width.
    // The label position is function of node's height and width so we adjust it
    // now after those changes.
    if (nodo.data.label != null) {
      nodo.data.labelYpos -= 4;
    }

    array_json_elems[array_json_elems.length-1] = triangle_left;
    array_json_elems.push(triangle_right);
    array_json_elems.push(nodo);
  }
}

GrapholScape.prototype.filter = function(checkbox_id) {
  var selector,eles,eles_aux,type;
  switch(checkbox_id) {
    case 'val_check':
      type = 'value-domain';
      break;

    case 'attr_check':
      type = 'attribute';

      if (!document.getElementById('attr_check').checked) {
        document.getElementById('val_check').setAttribute('disabled','true');
      }
      else {
        document.getElementById('val_check').removeAttribute('disabled');
      }
      break;

    case 'indiv_check':
      type = 'individual';
    break;
    
    case 'forall_check':
      type = 'forall';
       break;

    case 'not_check':
      type = 'complement';
      break;
  }

  if (type == 'forall') {
    eles = this.cy.$('node[type $= "-restriction"][label = "forall"], .forall_check');
    eles_aux = this.cy_aux.$('node[type $= "-restriction"][label = "forall"], .forall_check');
  }
  else {
    eles_aux = this.cy_aux.$('node[type = "'+type+'"], .'+checkbox_id);
    eles = this.cy.$('node[type = "'+type+'"], .'+checkbox_id);
  }

  if (document.getElementById(checkbox_id).checked) {
    eles.removeClass('filtered');
    eles.removeClass(checkbox_id);

    eles_aux.removeClass('filtered');
    eles_aux.removeClass(checkbox_id);
  }
  else {
    eles.forEach(element => {
      filterElem(element,checkbox_id);
    });

    eles_aux.forEach(element => {
      filterElem(element,checkbox_id);
    });
  }

  // check if any filter is active in order to change the icon's color
  var filter_options = document.getElementsByClassName('filtr_option');
  var i,active = 0;

  for(i=0; i < filter_options.length; i++) {
    if (!filter_options[i].firstElementChild.checked) {
      filter_options[i].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = 'rgb(81,149,199)';
      active = 1;
      break; 
    }
  }

  if (!active) {
    filter_options[0].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = '';
  }

  function filterElem(element, option_id) {
    element.addClass('filtered');
    element.addClass(option_id);

    // ARCHI IN USCITA
    var selector = '[source = "'+element.data('id')+'"]';
    element.connectedEdges(selector).forEach( e => {
      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      var sel2 = 'edge:visible[source = "'+e.target().id()+'"]';
      var sel3 = 'edge:visible[target = "'+e.target().id()+'"][type != "input"]';
      var number_edges_in_out = e.target().connectedEdges(sel2).size() + e.target().connectedEdges(sel3).size();
      
      if (!e.target().hasClass('filtered') && (number_edges_in_out == 0 || e.data('type') == 'input')) {
        switch(e.target().data('type')) {
          case 'union':
          case 'disjoint-union' :
          case 'role-inverse' :
          case 'intersection' :
          case 'role-chain' :
          case 'complement' :
          case 'enumeration' :
          case 'datatype-restriction' :
          case 'domain-restriction':
          case 'range-restriction':
          case 'value-domain':
            filterElem(e.target(),option_id);
        }
      }
    });
    
    // ARCHI IN ENTRATA
    selector = '[target ="'+element.data('id')+'"]';
    element.connectedEdges(selector).forEach( e => {
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      var sel2 = 'edge:visible[source = "'+e.source().id()+'"]';
      var sel3 = 'edge:visible[target = "'+e.source().id()+'"][type != "input"]';
      var number_edges_in_out = e.source().connectedEdges(sel2).size() + e.source().connectedEdges(sel3).size();
      if (!e.source().hasClass('filtered') && number_edges_in_out == 0) {
        switch(e.source().data('type')) {
          case 'union':
          case 'disjoint-union' :
          case 'role-inverse' :
          case 'intersection' :
          case 'role-chain' :
          case 'complement' :
          case 'enumeration' :
          case 'datatype-restriction' :
          case 'domain-restriction':
          case 'range-restriction':
          case 'value-domain':
            filterElem(e.source(),option_id);
        }
      }
    });
  }
}

GrapholScape.prototype.getIdentityForNeutralNodes = function() {
  this.collection.filter('node[identity = "neutral"]').forEach(node => {
    node.data('identity', findIdentity(node));
});

  // Recursively traverse first input node and return his identity
  // if he is neutral => recursive step
  function findIdentity(node) {
    var first_input_node = node.incomers('[type = "input"]').sources();
    var identity = first_input_node.data('identity');

    if (identity == 'neutral')
      return findIdentity(first_input_node);
    else {
      switch(node.data('type')) {
        case 'range-restriction':
          if (identity == 'role')
            return 'concept';
          else if ( identity == 'attribute' )
            return 'value_domain';
          else  
            return identity;  
        
        case 'enumeration' :
          if (identity == 'individual')
            return 'concept';
          else
            return identity;
        
        default:
          return identity;
      }
    }
  }
}