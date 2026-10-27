/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "64966c643b1bf10abe01d2aba48916bc"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ed7f8085646396b4c4563737bbe6471e"
  }, {
    "url": "pwa-192x192.png",
    "revision": "a4aa31ec4a9a2629ad9008147cd5ca9f"
  }, {
    "url": "index.html",
    "revision": "3591b13d7948580995951fec21b22962"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "48dee37c4a622069eb9ffa1932d3d5e0"
  }, {
    "url": "assets/nutria-portrait.jpg",
    "revision": null
  }, {
    "url": "assets/nutria-cart.jpg",
    "revision": null
  }, {
    "url": "assets/index-ClgnM7Mc.css",
    "revision": null
  }, {
    "url": "assets/index-BhFi7CFZ.js",
    "revision": null
  }, {
    "url": "assets/aistudio/Captura_de_pantalla_2026-10-26_a_les_23.18.05_685591ef.png",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "48dee37c4a622069eb9ffa1932d3d5e0"
  }, {
    "url": "pwa-192x192.png",
    "revision": "a4aa31ec4a9a2629ad9008147cd5ca9f"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ed7f8085646396b4c4563737bbe6471e"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "64966c643b1bf10abe01d2aba48916bc"
  }, {
    "url": "assets/nutria-cart.jpg",
    "revision": "7e57c842bf170405bec0ac206600eaf6"
  }, {
    "url": "assets/nutria-portrait.jpg",
    "revision": "a4937372e543f012ddc9a81c5379bdad"
  }, {
    "url": "manifest.webmanifest",
    "revision": "885e800da825618a3116be124f0662c5"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
