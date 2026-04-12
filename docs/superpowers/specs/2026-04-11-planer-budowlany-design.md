# Planer Budowlany — Specyfikacja produktu (Faza 1)

**Data:** 2026-04-11  
**Wersja:** 1.0  
**Status:** Zaakceptowana

---

## 1. Cel produktu

Planer Budowlany to aplikacja webowa wspierająca osoby budujące dom jednorodzinny od zera. Główny ból, który rozwiązuje: "co muszę zrobić formalnie i technicznie na tym etapie budowy?" — pytanie, na które trudno znaleźć zwięzłą, wiarygodną odpowiedź.

**Użytkownicy docelowi:**
- Właściciel projektu (autor aplikacji) — na własną budowę
- Ogół: każda osoba budująca dom jednorodzinny, niekoniecznie fachowiec

**Zakres (Faza 1):** Wyłącznie budowa nowego domu jednorodzinnego od zera. Remonty i przebudowy są poza zakresem tej fazy.

---

## 2. Funkcje podstawowe

### 2.1 Checklista etapów (rdzeń produktu)

- 8 etapów budowy domu, ułożonych sekwencyjnie
- Każdy etap zawiera zadania dwóch typów:
  - `formal` — formalność urzędowa (wniosek, dokument, decyzja)
  - `technical` — wymóg techniczny lub ważna decyzja techniczna
- Każde zadanie może mieć opcjonalną wskazówkę (tip) wyjaśniającą szczegóły
- Użytkownik odhacza zadania — stan zapisywany w `localStorage` przeglądarki
- Brak kont użytkowników w Fazie 1 — postęp przypisany do przeglądarki

### 2.2 Pasek postępu etapów

- Widoczny na górze każdego ekranu
- Pokazuje: etapy ukończone, aktualny etap, etapy przyszłe
- Nawigacja między etapami przyciskami (← Poprzedni / Następny →)

### 2.3 Eksport do PDF

- Generowany po stronie przeglądarki (biblioteka `pdf-lib`, brak serwera)
- Zawiera: tytuł etapu lub całego projektu, checkboxy do odhaczenia (interaktywne w Acrobacie, do zakreślenia ręcznie na wydruku), wskazówki jako mniejszy tekst
- Dwa tryby eksportu: aktualny etap lub pełny plan (wszystkie etapy)
- Stopka z datą wygenerowania

---

## 3. Etapy budowy (zawartość)

Pełna treść — zadania, formalności i wskazówki — definiowana w pliku `src/data/stages.json`:

| # | Etap | Przykładowe zadania formalne |
|---|------|------------------------------|
| I | Działka i warunki zabudowy | Sprawdzenie MPZP/WZ, księga wieczysta, badania geotechniczne |
| II | Projekt budowlany | Wybór architekta, warunki techniczne przyłączy, umowa projektowa |
| III | Pozwolenie na budowę | Złożenie wniosku PnB, kompletacja dokumentów, rejestracja dziennika budowy |
| IV | Przygotowanie terenu i fundamenty | Wytyczenie geodezyjne, kierownik budowy, ogrodzenie placu, wylewka fundamentów |
| V | Stan surowy otwarty | Ściany, stropy, konstrukcja dachu, kominy |
| VI | Stan surowy zamknięty | Pokrycie dachu, montaż okien i drzwi zewnętrznych |
| VII | Instalacje i wykończenie | Elektryka, wod-kan, ogrzewanie, rekuperacja, tynki, wylewki |
| VIII | Odbiory i formalności końcowe | Zawiadomienie PINB, dokumentacja powykonawcza, odbiory instalacji |

Treść bazowa generowana z wiedzy o polskim prawie budowlanym i weryfikowana przez właściciela projektu.

---

## 4. Architektura techniczna

### Stack
- **Frontend:** React + TypeScript, Vite
- **Stylowanie:** Tailwind CSS
- **Dane:** pliki JSON (`src/data/stages.json`) — brak bazy danych
- **Stan:** `localStorage` przeglądarki
- **PDF:** biblioteka `pdf-lib`
- **Hosting:** Vercel (darmowy tier)

### Struktura projektu

```
planer-budowlany/
├── src/
│   ├── data/
│   │   └── stages.json          # treść: etapy, zadania, wskazówki
│   ├── components/
│   │   ├── StageBar.tsx          # pasek postępu u góry
│   │   ├── StageDetail.tsx       # checklista aktualnego etapu
│   │   ├── TaskItem.tsx          # pojedyncze zadanie z checkboxem i tipem
│   │   └── ExportButton.tsx      # generowanie PDF
│   ├── hooks/
│   │   └── useProgress.ts        # stan checklisty + localStorage
│   └── utils/
│       └── pdfExport.ts          # logika generowania PDF (pdf-lib)
└── public/
```

### Format danych (`stages.json`)

```json
{
  "stages": [
    {
      "id": "dzialka",
      "title": "I. Działka i warunki zabudowy",
      "tasks": [
        {
          "id": "mpzp",
          "title": "Sprawdź miejscowy plan zagospodarowania przestrzennego (MPZP)",
          "type": "formal",
          "tip": "Jeśli brak MPZP — musisz uzyskać Warunki Zabudowy (WZ) przed projektem. Złóż wniosek do gminy."
        },
        {
          "id": "geologia",
          "title": "Badanie geotechniczne gruntu",
          "type": "technical",
          "tip": "Nieobowiązkowe formalnie, ale kluczowe — typ fundamentów zależy od gruntu."
        }
      ]
    }
  ]
}
```

---

## 5. Design wizualny

**Kierunek:** Jasny, elegancki, profesjonalny — styl dokumentacji budowlanej. Bez ciemnych motywów i neonowych kolorów.

**Paleta:**
- Tło: `#f7f5f2` (ciepła biel) i `#ffffff`
- Akcent główny: `#9b8b6e` (złoto-beżowy)
- Linie i obramowania: `#c8b89a`, `#e8e0d5`
- Tekst główny: `#2c2c2c`
- Tekst drugorzędny: `#6b6258`, `#bfb5a8`

**Typografia:** Georgia (serif) dla tytułów i nazw zadań, sans-serif dla wskazówek i etykiet.

**Układ:** Pasek etapów u góry (poziome taby) → checklista poniżej podzielona na sekcje (Formalności / Techniczne).

---

## 6. Poza zakresem Fazy 1

Poniższe funkcje są świadomie wykluczone z Fazy 1 i mogą wejść w Fazie 2 (SaaS):

- Konta użytkowników i synchronizacja postępu między urządzeniami
- Zarządzanie budżetem i kosztorysem
- Harmonogram Gantta z datami
- Zarządzanie ekipami i wykonawcami
- Aplikacja mobilna (natywna)
- Płatności i subskrypcje
- Planer ogrodowy / organizer domowy

---

## 7. Ścieżka do produktu (roadmapa)

| Faza | Co | Kiedy |
|------|-----|-------|
| **1** | Statyczna web app: 8 etapów, checklista, PDF export | Teraz |
| **2** | Konta użytkowników, wiele projektów, synchronizacja | Po walidacji z użytkownikami |
| **3** | Monetyzacja (subskrypcja), marketing, domenа | Po potwierdzeniu demand |

---

## 8. Kryteria sukcesu Fazy 1

- Aplikacja działa w przeglądarce bez instalacji
- Wszystkie 8 etapów ma wypełnioną treść (zadania + wskazówki)
- Postęp zachowuje się po odświeżeniu strony
- PDF eksportuje się poprawnie z checkboxami
- Wygląd jest spójny z zatwierdzonym mockupem
