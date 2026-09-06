# 01 — It’s Raining Mem

Une petite application Vue/Vite qui simule de la pluie sur un paysage en pixel
art. Chaque pixel de terre, d’herbe, de nuage et d’eau est représenté par une
forme distincte dans la simulation.

Le curseur règle le temps pendant lequel une goutte reste au sol. Une durée plus
longue laisse davantage d’eau s’accumuler dans les creux du terrain.

Sous le paysage, le lab affiche aussi la mémoire JavaScript lorsque le navigateur
l’expose, ainsi que le temps moyen consacré à la simulation et au rendu. Ce temps
est comparé au budget de 16,67 ms d’une image à 60 Hz&nbsp;: il ne représente pas
l’utilisation CPU totale du navigateur.

## Lancer le lab

```bash
npm install
npm run dev
```

Ouvrez ensuite l’URL affichée par Vite. Le lab contient volontairement un
problème de rétention mémoire à analyser avec les DevTools du navigateur.
