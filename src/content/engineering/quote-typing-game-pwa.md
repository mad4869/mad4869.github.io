---
title: Quote Typing Game PWA
description: A Progressive Web App version of Quote Typing Game.
date: 2024-06-03
image: ./assets/quote-typing-game-pwa/quote-typing-game-pwa.png
categories: ['React', 'PWA', 'Web Development']
repo: https://github.com/mad4869/quote-typing-game-pwa
---

## Demo

[quote-typing-game.vercel.app/](https://quote-typing-game.vercel.app/)

## Process

### Building Web Manifest

To create a PWA, first we need to build a web manifest that contains all the properties needed to define how the app should look like as a native app. Here I define the web manifest in the `app.webmanifest` file, with all these properties laid out:

```json
{
    "name": "Quote Typing Game",
    "short_name": "Typing Game",
    "description": "A Progressive Web App version of Quote Typing Game",
    "start_url": "https://quote-typing-game.vercel.app/",
    "orientation": "portrait",
    "theme_color": "#560bd8",
    "background_color": "#ffffff",
    "scope": "https://quote-typing-game.vercel.app/",
    "display": "standalone",
    "screenshots": [
        {
            "src": "https://quote-typing-game.vercel.app/ss-wide.png",
            "sizes": "1919x950",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Landing Page Desktop"
        },
        {
            "src": "https://quote-typing-game.vercel.app/ss-narrow.png",
            "sizes": "582x888",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Landing Page Mobile"
        }
    ],
    "icons": [
        {
            "src": "https://quote-typing-game.vercel.app/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "https://quote-typing-game.vercel.app/icon-1024.png",
            "sizes": "1024x1024",
            "type": "image/png"
        },
        {
            "src": "https://quote-typing-game.vercel.app/icon-512-maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ]
}
```

### Configure Service Worker

The second step is to configure a service worker that would act as an internal web server that serves all the web content inside multiple devices. Here I am using __Workbox__ as a tool to generate the service worker as well as configure the caching strategy for all the app assets.

```js
/* global module */

module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{html,js,css,woff2,woff,png,jpg,jpeg,svg,gif,ttf,otf}'
    ],
    swDest: 'dist/sw.js',
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
            },
        },
        {
            urlPattern: /\.(?:woff2|woff|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'fonts',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
                },
            },
        },
        {
            urlPattern: /\.(?:js)$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'javascript',
                expiration: {
                    maxEntries: 50,
                },
            },
        },
        {
            urlPattern: /\.(?:css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'stylesheets',
                expiration: {
                    maxEntries: 50,
                },
            },
        },
        {
            urlPattern: new RegExp('https://type.fit/api/quotes'),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api',
                expiration: {
                    maxEntries: 50,
                },
            },
        },
    ],
};
```

## Conclusion

By building a web manifest and configuring a service worker, the Quote Typing Game is transformed into a PWA. This allows users to install the app on their devices for offline access and a more native-like experience.
