import { html, LitElement } from 'lit-element';
import cytoscape from 'cytoscape'
import GrapholscapeRenderer from './rendering/grapholscape_renderer'
/**
 * TODO: Import the rest of the modules just like the renderer
 */

/**
 * Example declaration of LitElement subclass to show
 * remapping of import statements with rollup
 */
export class GrapholscapeWidget extends LitElement {
    render() {
        return html('');
    }
}

export class GrapholScape {
	constructor(file) {
		var this_graph = this;
		this.ready = false;

		if (typeof(file) === 'object') {
			var reader = new FileReader();
			var event = new Event('grapholscape_ready');

			reader.onloadend = function () {
				this_graph.ontology = this_graph.parseGraphol(reader.result);
				this.ready = true;
				window.dispatchEvent(event);
			};

			reader.readAsText(file);
		}
		else if (typeof(file) === 'string') {
			this.ontology = this.parseGraphol(file);
			this.ready = true;
		}
		else {
			console.error('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized');
			return;
		}
	
	} // End Constructor

	setRenderer(container) {
		return new Promise ((resolve, reject) => {
			if (this.ready)
				resolve(new GrapholscapeRenderer(container, this.ontology));
			
			window.addEventListener('grapholscape_ready', () => {
				resolve(new GrapholscapeRenderer(container, this.ontology));
			},this);
		});  
	}

	getOccurrencesOfPredicate(predicate) {
		var list = document.getElementById('predicates_list');
		var rows = list.getElementsByClassName('predicate');
		var matches = {};
		for (var i = 0; i < rows.length; i++) {
		var info = rows[i].getElementsByClassName('info')[0];
		if (info.innerHTML === predicate) {
			var occurrences = rows[i].getElementsByClassName('sub_row');
			for (var j = 0; j < occurrences.length; j++) {
			var occurrence = occurrences[j];
			var diagram = occurrence.getAttribute('diagram');
			var node = occurrence.getAttribute('node_id');
			if (diagram in matches) {
				matches[diagram].push(node);
			}
			else {
				matches[diagram] = [node];
			}
			}
			break;
		}
		}
		return matches;
	}
}

