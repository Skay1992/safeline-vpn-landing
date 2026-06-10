# SafeLine VPN Landing

Современный адаптивный лендинг VPN-сервиса SafeLine VPN.

## Онлайн-версия

[Открыть SafeLine VPN](https://skay1992.github.io/safeline-vpn-landing/)

## Возможности

- адаптивная вёрстка для компьютеров, планшетов и телефонов;
- светлая цифровая VPN-планета с CSS/SVG-анимациями;
- блоки преимуществ, подключения, тарифов, FAQ и поддержки;
- реальная ссылка на Telegram-бота;
- без backend, авторизации, оплаты и тяжёлых библиотек.

## Локальный запуск

Проект является статическим сайтом. Его можно открыть через любой локальный HTTP-сервер:

```bash
python3 -m http.server 4173
```

После запуска сайт будет доступен по адресу:

```text
http://127.0.0.1:4173/
```

## Проверки качества

Быстрая проверка структуры, локальных ресурсов, внутренних ссылок и базовых
инвариантов доступности не требует npm:

```bash
python3 scripts/check_site.py
```

Полный набор проверок использует Node.js 24.8 или новее:

```bash
npm install
npm run check
```

Полная проверка включает:

- HTML-валидацию и линтинг JavaScript;
- браузерные сценарии для компьютера и телефона;
- автоматический аудит доступности через axe-core;
- Lighthouse-бюджеты производительности, SEO и доступности.

Отдельно можно отправить локальный HTML в W3C Nu Validator:

```bash
npm run check:w3c
```

## Структура

```text
.
├── .github/
│   └── dependabot.yml
├── tests/
│   └── site.spec.js
├── scripts/
│   ├── check_site.py
│   └── validate_w3c.py
├── index.html
├── lighthouserc.json
├── package.json
├── playwright.config.js
├── robots.txt
├── sitemap.xml
├── styles.css
├── script.js
└── public/
    └── logo.png
```

## Публикация

Сайт готов к размещению на GitHub Pages из ветки `main`.
