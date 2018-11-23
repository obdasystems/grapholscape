GrapholScape.prototype.parseGraphol = function(xmlString) {
	var i, k;
	var parser = new DOMParser();
	var xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : parser.parseFromString(xmlString, 'text/xml');
	
	var xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0];
	
	var ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent;
	var ontology_version = '';
	

	if (xml_ontology_tag.getElementsByTagName('version')[0])
		ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent;
	else
		ontology_version = 'Undefined';

	// Creating an Ontology Object
	ontology = new Ontology(ontology_name,ontology_version);

	if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length == 0) {
		// for old graphol files
		let default_iri_value = xmlDocument.getElementsByTagName('iri')[0].textContent;
		ontology.addIri(new Iri('',default_iri_value, is_default=true));
	}
	else {
		// Create iri and add them to ontology.iriSet
		let iri_list = xmlDocument.getElementsByTagName('iri');
		// Foreach iri create a Iri object

		for (i=0; i< iri_list.length; i++) {
			let iri = iri_list[i];

			var iri_value = iri.getAttribute('iri_value');
			
			var is_default = false;
			var is_project = false;
			var is_standard = false;
			var iri_prefix = '';

			if (iri.getElementsByTagName('prefix').length == 0) {
					is_default = true;
			}
			else {
					iri_prefix = iri.getElementsByTagName('prefix')[0].getAttribute('prefix_value');
			}

			for(k=0; k< iri.getElementsByTagName('property').length; k++) {
				iri_property = iri.getElementsByTagName('property')[k];

				switch(iri_property.getAttribute('property_value')) {
					case 'Standard_IRI':
						is_standard = true;
						break;
					
					case 'Project_IRI':
						is_project = true;
						break;
				}
			};

			ontology.addIri(new Iri(iri_prefix, iri_value, is_default, is_project, is_standard));        
		} 
	}
	

	// for searching predicates' description
	var xmlPredicates = xmlDocument.getElementsByTagName('predicate');

	var diagrams = xmlDocument.getElementsByTagName('diagram');
	for(i = 0;  i < diagrams.length; i++ ) {
		let diagram_name = diagrams[i].getAttribute('name');
		let diagram = new Diagram(diagram_name,i);
		ontology.addDiagram(diagram);

		array_json_elems = [];
		array_json_edges = [];
		nodes = diagrams[i].getElementsByTagName('node');
		edges = diagrams[i].getElementsByTagName('edge');
		cnt = 0;
		// Create JSON for each node to be added to the collection
		for (k = 0; k < nodes.length; k++) {
			array_json_elems.push(NodeXmlToJson(nodes[k], ontology, xmlPredicates, i));

			if (array_json_elems[cnt].data.type === 'property-assertion' ||
				array_json_elems[cnt].data.type === 'facet' ||
				(array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {

				addFakeNodes(array_json_elems);
				cnt += array_json_elems.length - cnt;
			}
			else
				cnt++;
		}
		diagram.addElems(array_json_elems);
		
		array_json_elems = [];
		for (k = 0; k < edges.length; k++) {
				array_json_elems.push(EdgeXmlToJson(edges[k], ontology, i));
		}
		diagram.addElems(array_json_elems);
		
	}

	
	getIdentityForNeutralNodes(ontology);
	
	return ontology;
}


function NodeXmlToJson(element, ontology, xmlPredicates, diagram_id) {
	// Creating a JSON Object for the node to be added to the collection
	
	var label_no_break;
	var nodo = {
		data: {
			id_xml: element.getAttribute('id'),
			diagram_id: diagram_id,
			id: element.getAttribute('id') + '_' + diagram_id,
			fillColor: element.getAttribute('color'),
			type: element.getAttribute('type'),
		},
		position: {},
		classes: element.getAttribute('type'),
	};

	switch (nodo.data.type) {
		case 'concept':
		case 'domain-restriction':
			nodo.data.shape = 'rectangle';
			nodo.data.identity = 'concept';
			break;
		case 'range-restriction':
			nodo.data.shape = 'rectangle';
			nodo.data.identity = 'neutral';
			break;
		case 'role':
			nodo.data.shape = 'diamond';
			nodo.data.identity = 'role';
			break;
		case 'attribute':
			nodo.data.shape = 'ellipse';
			nodo.data.identity = 'attribute';
			break;
		case 'union':
		case 'disjoint-union':
		case 'complement':
		case 'intersection':
		case 'enumeration':
			nodo.data.shape = 'hexagon';
			nodo.data.identity = 'neutral';
			break;
		case 'role-inverse':
		case 'role-chain':
			nodo.data.shape = 'hexagon';
			nodo.data.identity = 'role';
			if (nodo.data.type == 'role-chain') {
				if (element.getAttribute('inputs') != '')
					nodo.data.inputs = element.getAttribute('inputs').split(",");
			}
			break;
		case 'datatype-restriction':
			nodo.data.shape = 'hexagon';
			nodo.data.identity = 'value_domain';
			break;
		case 'value-domain':
			nodo.data.shape = 'roundrectangle';
			nodo.data.identity = 'value_domain';
			break;
		case 'property-assertion':
			nodo.data.shape = 'roundrectangle';
			nodo.data.identity = 'neutral';
			nodo.data.inputs = element.getAttribute('inputs').split(",");
			break;
		case 'individual':
			nodo.data.shape = 'octagon';
			nodo.data.identity = 'individual';
			break;
		case 'facet':
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
		nodo.data.width = -nodo.data.width;

	nodo.data.height = parseInt(info.getAttribute('height'));
	// Gli individual hanno dimensioni negative nel file graphol
	if (nodo.data.height < 0)
		nodo.data.height = -nodo.data.height;

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
		nodo.data.labelYpos = (parseInt(info.getAttribute('y')) - nodo.position.y) + (nodo.data.height + 2) / 2 + parseInt(info.getAttribute('height')) / 4;
		label_no_break = nodo.data.label.replace(/\n/g, '');
	}

	// Setting predicates properties
	if (isPredicate(element)) {
		nodo.classes += ' predicate';
		var node_iri, rem_chars, len_prefix, node_prefix_iri;
		var x = ontology.getDefaultIri();

		// setting iri
		if (element.getAttribute('remaining_characters') != null) {
			rem_chars = element.getAttribute('remaining_characters').replace(/\n/g, '');
			len_prefix = label_no_break.length - rem_chars.length;
			node_prefix_iri = label_no_break.substring(0, len_prefix);
			
			if (node_prefix_iri == ':' || !node_prefix_iri)
				node_iri = ontology.getDefaultIri().value;
			else {
				ontology.iriSet.forEach(iri => {
					if (node_prefix_iri == iri.prefix + ':') {
						node_iri = iri.value;
						return;
					}
				});
			}
			
		}
		else {
			node_iri = ontology.getDefaultIri().value;
			node_prefix_iri = '';
			rem_chars = label_no_break;
		}
		
		if (node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1) {
			rem_chars = label_no_break;
			node_iri = '';
			node_prefix_iri = node_prefix_iri.substring(node_prefix_iri.lastIndexOf('^') + 1, node_prefix_iri.lastIndexOf(':') + 1);
		}
		else if (!node_iri.substr(-1, 1) == '/' && !node_iri.substr(-1, 1) == '#')
			node_iri = node_iri + '/';

		nodo.data.remaining_chars = rem_chars;
		nodo.data.prefix_iri = node_prefix_iri;
		nodo.data.iri = node_iri + rem_chars;
		

		var j, predicateXml;
		for (j = 0; j < xmlPredicates.length; j++) {
			predicateXml = xmlPredicates[j];
			if (label_no_break == predicateXml.getAttribute('name') && nodo.data.type == predicateXml.getAttribute('type')) {
				nodo.data.description = predicateXml.getElementsByTagName('description')[0].textContent;
				nodo.data.description = nodo.data.description.replace(/&lt;/g, '<');
				nodo.data.description = nodo.data.description.replace(/&gt;/g, '>');
				nodo.data.description = nodo.data.description.replace(/font-family:'monospace'/g, '');
				nodo.data.description = nodo.data.description.replace(/&amp;/g, '&');
				nodo.data.description = nodo.data.description.replace(/font-size:0pt/g, 'font-size:inherit');
				var start_body_index = nodo.data.description.indexOf('<p');
				var end_body_index = nodo.data.description.indexOf('</body');
				nodo.data.description = nodo.data.description.substring(start_body_index, end_body_index);
				
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
			nodo.data.prefix_iri = label_no_break.split(':')[0] + ':';
			nodo.data.remaining_chars = label_no_break.split(':')[1];
		}
	}
	return nodo;
}


function EdgeXmlToJson(arco, ontology, diagram_id) {
	var k;
	var edge = {
		data: {
			target: arco.getAttribute('target') + '_' + diagram_id,
			source: arco.getAttribute('source') + '_' + diagram_id,
			id: arco.getAttribute('id') + '_' + diagram_id,
			id_xml: arco.getAttribute('id'),
			diagram_id: diagram_id,
			type: arco.getAttribute('type'),
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
			case 'membership':
				edge.data.style = 'solid';
				edge.data.target_arrow = 'triangle';
				edge.data.arrow_fill = 'filled';
				edge.data.edge_label = 'instance Of';
				break;
			default:
				console.error('tipo di arco non implementato <' + arco.getAttribute('type') + '>');
				break;
	}


	// Prendiamo i nodi source e target
	var source = ontology.diagrams[diagram_id].collection.$id(edge.data.source);
	var target = ontology.diagrams[diagram_id].collection.$id(edge.data.target);
	// Impostiamo le label numeriche per gli archi che entrano nei role-chain
	// I role-chain hanno un campo <input> con una lista di id di archi all'interno
	// che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
	// numerica che deve avere l'arco
	// Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
	// Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
	// la target_label in base alla posizione nella sequenza
	if (target.data('type') == 'role-chain' || target.data('type') == 'property-assertion') {
	  for (k = 0; k < target.data('inputs').length; k++) {
		if (target.data('inputs')[k] == edge.data.id_xml) {
		  edge.data.target_label = k + 1;
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
	for (j = 0; j < arco.childNodes.length; j++) {
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
					var aux = getDistanceWeight(target.position(), source.position(), breakpoints[count]);
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
	source_endpoint = getNewEndpoint(source_endpoint, source, breakpoints[1]);
	// Impostiamo l'endpoint solo se è diverso da zero
	// perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
	if (source_endpoint['x'] != 0 || source_endpoint['y'] != 0) {
			edge.data.source_endpoint = [];
			edge.data.source_endpoint.push(source_endpoint['x']);
			edge.data.source_endpoint.push(source_endpoint['y']);
	}
	// Facciamo la stessa cosa per il target
	var target_endpoint = [];
	target_endpoint['x'] = breakpoints[breakpoints.length - 1][0];
	target_endpoint['y'] = breakpoints[breakpoints.length - 1][1];
	target_endpoint = getNewEndpoint(target_endpoint, target, breakpoints[breakpoints.length - 2]);
	if (target_endpoint['x'] != 0 || target_endpoint['y'] != 0) {
			edge.data.target_endpoint = [];
			edge.data.target_endpoint.push(target_endpoint['x']);
			edge.data.target_endpoint.push(target_endpoint['y']);
	}
	return edge;
}


function addFakeNodes(array_json_nodes) {
	var nodo = array_json_nodes[array_json_nodes.length - 1];
	if (nodo.data.type == 'facet') {
		// Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
		// e la trasliamo verso il basso di una quantità pari all'altezza del nodo
		nodo.data.label = nodo.data.label.replace('^^', '\n\n');
		nodo.data.labelYpos = nodo.data.height;
		// Creating the top rhomboid for the grey background
		var top_rhomboid = {
			selectable: false,
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
			position: {
				x: nodo.position.x,
				y: nodo.position.y,
			},
		};

		var bottom_rhomboid = {
			selectable: false,
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
			position: {
				x: nodo.position.x,
				y: nodo.position.y,
			},
		};
		array_json_nodes[array_json_nodes.length - 1] = top_rhomboid;
		array_json_nodes.push(bottom_rhomboid);
		array_json_nodes.push(nodo);
		return;
	}

	
	if (nodo.data.functional == 1 && nodo.data.inverseFunctional == 1) {
		//Creating "fake" nodes for the double style border effect
		var triangle_right = {
			selectable: false,
			data: {
				height: nodo.data.height,
				width: nodo.data.width,
				fillColor: '#000',
				shape: 'polygon',
				shape_points: '0 -1 1 0 0 1',
				diagram_id: nodo.data.diagram_id,
			},
			position: {
				x: nodo.position.x,
				y: nodo.position.y,
			}
		};
		var triangle_left = {
			selectable: false,
			data: {
				height: nodo.data.height,
				width: nodo.data.width + 2,
				fillColor: '#fcfcfc',
				shape: 'polygon',
				shape_points: '0 -1 -1 0 0 1',
				diagram_id: nodo.data.diagram_id,
			},
			position: {
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
		array_json_nodes[array_json_nodes.length - 1] = triangle_left;
		array_json_nodes.push(triangle_right);
		array_json_nodes.push(nodo);
	}

	if (nodo.data.type == 'property-assertion') {
		var circle1 = {
			selectable: false,
			classes: 'no_overlay',
			data: {
				height: nodo.data.height,
				width: nodo.data.height,
				shape: 'ellipse',
				diagram_id: nodo.data.diagram_id,
				fillColor: '#fff',
				parent_node_id: nodo.data.id,
				type: nodo.data.type,
			},
			position: {
				x: nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
				y: nodo.position.y,
			}
		};
		var circle2 = {
			selectable: false,
			classes: 'no_overlay',
			data: {
				height: nodo.data.height,
				width: nodo.data.height,
				shape: 'ellipse',
				diagram_id: nodo.data.diagram_id,
				fillColor: '#fff',
				parent_node_id: nodo.data.id,
				type: nodo.data.type,
			},
			position: {
				x: nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
				y: nodo.position.y,
			}
		};
		var back_rectangle = {
			data: {
				selectable: false,
				height: nodo.data.height,
				width: nodo.data.width - nodo.data.height,
				shape: 'rectangle',
				diagram_id: nodo.data.diagram_id,
				fillColor: '#fff',
				parent_node_id: nodo.data.id,
				type: nodo.data.type,
			},
			position: nodo.position,
		};

		var front_rectangle = {
			data: {
				type: 'property-assertion',
				height: nodo.data.height - 1,
				width: nodo.data.width - nodo.data.height,
				shape: 'rectangle',
				diagram_id: nodo.data.diagram_id,
				fillColor: '#fff',
				parent_node_id: nodo.data.id,
				type: nodo.data.type,
			},
			position: nodo.position,
			classes: 'property-assertion no_border',
		};

		nodo.classes += ' hidden';
		array_json_nodes[array_json_nodes.length - 1] = nodo;
		array_json_nodes.push(back_rectangle);
		array_json_nodes.push(circle1);
		array_json_nodes.push(circle2);
		array_json_nodes.push(front_rectangle);
	}
}

function getIdentityForNeutralNodes(ontology) {
	ontology.diagrams.forEach(diagram =>{

		diagram.collection.filter('node[identity = "neutral"]').forEach(node => {
			node.data('identity', findIdentity(node));
		});

	});

	// Recursively traverse first input node and return his identity
	// if he is neutral => recursive step
	function findIdentity(node) {
		var first_input_node = node.incomers('[type = "input"]').sources();
		var identity = first_input_node.data('identity');
		if (identity == 'neutral')
				return findIdentity(first_input_node);
		else {
			switch (node.data('type')) {
				case 'range-restriction':
					if (identity == 'role')
						return 'concept';
					else if (identity == 'attribute')
						return 'value_domain';
					else
						return identity;
				case 'enumeration':
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

