import Ontology from '../model/ontology'
import Iri from '../model/iri'
import Diagram from '../model/diagrams'
import * as ParserUtil from './parser_util'

export default class GrapholParser {
  constructor(xmlString) {
    this.xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : new DOMParser().parseFromString(xmlString, 'text/xml')

    this.graphol_ver = this.xmlDocument.getElementsByTagName('graphol')[0].getAttribute('version') || -1

    if(this.graphol_ver == 2 || this.graphol_ver == -1)
      this.parseGraphol = this.parseGraphol2.bind(this)
    else if(this.graphol_ver == 3)
      this.parseGraphol = this.parseGraphol3.bind(this)
    else
      throw new Error('Error: Graphol version not supported or not defined.')
  }

  parseGraphol2() {
    var i, k

    var xml_ontology_tag = this.xmlDocument.getElementsByTagName('ontology')[0]

    var ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent
    var ontology_version = ''

    if (xml_ontology_tag.getElementsByTagName('version')[0]) {
      ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent
    } else {
      ontology_version = 'Undefined'
    }

    // Creating an Ontology Object
    this.ontology = new Ontology(ontology_name, ontology_version)

    if (this.xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length === 0) {
      // for old graphol files
      let iri_value = this.xmlDocument.getElementsByTagName('iri')[0].textContent
      this.ontology.addIri(new Iri([''], iri_value))
    } else {
      // Create iri and add them to ontology.iriSet
      let iri_list = this.xmlDocument.getElementsByTagName('iri')
      // Foreach iri create a Iri object

      for (i = 0; i < iri_list.length; i++) {
        let iri = iri_list[i]

        var iri_value = iri.getAttribute('iri_value')

        var is_standard = false
        var iri_prefixes = []

        if (true) {
          [...iri.getElementsByTagName('prefix')].forEach(iri_prefix => {
            iri_prefixes.push(iri_prefix.getAttribute('prefix_value'))
          }) 
        }

        if (iri_prefixes.length == 0) {
          iri_prefixes.push('');
        }

        for (k = 0; k < iri.getElementsByTagName('property').length; k++) {
          let iri_property = iri.getElementsByTagName('property')[k]

          switch (iri_property.getAttribute('property_value')) {
            case 'Standard_IRI':
              is_standard = true
              break
          }
        };

        this.ontology.addIri(new Iri(iri_prefixes, iri_value, is_standard))
      }
    }

    // for searching predicates' description
    this.xmlPredicates = this.xmlDocument.getElementsByTagName('predicate')

    var diagrams = this.xmlDocument.getElementsByTagName('diagram')
    for (i = 0; i < diagrams.length; i++) {
      let diagram_name = diagrams[i].getAttribute('name')
      let diagram = new Diagram(diagram_name, i)
      this.ontology.addDiagram(diagram)

      var array_json_elems = []
      var nodes = diagrams[i].getElementsByTagName('node')
      var edges = diagrams[i].getElementsByTagName('edge')
      var cnt = 0
      // Create JSON for each node to be added to the collection
      for (k = 0; k < nodes.length; k++) {
        array_json_elems.push(this.NodeXmlToJson(nodes[k], i))

        if (array_json_elems[cnt].data.type === 'property-assertion' ||
          array_json_elems[cnt].data.type === 'facet' ||
          (array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {
          this.addFakeNodes(array_json_elems)
          cnt += array_json_elems.length - cnt
        } else { cnt++ }
      }
      diagram.addElems(array_json_elems)
      array_json_elems = []
      for (k = 0; k < edges.length; k++) {
        array_json_elems.push(this.EdgeXmlToJson(edges[k], i))
      }
      diagram.addElems(array_json_elems)

      
    }

    if(i==0) {
      throw("The selected .graphol file has no defined diagram")
    }

    this.getIdentityForNeutralNodes()
    return this.ontology
  }

    return ontology
  }

  NodeXmlToJson(element, diagram_id) {
    // Creating a JSON Object for the node to be added to the collection

    var label_no_break
    var nodo = {
      data: {
        id_xml: element.getAttribute('id'),
        diagram_id: diagram_id,
        id: element.getAttribute('id') + '_' + diagram_id,
        fillColor: element.getAttribute('color'),
        type: element.getAttribute('type'),
      },
      position: {},
      classes: element.getAttribute('type')
    }

    switch (nodo.data.type) {
      case 'concept':
      case 'domain-restriction':
        nodo.data.shape = 'rectangle'
        nodo.data.identity = 'concept'
        break
      case 'range-restriction':
        nodo.data.shape = 'rectangle'
        nodo.data.identity = 'neutral'
        break
      case 'role':
        nodo.data.shape = 'diamond'
        nodo.data.identity = 'role'
        break
      case 'attribute':
        nodo.data.shape = 'ellipse'
        nodo.data.identity = 'attribute'
        break
      case 'union':
      case 'disjoint-union':
      case 'complement':
      case 'intersection':
      case 'enumeration':
        nodo.data.shape = 'hexagon'
        nodo.data.identity = 'neutral'
        break
      case 'role-inverse':
      case 'role-chain':
        nodo.data.shape = 'hexagon'
        nodo.data.identity = 'role'
        if (nodo.data.type === 'role-chain') {
          if (element.getAttribute('inputs') !== '') { nodo.data.inputs = element.getAttribute('inputs').split(',') }
        }
        break
      case 'datatype-restriction':
        nodo.data.shape = 'hexagon'
        nodo.data.identity = 'value_domain'
        break
      case 'value-domain':
        nodo.data.shape = 'roundrectangle'
        nodo.data.identity = 'value_domain'
        break
      case 'property-assertion':
        nodo.data.shape = 'roundrectangle'
        nodo.data.identity = 'neutral'
        nodo.data.inputs = element.getAttribute('inputs').split(',')
        break
      case 'individual':
        nodo.data.shape = 'octagon'
        nodo.data.identity = 'individual'
        break
      case 'facet':
        nodo.data.shape = 'polygon'
        nodo.data.shape_points = '-0.9 -1 1 -1 0.9 1 -1 1'
        nodo.data.fillColor = '#ffffff'
        nodo.data.identity = 'facet'
        break
      default:
        console.error('tipo di nodo sconosciuto')
        break
    }

    // Parsing the <geometry> child node of node
    var geometry = element.getElementsByTagName('geometry')[0]
    nodo.data.width = parseInt(geometry.getAttribute('width'))

    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.width < 0) { nodo.data.width = -nodo.data.width }

    nodo.data.height = parseInt(geometry.getAttribute('height'))
    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.height < 0) { nodo.data.height = -nodo.data.height }

    // L'altezza dei facet è nulla nel file graphol, la impostiamo a 40
    if (nodo.data.type === 'facet') {
      nodo.data.height = 40
    }

    nodo.position.x = parseInt(geometry.getAttribute('x'))
    nodo.position.y = parseInt(geometry.getAttribute('y'))

    // info = <LABEL>
    let label = element.getElementsByTagName('label')[0]
    // info = null se non esiste la label (è l'ultimo elemento)
    if (label != null) {
      nodo.data.label = this.getLabel(element)
      nodo.data.labelXpos = parseInt(label.getAttribute('x')) - nodo.position.x + 1
      nodo.data.labelYpos = (parseInt(label.getAttribute('y')) - nodo.position.y) + (nodo.data.height + 2) / 2 + parseInt(label.getAttribute('height')) / 4
      label_no_break = nodo.data.label.replace(/\n/g, '')
    }

    // Setting predicates properties
    if (ParserUtil.isPredicate(element)) {
      nodo.classes += ' predicate'
      let iri_infos = this.getIri(element, label_no_break)
      
      nodo.data.remaining_chars = iri_infos.remaining_chars
      nodo.data.prefix_iri = iri_infos.prefix_iri
      nodo.data.iri = iri_infos.iri

      let predicate_infos = this.getPredicateInfos(nodo, label_no_break)
      if (predicate_infos) {
        Object.keys(predicate_infos).forEach(info => {
          nodo.data[info] = predicate_infos[info]
        })
      }
    } else {
      // Set prefix and remaining chars for non-predicate nodes
      // owl.js use this informations for all nodes
      nodo.data.prefix_iri = ''
      nodo.data.remaining_chars = label_no_break
      if (nodo.data.type ==='value-domain' || nodo.data.type ==='facet') {
        nodo.data.prefix_iri = label_no_break.split(':')[0] + ':'
        nodo.data.remaining_chars = label_no_break.split(':')[1]
      }
    }
    return nodo
  }

  EdgeXmlToJson (arco, diagram_id) {
    var k
    var edge = {
      data: {
        target: arco.getAttribute('target') + '_' + diagram_id,
        source: arco.getAttribute('source') + '_' + diagram_id,
        id: arco.getAttribute('id') + '_' + diagram_id,
        id_xml: arco.getAttribute('id'),
        diagram_id: diagram_id,
        type: arco.getAttribute('type'),
        breakpoints: [],
      }
    }

    if (edge.data.type == 'membership') 
        edge.data.edge_label = 'instance Of'

    // Prendiamo i nodi source e target
    var source = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.source)
    var target = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.target)
    // Impostiamo le label numeriche per gli archi che entrano nei role-chain
    // I role-chain hanno un campo <input> con una lista di id di archi all'interno
    // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
    // numerica che deve avere l'arco
    // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
    // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
    // la target_label in base alla posizione nella sequenza
    if (target.data('type') ==='role-chain' || target.data('type') ==='property-assertion') {
      for (k = 0; k < target.data('inputs').length; k++) {
        if (target.data('inputs')[k] ===edge.data.id_xml) {
          edge.data.target_label = k + 1
          break
        }
      }
    }

    // info = <POINT>
    // Processiamo i breakpoints dell'arco
    // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
    var point = ParserUtil.getFirstChild(arco)
    var breakpoints = []
    var segment_weights = []
    var segment_distances = []
    var j
    var count = 0
    for (j = 0; j < arco.childNodes.length; j++) {
      // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
      if (arco.childNodes[j].nodeType != 1) { continue }
      breakpoints[count] = {
        'x' : parseInt(point.getAttribute('x')),
        'y' : parseInt(point.getAttribute('y')),
      }
      //breakpoints[count].push(parseInt(point.getAttribute('x')))
      //breakpoints[count].push(parseInt(point.getAttribute('y')))
      if (ParserUtil.getNextSibling(point) != null) {
        point = ParserUtil.getNextSibling(point)
        // Se il breakpoint in questione non è il primo
        // e non è l'ultimo, visto che ha un fratello,
        // allora calcoliamo peso e distanza per questo breakpoint
        // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
        if (count > 0) {
          var aux = ParserUtil.getDistanceWeight(target.position(), source.position(), breakpoints[count])
          segment_distances.push(aux[0])
          segment_weights.push(aux[1])
        }
        count++
      } else { break }
    }
    // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi
    if (count > 1) {
      edge.data.breakpoints = breakpoints.slice(1, count)
      edge.data.segment_distances = segment_distances
      edge.data.segment_weights = segment_weights
    }
    // Calcoliamo gli endpoints sul source e sul target
    // Se non sono centrati sul nodo vanno spostati sul bordo del nodo
    var source_endpoint = []
    source_endpoint['x'] = breakpoints[0]['x']
    source_endpoint['y'] = breakpoints[0]['y']
    source_endpoint = ParserUtil.getNewEndpoint(source_endpoint, source, breakpoints[1])
    // Impostiamo l'endpoint solo se è diverso da zero
    // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
    if (source_endpoint['x'] != 0 || source_endpoint['y'] != 0) {
      edge.data.source_endpoint = []
      edge.data.source_endpoint.push(source_endpoint['x'])
      edge.data.source_endpoint.push(source_endpoint['y'])
    }
    // Facciamo la stessa cosa per il target
    var target_endpoint = []
    target_endpoint['x'] = breakpoints[breakpoints.length - 1]['x']
    target_endpoint['y'] = breakpoints[breakpoints.length - 1]['y']
    target_endpoint = ParserUtil.getNewEndpoint(target_endpoint, target, breakpoints[breakpoints.length - 2])
    if (target_endpoint['x'] != 0 || target_endpoint['y'] != 0) {
      edge.data.target_endpoint = []
      edge.data.target_endpoint.push(target_endpoint['x'])
      edge.data.target_endpoint.push(target_endpoint['y'])
    }
    return edge
  }

  addFakeNodes(array_json_nodes) {
    var nodo = array_json_nodes[array_json_nodes.length - 1]
    if (nodo.data.type ==='facet') {
      // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
      // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
      nodo.data.label = nodo.data.label.replace('^^', '\n\n')
      nodo.data.labelYpos = nodo.data.height
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
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        }
      }

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
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        }
      }
      array_json_nodes[array_json_nodes.length - 1] = top_rhomboid
      array_json_nodes.push(bottom_rhomboid)
      array_json_nodes.push(nodo)
      return
    }

    if (nodo.data.functional ===1 && nodo.data.inverseFunctional ===1) {
      // Creating "fake" nodes for the double style border effect
      var triangle_right = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          fillColor: "#000",
          shape: 'polygon',
          shape_points: '0 -1 1 0 0 1',
          diagram_id: nodo.data.diagram_id,
          type: nodo.data.type,
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y,
        },
        classes: 'fake-triangle fake-triangle-right'
      }
      var triangle_left = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width + 2,
          fillColor: '#fcfcfc',
          shape: 'polygon',
          shape_points: '0 -1 -1 0 0 1',
          diagram_id: nodo.data.diagram_id,
          type: nodo.data.type,
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        },
        classes: 'fake-triangle'
      }
      //var old_labelXpos = nodo.data.labelXpos
      //var old_labelYpos = nodo.data.labelYpos
      nodo.data.height -= 8
      nodo.data.width -= 10
      // If the node is both functional and inverse functional,
      // we added the double style border and changed the node height and width.
      // The label position is function of node's height and width so we adjust it
      // now after those changes.
      if (nodo.data.label != null) {
        nodo.data.labelYpos -= 4
      }
      array_json_nodes[array_json_nodes.length - 1] = triangle_left
      array_json_nodes.push(triangle_right)
      array_json_nodes.push(nodo)
    }

    if (nodo.data.type ==='property-assertion') {
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
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
          y: nodo.position.y
        }
      }
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
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
          y: nodo.position.y
        }
      }
      var back_rectangle = {
        data: {
          selectable: false,
          height: nodo.data.height,
          width: nodo.data.width - nodo.data.height,
          shape: 'rectangle',
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: nodo.position
      }

      var front_rectangle = {
        data: {
          type: 'property-assertion',
          height: nodo.data.height - 1,
          width: nodo.data.width - nodo.data.height,
          shape: 'rectangle',
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: nodo.position,
        classes: 'property-assertion no_border'
      }

      nodo.classes += ' hidden'
      array_json_nodes[array_json_nodes.length - 1] = nodo
      array_json_nodes.push(back_rectangle)
      array_json_nodes.push(circle1)
      array_json_nodes.push(circle2)
      array_json_nodes.push(front_rectangle)
    }
  }

  getIdentityForNeutralNodes() {
    this.ontology.diagrams.forEach(diagram => {
      diagram.cy.nodes('[identity = "neutral"]').forEach(node => {
        node.data('identity', findIdentity(node))
      })
    })

    // Recursively traverse first input node and return his identity
    // if he is neutral => recursive step
    function findIdentity (node) {
      var first_input_node = node.incomers('[type = "input"]').sources()
      var identity = first_input_node.data('identity')
      if (identity ==='neutral') { return findIdentity(first_input_node) } else {
        switch (node.data('type')) {
          case 'range-restriction':
            if (identity ==='role') { return 'concept' } else if (identity ==='attribute') { return 'value_domain' } else { return identity }
          case 'enumeration':
            if (identity ==='individual') { return 'concept' } else { return identity }
          default:
            return identity
        }
      }
    }
  }

  getLabel(element) {
    switch(this.graphol_ver) {
      case 3:
        break
      
      default:
        return element.getElementsByTagName('label')[0].textContent
        break
    }
  }

  getIri(element, label_no_break) {
    let node_iri, rem_chars, len_prefix, node_prefix_iri
    let iri_infos = {}

    // setting iri
    if (element.getAttribute('remaining_characters') != null) {
      rem_chars = element.getAttribute('remaining_characters').replace(/\n/g, '')
    } else {
      rem_chars = label_no_break
    }
    
    len_prefix = label_no_break.length - rem_chars.length
    node_prefix_iri = label_no_break.substring(0, len_prefix)
    for(let iri of this.ontology.iriSet) {
      iri.prefixes.forEach(prefix => {
        if (node_prefix_iri == prefix+':' || node_prefix_iri == prefix) {
          node_iri = iri.value
        }
      })
    }

    if(!node_iri) {
      throw(`Err: the iri prefix "${node_prefix_iri}" is not associated to any iri`)
    }
    
    if (node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1) {
      rem_chars = label_no_break
      node_iri = ''
      node_prefix_iri = node_prefix_iri.slice(node_prefix_iri.lastIndexOf('^') + 1, node_prefix_iri.lastIndexOf(':') + 1)
    } else if (node_iri.slice(-1) !=='/' && node_iri.slice(-1) !=='#') { node_iri = node_iri + '/' }

    iri_infos.remaining_chars = rem_chars
    iri_infos.prefix_iri = node_prefix_iri
    iri_infos.iri = node_iri + rem_chars

    return iri_infos
  }

  getPredicateInfos(nodo, label_no_break){
    let j, predicateXml, description
    let result = {}
    for (j = 0; j < this.xmlPredicates.length; j++) {
      predicateXml = this.xmlPredicates[j]
      if (label_no_break === predicateXml.getAttribute('name') && nodo.data.type === predicateXml.getAttribute('type')) {
        description = predicateXml.getElementsByTagName('description')[0].textContent
        description = description.replace(/font-size:0pt/g, '')
        let start_body_index = description.indexOf('<p')
        let end_body_index = description.indexOf('</body')

        result.description = description.slice(start_body_index, end_body_index)

        // Impostazione delle funzionalità dei nodi di tipo role o attribute
        if (nodo.data.type === 'attribute' || nodo.data.type === 'role') {
          result.functional = parseInt(predicateXml.getElementsByTagName('functional')[0].textContent)
        }

        if (nodo.data.type === 'role') {
          result.inverseFunctional = parseInt(predicateXml.getElementsByTagName('inverseFunctional')[0].textContent)
          result.asymmetric = parseInt(predicateXml.getElementsByTagName('asymmetric')[0].textContent)
          result.irreflexive = parseInt(predicateXml.getElementsByTagName('irreflexive')[0].textContent)
          result.reflexive = parseInt(predicateXml.getElementsByTagName('reflexive')[0].textContent)
          result.symmetric = parseInt(predicateXml.getElementsByTagName('symmetric')[0].textContent)
          result.transitive = parseInt(predicateXml.getElementsByTagName('transitive')[0].textContent)
        }
        break
      }
    }

    return result
  }
}
