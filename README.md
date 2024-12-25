# Decentralized Voting System

## О проекте

Данный проект представляет собой децентрализованное приложение для создания голосований, голосования за варианты и отображения результатов. Смарт-контракт написан на Solidity, фронтенд реализован с использованием Next.js, а взаимодействие между ними происходит через `ethers.js`.

---

## Функционал

### Возможности:
1. Создание голосований с несколькими вариантами ответов.
2. Голосование за выбранный вариант.
3. Просмотр результатов голосования.
4. Список всех созданных голосований с их параметрами.

---

## Как запустить проект

### 1. Установите зависимости
yarn install

### 2. Запустите локальную сеть Ethereum
yarn chain

### 3. Разверните смарт-контракт
yarn deploy

### 4. Запустите фронтенд
yarn start

### 5. Откройте приложение
http://localhost:3000

---

## Как пользоваться

### **1. Создание голосования**
- В разделе **Create Election** введите:
  - Название голосования (например: "Лучший язык программирования").
  - Варианты ответов через запятую (например: "JavaScript, Python, Rust").
- Нажмите **Create Election**.

### **2. Голосование**
- В разделе **Vote** выберите голосование из выпадающего списка.
- Укажите **Option ID** (номер варианта, начиная с `0`).
- Нажмите **Vote** и подтвердите транзакцию в MetaMask.

### **3. Просмотр результатов**
- В разделе **Results** выберите голосование.
- Нажмите **Fetch Results**.
- Результаты голосования отобразятся в списке с количеством голосов за каждый вариант.
- Чтобы переключаться между результатами голосования нужно выбрать в разделе **Vote** нужный вам вариант.
---

## Структура проекта

### Основные директории:
- **`/contracts`** — Смарт-контракты на Solidity.
- **`/pages`** — Фронтенд-код на React (Next.js).
- **`/test`** — Тесты для смарт-контрактов.

---

## Описание смарт-контракта

### Основные функции:

1. **`createElection(string _name, string[] _options, uint256 _duration)`**:
   - Создаёт новое голосование.
   - Параметры:
     - `_name`: Название голосования.
     - `_options`: Список вариантов.

2. **`vote(uint256 _electionId, uint256 _choice)`**:
   - Голосует за выбранный вариант.
   - Параметры:
     - `_electionId`: ID голосования.
     - `_choice`: Номер варианта ответа.

3. **`getResults(uint256 _electionId)`**:
   - Возвращает массив с количеством голосов за каждый вариант.
   - Параметры:
     - `_electionId`: ID голосования.

4. **`getAllElections()`**:
   - Возвращает массив всех созданных голосований (названия и варианты).

---

## Тестирование

### 1. Запуск тестов
Для проверки работы смарт-контракта выполните:
yarn hardhat:test

### 2. Ожидаемые результаты
- Успешное создание голосования.
- Корректное голосование за варианты.
- Запрет повторного голосования.
- Отображение результатов.

---

## Проблемы, с которыми я столкнулся

- Понял, что маппинги в Solidity нельзя возвращать напрямую, пришлось переписывать контракт.
- Ошибки с несовместимостью версий `ethers.js`. В проекте на данный момент используется версия `5.7.2`.
- Трудности с тестированием голосований: пришлось изолировать тесты, чтобы данные из одного теста не влияли на другие.

---

## Чему я научился

1. Работать с Solidity: создавать и тестировать контракты.
2. Настраивать взаимодействие между блокчейном и фронтендом.
3. Разрабатывать пользовательский интерфейс с использованием Tailwind CSS.
4. Работать с инструментами разработки смарт-контрактов (Hardhat, ethers.js).

---
