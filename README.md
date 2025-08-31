# Mewnbeam’s Adventure

A black-cat-themed deckbuilder built for js13kgames 2025.

## How to Play

1. Click or drag a card to play it
2. Repeat step 1
3. Click 'End Turn' when you're done playing cards
4. Good luck!

## Actions & Mana

At the start of every turn you reset to 2 actions (pink diamond) and gain 1 mana (blue circle). Mana is carried over between turns, whereas actions are not.

Actions and Mana are used to pay for cards. Each card lists its cost in the top left.

## Card Keywords

Some keywords that appear on cards:
* **Attack X**: Do X damage to the targeted enemy.
* **Bleed X**: Apply X bleed to the target enemy. Bleed damages enemies before the start of their turn, then decreases by 1.
* **Cantrip**: This card is played automatically when drawn.
* **Damage self X**: Damage yourself for X.
* **Dodge X**: Avoid the next X enemy attacks.
* **Draw X**: Draw this many cards.
* **Exhaust**: Remove this card from play this fight.
* **Gain X Actions/Mana**: Gain the specified resources.
* **Ghostly**: A version of a card that costs 0/0 and exhausts after played.
* **Heal X**: Heal yourself for X.
* **Pass**: Ends your turn.
* **Splash Attack X**: Do X damage to enemies adjacent to the targeted one.
* **Stun**: Prevent the targeted enemy's action this turn.
* **...to all**: Always targets all enemies.
* **...to the left enemy**: Always targets the leftmost enemy.

## Enemy Abilities:

Some enemies have an extra ability listed next to their name:
* 🛑X (Weaselly): After taking attack damage, gain dodge X.
* 🛡️ (Defender): This enemy must be targeted before any others.
* 🐍 (Slippery): Starts each turn with **dodge 1**.

## Enemy Actions:

The action an enemy will take on its turn is listed below it:
* 🗡️ X: Attack for X.
* 🧪 X: Poison you for X. Poison damages you at the start of your turn, then decreases by 1.
* 🛡️ X: Gain X block. Each block prevents a single point of attack damage, then goes away at the start of the enemy's next turn.
* 💖 X: Heal self for X.
* Summon [icon]: Summon the specified enemies.
* ◄ [action] ►: The action applies to all enemies, including self.
