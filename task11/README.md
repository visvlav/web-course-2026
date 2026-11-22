# Zen-Money (лабораторная 10–11)

Full-stack приложение учёта финансов: Express + SQLite (`server/`) и фронтенд на ES-модулях (`client/`).

## Запуск
1. Сервер:
   ```bash
   cd server
   npm install
   npm start
   ```
2. Клиент: открыть `client/index.html` через Live Server (VS Code). Модули не работают при открытии через `file://`.

Сначала запускается сервер, потом клиент. Подробности по API — в `server/README.md`.

## MVC на клиенте
- `model.js` — состояние, подсчёт сводки, настройки в localStorage (тема, последний фильтр)
- `ui.js` — View: отрисовка и чтение полей форм
- `api.js` — запросы к серверу (fetch + async/await)
- `main.js` — Controller: обработчики событий, связывает model, api и ui
