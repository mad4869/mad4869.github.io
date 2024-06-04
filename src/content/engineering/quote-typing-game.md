---
title: Quote Typing Game
description: A simple typing game built using React, Vite, and Typescript.
date: 2023-11-05
image: ./assets/quote-typing-game/quote-typing-game.png
categories: ['React', 'Web Development']
repo: https://github.com/mad4869/quote-typing-game
---

## Rules

The player should type as many words as they can within a 60-second timeframe.

## Demo

[quote-typing-game.vercel.app](https://quote-typing-game.vercel.app/) (also available as [Progressive Web App](https://github.com/mad4869/quote-typing-game-pwa))

![Welcome screen](./assets/quote-typing-game/initial.png)

## API

This app utilizes the __Quote API__ provided by [type.fit](https://type.fit/)

## Requirements

The typing game should have the following features:

1. The target text that the player should type in the input field to gain scores.
2. An indicator of the current target word.
3. An error alert when the player makes a typo.
4. A 60-second countdown to keep track of the remaining time for the player's playtime.
5. A final score review once the game is complete.

## Test Case

### 1. Target text, target word indicator, and the countdown

![Countdown safe indicator](./assets/quote-typing-game/safe-count.png)
![Countdown caution indicator](./assets/quote-typing-game/caution-count.png)
![Countdown danger indicator](./assets/quote-typing-game/danger-count.png)

### 2. Error alert

![No alert when there is no typo](./assets/quote-typing-game/not-typo.png)
![Error alert when a typo is detected](./assets/quote-typing-game/typo.png)

### 3. Final score review

![Final score review](./assets/quote-typing-game/review.png)

## Conclusion/Future Work

__Quote Typing Game__ is a simple typing game constructed using React, Vite, and Typescript. In this game, the player's objective is to type as many words as possible within a 60-second timeframe. It boasts features such as a target word indicator and an error alert to aid the player in achieving their goal. However, there is ample room for enhancing the player experience through the incorporation of additional features, including:

- An option to switch the text category to something other than a quote.
- An option to adjust the duration of the gameplay timeframe.

These features can make the typing game even more engaging and enjoyable.
