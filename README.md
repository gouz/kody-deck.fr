# Kody

![kody](https://user-images.githubusercontent.com/219936/122676928-5ee6de00-d1e0-11eb-92c9-aacd789ab6e2.png)

## Idées & Concepts

### Origine

Nous avons des enfants, et nous codons.

> Mes enfants sont jeunes et ils aiment les LEGO&reg;, les cartes Pokémon, MineCraft et le dessin (le grand veut être un Mangaka).
> Le plus âgé (8 ans) a du temps libre à l'école pour faire ce qu'il veut en lecture ou en dessin, mais il veut apprendre d'autres choses comme le codage mais il ne peut pas utiliser l'ordinateur de la classe.
> Ma femme m'a dit: "Comment peut-il utiliser Scratch sans ordinateur, peut-être avec des cartes ?"
> Après un entretien avec sa maîtresse, il peut prendre des cartes pour apprendre le code. Mais ce n'était qu'une idée.
>
> Mon deuxième (4 ans) veut toujours faire comme son frère, alors j'imagine un jeu, ludique pour l'école, qui peut être joué par un enfant de 4 ans et instructif pour un enfant de 7 ans.
>
> @gouz

### Problématique

Alors, comment apprendre le code, seul, sans écran et avec des cartes?

1. Apprendre à coder est optimiste
1. Apprendre des concepts de codage comme AND, OR, IF, LOOP, ... est plus raisonnable
1. Apprendre seul
1. Les parents conviennent qu'il y a trop d'écran pour les enfants, il est donc préférable d'apprendre sans écran
1. Créez un jeu de cartes pour prendre de nombreuses cartes à l'école, qui doit être compact car peu de place sur le bureau

### Concepts

Empiler des cartes pour générer un dessin pour vérifier s'il correspond à l'exercice.

### Idées

- comme un livre où le lecteur est le héros, le dessin du résultat peut être trouvé dans le livre pour continuer une histoire
- la taille des cartes est aussi grande qu'une carte pokémon, facile à manipuler, facile à transporter, ne prend pas sa place sur le bureau
- l'histoire peut être une histoire de pirate avec une chasse au trésor
- "if then else" peut être représentatif d'un choix du joueur
- une carte peut être une action (déplacer 1 case, tourner à gauche, tourner à droite, ...)
- avec peut imaginer que vous avez 4 mouvements identiques à faire, mais seulement 3 cartes peuvent le réaliser, vous devez donc utiliser la carte en boucle
- le jeu, où les cartes sont stockées, peut être le plateau du jeu
- une carte est composée d'un nom, d'une grille (avec des trous ou unie), d'une couleur, et doit être empilable avec une autre carte
- Différentes histoires doivent être écrites, et elle / il peut l'écrire / la sienne
- La grille représente 0 & 1
- Certaines histoires de base peuvent être écrites pour apprendre les travaux du jeu de cartes, avec un niveau de difficulté
- Comme des SmartGames[https://www.oxybul.com/jeux-de-societe/casse-tete/casse-tete-en-quete-de-pepites/produit/336815?cmpid=SN-GOO-SmartShopping-all-3&gclsrc=ds], imaginez quelques scripts à écrire pour résoudre la mission

### Liste des types de cartes à imaginer

- AND => ET
- OR => OU
- TRUE => VRAI
- FALSE => FAUX
- IF => SI
- ELSE => SINON
- END IF => FIN SI
- LOOP => BOUCLE
- END LOOP => FIN BOUCLE
- MOVE => AVANCER
- TURN => TOURNER
- LEFT => GAUCHE
- RIGHT => DROITE
- UP => HAUT
- DOWN => BAS
- PIRATE => PIRATE
- CHEST => COFFRE
- SLEEP => DORMIR

## Installation

Ce dépôt dispose d'un générateur de cartes et "deck" (boitier de transport et de jeu).
`nodejs` est prérequis pour l'utilisation de ce générateur.

Puis faire un :

```
pnpm install
```

## Lancer le serveur de test

Ce projet tourne avec parcelJS.

```
pnpm run dev
```

## Créer son propre deck

Le fichier `src/json/deck.json` permet de générer l'ensemble des cartes et boîtier.

Il est structuré de la manière suivante :

```json
{
  "cards": [
    {
      "name": "pirate",
      "color": "#fa2f3e",
      "code": [
        "00000000",
        "00000000",
        "00000000",
        "00100100",
        "00000000",
        "00011000",
        "00000000",
        "00000000",
        "00000000",
        "00000000"
      ]
    }
    // ...
  ]
}
```

Dans le code, les `0` représentent les trous, les `1` les parties pleines.

La couleur est juste esthétique.

La palette de couleur validée pour les daltoniens est la suivante :

- rouge: #fa2f3e
- gris: #a7a9a8
- noir: #000000
- blanc: #ffffff
- orange: #ff7a42
- vert: #05aa42
- bleu: #68b6f4
- jaune: #e4d109

## @TODO

- Faire des codes utilisables et combinables
- Rédiger les "stories"
