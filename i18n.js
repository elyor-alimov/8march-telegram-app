/* ====================================
   i18n.js — Bilingual translations (RU/UZ)
   Flowers, Prizes, and UI strings
   ==================================== */
(function () {
    'use strict';

    const TRANSLATIONS = {
        ru: {
            // Loading
            loadingTitle: 'Загружаем волшебство...',
            // Name
            nameTitle: '8 Марта — Твой день!',
            nameSubtitle: 'Как тебя зовут?',
            namePlaceholder: 'Введи имя...',
            nameContinue: 'ПРОДОЛЖИТЬ',
            // Menu
            menuGreeting: 'С праздником! 🌸',
            menuReasons: '101 причина',
            menuReasonsDesc: 'Почему ты особенная',
            menuGift: 'Подарочная коробка',
            menuGiftDesc: '9 сюрпризов внутри',
            menuGame: 'Kitty Runner',
            menuGameDesc: 'Беги и собирай монетки',
            menuShop: 'Магазин подарков',
            menuShopDesc: 'Обменяй монетки на призы',
            musicOn: '🎵 Вкл. музыку',
            musicOff: '🔇 Выкл. музыку',
            // Intro screens
            introReasonsTitle: '💌 101 причина',
            introReasonsDesc: 'Мы собрали 101 причину, почему ты — потрясающая. Нажимай на карточки и открывай по одной!',
            introGiftTitle: '🎁 Подарочная коробка',
            introGiftDesc: 'Внутри 9 сюрпризов — открой каждую коробочку и узнай, что внутри!',
            introGameTitle: '🐱 Kitty Runner',
            introGameDesc: 'Помоги котику бежать и собирать монетки! Нажимай на экран, чтобы прыгать. Чем дальше — тем быстрее!',
            introOpen: 'ОТКРЫТЬ',
            introPlay: 'ИГРАТЬ',
            btnBack: 'НАЗАД',
            btnMenu: 'В МЕНЮ',
            // Reasons
            reasonsTitle: '101 причина',
            reasonsComplete: 'Все 101 причина открыты! 🎉',
            reasonsCompleteDesc: 'Ты — невероятная! 💖',
            // Gift
            giftTitle: 'Подарочная коробка',
            giftComplete: 'Все 9 подарков открыты! 🎉',
            giftCompleteDesc: 'С праздником! 💐',
            flowerToggle: 'Подробнее',
            specialTitle: 'Особый сюрприз! 💕',
            // Game
            gameTapHint: 'Нажми чтобы начать!',
            gameOverTitle: 'Игра окончена! 💔',
            gameOverScore: 'Очки:',
            gameOverCoins: 'Монетки:',
            gameOverTotal: 'Всего монеток:',
            gameOverPlayAgain: 'ИГРАТЬ СНОВА',
            gameOverShop: 'МАГАЗИН ПРИЗОВ',
            // Shop
            shopTitle: 'Магазин призов',
            shopClaim: 'ПОЛУЧИТЬ',
            shopNotEnough: 'Недостаточно монеток! 🪙',
            // Claim modal
            claimTelegram: '📩 Написать в Telegram',
            claimInstagram: '📸 Написать в Instagram',
            claimCancel: 'ОТМЕНА',
            // Flowers
            flowers: [
                { name: 'Тюльпан 🌷', desc: 'Тюльпан — символ весны и нежности. Его яркие лепестки приносят радость и напоминают, что красота рождается заново каждый год.' },
                { name: 'Роза 🌹', desc: 'Роза — королева цветов, символ любви и элегантности. Каждый лепесток хранит тепло и страсть.' },
                { name: 'Ромашка 🌼', desc: 'Ромашка — символ чистоты и искренности. Она напоминает о детстве, солнечных днях и простой радости.' },
                { name: 'Гибискус 🏵️', desc: 'Гибискус — символ счастья и возвращения весны. Его нежный аромат наполняет сердце покоем.' },
                { name: 'Пион 🌺', desc: 'Пион — символ богатства и процветания. Его пышные лепестки олицетворяют красоту и изобилие.' },
                { name: 'Подсолнух 🌻', desc: 'Подсолнух — символ верности и оптимизма. Он всегда тянется к солнцу, как мы тянемся к счастью.' },
                { name: 'Лаванда 💜', desc: 'Лаванда — символ скромности и преданности. Её тонкий аромат и нежный цвет покоряют сердца.' },
                { name: 'Сакура 🤍', desc: 'Сакура — символ грации и чистоты. Его цветы наполняют воздух волшебным ароматом.' }
            ],
            // Prizes
            prizes: [
                { name: 'Кофе и круассан ☕', venue: 'Safia', cost: 50 },
                { name: 'Шоколадка Alpen Gold 🍫', venue: 'Korzinka', cost: 25 },
                { name: 'Ужин 🍽️', venue: 'Bon!', cost: 100 }
            ]
        },
        uz: {
            // Loading
            loadingTitle: 'Sehr yuklanmoqda...',
            // Name
            nameTitle: '8-Mart — Sening kuning!',
            nameSubtitle: 'Ismingni yoz:',
            namePlaceholder: 'Ismingni kiriting...',
            nameContinue: 'DAVOM ETISH',
            // Menu
            menuGreeting: 'Bayram muborak! 🌸',
            menuReasons: '101 sabab',
            menuReasonsDesc: 'Nega sen ajoyibsan',
            menuGift: 'Sovg\'a qutisi',
            menuGiftDesc: '9 ta syurpriz ichida',
            menuGame: 'Kitty Runner',
            menuGameDesc: 'Yugur va tangalar yig\'',
            menuShop: 'Sovg\'alar do\'koni',
            menuShopDesc: 'Tangalarni sovg\'alarga almashtir',
            musicOn: '🎵 Musiqa yoqish',
            musicOff: '🔇 Musiqani o\'chirish',
            // Intro screens
            introReasonsTitle: '💌 101 sabab',
            introReasonsDesc: 'Biz 101 ta sabab yig\'dik — nega sen ajoyibsan! Kartochkalarni bos va birma-bir ochib ko\'r!',
            introGiftTitle: '🎁 Sovg\'a qutisi',
            introGiftDesc: 'Ichida 9 ta syurpriz — har bir qutichani och va ichidagisini bil!',
            introGameTitle: '🐱 Kitty Runner',
            introGameDesc: 'Mushukchaga yordam ber — yugursin va tangalar yig\'sin! Sakrash uchun ekranga bos. Qancha uzoqroq — shuncha tezroq!',
            introOpen: 'OCHISH',
            introPlay: 'O\'YNASH',
            btnBack: 'ORQAGA',
            btnMenu: 'MENYUGA',
            // Reasons
            reasonsTitle: '101 sabab',
            reasonsComplete: 'Barcha 101 sabab ochildi! 🎉',
            reasonsCompleteDesc: 'Sen — ajoyibsan! 💖',
            // Gift
            giftTitle: 'Sovg\'a qutisi',
            giftComplete: 'Barcha 9 sovg\'a ochildi! 🎉',
            giftCompleteDesc: 'Bayram muborak! 💐',
            flowerToggle: 'Batafsil',
            specialTitle: 'Maxsus syurpriz! 💕',
            // Game
            gameTapHint: 'Boshlash uchun bos!',
            gameOverTitle: 'O\'yin tugadi! 💔',
            gameOverScore: 'Ochko:',
            gameOverCoins: 'Tangalar:',
            gameOverTotal: 'Jami tangalar:',
            gameOverPlayAgain: 'YANA O\'YNASH',
            gameOverShop: 'SOVG\'ALAR DO\'KONI',
            // Shop
            shopTitle: 'Sovg\'alar do\'koni',
            shopClaim: 'OLISH',
            shopNotEnough: 'Tangalar yetarli emas! 🪙',
            // Claim modal
            claimTelegram: '📩 Telegramda yozish',
            claimInstagram: '📸 Instagramda yozish',
            claimCancel: 'BEKOR QILISH',
            // Flowers
            flowers: [
                { name: 'Lola 🌷', desc: 'Lola — bahor va noziklikning ramzi. Uning yorqin gullari quvonch keltiradi va go\'zallik har yili qaytadan tug\'ilishini eslatadi.' },
                { name: 'Atirgul 🌹', desc: 'Atirgul — gullar malikasi, sevgi va nafosatning ramzi. Har bir gul bargi iliqlik va ishtiyoq saqlaydi.' },
                { name: 'Romashka 🌼', desc: 'Romashka — pokizalik va samimiyatning ramzi. U bolalik, quyoshli kunlar va oddiy quvonchni eslatadi.' },
                { name: 'Gulsafsar 🏵️', desc: 'Gulsafsar — baxt va bahor qaytishining ramzi. Uning nozik hidi yurakni tinchlik bilan to\'ldiradi.' },
                { name: 'Pion 🌺', desc: 'Pion — boylik va farovonlikning ramzi. Uning hashamatli gullari go\'zallik va mo\'llikni ifodalaydi.' },
                { name: 'Kungaboqar 🌻', desc: 'Kungaboqar — sodiqlik va nikbinlikning ramzi. U doimo quyoshga intiladi, biz baxtga intiladigan kabi.' },
                { name: 'Lavanda 💜', desc: 'Lavanda — kamtarlik va sadoqatning ramzi. Uning nozik rangi va hidi yurakni zabt etadi.' },
                { name: 'Sakura 🤍', desc: 'Sakura — nafislik va pokizalikning ramzi. Uning oppoq gullari havoni sehrli hid bilan to\'ldiradi.' }
            ],
            // Prizes
            prizes: [
                { name: 'Qahva va kruassan ☕', venue: 'Safia', cost: 50 },
                { name: 'Alpen Gold shokolad 🍫', venue: 'Korzinka', cost: 25 },
                { name: 'Kechki ovqat 🍽️', venue: 'Bon!', cost: 100 }
            ]
        }
    };

    /* --- Helper Functions --- */

    function getLang() {
        return localStorage.getItem('lang') || 'ru';
    }

    function t(key, params) {
        let str = TRANSLATIONS[getLang()]?.[key] || TRANSLATIONS.ru[key] || key;
        if (params) {
            Object.keys(params).forEach(function (k) {
                str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
            });
        }
        return str;
    }

    function applyTranslations(name) {
        var lang = getLang();
        var strings = TRANSLATIONS[lang] || TRANSLATIONS.ru;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (strings[key] !== undefined) {
                el.textContent = strings[key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (strings[key] !== undefined) {
                el.placeholder = strings[key];
            }
        });
        // Update dynamic name text
        var nameEl = document.getElementById('menu-user-name');
        if (nameEl && name) {
            nameEl.textContent = name;
        }
    }

    function getFlowers() {
        return TRANSLATIONS[getLang()]?.flowers || TRANSLATIONS.ru.flowers;
    }

    function getPrizes() {
        return TRANSLATIONS[getLang()]?.prizes || TRANSLATIONS.ru.prizes;
    }

    function getReason(index, name) {
        var lang = getLang();
        var reasons = lang === 'uz' ? (window.REASONS_UZ || []) : (window.REASONS_RU || []);
        var reason = reasons[index] || '';
        if (name) {
            reason = reason.replace(/\{name\}/g, name);
        }
        return reason;
    }

    /* --- Export --- */
    window.getLang = getLang;
    window.t = t;
    window.applyTranslations = applyTranslations;
    window.getFlowers = getFlowers;
    window.getPrizes = getPrizes;
    window.getReason = getReason;
})();
