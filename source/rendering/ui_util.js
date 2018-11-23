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
