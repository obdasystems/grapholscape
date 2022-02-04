import GrapholscapeRenderer from "./default-renderer";
import LiteGscapeRenderer from "./lite-renderer";
import FloatyGscapeRenderer from "./float-renderer";

export const grapholRenderer = { key: "default", label: "Graphol", getObj: () => new GrapholscapeRenderer() } 
export const grapholLiteRenderer = { key: "lite", label: "Graphol-Lite", getObj: () => new LiteGscapeRenderer() }
export const floatyRenderer = { key: "float", label: "Floaty", getObj: () => new FloatyGscapeRenderer() }

//export const floatyRenderer = new FloatyGscapeRenderer()
export { GrapholscapeRenderer } // export class for letting the user extends it creating his own renderer 