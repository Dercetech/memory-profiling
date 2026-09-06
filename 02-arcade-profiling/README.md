# 02 — Arcade profiling

Base de travail pour les exercices de profilage mémoire et de performance.
Jeu spatial servant de base de travail pour les exercices de profilage mémoire et de performance.

## Lancer le jeu

```bash
npm install
npm run dev
```

Ouvrez l'URL locale affichée par Vite. `WASD`, `ZQSD` et les flèches contrôlent le vaisseau : avancer, tourner à gauche, reculer et tourner à droite. `Shift` double la vitesse de rotation. `Espace` tire. `X` déclenche l'attaque spéciale. `C` transfère l'énergie du condensateur au bouclier. `O` est une triche : une pression recharge instantanément le bouclier et le condensateur. `Échap` met le jeu en pause et affiche un voile sombre. Les contrôles reposent sur les codes physiques du clavier et prennent donc en charge les dispositions AZERTY et QWERTY.

Lors d'une collision avec une mine, le vaisseau perd entre 1 et 40 points de vie. Les vecteurs de vitesse du vaisseau et de la mine sont additionnés, puis leur norme est plafonnée à la vitesse maximale d'une mine : `dégâts = max(1, ceil(40 × min(|vaisseau + mine| / 400, 1)))`. Ainsi, une mine à pleine vitesse contre un vaisseau immobile enlève exactement 40 points de vie, et aucun impact ne peut en enlever davantage. À zéro point de vie, le vaisseau explose puis réapparaît une seconde plus tard. Il clignote et reste invincible pendant trois secondes. La barre au-dessus du vaisseau alterne entre la vie en vert et le bouclier en bleu. `Kills` et `Collisions` sont empilés en bas à gauche ; les aides `X: BLAST` et `C: SHIELD BOOST` occupent le bas au centre.

Le bouclier d'énergie absorbe les dégâts en premier. Il contient au plus 40 points, régénère un point par seconde et son anneau s'amincit et devient plus transparent lorsqu'il se vide. `C` consomme 10 points du condensateur et apporte 10 points de bouclier — soit 25 % de sa capacité. Toute mine qui percute le bouclier ou le vaisseau est détruite dans une explosion. Si le bouclier absorbe tout l'impact, le vaisseau ne subit aucun dégât ; sinon, le solde endommage le vaisseau avant que la mine soit détruite.

La barre bleue sous le vaisseau représente un condensateur de 100 points qui se recharge de 5 points par seconde. Chaque tir d'`Espace` consomme 1 point. `X` consomme 30 points et tire un anneau de 30 particules d'énergie : elles traversent presque toute l'arène à grande vitesse et détruisent instantanément toute mine qu'elles touchent. Dès 30 points, l'indicateur alterne entre `PRESS X` et `CHARGING`; à 100 points, il affiche `FULL`. La barre au-dessus du vaisseau alterne entre `LIFE` en vert et `SHIELD` en bleu.

## Architecture

- `src/config/` regroupe les constantes de réglage, la configuration du jeu et le manifeste des assets.
- `src/entities/` contient les GameObjects créés à la demande (`Bullet`, `SpecialEnergyParticle`, `ExplosionParticle` et `Enemy`) sans état partagé au niveau du module.
- `src/scenes/` orchestre le cycle de vie du jeu : chargement, création, entrées, collisions et effets.
- `src/monitoring/` fournit des mesures légères du tas JavaScript et du temps de travail de la scène.
- `src/systems/PlayerRespawnController.js` porte le cycle de collision, réapparition et invincibilité du joueur.
- `src/ui/ProfilingHud.js` rend les indicateurs à l'écran sans les mélanger à la logique de jeu.
- `src/main.js` est volontairement réduit au démarrage du jeu.

## Scénario de profilage

Ce projet contient volontairement trois memory leaks : les tirs manqués continuent hors écran, les particles d’attaque spéciale traversent l’espace sans fin, et les débris d’explosion fondent sans jamais être détruits. Le dossier `_clean-code/` conserve la version saine de référence, qui crée les mêmes GameObjects à la demande puis les détruit sur chaque chemin de sortie.

Le HUD affiche le tas JavaScript lorsqu'il est exposé par le navigateur, ainsi que le temps CPU JavaScript passé dans la méthode `update` de la scène et son pourcentage du budget d'une image à 60 Hz. Ce n'est pas le CPU total du processus : utilisez le moniteur de performances ou un enregistrement DevTools pour cette mesure globale.
