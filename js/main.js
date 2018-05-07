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
}

function toggleSubRows(col_with_arrow) {
  var subrows = col_with_arrow.parentNode.parentNode.getElementsByClassName('sub_row_wrapper')[0];

  if (subrows.style.display == 'initial') {
    subrows.style.display = 'none';
    col_with_arrow.firstChild.innerHTML = 'keyboard_arrow_right';
  }
  else {
    subrows.style.display = 'initial';
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
