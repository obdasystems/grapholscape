function GrapholScape(file,container,xmlstring) {
  this.highlight_color = 'rgb(81,149,199)';
  this.container = container;
  this.diagrams = [];
  this.actual_diagram = -1;

  this.container.style.fontSize = '14px';
  this.container.style.color = '#666';

  this.container.requestFullscreen =
    this.container.requestFullscreen       ||
    this.container.mozRequestFullscreen    || // Mozilla
    this.container.mozRequestFullScreen    || // Mozilla older API use uppercase 'S'.
    this.container.webkitRequestFullscreen || // Webkit
    this.container.msRequestFullscreen;       // IE

  document.cancelFullscreen =
    document.cancelFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitCancelFullScreen ||
    document.msExitFullscreen;

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
          'display' : 'none',
        },
      },
      {
        selector: '.facet',
        style: {
          'background-opacity':0,
        }
      },

      {
        selector: '.hidden',
        style: {
          'visibility': 'hidden',
        },
      },

      {
        selector: '.no_border',
        style : {
          'border-width' : 0,
        }
      },

      {
        selector: '.no_overlay',
        style : {
          'overlay-opacity' : 0,
          'overlay-padding' : 0,
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
    }

    if (evt.target.isEdge() && (evt.target.data('type') != 'input' )) {
      document.getElementById('owl_translator').classList.remove('hide');
      document.getElementById('owl_axiomes').innerHTML = this_graph.edgeToOwlString(evt.target);

    }
    else if (evt.target.isNode() && evt.target.data('type') != 'facet') {
      document.getElementById('owl_translator').classList.remove('hide');
      document.getElementById('owl_axiomes').innerHTML = this_graph.nodeToOwlString(evt.target,true);
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
      var bottom_windows = document.getElementsByClassName('bottom_window');
      for (i=0; i<bottom_windows.length; i++) {
        bottom_windows[i].classList.add('hide');
      }

      var collapsible_elms = document.getElementsByClassName('gcollapsible');
      for (i=0; i<collapsible_elms.length; i++) {
        if (collapsible_elms[i].id == 'details_body' || collapsible_elms[i].id == 'translator_body')
          continue;

        if (collapsible_elms[i].clientHeight != 0) {
          if (collapsible_elms[i].parentNode.getElementsByClassName('module_button')[0])
            toggle(collapsible_elms[i].parentNode.getElementsByClassName('module_button')[0]);
          else
            toggle(collapsible_elms[i]);
        }
      }
    }
  });
}


GrapholScape.prototype.init = function(xmlString) {
  var i,k;

  var parser = new DOMParser();
  var xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : parser.parseFromString(xmlString, 'text/xml');
  this.xmlDocument = xmlDocument;
  this.diagrams = xmlDocument.getElementsByTagName('diagram');

  var xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0];

  this.ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent;
  if (xml_ontology_tag.getElementsByTagName('version')[0])
    this.ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent;
  else
    this.ontology_version = 'Undefined';

  this.xmlPredicates = xmlDocument.getElementsByTagName('predicate');

  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length == 0) {
    // for old graphol files
    this.default_iri = xmlDocument.getElementsByTagName('iri')[0];
  }
  else {
    this.iri_prefixes = xmlDocument.getElementsByTagName('prefix');

    var iri_list = xmlDocument.getElementsByTagName('iri');

    for(i=0; i< iri_list.length; i++) {
      if (iri_list[i].getElementsByTagName('prefix').length == 0) {
        this.default_iri = iri_list[i];
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

      if (array_json_elems[cnt].data.type === 'property-assertion' ||
          array_json_elems[cnt].data.type === 'facet' ||
          (array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {

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

  // Sorting predicates collection
  this.predicates = this.collection.filter('.predicate').sort(function(a,b) {
    return a.data('label').localeCompare(b.data('label'));
  });

  this.createUi();
};

GrapholScape.prototype.drawDiagram = function(diagram_name) {
  var diagram_id = this.getDiagramId(diagram_name);

  if (diagram_id < 0) {
    console.log('Error: diagram not found');
    return null;
  }

  this.cy.remove('*');

  this.cy.add(this.collection.filter('[diagram_id = '+diagram_id+']'));

  // check if any filter is active and if yes, apply them to the "actual diagram"
  var filter_options = document.getElementsByClassName('filtr_option');
  var i;

  for(i = 0; i < filter_options.length; i++) {
    if (!filter_options[i].firstElementChild.firstElementChild.checked) {
      this.filter(filter_options[i].firstElementChild.firstElementChild.id);
    }
  }

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

GrapholScape.prototype.isFullscreen = function() {
  return document.fullScreenElement       ||
         document.mozFullScreenElement    || // Mozilla
         document.webkitFullscreenElement || // Webkit
         document.msFullscreenElement;       // IE
}

GrapholScape.prototype.toggleFullscreen = function(button, x, y, event) {
  var c = this.container;

  if (this.isFullscreen()) {
    document.cancelFullscreen();
  } else {
    c.requestFullscreen();
  }
};

GrapholScape.prototype.showDetails = function (target) {
  document.getElementById('details').classList.remove('hide');

  var body_details = document.getElementById('details_body');

  body_details.innerHTML = '<table class="details_table">\
  <tr><th>Name</th><td>'+target.data('label').replace(/\n/g,'')+'</td></tr>\
  <tr><th>Type</th><td>'+target.data('type')+'</td></tr>\
  <tr><th>IRI</th><td><a style="text-decoration:underline" href="/documentation/predicate/'+target.data('type')+'/'+target.data('label').replace('\n', '')+'">'+target.data('iri')+'</a></td></tr></table>';

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
    body_details.innerHTML += '<div class="table_header"><strong>Description</strong></div><div class="descr">'+this.renderDescription(target.data('description'))+'</div>';
  }
}

GrapholScape.prototype.renderDescription = function(description) {
  return description.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/');
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
        if (element.getAttribute('inputs') != '')
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
      nodo.data.inputs = element.getAttribute('inputs').split(",");
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
      console.error('tipo di nodo sconosciuto');
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
    // setting iri
    if (element.getAttribute('remaining_characters') != null) {
      rem_chars = element.getAttribute('remaining_characters').replace(/\n/g,'');
      len_prefix = label_no_break.length - rem_chars.length;
      node_prefix_iri = label_no_break.substring(0,len_prefix);

      if(node_prefix_iri == ':' || !node_prefix_iri)
        node_iri = this.default_iri.getAttribute('iri_value') || this.default_iri.textContent;
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
      node_iri = this.default_iri.getAttribute('iri_value') || this.default_iri.textContent;
      node_prefix_iri = '';
      rem_chars = label_no_break;
    }

    if ( node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1 ) {
      rem_chars = label_no_break;
      node_iri = '';
      node_prefix_iri = node_prefix_iri.substring(node_prefix_iri.lastIndexOf('^')+1, node_prefix_iri.lastIndexOf(':')+1);
    }
    else if (!node_iri.substr(-1, 1) == '/' && !node_iri.substr(-1, 1) == '#')
      node_iri = node_iri+'/';

    nodo.data.remaining_chars = rem_chars;
    nodo.data.prefix_iri = node_prefix_iri;
    nodo.data.iri = node_iri+rem_chars;


    var j, predicateXml;
    for (j = 0; j < this.xmlPredicates.length; j++) {
      predicateXml = this.xmlPredicates[j];

      if (label_no_break == predicateXml.getAttribute('name') && nodo.data.type == predicateXml.getAttribute('type')) {
        nodo.data.description = predicateXml.getElementsByTagName('description')[0].textContent;
        nodo.data.description = nodo.data.description.replace(/&lt;/g,'<');
        nodo.data.description = nodo.data.description.replace(/&gt;/g,'>');
        nodo.data.description = nodo.data.description.replace(/font-family:'monospace'/g,'');
        nodo.data.description = nodo.data.description.replace(/&amp;/g,'&');
        nodo.data.description = nodo.data.description.replace(/font-size:0pt/g,'font-size:inherit');

        var start_body_index = nodo.data.description.indexOf('<p');
        var end_body_index = nodo.data.description.indexOf('</body');
        nodo.data.description = nodo.data.description.substring(start_body_index,end_body_index);

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
      console.error('tipo di arco non implementato <'+arco.getAttribute('type')+'>');
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
  if (target.data('type') == 'role-chain' || target.data('type') == 'property-assertion') {
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
  if (nodo.data.type == 'facet') {
    // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
    // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
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
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
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
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
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


  if (nodo.data.type == 'property-assertion') {
    var circle1 = {
      selectable:false,
      classes : 'no_overlay',
      data : {
        height : nodo.data.height,
        width : nodo.data.height,
        shape : 'ellipse',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : {
        x : nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
        y : nodo.position.y,
      }
    };

    var circle2 = {
      selectable:false,
      classes : 'no_overlay',
      data : {
        height : nodo.data.height,
        width : nodo.data.height,
        shape : 'ellipse',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : {
        x : nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
        y : nodo.position.y,
      }
    };

    var back_rectangle = {
      data : {
        selectable:false,
        height : nodo.data.height,
        width : nodo.data.width - nodo.data.height,
        shape : 'rectangle',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : nodo.position,
    };

    var front_rectangle = {
      data : {
        type : 'property-assertion',
        height : nodo.data.height - 1,
        width : nodo.data.width - nodo.data.height,
        shape : 'rectangle',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : nodo.position,
      classes : 'property-assertion no_border',
    };

    nodo.classes += ' hidden';

    array_json_elems[array_json_elems.length-1] = nodo;
    array_json_elems.push(back_rectangle);
    array_json_elems.push(circle1);
    array_json_elems.push(circle2);
    array_json_elems.push(front_rectangle);
  }
}

GrapholScape.prototype.filter = function(checkbox_id) {
  var selector,eles,eles_all,type;
  var this_graph = this;

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

  if (type == 'forall')
    eles = this.cy.$(':visible[type $= "-restriction"][label = "forall"], .forall_check');
  else
    eles = this.cy.$(':visible[type = "'+type+'"], .'+checkbox_id);


  if (document.getElementById(checkbox_id).checked) {
    eles.removeClass(checkbox_id);
    eles.removeClass('filtered');

    // Re-Apply other active filters to resolve ambiguity
    for(i=0; i < filter_options.length; i++) {
      var filter = filter_options[i].firstElementChild.firstElementChild;
      if (!filter.checked) {
        this.filter(filter.id);
      }
    }
  }
  else {
    eles.forEach(function (element) {
      filterElem(element,checkbox_id);
    });
  }

  // check if any filter is active in order to change the icon's color
  for(i=0; i < filter_options.length; i++) {
    if (!filter_options[i].firstElementChild.firstElementChild.checked) {
      filter_options[i].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = 'rgb(81,149,199)';
      active = 1;
      break;
    }
  }

  if (!active) {
    filter_options[0].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = '';
  }



  function filterElem(element, option_id) {
    element.addClass('filtered '+option_id);

    // Filter fake nodes!
    this_graph.cy.nodes('[parent_node_id = "'+element.id()+'"]').addClass('filtered '+option_id);

    // ARCHI IN USCITA
    var selector = '[source = "'+element.data('id')+'"]';
    element.connectedEdges(selector).forEach( function(e) {
      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      var sel2 = 'edge:visible[source = "'+e.target().id()+'"]';
      var sel3 = 'edge:visible[target = "'+e.target().id()+'"][type != "input"]';
      var number_edges_in_out = e.target().connectedEdges(sel2).size() + e.target().connectedEdges(sel3).size();

      if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') == 'input')) {
        filterElem(e.target(), option_id);
      }
    });

    // ARCHI IN ENTRATA
    selector = '[target ="'+element.data('id')+'"]';
    element.connectedEdges(selector).forEach( function(e) {
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      var sel2 = 'edge:visible[source = "'+e.source().id()+'"]';
      var sel3 = 'edge:visible[target = "'+e.source().id()+'"][type != "input"]';
      var number_edges_in_out = e.source().connectedEdges(sel2).size() + e.source().connectedEdges(sel3).size();
      if (!e.source().hasClass('filtered') && number_edges_in_out == 0) {
        filterElem(e.source(), option_id);
      }
    });
  }
}

GrapholScape.prototype.getIdentityForNeutralNodes = function() {
  this.collection.filter('node[identity = "neutral"]').forEach(function (node) {
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

GrapholScape.prototype.getOccurrencesOfPredicate = function(predicate) {
  var list = document.getElementById('predicates_list');
  var rows = list.getElementsByClassName('predicate');
  var matches = {};

  for (var i = 0 ; i < rows.length ; i++) {
    var info = rows[i].getElementsByClassName('info')[0];

    if (info.innerHTML === predicate) {
      var occurrences = rows[i].getElementsByClassName('sub_row');

      for (var j = 0 ; j < occurrences.length ; j++) {
        var occurrence = occurrences[j];
        var diagram = occurrence.getAttribute('diagram');
        var node = occurrence.getAttribute('node_id');

        if (diagram in matches) {
          matches[diagram].push(node);
        } else {
          matches[diagram] = [node];
        }
      }

      break;
    }
  }

  return matches;
}

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
    var elm = button.parentNode.getElementsByClassName('gcollapsible')[0];

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
        elm.style.width = '100%';
      }
      else {
        elm.style.width = '0';
      }
    }
    if (elm.id == 'slider_body')
      button.parentNode.getElementsByTagName('hr')[0].classList.toggle('hide');

  }
}

function search(value) {
  var list = document.getElementById('predicates_list');

  if (value == '') {
    list.style.maxHeight = 0;
    document.getElementById('predicates-list-button').getElementsByTagName('i')[0].innerHTML = 'arrow_drop_down';
  }
  else {
    document.getElementById('predicates-list-button').getElementsByTagName('i')[0].innerHTML = 'arrow_drop_up';
    list.style.maxHeight = '450px';
  }

  document.getElementById('search').value = value;
  var val = value.toLowerCase();
  var rows = list.getElementsByClassName('predicate');

  var i=0;
  var info;
  for (i=0; i<rows.length; i++) {
    info = rows[i].getElementsByClassName('info')[0];

    if (info.innerHTML.toLowerCase().indexOf(val) > -1) {
      rows[i].style.display = "";
    }
    else {
      rows[i].style.display = "none";
    }
  }

  document.getElementById('search').focus();
}

function toggleSubRows(col_with_arrow) {
  var subrows = col_with_arrow.parentNode.parentNode.getElementsByClassName('sub_row_wrapper')[0];

  if (subrows.style.display == 'inherit') {
    subrows.style.display = 'none';
    col_with_arrow.firstChild.innerHTML = 'keyboard_arrow_right';
  }
  else {
    subrows.style.display = 'inherit';
    col_with_arrow.firstChild.innerHTML = 'keyboard_arrow_down';
  }
}

function goTo(graph,sub_row) {
  var diagram = sub_row.getAttribute('diagram');
  var node_id = sub_row.getAttribute('node_id');

  toggle(document.getElementById('predicates-list-button'));
  graph.centerOnNode(node_id,diagram,1.25);
}


// Funzioni che ritornano il primo figlio o il fratello successivo di un dato nodo
// Ignorano quindi tutti gli elementi di tipo diverso da 1
// cioè gli attributi, gli spazi vuoti ecc...
function getFirstChild(node) {
  if (node == null || node.firstChild == null)
    return null;

  node = node.firstChild;

  if (node.nodeType != 1)
    node = getNextSibling(node);

  return node;
}

function getNextSibling(node) {
  if (node == null || node.nextSibling == null)
    return null;

  node = node.nextSibling;
  while (node.nodeType != 1) {
    if (node.nextSibling == null)
      return null;

    node = node.nextSibling;
  }

  return node;
}


function isPredicate(node) {
  switch (node.getAttribute('type')) {
    case 'concept':
    case 'attribute':
    case 'role':
    case 'individual':
      return true;
  }

  return false;
}



// Date le posizioni di source, target e del breakpoint,
// la funzione calcola i due parametri peso e distanza del breakpoint e li restituisce
function getDistanceWeight(target, source, point) {
  // Esprimiamo le coordinate di point traslando l'origine sul source:
  // point['0'] corrisponde alla coordinata x del punto, point['1'] è l'ordinata
  var breakpoint = []
  breakpoint['x'] = point['0'] - source['x'];
  breakpoint['y'] = point['1'] - source['y'];

  var delta = []
  delta['x'] = target['x'] - source['x'];
  delta['y'] = target['y'] - source['y'];


  var intersectpoint = [];
  var angolar_coeff;

  // Se delta['x'] è nullo : source e target sono sulla stessa ascissa
  // la retta che li congiunge è verticale e pertanto non esprimibile come y = mx + q
  // Sappiamo però automaticamente che la retta perpendicolare è del tipo y = c
  // quindi l'intersect point avrà X = 0 e Y = breakpoint['y']
  if (delta['x'] == 0) {
    intersectpoint['x'] = 0;
    intersectpoint['y'] = breakpoint['y'];
  }
  else if ( delta['y'] == 0) {
    intersectpoint['x'] = breakpoint['x'];
    intersectpoint['y'] = 0;
    angolar_coeff = 0;
  }
  else {
    angolar_coeff = delta['y'] / delta['x'];

    // quindi prendendo il source come origine, la retta che unisce source e target è data da:
    // R: y = angolar_coeff * x

    // La retta che interseca perpendicolarmente R e che passa per point è data da :
    // T: y = - x / angolar_coeff + quote

    // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
    // quote = breakpoint_y + (breakpoint_x/angolar_coeff)

    var quote = breakpoint['y'] + (breakpoint['x'] / angolar_coeff);

    // Adesso mettiamo a sistema le due rette T ed R (che sono perpendicolari) e risolvendo il sistema
    // otteniamo che il punto di intersezione tra le due ha le coordinate:
    // intersectpoint_x = (quote * angolar_coeff) / ((angolar_coeff ^ 2) + 1)
    // intersectpoint_y = intersectpoint_x * angolar_coeff

    intersectpoint['x'] = (quote * angolar_coeff) / (Math.pow(angolar_coeff, 2) + 1);
    intersectpoint['y'] = intersectpoint['x'] * angolar_coeff;
  }


  // Adesso calcoliamo la distanza tra source e target
  var dist_source_target = Math.sqrt(Math.pow(delta['x'], 2) + Math.pow(delta['y'], 2));

  // Adesso calcoliamo la distanza tra interscetpoint e source
  // NOTA: le coordinate di intersectpoint sono calcolate traslando l'origine sul source, quindi usando il teorema di pitagora non sottraiamo le coordinate di source perchè sono nulle in questo sistema di riferimento
  // NOTA 2: la distanza che otteniamo è un valore assoluto, è quindi indipendente dal sistema di riferimento e possiamo usarla direttamente per calcolare il peso
  var dist_inter_source = Math.sqrt(Math.pow(intersectpoint['x'], 2) + Math.pow(intersectpoint['y'], 2));


  // Il peso lo calcolo come percentuale dividendo la distanza dell'intersectpoint dal source per la distanza tra source e target
  var point_weight = dist_inter_source / dist_source_target;

  // Dobbiamo stabilire se il peso è positivo o negativo
  // Se la X dell' intersectpoint è compresta tra quella del source e quella del target, allora il peso è positivo

  // se la X del target è maggiore della X del source e la X dell'intersectpoint è minore di quella del source, allora il peso è negativo
  if (delta['x'] > 0 && intersectpoint['x'] < 0)
    point_weight = - point_weight;

  if (delta['x'] < 0 && intersectpoint['x'] > 0)
    point_weight = - point_weight;



  // Calcolo la distanza tra point e intersectpoint (sono entrambi espressi rispetto a source, ma per la distanza non ci interessa)
  var point_distance = Math.sqrt(Math.pow(intersectpoint['x'] - breakpoint['x'], 2) + Math.pow(intersectpoint['y'] - breakpoint['y'], 2));


  // Dobbiamo stabilire se prendere la point_distance positiva o negativa
  // La regola è che, andando dal source al target sulla retta che li
  // congiunge, se il breakpoint si trova alla mia sinistra, la distanza
  // è negativa, se invece è alla mia destra è positiva

  // questo si traduce nel valutare una diseguaglianza (Y ><= M*X ? dove Y e X sono le coordinate del breakpoint) e la scelta dipende dal quadrante in cui si trova il target.

  // [Stiamo considerando le coordinate relative al source]
  // [Quindi delta['x'] e delta['y'] sono proprio le coordinate del target]

  // RICORDA: in cytoscape il verso crescente dell'asse Y è verso il
  // basso, quindi occorre fare attenzione al verso delle diseguaglianze

  // Target con X negativa => il breakpoint si trova a sinitra della
  // retta quando si trova al di sotto della retta
  if (delta['x'] < 0  && breakpoint['y'] > angolar_coeff * breakpoint['x'])
    point_distance = - point_distance;

  // Target con X positiva => il breakpoint si trova a sinistra dela
  // retta quando si trova al di sopra della retta
  if (delta['x'] > 0  && breakpoint['y'] < angolar_coeff * breakpoint['x'])
    point_distance = - point_distance;

  // SOURCE CON STESSA X DEL TARGET
  // se il target ha una Y maggiore del source (deltaY>0),
  // allora sto guardando verso il basso, quindi il punto sarà a
  // sinistra quando la sua X sarà positiva
  if (delta['x'] == 0 && delta['y'] > 0 && breakpoint['x'] > 0)
    point_distance = - point_distance;
  // Se invece guardo verso l'alto (target con Y<0), allora il nodo è a
  // sinistra della retta quando ha la X negativa
  if (delta['x'] == 0 && delta['y'] < 0 && breakpoint['x'] < 0)
    point_distance = - point_distance;



  return [point_distance, point_weight];
}



// Funzione che decide se spostare un endpoint sul bordo del nodo (source o target) o meno

// Facciamo quest'operazione per tutti gli archi che presentano degli endpoint
// non al centro del nodo (source o target), in questi casi le
// opzioni sono 2:
//   1: l'arco parte (o arriva) in diagonale, in questo caso l'endpoint lo lasciamo al centro del nodo
//   2: l'arco arriva perpendicolarmente al bordo del nodo (source o target), in questo caso
//      vediamo se il breakpoint successivo (o precedente nel caso del target), ha la stessa X o la stessa Y
//      del nodo in questione.
//      Valutando poi la coordinata che non risulta uguale a quella del nodo, spostiamo l'endpoint sul bordo del
//      nodo in direzione del breakpoint successivo (o precedente).

// Se lasciassimo intatti gli endpoint non centrati, cytoscape farebbe entrare la freccia nel nodo,
// Traslando sul bordo l'endpoint in direzione del breakpoint successivo (nel caso di source) o precedente
// (nel caso di target), cytoscape farà corrispondere la punta della freccia sul bordo del nodo e
// sarà quindi visibile
function getNewEndpoint(end_point,node,break_point) {

  // Calcoliamo le coordinate relative al nodo source (o target)
  var endpoint = [];
  endpoint['x'] = end_point['x'] - node.position('x');
  endpoint['y'] = end_point['y'] - node.position('y');

  var breakpoint = [];
  breakpoint['x'] = break_point[0] - node.position('x');
  breakpoint['y'] = break_point[1] - node.position('y');


  // Se l'endpoint non è centrato nel nodo ma ha la X uguale al breakpoint successivo (o precedente)
  // Allora l'arco parte (o arriva) perpendicolarmente dall'alto o dal basso


  if ( endpoint['x'] == breakpoint['x'] ) {
    // Se il breakpoint si trova più in basso (Ricorda: asse Y al contrario in cytoscape!),
    // allora spostiamo sul bordo inferiore l'endpoint
    if (breakpoint['y'] > 0) {
      endpoint['y'] = node.data('height') / 2;
      return endpoint;
    }
    // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
    else if (breakpoint['y'] < 0 ) {
      endpoint['y'] = - node.data('height') / 2;
      return endpoint;
    }
  }
  // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
  else if (endpoint['y'] == breakpoint['y'] ) {
    if (breakpoint['x'] > 0) {
      endpoint['x'] = node.data('width') / 2;
      return endpoint;
    }
    else if (breakpoint['x'] < 0) {
      endpoint['x'] = - node.data('width') / 2;
      return endpoint;
    }
  }
  return endpoint;
}



function makeDraggable(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.classList.add('draggable');

  elmnt.getElementsByClassName('module_head')[0].onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

GrapholScape.prototype.edgeToOwlString = function(edge) {
  var owl_string;
  var source = edge.source();
  var target = edge.target();
  var malformed = '<span class="owl_error">Malformed Axiom</span>';
  var missing_operand = '<span class="owl_error">Missing Operand</span>';

  switch(edge.data('type')) {
    case 'inclusion':
      if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
        if (source.data('type') == 'domain-restriction' && source.data('label') != 'self' && target.data('label') != 'self') {
          return propertyDomain(this,edge);
        }
        else if (source.data('type') == 'range-restriction' && source.data('label') != 'self' && target.data('label') != 'self') {
          return propertyRange(this,edge);
        }
        else if (target.data('type') == 'complement' || source.data('type') == 'complement') {
          return disjointClasses(this,edge.connectedNodes());
        }

        return subClassOf(this,edge);
      }
      else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
        if (target.data('type') == 'complement') {
          return disjointTypeProperties(this,edge);
        }
        return subTypePropertyOf(this,edge);
      }
      else if (source.data('identity') == 'value_domain' && target.data('identity') == 'value_domain') {
        return propertyRange(this,edge);
      }
      else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
        if (target.data('type') == 'complement') {
          return disjointTypeProperties(this,edge);
        }
        else
          return subTypePropertyOf(this,edge);
      }
      else
        return malformed;

      break;

    case 'equivalence':
      if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
        return equivalentClasses(this,edge);
      }
      else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
        if (source.data('type') == 'role-inverse' || target.data('type') == 'role-inverse')
          return inverseObjectProperties(this,edge);
        else
          return equivalentTypeProperties(this,edge);
      }
      else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
        return equivalentTypeProperties(this,edge);
      }
      else
        return malformed;

      break;

    case 'membership':
      if (target.data('identity') == 'concept')
        return classAssertion(this,edge);
      else
        return propertyAssertion(this,edge);
      break;
  }

  function propertyAssertion(self,edge) {
    var axiom_type = 'Object';
    var owl_string;

    if (edge.target().data('identity') == 'attribute') {
      axiom_type = 'Data';
    }

    owl_string = axiom_type+'PropertyAssertion('+self.nodeToOwlString(edge.target())+' ';

    if (edge.source().data('type') == 'property-assertion') {
      var property_node = edge.source();

      property_node.data('inputs').forEach(function (input_id) {
        input = self.cy.$('edge[id_xml = "'+input_id+'"]').source();
        owl_string += self.nodeToOwlString(input)+' ';
      });

      owl_string = owl_string.slice(0,owl_string.length - 1);
    }
    else {
      owl_string += self.nodeToOwlString(edge.source());
    }

    return owl_string+')';
  }


  function classAssertion(self,edge) {
    return 'ClassAssertion('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function inverseObjectProperties(self,edge) {
    var complement_input;
    var input;
    if (edge.source().data('type') == 'role-inverse') {
      input = edge.target();
      complement_input = edge.source().incomers('[type = "input"]').sources().first();
    }
    else {
      input = edge.source();
      complement_input = edge.target().incomers('[type = "input"]').sources().first();
    }

    if (!complement_input.length)
      return missing_operand;

    return 'InverseObjectProperties('+self.nodeToOwlString(input)+' '+self.nodeToOwlString(complement_input)+')';
  }

  function equivalentClasses(self,edge) {
    return 'EquivalentClasses('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function equivalentTypeProperties(self,edge) {
    var axiom_type;
    if (edge.source().data('idenity') == 'role')
      axiom_type = 'Object';
    else
      axiom_type = 'Data';

    return 'Equivalent'+axiom_type+'Properties('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function subClassOf(self,edge) {
    return 'SubClassOf('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function subTypePropertyOf(self,edge) {
    var axiom_type;

    if (edge.target().data('identity') == 'role')
      axiom_type = 'Object';
    else if (edge.target().data('type') == 'attribute')
      axiom_type = 'Data';
    else
      return null;

    return 'Sub'+axiom_type+'PropertyOf('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function propertyDomain(self,edge) {
    var node = edge.source().incomers('[type = "input"]').sources();

    if ( node.size() > 1)
      return subClassOf(self,edge);

    if (node.data('type') == 'role')
      return 'ObjectPropertyDomain('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
    else if (node.data('type') == 'attribute')
      return 'DataPropertyDomain('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
  }

  function propertyRange(self,edge) {
    var node = edge.source().incomers('[type = "input"]').sources();

    if ( node.size() > 1)
      return subClassOf(self,edge);

    if (node.data('type') == 'role')
      return 'ObjectPropertyRange('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
    else if (node.data('type') == 'attribute')
      return 'DataPropertyRange('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
  }

  function disjointClasses(self,inputs) {
    var owl_string = 'DisjointClasses(';

    inputs.forEach(function (input) {
      if (input.data('type') == 'complement') {
        input = input.incomers('[type = "input"]').source();
      }
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function disjointTypeProperties(self,edge) {
    var axiom_type,owl_string;

    if (edge.target().data('identity') == 'role')
      axiom_type = 'Object';
    else if (edge.target().data('identity') == 'attribute')
      axiom_type = 'Data';
    else
      return null;

    owl_string = 'Disjoint'+axiom_type+'Properties(';

    edge.connectedNodes().forEach(function (node) {
      if (node.data('type') == 'complement') {
        node = node.incomers('[type = "input"]').source();
      }
      owl_string += self.nodeToOwlString(node)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    return owl_string+')';
  }
};


GrapholScape.prototype.nodeToOwlString = function(node,from_node) {
  var owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>';
  var rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>';
  var missing_operand = '<span class="owl_error">Missing Operand</span>';
  var not_defined = 'Undefined';
  var from_node_flag = from_node || null;

  if (from_node_flag && (node.hasClass('predicate') || node.data('type') == 'value-domain')) {
    var owl_predicate = '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="owl_'+node.data('type')+'">'+node.data('remaining_chars')+'</span>';
    var owl_type;

    switch(node.data('type')) {
      case 'concept':
        owl_type = 'Class';
        return 'Declaration('+owl_type+'('+owl_predicate+'))';
        break;

      case 'role':
        owl_type = 'ObjectProperty';
        var owl_string = 'Declaration('+owl_type+'('+owl_predicate+'))';

        if (node.data('functional'))
          owl_string += '<br/>Functional'+owl_type+'('+owl_predicate+')';

        if (node.data('inverseFunctional'))
          owl_string += '<br/>InverseFunctional'+owl_type+'('+owl_predicate+')';

        if (node.data('asymmetric'))
          owl_string += '<br />Asymmetric'+owl_type+'('+owl_predicate+')';

        if (node.data('irreflexive'))
          owl_string += '<br/>Irreflexive'+owl_type+'('+owl_predicate+')';

        if (node.data('reflexive'))
          owl_string += '<br/>Reflexive'+owl_type+'('+owl_predicate+')';

        if (node.data('symmetric'))
          owl_string += '<br/>Symmetric'+owl_type+'('+owl_predicate+')';

        if (node.data('transitive'))
          owl_string += '<br/>Transitive'+owl_type+'('+owl_predicate+')';

        return owl_string;
        break;

      case 'attribute':
        owl_type = 'DataProperty';
        var owl_string = 'Declaration('+owl_type+'('+owl_predicate+'))';

        if (node.data('functional'))
          owl_string += '<br/>Functional'+owl_type+'('+owl_predicate+'))';

        return owl_string;
        break;

      case 'individual':
        if ( node.data('remaining_chars').search(/"[\w]+"\^\^[\w]+:/) != -1 ) {
          var value = node.data('remaining_chars').split('^^')[0];
          var datatype = node.data('remaining_chars').split(':')[1];

          owl_predicate = '<span class="owl_value">'+value+'</span>^^'+
          '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span>'+
          '<span class="owl_value-domain">'+datatype+'</span>';
        }
        owl_type = 'NamedIndividual';
        return 'Declaration('+owl_type+'('+owl_predicate+'))';
        break;

      case 'value-domain':
        owl_type = 'Datatype';
        return 'Declaration('+owl_type+'('+owl_predicate+'))';
        break;
    }
  }


  switch(node.data('type')) {
    case 'individual':
      if ( node.data('remaining_chars').search(/"[\w]+"\^\^[\w]+:/) != -1 ) {
        var value = node.data('remaining_chars').split('^^')[0];
        var datatype = node.data('remaining_chars').split(':')[1];

        return '<span class="owl_value">'+value+'</span>^^'+
        '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span>'+
        '<span class="owl_value-domain">'+datatype+'</span>';
      }

    case 'concept':
    case 'role':
    case 'value-domain':
    case 'attribute':
    case 'individual':
      return '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="owl_'+node.data('type')+'">'+node.data('remaining_chars')+'</span>';
      break;

    case 'facet':
      var rem_chars = node.data('remaining_chars').split('^^');
      return '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="owl_value-domain">'+rem_chars[0]+'</span><span class="owl_value">'+rem_chars[1]+'</span>';
      break;

    case 'domain-restriction':
    case 'range-restriction':
      var input_edges = node.connectedEdges('edge[target = "'+node.id()+'"][type = "input"]');
      var input_first, input_other, input_attribute = null;

      if (!input_edges.length)
        return missing_operand;

      input_edges.forEach(function (e) {
        if (e.source().data('type') == 'role' || e.source().data('type') == 'attribute') {
          input_first = e.source();
        }

        if (e.source().data('type') != 'role' && e.source().data('type') != 'attribute') {
          input_other = e.source();
        }
      });

      if (input_first) {
        if (input_first.data('type') == 'attribute' && node.data('type') == 'range-restriction')
          return not_defined;

        if ( node.data('label') == 'exists' )
          return someValuesFrom(this,input_first,input_other,node.data('type'));

        else if ( node.data('label') == 'forall' )
          return allValuesFrom(this,input_first,input_other,node.data('type'));

        else if ( node.data('label').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
          var cardinality = node.data('label').replace(/\(|\)/g,'').split(/,/);
          return minMaxExactCardinality(this,input_first,input_other,cardinality,node.data('type'))
        }

        else if ( node.data('label') == 'self') {
          return hasSelf(this,input_first,node.data('type'));
        }
      }
      else return missing_operand;

      case 'role-inverse':
        var input = node.incomers('[type = "input"]').sources();

        if (!input.length)
          return missing_operand;

        return objectInverseOf(this,input);
        break;

      case 'role-chain':
        if (!node.data('inputs'))
          return missing_operand;

        return objectPropertyChain(this,node.data('inputs'));
        break;

      case 'union':
      case 'intersection':
      case 'complement':
      case 'enumeration':
      case 'disjoint-union':
        var inputs = node.incomers('[type = "input"]').sources();
        if (!inputs.length)
          return missing_operand;

        var axiom_type = 'Object';

        if (node.data('identity') != 'concept' && node.data('identity') != 'role')
          axiom_type = 'Data';

        if (node.data('type') == 'disjoint-union') {
          if (!from_node_flag) {
            return logicalConstructors(this,inputs,'union',axiom_type);
          }
          else {
            return logicalConstructors(this,inputs,'union',axiom_type)+'<br />'+disjointClasses(this,inputs);
          }
        }

        return logicalConstructors(this,inputs,node.data('type'),axiom_type);
        break;

      case 'datatype-restriction':
        var inputs = node.incomers('[type = "input"]').sources();
        if(!inputs.length)
          return missing_operand;

        return datatypeRestriction(this,inputs);
        break;

      case 'property-assertion':
        return not_defined;
    }


  function someValuesFrom(self,first,other,restr_type) {
    var axiom_type,owl_string;
    if (first.data('type') == 'role')
      axiom_type = 'Object';

    if (first.data('type') == 'attribute')
      axiom_type = 'Data';

    owl_string = axiom_type+'SomeValuesFrom(';

    // if the node is a range-restriction, put the inverse of the role
    if (restr_type == 'range-restriction')
      owl_string += objectInverseOf(self,first);
    else
      owl_string += self.nodeToOwlString(first);

    if (!other && axiom_type == 'Object')
      return owl_string += ' '+owl_thing+')';


    if (!other && axiom_type == 'Data')
      return owl_string += ' '+rdfs_literal+')';

    return owl_string +=' '+self.nodeToOwlString(other)+')';
  }

  function allValuesFrom(self,first,other,restr_type) {
    var axiom_type,owl_string;
    if (first.data('type') == 'role')
      axiom_type = 'Object';

    if (first.data('type') == 'attribute')
      axiom_type = 'Data';

    owl_string = axiom_type+'AllValuesFrom(';

    // if the node is a range-restriction, put the inverse of the role
    if (restr_type == 'range-restriction')
      owl_string += objectInverseOf(self,first);
    else
      owl_string += self.nodeToOwlString(first);

    if (!other && axiom_type == 'Object')
      return owl_string += ' '+owl_thing+')';

    if(!other && axiom_type == 'Data')
      return owl_string += ' '+rdfs_literal+')';

    return owl_string +=' '+self.nodeToOwlString(other)+')';
  }

  function minMaxExactCardinality(self,first,other,cardinality,restr_type) {
    var axiom_type, owl_string;
    if (first.data('type') == 'role')
      axiom_type = 'Object';

    if (first.data('type') == 'attribute')
      axiom_type = 'Data';

    if (cardinality[0] == '-') {
      if(restr_type == 'range-restriction') {
        if (!other)
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+objectInverseOf(self,first)+')';
        else
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+objectInverseOf(self,first)+' '+self.nodeToOwlString(other)+')';
      }
      else {
        if (!other)
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+self.nodeToOwlString(first)+')';
        else
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+self.nodeToOwlString(first)+' '+self.nodeToOwlString(other)+')';
      }
    }

    if (cardinality[1] == '-') {
      if(restr_type == 'range-restriction') {
        if (!other)
          return axiom_type+'MinCardinality('+cardinality[0]+' '+objectInverseOf(self,first)+')';
        else
          return axiom_type+'MinCardinality('+cardinality[0]+' '+objectInverseOf(self,first)+' '+self.nodeToOwlString(other)+')';
      }
      else {
        if (!other)
          return axiom_type+'MinCardinality('+cardinality[0]+' '+self.nodeToOwlString(first)+')';
        else
          return axiom_type+'MinCardinality('+cardinality[0]+' '+self.nodeToOwlString(first)+' '+self.nodeToOwlString(other)+')';
      }
    }

    if (cardinality[0] != '-' && cardinality[1] != '-') {
      var min = [], max = [];

      min.push(cardinality[0]);
      min.push('-');

      max.push('-');
      max.push(cardinality[1]);

      return axiom_type+'IntersectionOf('+minMaxExactCardinality(self,first,other,min,restr_type)+' '+minMaxExactCardinality(self,first,other,max,restr_type)+')';
    }
  }


  function objectInverseOf(self,node) {
    return 'ObjectInverseOf('+self.nodeToOwlString(node)+')';
  }

  function objectPropertyChain(self,inputs) {
    var owl_string,

    owl_string = 'ObjectPropertyChain(';
    inputs.forEach(function (input_id) {
      input = self.cy.$('edge[id_xml = "'+input_id+'"]').source();
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function logicalConstructors(self,inputs,constructor_name,axiom_type) {
    var owl_string;

    if (constructor_name == 'enumeration')
      constructor_name = 'One';
    else // Capitalize first char
      constructor_name = constructor_name.charAt(0).toUpperCase()+constructor_name.slice(1);

    owl_string = axiom_type+constructor_name+'Of(';

    inputs.forEach(function (input) {
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';

    return owl_string;
  }

  function disjointClasses(self,inputs) {
    var owl_string = 'DisjointClasses(';

    inputs.forEach(function (input) {
      owl_string += self.nodeToOwlString(input)+' ';
    })

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function datatypeRestriction(self,inputs) {
    var owl_string = 'DatatypeRestriction(';

    var value_domain = inputs.filter('[type = "value-domain"]').first();

    owl_string += self.nodeToOwlString(value_domain)+' ';

    inputs.forEach(function (input) {
      if (input.data('type') == 'facet') {
        owl_string += self.nodeToOwlString(input)+'^^';
        owl_string += self.nodeToOwlString(value_domain)+' ';
      }
    });
    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function hasSelf(self,input,restr_type) {
    // if the restriction is on the range, put the inverse of node
    if (restr_type == 'range-restriction')
      return 'ObjectHasSelf('+objectInverseOf(self,input)+')';

    return 'ObjectHasSelf('+self.nodeToOwlString(input)+')';
  }
}

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
  child.setAttribute('class','gcollapsible module_body');

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
  child.setAttribute('class','gcollapsible module_body');

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
      wrap.setAttribute("class","graphol_row");

      // columns
      col = document.createElement('span');
      img  = document.createElement('i');
      img.setAttribute('class','no_highlight material-icons md-18')
      img.innerHTML = 'keyboard_arrow_right';
      col.appendChild(img);
      wrap.appendChild(col);

      col = document.createElement('span');
      //col.setAttribute('class','col type_img');
      
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
  module.setAttribute('class','grapholscape-tooltip module');

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
  child.setAttribute('class','gcollapsible');
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
  child.setAttribute('class','gcollapsible module_body');
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

  // fullscreen control
  module = document.createElement('div');
  module.setAttribute('id', 'grapholscape-fullscreen-btn');
  module.setAttribute('class', 'module bottom_button');
  module.setAttribute('title', 'fullscreen');
  img = document.createElement('i');
  img.setAttribute('class', 'material-icons md-24');
  img.innerHTML = 'fullscreen';
  img.onclick = function() { this.toggleFullscreen() }.bind(this);
  var grapholscape = this;
  var fsHandler = function(event) {
    var fullscreenToggle = document.getElementById('grapholscape-fullscreen-btn');
    var toggleImg = fullscreenToggle.getElementsByTagName('i')[0];
    var c = grapholscape.container;

    if (grapholscape.isFullscreen()) {
      c.fullScreenRestore = {
        position: c.style.position,
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset,
        width: c.style.width,
        height: c.style.height
      };
      c.style.position = undefined;
      c.style.width = "100%";
      c.style.height = "100%";
      c.className += " grapholscape-fullscreen";
      document.documentElement.style.overflow = "hidden";
      toggleImg.innerHTML = 'fullscreen_exit';
    } else {
      c.className = c.className.replace(/\s*grapholscape-fullscreen\b/, "");
      document.documentElement.style.overflow = "";
      var info = c.fullScreenRestore;
      c.style.position = info.position;
      c.style.width = info.width;
      c.style.height = info.height;
      window.scrollTo(info.scrollLeft, info.scrollTop);
      toggleImg.innerHTML = 'fullscreen';
    }

    grapholscape.cy.resize();
  }
  document.addEventListener('fullscreenchange', fsHandler, false);
  document.addEventListener('mozfullscreenchange', fsHandler, false);
  document.addEventListener('webkitfullscreenchange', fsHandler, false);
  module.appendChild(img);
  this.container.appendChild(module);

  // OWL2 TRANSLATOR
  module = document.createElement('div');
  module.setAttribute('id','owl_translator');
  module.setAttribute('class','hide module');

  // module body
  child = document.createElement('div');
  child.setAttribute('id','translator_body');
  child.setAttribute('class','module_body gcollapsible');
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
  child.innerHTML += '<div class="table_header"><strong>IRI Prefixes Dictionary</strong></div>';

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
    full_iri.innerHTML = this.default_iri.getAttribute('iri_value') || this.default_iri.textContent;

    properties = this.default_iri.getElementsByTagName('properties')[0];
    if (properties) {
      for (i=0; i<properties.getElementsByTagName('property').length; i++) {
        property_value = properties.getElementsByTagName('property')[i].getAttribute('property_value');

        if (property_value == 'Project_IRI') {
          full_iri.classList.add('project_iri');
        }
      }
    }
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
