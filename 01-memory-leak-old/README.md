# 01 — Fuite mémoire

Un petit jeu Phaser qui sert de support à l’exercice sur les fuites mémoire.

## Lancer le jeu

```bash
npm install
npm run dev
```

Ouvrez l’URL locale affichée par Vite, puis ramassez les orbes avec les flèches,
ZQSD sur un clavier belge ou français, ou WASD sur un clavier QWERTY. Le jeu se
base sur la position physique des touches, indépendamment de la disposition du
clavier.

Cette version contient volontairement une fuite : des objets détruits à l’écran
restent accessibles en mémoire. Le laboratoire consiste à mesurer cette
rétention, identifier son chemin de rétention, puis corriger sa cause.

Le compteur « Mémoire JS » utilise la mesure native du tas JavaScript lorsqu’elle
est exposée par le navigateur. Il indique explicitement son indisponibilité dans
les autres navigateurs.
