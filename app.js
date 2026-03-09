/* ====================================
   app.js — Main Navigation, Screen Logic,
   Gift Box, Reasons, Shop, Music
   ==================================== */
(function () {
    'use strict';

    /* === TELEGRAM WEBAPP === */
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    /* === SCREEN NAVIGATION === */
    var allScreens = [];

    function showScreen(id) {
        if (!allScreens.length) {
            allScreens = document.querySelectorAll('.screen');
        }
        allScreens.forEach(function (s) {
            s.classList.remove('active');
        });
        var target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
        }
    }

    /* === INIT ON DOM READY === */
    document.addEventListener('DOMContentLoaded', function () {
        allScreens = document.querySelectorAll('.screen');

        // Check saved language
        var savedLang = localStorage.getItem('lang');
        if (savedLang) {
            startLoading();
        }
        // else: language select screen is already active

        /* --- Language Select --- */
        document.getElementById('btn-lang-ru')?.addEventListener('click', function () {
            localStorage.setItem('lang', 'ru');
            startLoading();
        });
        document.getElementById('btn-lang-uz')?.addEventListener('click', function () {
            localStorage.setItem('lang', 'uz');
            startLoading();
        });

        /* --- Name Entry --- */
        document.getElementById('btn-name-submit')?.addEventListener('click', submitName);
        document.getElementById('input-name')?.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') submitName();
        });

        /* --- Menu Cards --- */
        document.getElementById('card-reasons')?.addEventListener('click', function () {
            showScreen('screen-intro-reasons');
        });
        document.getElementById('card-gift')?.addEventListener('click', function () {
            showScreen('screen-intro-gift');
        });
        document.getElementById('card-game')?.addEventListener('click', function () {
            showScreen('screen-intro-game');
        });
        document.getElementById('card-shop')?.addEventListener('click', function () {
            openShop();
        });

        /* --- Intro Screen Buttons --- */
        document.getElementById('btn-go-reasons')?.addEventListener('click', function () {
            openReasons();
        });
        document.getElementById('btn-go-gift')?.addEventListener('click', function () {
            openGiftBox();
        });
        document.getElementById('btn-go-game')?.addEventListener('click', function () {
            startGame();
        });

        /* --- Back Buttons --- */
        document.getElementById('btn-back-intro-reasons')?.addEventListener('click', goMenu);
        document.getElementById('btn-back-intro-gift')?.addEventListener('click', goMenu);
        document.getElementById('btn-back-intro-game')?.addEventListener('click', goMenu);
        document.getElementById('btn-back-reasons')?.addEventListener('click', goMenu);
        document.getElementById('btn-back-gift')?.addEventListener('click', goMenu);
        document.getElementById('btn-back-game')?.addEventListener('click', goMenu);
        document.getElementById('btn-back-shop')?.addEventListener('click', goMenu);

        /* --- Reasons Complete --- */
        document.getElementById('btn-reasons-complete')?.addEventListener('click', goMenu);

        /* --- Gift Complete --- */
        document.getElementById('btn-gift-complete')?.addEventListener('click', goMenu);

        /* --- Game Over Buttons --- */
        document.getElementById('btn-play-again')?.addEventListener('click', function () {
            startGame();
        });
        document.getElementById('btn-gameover-shop')?.addEventListener('click', function () {
            openShop();
        });
        document.getElementById('btn-gameover-menu')?.addEventListener('click', goMenu);

        /* --- Music Toggle --- */
        document.getElementById('btn-music-toggle')?.addEventListener('click', toggleMusic);

        /* --- Modals --- */
        document.getElementById('modal-flower-close')?.addEventListener('click', closeFlowerModal);
        document.getElementById('modal-flower')?.addEventListener('click', function (e) {
            if (e.target === this) closeFlowerModal();
        });
        document.getElementById('modal-flower-toggle')?.addEventListener('click', toggleFlowerDesc);

        document.getElementById('modal-special-close')?.addEventListener('click', closeSpecialModal);
        document.getElementById('modal-special')?.addEventListener('click', function (e) {
            if (e.target === this) closeSpecialModal();
        });

        document.getElementById('modal-claim-close')?.addEventListener('click', closeClaimModal);
        document.getElementById('modal-claim')?.addEventListener('click', function (e) {
            if (e.target === this) closeClaimModal();
        });
        document.getElementById('modal-claim-cancel')?.addEventListener('click', closeClaimModal);

        /* --- Floating Petals --- */
        createFloatingPetals();
    });

    /* === LOADING === */
    function startLoading() {
        showScreen('screen-loading');
        applyTranslations(localStorage.getItem('userName') || '');
        var progressBar = document.getElementById('progress-bar');
        var percentText = document.getElementById('loading-percent');
        var progress = 0;
        var interval = setInterval(function () {
            progress += 2;
            if (progress > 100) progress = 100;
            if (progressBar) progressBar.style.width = progress + '%';
            if (percentText) percentText.textContent = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(function () {
                    var savedName = localStorage.getItem('userName');
                    if (savedName) {
                        goMenu();
                    } else {
                        showScreen('screen-name');
                    }
                }, 200);
            }
        }, 40);
    }

    /* === NAME === */
    function submitName() {
        var input = document.getElementById('input-name');
        var name = (input?.value || '').trim();
        if (!name) return;
        localStorage.setItem('userName', name);
        applyTranslations(name);
        goMenu();
    }

    /* === MENU === */
    function goMenu() {
        showScreen('screen-menu');
        var name = localStorage.getItem('userName') || '';
        applyTranslations(name);
        var nameEl = document.getElementById('menu-user-name');
        if (nameEl) nameEl.textContent = name;
        updateCoinsDisplay();
    }

    function updateCoinsDisplay() {
        var totalCoins = parseInt(localStorage.getItem('totalCoins') || '0', 10);
        var displays = document.querySelectorAll('#menu-coins, #shop-coins, #game-coins-display');
        displays.forEach(function (el) {
            if (el) el.textContent = '🪙 ' + totalCoins;
        });
    }

    /* === FLOATING PETALS === */
    function createFloatingPetals() {
        var container = document.getElementById('floating-petals');
        if (!container) return;
        var emojis = ['♥', '★', '♥', '★', '♥', '★', '✿', '❀'];
        for (var i = 0; i < 8; i++) {
            var petal = document.createElement('span');
            petal.className = 'floating-petal';
            petal.textContent = emojis[i % emojis.length];
            petal.style.left = (10 + Math.random() * 80) + '%';
            petal.style.animationDelay = (Math.random() * 8) + 's';
            petal.style.fontSize = (14 + Math.random() * 8) + 'px';
            container.appendChild(petal);
        }
    }

    /* === 101 REASONS === */
    var reasonsBuilt = false;

    function openReasons() {
        showScreen('screen-reasons');
        if (!reasonsBuilt) {
            buildReasonsGrid();
            reasonsBuilt = true;
        }
        updateReasonsUI();
    }

    function buildReasonsGrid() {
        var grid = document.getElementById('reasons-grid');
        if (!grid) return;
        grid.innerHTML = '';
        var name = localStorage.getItem('userName') || '';
        var openedReasons = getOpenedReasons();

        for (var i = 0; i < 101; i++) {
            var card = document.createElement('div');
            card.className = 'reason-card';
            card.setAttribute('data-index', i.toString());

            var numSpan = document.createElement('span');
            numSpan.className = 'reason-number';
            numSpan.textContent = (i + 1).toString();

            var textSpan = document.createElement('span');
            textSpan.className = 'reason-text';
            textSpan.textContent = getReason(i, name);

            card.appendChild(numSpan);
            card.appendChild(textSpan);

            if (openedReasons.indexOf(i) !== -1) {
                card.classList.add('opened');
            }

            card.addEventListener('click', (function (index) {
                return function () {
                    flipReason(index);
                };
            })(i));

            grid.appendChild(card);
        }
    }

    function flipReason(index) {
        var openedReasons = getOpenedReasons();
        if (openedReasons.indexOf(index) !== -1) return; // already opened

        openedReasons.push(index);
        localStorage.setItem('openedReasons', JSON.stringify(openedReasons));

        var card = document.querySelector('.reason-card[data-index="' + index + '"]');
        if (card) {
            card.classList.add('opened');
            // Update text with current name
            var textSpan = card.querySelector('.reason-text');
            if (textSpan) {
                var name = localStorage.getItem('userName') || '';
                textSpan.textContent = getReason(index, name);
            }
        }

        updateReasonsUI();

        // Check completion
        if (openedReasons.length >= 101) {
            setTimeout(function () {
                var overlay = document.getElementById('reasons-complete');
                if (overlay) overlay.classList.remove('hidden');
            }, 300);
        }
    }

    function updateReasonsUI() {
        var openedReasons = getOpenedReasons();
        var counter = document.getElementById('reasons-counter');
        if (counter) counter.textContent = openedReasons.length + '/101';
    }

    function getOpenedReasons() {
        try {
            return JSON.parse(localStorage.getItem('openedReasons') || '[]');
        } catch (e) {
            return [];
        }
    }

    /* === GIFT BOX === */
    var giftsBuilt = false;

    function openGiftBox() {
        showScreen('screen-gift');
        if (!giftsBuilt) {
            buildGiftGrid();
            giftsBuilt = true;
        }
        updateGiftUI();
    }

    function buildGiftGrid() {
        var grid = document.getElementById('gift-grid');
        if (!grid) return;
        grid.innerHTML = '';
        var openedGifts = getOpenedGifts();

        for (var i = 0; i < 9; i++) {
            var box = document.createElement('div');
            box.className = 'gift-box';
            box.setAttribute('data-index', i.toString());

            var emoji = document.createElement('span');
            emoji.className = 'gift-emoji';
            emoji.textContent = '🎁';

            var content = document.createElement('div');
            content.className = 'gift-content';

            if (i < 8) {
                // Flower gift
                var flowers = getFlowers();
                var flower = flowers[i];
                var img = document.createElement('img');
                img.className = 'gift-flower-img';
                img.src = 'assets/images/flower' + (i + 1) + '.png';
                img.alt = flower.name;
                img.onerror = function () {
                    this.style.display = 'none';
                    var parent = this.parentElement;
                    if (parent && !parent.querySelector('.gift-flower-fallback')) {
                        var fallback = document.createElement('span');
                        fallback.className = 'gift-flower-fallback';
                        fallback.style.fontSize = '36px';
                        fallback.textContent = '🌸';
                        parent.insertBefore(fallback, parent.firstChild);
                    }
                };
                var nameSpan = document.createElement('span');
                nameSpan.className = 'gift-flower-name';
                nameSpan.textContent = flower.name;
                content.appendChild(img);
                content.appendChild(nameSpan);
            } else {
                // Special gift (9th)
                var specialSpan = document.createElement('span');
                specialSpan.className = 'gift-flower-name';
                specialSpan.textContent = '💕 ???';
                content.appendChild(specialSpan);
            }

            box.appendChild(emoji);
            box.appendChild(content);

            if (openedGifts.indexOf(i) !== -1) {
                box.classList.add('opened');
            }

            box.addEventListener('click', (function (index) {
                return function () {
                    openGift(index);
                };
            })(i));

            grid.appendChild(box);
        }
    }

    function openGift(index) {
        var openedGifts = getOpenedGifts();
        if (openedGifts.indexOf(index) !== -1) {
            // Already opened — show modal again
            if (index < 8) {
                showFlowerModal(index);
            } else {
                showSpecialModal();
            }
            return;
        }

        openedGifts.push(index);
        localStorage.setItem('openedGifts', JSON.stringify(openedGifts));

        var box = document.querySelector('.gift-box[data-index="' + index + '"]');
        if (box) {
            box.classList.add('opened');
        }

        updateGiftUI();

        // Show modal
        if (index < 8) {
            showFlowerModal(index);
        } else {
            showSpecialModal();
        }

        // Check completion — only show overlay the very first time
        if (openedGifts.length >= 9 && !localStorage.getItem('giftCompleteSeen')) {
            localStorage.setItem('giftCompleteSeen', '1');
            setTimeout(function () {
                var overlay = document.getElementById('gift-complete');
                if (overlay) overlay.classList.remove('hidden');
            }, 500);
        }
    }

    function updateGiftUI() {
        var openedGifts = getOpenedGifts();
        var counter = document.getElementById('gift-counter');
        if (counter) counter.textContent = openedGifts.length + '/9';
    }

    function getOpenedGifts() {
        try {
            return JSON.parse(localStorage.getItem('openedGifts') || '[]');
        } catch (e) {
            return [];
        }
    }

    /* === FLOWER MODAL === */
    function showFlowerModal(index) {
        var flowers = getFlowers();
        var flower = flowers[index];
        if (!flower) return;

        document.getElementById('modal-flower-img').src = 'assets/images/flower' + (index + 1) + '.png';
        document.getElementById('modal-flower-img').onerror = function () {
            this.style.display = 'none';
        };
        document.getElementById('modal-flower-name').textContent = flower.name;
        document.getElementById('modal-flower-desc').textContent = flower.desc;
        document.getElementById('modal-flower-desc').classList.add('hidden');
        document.getElementById('modal-flower').classList.remove('hidden');
    }

    function closeFlowerModal() {
        document.getElementById('modal-flower').classList.add('hidden');
    }

    function toggleFlowerDesc() {
        var desc = document.getElementById('modal-flower-desc');
        if (desc) desc.classList.toggle('hidden');
    }

    /* === SPECIAL MODAL === */
    function showSpecialModal() {
        var modal = document.getElementById('modal-special');
        modal.classList.remove('hidden');
        modal.classList.add('modal-centered');
        var video = document.getElementById('modal-special-video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(function () { /* silent */ });
        }
    }

    function closeSpecialModal() {
        document.getElementById('modal-special').classList.add('hidden');
        var video = document.getElementById('modal-special-video');
        if (video) video.pause();
    }

    /* === GAME === */
    function startGame() {
        showScreen('screen-game');
        setTimeout(function () {
            if (typeof window.initGame === 'function') {
                window.initGame();
            }
        }, 100);
    }

    window.showGameOver = function (score, coins, total) {
        showScreen('screen-gameover');
        document.getElementById('gameover-score').textContent = score;
        document.getElementById('gameover-coins').textContent = '🪙 ' + coins;
        document.getElementById('gameover-total').textContent = '🪙 ' + total;
        updateCoinsDisplay();
    };

    /* === SHOP === */
    function openShop() {
        showScreen('screen-shop');
        updateCoinsDisplay();
        buildShopList();
    }

    function buildShopList() {
        var list = document.getElementById('shop-list');
        if (!list) return;
        list.innerHTML = '';
        var prizes = getPrizes();

        prizes.forEach(function (prize, index) {
            var card = document.createElement('div');
            card.className = 'shop-card';

            var h3 = document.createElement('h3');
            h3.textContent = prize.name;

            var venue = document.createElement('p');
            venue.className = 'shop-venue';
            venue.textContent = prize.venue;

            var cost = document.createElement('p');
            cost.className = 'shop-cost';
            cost.textContent = '🪙 ' + prize.cost;

            var btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = t('shopClaim');
            btn.addEventListener('click', function () {
                attemptClaim(prize);
            });

            card.appendChild(h3);
            card.appendChild(venue);
            card.appendChild(cost);
            card.appendChild(btn);
            list.appendChild(card);
        });
    }

    function attemptClaim(prize) {
        var totalCoins = parseInt(localStorage.getItem('totalCoins') || '0', 10);
        if (totalCoins < prize.cost) {
            showToast(t('shopNotEnough'));
            return;
        }
        showClaimModal(prize);
    }

    /* === CLAIM MODAL === */
    var currentClaimPrize = null;

    function showClaimModal(prize) {
        currentClaimPrize = prize;
        document.getElementById('modal-claim-title').textContent = prize.name;
        document.getElementById('modal-claim-cost').textContent = '🪙 ' + prize.cost;
        document.getElementById('modal-claim').classList.remove('hidden');

        // Set up claim links with { once: true }
        var tgLink = document.getElementById('modal-claim-tg');
        var igLink = document.getElementById('modal-claim-ig');

        tgLink?.addEventListener('click', function () {
            completeClaim(prize);
        }, { once: true });

        igLink?.addEventListener('click', function () {
            completeClaim(prize);
        }, { once: true });
    }

    function completeClaim(prize) {
        var totalCoins = parseInt(localStorage.getItem('totalCoins') || '0', 10);
        totalCoins -= prize.cost;
        if (totalCoins < 0) totalCoins = 0;
        localStorage.setItem('totalCoins', totalCoins.toString());
        updateCoinsDisplay();

        // Track
        var userName = localStorage.getItem('userName') || '';
        if (typeof window.trackPrizeClaim === 'function') {
            window.trackPrizeClaim(userName, prize.name, prize.cost, totalCoins);
        }

        closeClaimModal();
        goMenu();
    }

    function closeClaimModal() {
        document.getElementById('modal-claim').classList.add('hidden');
        currentClaimPrize = null;
    }

    /* === TOAST === */
    function showToast(message) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(function () {
            toast.classList.add('hidden');
        }, 2000);
    }

    /* === MUSIC === */
    var musicPlaying = false;

    function toggleMusic() {
        var audio = document.getElementById('bg-music');
        var btn = document.getElementById('btn-music-toggle');
        if (!audio) return;

        if (musicPlaying) {
            audio.pause();
            musicPlaying = false;
            if (btn) btn.textContent = t('musicOn');
        } else {
            audio.play().then(function () {
                musicPlaying = true;
                if (btn) btn.textContent = t('musicOff');
            }).catch(function () {
                // Browser blocked autoplay
                musicPlaying = false;
            });
        }
    }

})();
