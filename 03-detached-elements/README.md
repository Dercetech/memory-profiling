# 03 — Detached elements

Un mini-lab Vite sans framework pour observer des éléments retirés du DOM mais toujours retenus par une référence JavaScript. Le code sépare l’interface (`src/ui/`) du sandbox qui retient puis libère les nœuds (`src/sandbox/`).

```bash
npm install
npm run dev
```

Ajoutez quelques éléments, retirez-les de la liste, puis ouvrez **Memory → Detached elements** dans Chrome DevTools. Le bouton **Release retained references** vide la reference volontairement gardée par le lab afin de comparer un second profile.
