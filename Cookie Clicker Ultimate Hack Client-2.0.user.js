// ==UserScript==
// @name         Cookie Clicker Ultimate Hack Client
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  A sleek draggable hack client with UI for Cookie Clicker
// @author       ChatGPT
// @match        *://orteil.dashnet.org/cookieclicker/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Wait for Game to Load
  function waitForGameReady(callback) {
    const interval = setInterval(() => {
      if (typeof Game !== 'undefined' && Game.ready) {
        clearInterval(interval);
        callback();
      }
    }, 500);
  }

  waitForGameReady(initHackClient);

  function initHackClient() {
    console.log('[🍪 Hack Client] Game loaded!');

    // CSS Styling
    const style = document.createElement('style');
    style.textContent = `
      @keyframes neonGlow {
        0% { box-shadow: 0 0 5px #ffaa33, 0 0 10px #ffaa33, 0 0 20px #ffaa33; }
        50% { box-shadow: 0 0 10px #ffaa55, 0 0 20px #ffaa55, 0 0 30px #ffaa55; }
        100% { box-shadow: 0 0 5px #ffaa33, 0 0 10px #ffaa33, 0 0 20px #ffaa33; }
      }

      #hack-client {
        position: fixed;
        top: 100px;
        right: 100px;
        width: 280px;
        background: rgba(30, 30, 40, 0.95);
        border-radius: 16px;
        padding: 16px;
        color: #ffeedd;
        font-family: Arial, sans-serif;
        z-index: 999999;
        display: none;
        animation: neonGlow 3s infinite;
        cursor: grab;
      }

      #hack-client.minimized {
        height: 40px;
        overflow: hidden;
      }

      #hack-client h2 {
        margin: 0 0 12px;
        text-align: center;
        text-shadow: 0 0 5px #ffaa00aa;
        cursor: grab;
        user-select: none;
      }

      .feature {
        margin: 8px 0;
        display: flex;
        align-items: center;
      }

      .feature input {
        margin-right: 10px;
        transform: scale(1.2);
      }

      #hack-client button {
        margin-top: 8px;
        width: 100%;
        padding: 6px;
        border-radius: 10px;
        background: #ffaa33;
        color: #000;
        font-weight: bold;
        border: none;
        cursor: pointer;
        box-shadow: 0 0 5px #ffaa55aa;
      }

      .confirm-dialog {
        background: #222;
        border-radius: 12px;
        padding: 16px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000000;
        box-shadow: 0 0 15px #ff4444;
        color: #ffeedd;
      }

      .confirm-dialog button {
        margin: 8px;
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: bold;
      }

      .confirm-ok { background: #ff4444; color: #fff; }
      .confirm-cancel { background: #44ff44; color: #000; }
    `;
    document.head.appendChild(style);

    // UI Panel
    const panel = document.createElement('div');
    panel.id = 'hack-client';
    panel.innerHTML = `<h2>🍪 Cookie Hack Client</h2>`;
    document.body.appendChild(panel);

    const features = [
      'Infinite Cookies',
      'Auto Click Big Cookie',
      'Auto Buy Buildings',
      'Auto Buy Upgrades',
      'Golden Cookie Auto Click',
      'Speedhack'
    ];

    const states = {};
    features.forEach(f => states[f] = false);

    // Add checkboxes
    features.forEach(name => {
      const div = document.createElement('div');
      div.className = 'feature';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `feature-${name.replace(/\s+/g, '-')}`;
      input.addEventListener('change', (e) => {
        states[name] = e.target.checked;
        handleToggle(name, e.target.checked);
      });

      const label = document.createElement('label');
      label.textContent = name;

      div.appendChild(input);
      div.appendChild(label);
      panel.appendChild(div);
    });

    // Add 1 Billion button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add 1 Billion Cookies 💰';
    addButton.addEventListener('click', () => {
      Game.cookies += 1e9;
    });
    panel.appendChild(addButton);

    // Unlock all upgrades
    const unlockButton = document.createElement('button');
    unlockButton.textContent = 'Unlock All Upgrades 🔓';
    unlockButton.addEventListener('click', () => {
      for (const u in Game.Upgrades) {
        const upgrade = Game.Upgrades[u];
        if (!upgrade.bought) {
          upgrade.bought = 1;
          Game.UpgradesOwned++;
        }
      }
      Game.upgradesToRebuild = 1;
    });
    panel.appendChild(unlockButton);

    // Reset progress button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Progress ⚠️';
    resetButton.addEventListener('click', () => {
      showResetConfirm();
    });
    panel.appendChild(resetButton);

    // Toggle panel with Right Shift
    let lock = false;
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ShiftRight' && !lock) {
        lock = true;
        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
      }
      if (e.code === 'ControlRight' && !lock) {
        lock = true;
        if (panel.classList.contains('minimized')) {
          panel.classList.remove('minimized');
        } else {
          panel.classList.add('minimized');
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'ShiftRight' || e.code === 'ControlRight') {
        lock = false;
      }
    });

    // Dragging support
    let isDragging = false;
    let offsetX, offsetY;

    panel.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'H2') {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.cursor = 'grabbing';
      }
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.right = 'auto';
      }
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      panel.style.cursor = 'grab';
    });

    // Feature states and intervals
    let intervals = {};

    function handleToggle(name, enable) {
      if (enable) startFeature(name);
      else stopFeature(name);
    }

    function startFeature(name) {
      if (intervals[name]) return;

      switch(name) {
        case 'Infinite Cookies':
          intervals[name] = setInterval(() => Game.cookies = 1e300, 500);
          break;

        case 'Auto Click Big Cookie':
          intervals[name] = setInterval(() => Game.ClickCookie(), 50);
          break;

        case 'Auto Buy Buildings':
          intervals[name] = setInterval(() => {
            Object.values(Game.Objects).forEach(obj => {
              if (!obj.locked && Game.cookies >= obj.getPrice()) obj.buy();
            });
          }, 1000);
          break;

        case 'Auto Buy Upgrades':
          intervals[name] = setInterval(() => {
            Game.UpgradesInStore.forEach(upg => {
              if (Game.cookies >= upg.getPrice()) upg.buy();
            });
          }, 1000);
          break;

        case 'Golden Cookie Auto Click':
          intervals[name] = setInterval(() => {
            Game.shimmers.forEach(s => s.pop());
          }, 500);
          break;

        case 'Speedhack':
          intervals[name] = setInterval(() => {
            Game.fps = 120;
          }, 500);
          break;
      }
    }

    function stopFeature(name) {
      clearInterval(intervals[name]);
      delete intervals[name];
      if (name === 'Speedhack') Game.fps = 30;
    }

    // Confirm Dialog for Reset
    function showResetConfirm() {
      const dialog = document.createElement('div');
      dialog.className = 'confirm-dialog';
      dialog.innerHTML = `
        <p>⚠️ Are you sure you want to reset ALL progress?</p>
        <button class="confirm-ok">OK</button>
        <button class="confirm-cancel">Cancel</button>
      `;
      document.body.appendChild(dialog);

      dialog.querySelector('.confirm-ok').addEventListener('click', () => {
        Game.HardReset();
        document.body.removeChild(dialog);
      });
      dialog.querySelector('.confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(dialog);
      });
    }

    console.log('[🍪 Hack Client] Ready! Use Right Shift to toggle, Right Ctrl to minimize.');
  }
})();
