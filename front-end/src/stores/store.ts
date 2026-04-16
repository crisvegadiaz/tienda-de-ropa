import { persistentAtom } from '@nanostores/persistent';

export type Producto = {
  idVariante: string;
  nombre: string;
  precio: number;
  cantidad: number;
  color?: string;
  talle?: string;
};

export const $carrito = persistentAtom<Producto[]>('carrito', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});


export function agregarProducto(nuevoProducto: Producto) {
  const listaActual = $carrito.get();
  const indiceExistente = listaActual.findIndex(p => p.idVariante === nuevoProducto.idVariante);

  if (indiceExistente !== -1) {
    const nuevaLista = listaActual.map((item, index) => 
      index === indiceExistente 
        ? { ...item, cantidad: item.cantidad + nuevoProducto.cantidad }
        : item
    );
    $carrito.set(nuevaLista);
  } else {
    $carrito.set([...listaActual, nuevoProducto]);
  }
  console.log("Carrito actualizado:", $carrito.get());
}

export function eliminarProducto(idVariante: string) {
  const listaActual = $carrito.get();
  const nuevaLista = listaActual.filter(p => p.idVariante !== idVariante);
  $carrito.set(nuevaLista);
  console.log("Producto eliminado, carrito actualizado:", $carrito.get());
}
