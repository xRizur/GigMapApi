# GigMap API

**GigMap** to aplikacja webowa, która umożliwia zespołom muzycznym i pubom:

- wzajemne wyszukiwanie się,
- udostępnianie dostępnych terminów koncertów,
- składanie i zarządzanie requestami na koncerty.

Backend został napisany w **Node.js** z wykorzystaniem **Express.js** i **MongoDB (Mongoose)**, a widoki do podglądu danych oparte są na **EJS**.

---

## Wymagania projektowe

| Wymaganie                              | Status | Jak zostało zrealizowane                                           |
|----------------------------------------|--------|---------------------------------------------------------------------|
| Użycie Express.js                      | ✅     | Główny framework serwera i routing aplikacji                       |
| Operacje dyskowe                       | ✅     | Upload i usuwanie zdjęć przez `multer` i `fs.unlink`               |
| Wykorzystanie bazy danych              | ✅     | MongoDB- wszystkie dane przechowywane w kolekcjach i modelach      |
| Zastosowanie szablonów EJS             | ✅     | Widoki: `/bands/view`, `/requests/view`, `/pubs/view`              |
| Zasady REST API                        | ✅     | Każdy zasób ma własne endpointy CRUD z logicznym podziałem         |
| Użycie routerów                        | ✅     | Osobne pliki dla `bands`, `pubs`, `requests`                       |

---

## Funkcjonalności

- **REST API** dla zasobów `bands`, `pubs`, `requests` – każdy zasób posiada pełny zestaw endpointów (`GET`, `POST`, `PUT`, `DELETE`)
- **Upload obrazków** – wykorzystano `multer` do zapisu zdjęć zespołów i pubów, wraz z usuwaniem starych plików
- **System dostępności** – w modelach `Band` i `Pub` zastosowano tablice slotów `{ start, end }`, modyfikowalne przez `PUT`
- **Requesty koncertowe** – model `Request` zawiera relację `bandId`, `pubId`, `start`, `end`, `message`, `status`, `initiator`
- **Walidacja requestów** – backend sprawdza, czy proponowany slot mieści się w dostępności odbiorcy
-**Widok requestów (`/requests/view`)** – `EJS` z tabelą requestów, akcjami „Akceptuj” i „Odrzuć”
- **Akceptacja requestu** – zmiana statusu + usunięcie wykorzystanego slotu z dostępności odbiorcy (z podziałem przedziału czasu)
- **Struktura MVC** – modele, kontrolery i routery trzymane oddzielnie
- **Testy jednostkowe i integracyjne** – `jest`, `supertest`, `mongodb-memory-server` bez potrzeby lokalnej instalacji MongoDB

---

## Jak uruchomić lokalnie

1. Zainstaluj zależności:

```bash
npm install
```

2. Stwórz plik `.env` z URI do MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/gigmap
```

3. Uruchom serwer:

```bash
node server.js
```

4. Wejdź na `http://localhost:3000`

---

## Struktura

```
├── app.js                 # Express app
├── server.js              # Start serwera
├── routes/                # Trasy (bands, pubs, requests)
├── controllers/           # Logika aplikacji
├── models/                # Mongoose modele
├── views/                 # Widoki EJS
├── uploads/               # Przesłane zdjęcia
├── tests/                 # Testy
```

---
