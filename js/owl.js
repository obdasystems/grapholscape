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

    inputs.forEach(input => {
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

    edge.connectedNodes().forEach(node => {
      if (node.data('type') == 'complement') {
        node = node.incomers('[type = "input"]').source();
      }
      owl_string += self.nodeToOwlString(node)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    return owl_string+')';
  }
};


GrapholScape.prototype.nodeToOwlString = function(node,disjointness) {
  var owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>';
  var rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>';
  var missing_operand = '<span class="owl_error">Missing Operand</span>';
  var disjoint_classes = disjointness || null;

  switch(node.data('type')) {

    case 'concept':
    case 'role':
    case 'value-domain':
    case 'attribute':
    case 'individual':
      return '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="axiom_predicate">'+node.data('remaining_chars')+'</span>';
      break;
    
    case 'facet':
      var rem_chars = node.data('remaining_chars').replace('^^',' ');
      return '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="axiom_predicate">'+rem_chars+'</span>';
      break;

    case 'domain-restriction':
    case 'range-restriction':  
      var input_edges = node.connectedEdges('edge[target = "'+node.id()+'"][type = "input"]');
      var input_first, input_other, input_attribute = null;
      
      if (!input_edges.length)
        return missing_operand;


      input_edges.forEach(e => {
        if (e.source().data('type') == 'role' || e.source().data('type') == 'attribute') {
          input_first = e.source();         
        }

        if (e.source().data('type') != 'role' && e.source().data('type') != 'attribute') {
          input_other = e.source();
        }
      });

      if (input_first.length > 0) {
        if ( node.data('label') == 'exists' ) 
            return someValuesFrom(this,input_first,input_other,node.data('type'));
        
        else if ( node.data('label') == 'forall' )
          return allValuesFrom(this,input_first,input_other,node.data('type'));
          
        else if ( node.data('label').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
          var cardinality = node.data('label').replace(/\(|\)/g,'').split(/,/);
          return minMaxExactCardinality(this,input_first,input_other,cardinality)
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
        if (!node.data('inputs').length)
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
          if (!disjoint_classes) {
            this.disjoint_arr.unshift(node);
            return logicalConstructors(this,inputs,'union',axiom_type);
          }
          else  
            return disjointClasses(this,inputs);
        }

        return logicalConstructors(this,inputs,node.data('type'),axiom_type);
        break;

      case 'disjoint-union':
        var inputs = node.incomers('[type = "input"]').sources();
        if (!inputs.length)
          return missing_operand;

        return disjointClasses(this,inputs);
        break;

      case 'datatype-restriction':
        var inputs = node.incomers('[type = "input"]').sources();
        if(!inputs.length)
          return missing_operand;
        
        return datatypeRestriction(this,inputs);
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
      owl_string += inverseOf(self,first);
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
      owl_string += inverseOf(self,first);
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
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+inverseOf(first)+')';
        else 
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+inverseOf(first)+' '+self.nodeToOwlString(other)+')';
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
          return axiom_type+'MinCardinality('+cardinality[1]+' '+inverseOf(first)+')';
        else 
          return axiom_type+'MinCardinality('+cardinality[1]+' '+inverseOf(first)+' '+self.nodeToOwlString(other)+')';
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

      return axiom_type+'IntersectionOf('+minMaxExactCardinality(self,first,other,min)+' '+minMaxExactCardinality(self,first,other,max)+')';
    }
  }

  function inverseOf(self,node) {
    return 'ObjectInverseOf('+self.nodeToOwlString(node)+')';
  }

  function objectInverseOf(self,node) {
    return 'ObjectInverseOf('+self.nodeToOwlString(node)+')';
  }

  function objectPropertyChain(self,inputs) {
    var owl_string,

    owl_string = 'ObjectPropertyChain(';
    inputs.forEach(input_id =>{
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
    
    inputs.forEach(input => {
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';

    return owl_string;
  }

  function disjointClasses(self,inputs) {
    var owl_string = 'DisjointClasses(';

    inputs.forEach(input => {
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

    inputs.forEach(input => {
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
      return 'ObjectHasSelf('+inverseOf(self,input)+')';

    return 'ObjectHasSelf('+self.nodeToOwlString(input)+')';
  }
}