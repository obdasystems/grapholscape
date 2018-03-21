function HashTable(size) {
  this.storage = new Array(size);
  this.size = size;
  this.collisions = 0;
  this.count = 0;
}

function HashNode(key,element,next) {
  this.key = key;
  this.element = element;
  this.next = next || null;
}

HashTable.prototype.hash = function(key) {
  var index = 0;
  var i = 0;
  for (i=0; i<key.length; i++) {
    index += key.charCodeAt(i);
  }
  return index % this.size;
};


HashTable.prototype.insert = function(key,element) {
  this.count++;
  var index = this.hash(key);

  if (this.storage[index] == null) {
    this.storage[index] = new HashNode(key,element);
  }
  else if (this.storage[index].key == key) {
    this.storage[index].element = element;
  }
  else {
    this.collisions++;
    var temp = this.storage[index];

    this.storage[index] = new HashNode(key,element);
    this.storage[index].next = temp;
  }
}


HashTable.prototype.get = function(key) {
  var index = this.hash(key);

  if (!this.storage[index])
    return null;

  var current_node = this.storage[index];
  while (current_node) {
    if (current_node.key == key) {
      return current_node.element;
    }
    current_node = current_node.next;
  }

  return null;
}
