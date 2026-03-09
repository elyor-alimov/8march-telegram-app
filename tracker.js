/* ====================================
   tracker.js — Google Sheets Integration
   ==================================== */
(function () {
    'use strict';

    // Paste your Google Apps Script deployment URL here:
    var TRACKER_SCRIPT_URL = '';

    function trackGameResult(name, score, coinsEarned, totalCoins) {
        if (!TRACKER_SCRIPT_URL) return;
        try {
            fetch(TRACKER_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'game',
                    name: name || '',
                    score: score || 0,
                    coinsEarned: coinsEarned || 0,
                    totalCoins: totalCoins || 0
                })
            }).catch(function () { /* silent */ });
        } catch (e) { /* silent */ }
    }

    function trackPrizeClaim(name, prize, coinsSpent, totalCoins) {
        if (!TRACKER_SCRIPT_URL) return;
        try {
            fetch(TRACKER_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'claim',
                    name: name || '',
                    prize: prize || '',
                    coinsSpent: coinsSpent || 0,
                    totalCoins: totalCoins || 0
                })
            }).catch(function () { /* silent */ });
        } catch (e) { /* silent */ }
    }

    window.trackGameResult = trackGameResult;
    window.trackPrizeClaim = trackPrizeClaim;
})();
