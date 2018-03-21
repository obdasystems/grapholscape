function addNodesToGraph(nodes,graph,xmlPredicates,predicates) {

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
        alert(nodo.data.id);
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


      nodo.data.labelXpos = parseInt(info.getAttribute('x')) - nodo.position.x + 1;

      nodo.data.labelYpos = (parseInt(info.getAttribute('y')) - nodo.position.y) + (nodo.data.height+2)/2 + parseInt(info.getAttribute('height'))/4;

      // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
      // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
      if (nodo.data.type == 'facet') {
        nodo.data.label = nodo.data.label.replace('^^','\n\n');
        nodo.data.labelYpos = nodo.data.height;
        //nodo.labelXpos = 0;
      }
    }



    // Impostazione delle funzionalità dei nodi di tipo role o attribute
    //  1 -> funzionale
    //  -1 -> inversamente funzionale
    //  2 -> funzionale e inversamente funzionale
    if (nodo.data.type == 'attribute' || nodo.data.type == 'role') {
      var label_no_break = nodo.data.label.replace(/\n/,'');

      var j;
      for (j = 0; j < xmlPredicates.length; j++) {
        if (label_no_break == xmlPredicates[j].getAttribute('name')) {
          if (xmlPredicates[j].getElementsByTagName('functional')[0].textContent == 1) {
            nodo.data.functional = 1;
          }

          // Se il nodo è un ruolo ed è inversamente funzionale, impostiamo 2 se è anche
          // funzionale.
          // -1 altrimenti
          if (nodo.data.type == 'role' && xmlPredicates[j].getElementsByTagName('inverseFunctional')[0].textContent == 1) {
            if (nodo.data.functional == 1)
              nodo.data.functional = 2;
            else
              nodo.data.functional = -1;
          }
        }

      }
    }

    graph.add(nodo);
  }  // End For

}


function addEdgesToGraph(edges,graph) {


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
    var source = graph.getElementById(edge.data.source);
    var target = graph.getElementById(edge.data.target);


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

    graph.add(edge);
  }
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
    switch (node.type) {
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

  //Esprimiamo le coordinate di point traslando l'origine sul source:
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
    // T: y = - x/ angolar_coeff + quote

    // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
    // quote = point_y + (point_x/angolar_coeff)


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
      endpoint['y'] = node.height() / 2;
      return endpoint;
    }
    // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
    else if (breakpoint['y'] < 0 ) {
      endpoint['y'] = - node.height() / 2;
      return endpoint;
    }
  }
  // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
  else if (endpoint['y'] == breakpoint['y'] ) {
    if (breakpoint['x'] > 0) {
      endpoint['x'] = node.width() / 2;
      return endpoint;
    }
    else if (breakpoint['x'] < 0) {
      endpoint['x'] = - node.width() / 2;
      return endpoint;
    }
  }
  return endpoint;
}


function nodesToPredicates(nodes,predicates,diagram_number) {
  var i;
  var element;
  for (i= 0; i<nodes.length; i++) {
    element = nodes[i];

    var nodo = {
      data: {
        type : element.getAttribute('type'),
      }
    };


    if (isPredicate(nodo)) {
      nodo.data.label = element.getElementsByTagName('label')[0].textContent;
      nodo.data.label = nodo.data.label.replace(/\n/,""); // removing new_lines characters
      var key = nodo.data.label.concat(nodo.data.type);

      // if this predicate is already in the hashtable
      // then we add the id and the diagram identificator of this "istance"
      // So we will know the number of istances in the ontology for each predicate
      // and which diagram they referes to
      if (predicates.get(key) != null) {
        // overriding the node created previously with the one that's already in the hash table
        nodo = predicates.get(key);

        nodo.id.push(element.getAttribute('type'));
        nodo.diagrams.push(diagram_number);
      }
      else {
        // This is a new predicate, create the id and diagrams number array
        nodo.id = [];
        nodo.id.push(element.getAttribute('type'));
        nodo.diagrams = [];
        nodo.diagrams.push(diagram_number);
        predicates.insert(key,nodo);
      }
    }
  }
}
