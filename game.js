/* ====================================
   game.js — "Kitty Runner" Canvas Endless Runner
   ==================================== */
(function () {
    'use strict';

    /* --- Constants --- */
    var GRAVITY = 0.9;
    var JUMP_VEL = -17;
    var SCORE_PER_FRAME = 0.33;
    var COIN_PER_SCORE = 100;
    var START_SPEED = 5;
    var MAX_SPEED = 14;
    var GROUND_HEIGHT_RATIO = 0.18;
    var KITTY_SIZE = 80;
    var KITTY_SPRITE_SIZE = 100;
    var MONSTER_W = 44;
    var MONSTER_H = 64;
    var MONSTER_SPRITE_W = 60;
    var MONSTER_SPRITE_H = 80;
    var MIN_GAP = 180;
    var MAX_GAP = 350;
    var STAR_COUNT = 40;

    /* --- State --- */
    var canvas, ctx;
    var W, H, dpr;
    var groundY;
    var kittyX, kittyY, kittyVY;
    var isJumping, isGameOver, isGameStarted, isRunning;
    var score, coinsThisRound, lastCoinAt;
    var speed;
    var obstacles;
    var nextObstacleIn;
    var frameCount;
    var stars;
    var groundOffset;
    var particles;
    var gameOverTimeout;

    /* --- Sprites --- */
    var kittyRunFrames = [];
    var kittyJumpImg = null;
    var kittyUseFallback = false;
    var monsterFrames = [[], []]; // 2 types × 3 frames
    var monsterUseFallback = [false, false];
    var kittyFrame = 0;
    var kittyAnimTimer = 0;

    /* --- Load Images --- */
    function loadImage(src) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () { resolve(img); };
            img.onerror = function () { resolve(null); };
            img.src = src;
        });
    }

    function loadAllSprites() {
        var promises = [];
        // Kitty run frames
        for (var i = 1; i <= 3; i++) {
            promises.push(loadImage('assets/images/kitty_run' + i + '.png'));
        }
        promises.push(loadImage('assets/images/kitty_jump.png'));
        // Monster frames
        for (var t = 1; t <= 2; t++) {
            for (var f = 1; f <= 3; f++) {
                promises.push(loadImage('assets/images/monster' + t + '_f' + f + '.png'));
            }
        }

        Promise.all(promises).then(function (imgs) {
            // Kitty
            for (var i = 0; i < 3; i++) {
                kittyRunFrames[i] = imgs[i];
                if (!imgs[i]) kittyUseFallback = true;
            }
            kittyJumpImg = imgs[3];
            if (!imgs[3]) kittyUseFallback = true;

            // Monsters
            var idx = 4;
            for (var t = 0; t < 2; t++) {
                for (var f = 0; f < 3; f++) {
                    monsterFrames[t][f] = imgs[idx];
                    if (!imgs[idx]) monsterUseFallback[t] = true;
                    idx++;
                }
            }
        });
    }

    loadAllSprites();

    /* --- Init --- */
    function initGame() {
        canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resizeCanvas();
        resetGame();
    }

    function resizeCanvas() {
        if (!canvas) return;
        var container = document.getElementById('game-container');
        if (!container) return;
        var rect = container.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        groundY = H - (H * GROUND_HEIGHT_RATIO);

        // Generate stars
        stars = [];
        for (var i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * (groundY - 20),
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function resetGame() {
        kittyX = 50;
        kittyY = groundY - KITTY_SIZE;
        kittyVY = 0;
        isJumping = false;
        isGameOver = false;
        isGameStarted = false;
        isRunning = false;
        score = 0;
        coinsThisRound = 0;
        lastCoinAt = 0;
        speed = START_SPEED;
        obstacles = [];
        nextObstacleIn = 200;
        frameCount = 0;
        groundOffset = 0;
        particles = [];
        kittyFrame = 0;
        kittyAnimTimer = 0;
        if (gameOverTimeout) {
            clearTimeout(gameOverTimeout);
            gameOverTimeout = null;
        }
        // Show tap hint
        var hint = document.getElementById('game-tap-hint');
        if (hint) hint.classList.remove('hidden');
        // Update displays
        updateGameDisplays();
        // Draw initial frame
        if (ctx) drawFrame();
    }

    /* --- Controls --- */
    function onTap() {
        if (isGameOver) return;
        if (!isGameStarted) {
            isGameStarted = true;
            isRunning = true;
            var hint = document.getElementById('game-tap-hint');
            if (hint) hint.classList.add('hidden');
            requestAnimationFrame(gameLoop);
            return;
        }
        if (!isJumping) {
            kittyVY = JUMP_VEL;
            isJumping = true;
        }
    }

    /* --- Game Loop --- */
    var lastTime = 0;
    function gameLoop(timestamp) {
        if (!isRunning || isGameOver) return;

        // Cap delta to avoid spiraling
        var dt = 1; // simple frame-based

        update();
        drawFrame();

        if (!isGameOver) {
            requestAnimationFrame(gameLoop);
        }
    }

    function update() {
        frameCount++;

        // Score
        score += SCORE_PER_FRAME;
        var currentCoin = Math.floor(score / COIN_PER_SCORE);
        if (currentCoin > lastCoinAt) {
            coinsThisRound += (currentCoin - lastCoinAt);
            lastCoinAt = currentCoin;
            // Coin particle effect
            spawnCoinParticles();
        }

        // Speed ramp
        speed = Math.min(MAX_SPEED, START_SPEED + (score / 200));

        // Kitty physics
        if (isJumping) {
            kittyVY += GRAVITY;
            kittyY += kittyVY;
            if (kittyY >= groundY - KITTY_SIZE) {
                kittyY = groundY - KITTY_SIZE;
                kittyVY = 0;
                isJumping = false;
            }
        }

        // Kitty animation
        kittyAnimTimer++;
        if (kittyAnimTimer >= 6) {
            kittyAnimTimer = 0;
            kittyFrame = (kittyFrame + 1) % 3;
        }

        // Obstacles
        nextObstacleIn -= speed;
        if (nextObstacleIn <= 0) {
            var baseGap = MAX_GAP - (score / 10);
            if (baseGap < MIN_GAP) baseGap = MIN_GAP;
            // Add ±30% randomness so gaps feel unpredictable
            var randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
            nextObstacleIn = baseGap * randomFactor;
            var type = Math.floor(Math.random() * 2);
            obstacles.push({
                x: W + 20,
                type: type,
                frame: 0,
                animTimer: 0,
                bobOffset: Math.random() * Math.PI * 2
            });
        }

        for (var i = obstacles.length - 1; i >= 0; i--) {
            var obs = obstacles[i];
            obs.x -= speed;
            // Animation
            obs.animTimer++;
            if (obs.animTimer >= 10) {
                obs.animTimer = 0;
                obs.frame = (obs.frame + 1) % 3;
            }
            // Remove off-screen
            if (obs.x < -MONSTER_SPRITE_W) {
                obstacles.splice(i, 1);
                continue;
            }
            // Collision
            var kittyHitbox = {
                x: kittyX + 15,
                y: kittyY + 10,
                w: KITTY_SIZE - 30,
                h: KITTY_SIZE - 15
            };
            var bob = Math.sin(frameCount * 0.05 + obs.bobOffset) * 3;
            var monsterHitbox = {
                x: obs.x + 8,
                y: groundY - MONSTER_H + bob,
                w: MONSTER_W,
                h: MONSTER_H - 8
            };
            if (rectsOverlap(kittyHitbox, monsterHitbox)) {
                gameOver();
                return;
            }
        }

        // Particles
        for (var p = particles.length - 1; p >= 0; p--) {
            var pt = particles[p];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 0.3;
            pt.life--;
            if (pt.life <= 0) particles.splice(p, 1);
        }

        // Ground scroll
        groundOffset = (groundOffset + speed) % 40;

        // Stars twinkle
        if (stars) {
            for (var s = 0; s < stars.length; s++) {
                stars[s].alpha = 0.3 + 0.5 * Math.abs(Math.sin(frameCount * stars[s].speed + s));
            }
        }

        updateGameDisplays();
    }

    function rectsOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function gameOver() {
        isGameOver = true;
        isRunning = false;
        spawnHeartParticles();
        // Draw one more frame with particles
        drawFrame();
        // Delay before showing game over screen
        gameOverTimeout = setTimeout(function () {
            var totalCoins = parseInt(localStorage.getItem('totalCoins') || '0', 10);
            totalCoins += coinsThisRound;
            localStorage.setItem('totalCoins', totalCoins.toString());

            // Track result
            var userName = localStorage.getItem('userName') || '';
            if (typeof window.trackGameResult === 'function') {
                window.trackGameResult(userName, Math.floor(score), coinsThisRound, totalCoins);
            }

            // Show game over screen
            if (typeof window.showGameOver === 'function') {
                window.showGameOver(Math.floor(score), coinsThisRound, totalCoins);
            }
        }, 500);
    }

    /* --- Drawing --- */
    function drawFrame() {
        if (!ctx) return;

        // BG gradient
        var grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0E001A');
        grad.addColorStop(0.6, '#1A0030');
        grad.addColorStop(1, '#2D0B4E');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Stars
        if (stars) {
            for (var s = 0; s < stars.length; s++) {
                var st = stars[s];
                ctx.globalAlpha = st.alpha;
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Ground
        ctx.fillStyle = '#E91E8C';
        ctx.fillRect(0, groundY, W, H - groundY);

        // Ground lane markings
        ctx.strokeStyle = 'rgba(255,215,0,0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 15]);
        ctx.lineDashOffset = -groundOffset;
        ctx.beginPath();
        ctx.moveTo(0, groundY + (H - groundY) * 0.4);
        ctx.lineTo(W, groundY + (H - groundY) * 0.4);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ground border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(W, groundY);
        ctx.stroke();

        // Obstacles (monsters)
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            var bob = Math.sin(frameCount * 0.05 + obs.bobOffset) * 3;
            var monsterY = groundY - MONSTER_SPRITE_H + 8 + bob;

            if (!monsterUseFallback[obs.type] && monsterFrames[obs.type][obs.frame]) {
                ctx.drawImage(monsterFrames[obs.type][obs.frame], obs.x, monsterY, MONSTER_SPRITE_W, MONSTER_SPRITE_H);
            } else {
                // Emoji fallback
                ctx.font = '36px serif';
                ctx.textAlign = 'center';
                ctx.fillText(obs.type === 0 ? '🌸' : '🌷', obs.x + MONSTER_SPRITE_W / 2, groundY - 10 + bob);
            }
        }

        // Kitty
        if (!kittyUseFallback) {
            var spriteImg;
            if (isJumping) {
                spriteImg = kittyJumpImg;
            } else {
                spriteImg = kittyRunFrames[kittyFrame];
            }
            if (spriteImg) {
                // Draw the 100x100 sprite, positioned so the cat sits on the ground
                ctx.drawImage(spriteImg, kittyX - 10, kittyY - 10, KITTY_SPRITE_SIZE, KITTY_SPRITE_SIZE);
            } else {
                drawKittyFallback();
            }
        } else {
            drawKittyFallback();
        }

        // Particles
        for (var p = 0; p < particles.length; p++) {
            var pt = particles[p];
            ctx.globalAlpha = pt.life / pt.maxLife;
            ctx.font = pt.size + 'px serif';
            ctx.textAlign = 'center';
            ctx.fillText(pt.emoji, pt.x, pt.y);
        }
        ctx.globalAlpha = 1;
    }

    function drawKittyFallback() {
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐱', kittyX + KITTY_SIZE / 2, kittyY + KITTY_SIZE - 5);
    }

    /* --- Particles --- */
    function spawnCoinParticles() {
        for (var i = 0; i < 8; i++) {
            particles.push({
                x: kittyX + KITTY_SIZE / 2,
                y: kittyY,
                vx: (Math.random() - 0.5) * 8,
                vy: -(Math.random() * 6 + 3),
                life: 30 + Math.floor(Math.random() * 20),
                maxLife: 50,
                emoji: '🪙',
                size: 14 + Math.floor(Math.random() * 8)
            });
        }
    }

    function spawnHeartParticles() {
        for (var i = 0; i < 12; i++) {
            particles.push({
                x: kittyX + KITTY_SIZE / 2,
                y: kittyY + KITTY_SIZE / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: -(Math.random() * 8 + 2),
                life: 40 + Math.floor(Math.random() * 20),
                maxLife: 60,
                emoji: '💔',
                size: 16 + Math.floor(Math.random() * 10)
            });
        }
    }

    /* --- UI Updates --- */
    function updateGameDisplays() {
        var scoreEl = document.getElementById('game-score-display');
        var coinsEl = document.getElementById('game-coins-display');
        if (scoreEl) scoreEl.textContent = '⭐ ' + Math.floor(score);
        var totalCoins = parseInt(localStorage.getItem('totalCoins') || '0', 10);
        if (coinsEl) coinsEl.textContent = '🪙 ' + (totalCoins + coinsThisRound);
    }

    /* --- Canvas Resize Observer --- */
    var resizeObserver = null;
    function observeGameScreen() {
        var gameScreen = document.getElementById('screen-game');
        if (!gameScreen) return;

        if (typeof MutationObserver !== 'undefined') {
            resizeObserver = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].attributeName === 'class') {
                        if (gameScreen.classList.contains('active')) {
                            setTimeout(function () {
                                resizeCanvas();
                                resetGame();
                            }, 50);
                        }
                    }
                }
            });
            resizeObserver.observe(gameScreen, { attributes: true });
        }
    }

    /* --- Public API --- */
    window.initGame = initGame;
    window.resetGame = resetGame;
    window.onGameTap = onTap;
    window.observeGameScreen = observeGameScreen;

    // Bind tap/click on canvas
    document.addEventListener('DOMContentLoaded', function () {
        var gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.addEventListener('click', onTap);
            gameContainer.addEventListener('touchstart', function (e) {
                e.preventDefault();
                onTap();
            }, { passive: false });
        }
        observeGameScreen();
    });

})();
