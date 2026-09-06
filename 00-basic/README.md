# 00 — The Boring Memory Leak

Un lab Vue/Vite minimal pour observer un object graph simple : A pointe vers B
et C, tandis que B pointe vers C et C vers B.

Le bouton **Unlink structure** montre qu’un cycle unreachable est collectible.
Le bouton **Make 10,000 clumsy entries** crée une vraie memory leak en conservant
les islands dans `window.memoryLeakLab.myClumsyArray`.

## Structure du code

- `src/memory-leak.js` contient uniquement le modèle à étudier&nbsp;: objects,
  references, unlink et rétention volontaire.
- `src/lab-controller.js` relie ce modèle aux boutons, à l’état affiché et à
  `window.memoryLeakLab` pour l’inspection dans DevTools.

## Lancer le lab

```bash
npm install
npm run dev
```

Dans DevTools, prenez des heap snapshots et filtrez sur `Brol`. Le
retaining path doit mener à `myClumsyArray[]` tant que les islands sont retenues.
