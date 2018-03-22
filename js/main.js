function showDiagramList(graph) {
  var diagram_list = document.getElementById('diagram_list');
  diagram_list.style.display = 'initial';

  if (diagram_list.innerHTML == '') {
    var i=0;
    for(i=0; i<graph.diagrams.length; i++) {
      var item = document.createElement('div');
      item.setAttribute('class','diagram_item');

      var name = graph.diagrams[i].getAttribute('name');
      item.innerHTML = name;

      item.addEventListener('click',function () { graph.drawDiagram(this.innerHTML); });

      document.getElementById('diagram_list').appendChild(item);
    }
  }
}

function search(value) {
  var table = document.getElementById('predicates_table');
  var val = value.toLowerCase();
  var rows = table.getElementsByClassName('predicate');

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
    col_with_arrow.firstChild.setAttribute('src','icons/arrow_right_18dp.png');
  }
  else {
    subrows.style.display = 'initial';
    col_with_arrow.firstChild.setAttribute('src','icons/arrow_down_18dp.png');
  }
}

function goTo(graph,sub_row) {
  var diagram = sub_row.getAttribute('diagram');
  var node_id = sub_row.getAttribute('node_id');

  graph.centerOnNode(node_id,diagram,1.25);

}
