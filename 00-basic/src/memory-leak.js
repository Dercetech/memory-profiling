/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
const PAYLOAD_SIZE = 1024 * 1024 * 8;
export const BATCH_PAYLOAD_SIZE = 1024 * 8;

let nextId = 1;

// Liste applicative oubliée / Forgotten application list.
export const myClumsyArray = [];

export class Brol {
  constructor(id, name, payloadSize = PAYLOAD_SIZE) {
    this.name = `${name}-${id}`;
    this.peer = null;
    this.payload = new Array(payloadSize).fill(id);
  }
}

export class StructureA {
  constructor(id, b, c) {
    this.name = `A-${id}`;
    this.b = b;
    this.c = c;
  }
}

export function buildStructure(payloadSize = PAYLOAD_SIZE) {
  const id = nextId++;
  const b = new Brol(id, 'B', payloadSize);
  const c = new Brol(id, 'C', payloadSize);

  b.peer = c;
  c.peer = b;

  return new StructureA(id, b, c);
}

export function unlinkStructure(a) {
  a.b = null;
  a.c = null;
}

export function leakStructure(a) {
  myClumsyArray.push({ id: a.name, b: a.b, c: a.c });
  unlinkStructure(a);
}
