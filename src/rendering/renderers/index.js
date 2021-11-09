import GrapholscapeRenderer from "./default-renderer";
import LiteGscapeRenderer from "./lite-renderer";
import FloatyGscapeRenderer from "./float-renderer";

export const grapholRenderer = () => { return { key: "default", label: "Graphol", obj: new GrapholscapeRenderer() } }
export const grapholLiteRenderer = () => { return { key: "lite", label: "Graphol-Lite", obj:new LiteGscapeRenderer() } }
export const floatyRenderer = () => { return { key: "float", label: "Floaty", obj:new FloatyGscapeRenderer() } }

//export const floatyRenderer = new FloatyGscapeRenderer()
export { GrapholscapeRenderer } // export class for letting the user extends it creating his own renderer 