# Monopoly Web

A browser-based Monopoly game built with plain JavaScript. Live at [URL coming soon].

## What it is

A browser port of a university Java project (CM6123 + CM6121, Cardiff University). The Java version established the game rules; this version reimplements them visually for the browser.

## Features

- Circular board generated for any size from 10 to 50 squares
- 2 to 10 players, each with a coloured token
- Property buying and rent collection (rent is 1/3 of purchase price)
- Station teleportation and cycle squares with move restrictions
- £200 bonus for passing Home (on both regular moves and station teleports)
- Bankruptcy with automatic property sales at half price
- Winner declaration with tie detection
- Mid-game restart
- Distinct square types (Home, stations, properties, roads) with a pastel palette
- Coloured borders on owned properties to show ownership

## How to run it

Setup:

1. Clone the repository
2. Open `index.html` in any modern browser

Playing:

1. Enter a board size (10–50)
2. Enter the number of players (2–10)
3. Click Start Game

## Tech stack

- HTML5
- CSS3
- Plain JavaScript — no framework, no build tools

## Design notes

The board is a ring of absolutely positioned squares. Each square is placed using three CSS transforms in sequence: `rotate → translate → rotate`. The first rotation points the square at its position on the circle, the translation walks it out to the radius, and the second rotation turns it upright. This produces a correct board for any size from 10 to 50 — no hardcoded positions.

All game state lives in JavaScript variables (`playerList`, `squareData`, `cycleSquares`).

When a player lands on an unowned property, the game pauses on a modal prompt. The turn pointer deliberately does not advance until the player has decided — otherwise the turn indicator and the next player's roll would be out of sync.

## Background

This is a browser port of a Java Monopoly project completed as coursework at Cardiff University. The Java version is in a separate repository.
