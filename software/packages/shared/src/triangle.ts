import { Vertex } from "./vertex";

export const Triangle: Vertex[] = [
  new Vertex({ x: 0.0, y: 0.5 }, [1.0, 0.0, 0.0]),
  new Vertex({ x: -0.5, y: -0.5 }, [0.0, 1.0, 0.0]),
  new Vertex({ x: 0.5, y: -0.5 }, [0.0, 0.0, 1.0]),
];
