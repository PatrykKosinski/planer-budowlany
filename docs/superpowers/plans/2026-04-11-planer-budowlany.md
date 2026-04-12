# Planer Budowlany Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React web app that guides users through 8 stages of building a house in Poland, with a per-stage checklist, localStorage progress persistence, and PDF export with checkboxes.

**Architecture:** Vite + React + TypeScript SPA with no backend. All content lives in `src/data/stages.json`. Progress state lives in `localStorage`. PDF is generated client-side with `pdf-lib`. Deployed to Vercel.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v3, pdf-lib, Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/types.ts` | TypeScript interfaces: Stage, Task, ProgressMap |
| `src/data/stages.json` | All content: 8 stages, tasks, tips |
| `src/hooks/useProgress.ts` | Checkbox state + localStorage persistence |
| `src/components/TaskItem.tsx` | Single task row: checkbox, label, collapsible tip |
| `src/components/StageDetail.tsx` | Full stage view: grouped task list (formal / technical) |
| `src/components/StageBar.tsx` | Top progress bar: stage tabs with completion indicator |
| `src/utils/pdfExport.ts` | pdf-lib logic: generate PDF with checkbox fields |
| `src/components/ExportButton.tsx` | Button that calls pdfExport and triggers download |
| `src/App.tsx` | Root: wires StageBar + StageDetail + ExportButton |
| `src/main.tsx` | Vite entrypoint |
| `src/index.css` | Tailwind directives + custom Georgia/serif typography |
| `tests/useProgress.test.ts` | Hook unit tests |
| `tests/TaskItem.test.tsx` | Component unit tests |
| `tests/StageDetail.test.tsx` | Component unit tests |
| `tests/StageBar.test.tsx` | Component unit tests |
| `tests/pdfExport.test.ts` | Utility unit tests |
| `tests/ExportButton.test.tsx` | Component unit tests |
| `vercel.json` | Vercel SPA routing config |

---

## Task 1: Project Bootstrap

**Files:**
- Create: `package.json` (via npm create)
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`

- [ ] **Step 1: Scaffold Vite project**

Run in `/Users/ameliakosinska/Documents/PlannerBudowlany`:
```bash
npm create vite@latest . -- --template react-ts
```
When prompted "Current directory is not empty. Remove existing files and continue?" — answer **y** (docs/ folder will be preserved by Vite, it only removes its own files).

Actually Vite may warn about existing files. To be safe:
```bash
cd /Users/ameliakosinska/Documents/PlannerBudowlany
npm create vite@latest . -- --template react-ts --force
```

Expected: creates `src/`, `public/`, `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install pdf-lib
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Init Tailwind**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: Configure Tailwind**

Replace `tailwind.config.js` with:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50:  '#f7f5f2',
          100: '#f0ece6',
          200: '#e8e0d5',
          300: '#c8b89a',
          400: '#9b8b6e',
          500: '#7a6d56',
        },
        stone: {
          700: '#6b6258',
          800: '#4a4038',
          900: '#2c2c2c',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Configure Tailwind directives in CSS**

Replace `src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-sand-50 text-stone-900 font-sans;
  }
  h1, h2, h3 {
    @apply font-serif;
  }
}
```

- [ ] **Step 6: Configure Vitest in vite.config.ts**

Replace `vite.config.ts` with:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
```

- [ ] **Step 7: Create test setup file**

Create `tests/setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Add test script to package.json**

In `package.json`, inside `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 9: Delete Vite boilerplate**

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 10: Verify setup compiles**

```bash
npm run build
```

Expected: `dist/` created, no TypeScript errors.

- [ ] **Step 11: Commit**

```bash
git init
git add -A
git commit -m "chore: bootstrap Vite + React + TS + Tailwind + Vitest"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write types**

Create `src/types.ts`:
```ts
export type TaskType = 'formal' | 'technical';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  tip?: string;
}

export interface Stage {
  id: string;
  title: string;
  tasks: Task[];
}

export interface StagesData {
  stages: Stage[];
}

/** taskId → checked */
export type ProgressMap = Record<string, boolean>;
```

- [ ] **Step 2: Verify TypeScript accepts the file**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add TypeScript types for Stage, Task, ProgressMap"
```

---

## Task 3: Content — stages.json

**Files:**
- Create: `src/data/stages.json`

- [ ] **Step 1: Create the data directory and file**

```bash
mkdir -p src/data
```

Create `src/data/stages.json` with the full content below. This is the "heart" of the product — all Polish construction stages, tasks, and tips:

```json
{
  "stages": [
    {
      "id": "dzialka",
      "title": "I. Działka i warunki zabudowy",
      "tasks": [
        {
          "id": "dzialka-mpzp",
          "title": "Sprawdź Miejscowy Plan Zagospodarowania Przestrzennego (MPZP)",
          "type": "formal",
          "tip": "MPZP określa co możesz wybudować na działce: powierzchnię zabudowy, wysokość, kształt dachu. Sprawdź w urzędzie gminy lub na geoportalu. Jeśli MPZP nie istnieje dla Twojej działki, konieczne jest uzyskanie Warunków Zabudowy (WZ) — złóż wniosek do urzędu gminy przed zleceniem projektu."
        },
        {
          "id": "dzialka-kw",
          "title": "Sprawdź księgę wieczystą działki",
          "type": "formal",
          "tip": "Zweryfikuj: właściciela (czy sprzedający ma prawo sprzedać), służebności (np. przesyłu, drogi), hipoteki i obciążenia. Dostępne bezpłatnie online: ekw.ms.gov.pl — wpisz numer KW z aktu notarialnego."
        },
        {
          "id": "dzialka-wz",
          "title": "Uzyskaj Warunki Zabudowy (WZ) — jeśli brak MPZP",
          "type": "formal",
          "tip": "Wniosek składasz do urzędu gminy/miasta. Decyzja WZ może trwać 60–90 dni. WZ jest wymagane przed złożeniem projektu do urzędu. Nie jest wymagane jeśli działka ma MPZP."
        },
        {
          "id": "dzialka-geologia",
          "title": "Badanie geotechniczne gruntu",
          "type": "technical",
          "tip": "Technicznie nieobowiązkowe, ale kluczowe — typ fundamentów zależy od gruntu. Koszt: ok. 1 000–2 500 zł. Wyniki przekaż architektowi przed projektem fundamentów. Przy gruntach słabych (torf, nasypy) badanie jest niezbędne."
        },
        {
          "id": "dzialka-mapa",
          "title": "Uzyskaj aktualną mapę zasadniczą do celów projektowych",
          "type": "formal",
          "tip": "Zamów u geodety uprawnionego. Mapa jest potrzebna architektowi do naniesienia budynku na działce. Ważność: 3 lata. Koszt: ok. 500–1 000 zł."
        },
        {
          "id": "dzialka-droga",
          "title": "Sprawdź dostęp do drogi publicznej",
          "type": "technical",
          "tip": "Działka musi mieć bezpośredni dostęp do drogi publicznej lub przez ustanowioną służebność drogową. Brak dostępu uniemożliwia uzyskanie pozwolenia na budowę."
        },
        {
          "id": "dzialka-energia",
          "title": "Uzyskaj warunki techniczne przyłączenia do sieci energetycznej",
          "type": "formal",
          "tip": "Wniosek do lokalnego dystrybutora energii (np. Tauron, Enea, Energa). Czas oczekiwania: 30–60 dni. Warunki są potrzebne do projektu instalacji elektrycznej."
        },
        {
          "id": "dzialka-wodkan",
          "title": "Uzyskaj warunki techniczne przyłączenia do sieci wodociągowej i kanalizacyjnej",
          "type": "formal",
          "tip": "Wniosek do lokalnego zakładu wodociągów i kanalizacji. Jeśli brak sieci kanalizacyjnej — konieczna szambo lub przydomowa oczyszczalnia ścieków (wymagana zgoda wodnoprawna)."
        }
      ]
    },
    {
      "id": "projekt",
      "title": "II. Projekt budowlany",
      "tasks": [
        {
          "id": "projekt-architekt",
          "title": "Wybierz i podpisz umowę z architektem",
          "type": "formal",
          "tip": "Architekt musi mieć uprawnienia budowlane do projektowania. Umowa powinna określać: zakres projektu, harmonogram, prawa autorskie (prawo do adaptacji), cenę. Poproś o przykładowe realizacje. Koszt projektowania: ok. 4 000–15 000 zł w zależności od zakresu."
        },
        {
          "id": "projekt-program",
          "title": "Ustal z architektem program funkcjonalny domu",
          "type": "technical",
          "tip": "Przed projektem określ: liczba kondygnacji, powierzchnia, układ pomieszczeń, garaż (wbudowany / wolnostojący / brak), technologia budowy (murowana / drewniana / prefabrykowana), system ogrzewania. To są decyzje, które determinują cały projekt."
        },
        {
          "id": "projekt-ogrzewanie",
          "title": "Zdecyduj o systemie ogrzewania",
          "type": "technical",
          "tip": "Decyzja musi zapaść na etapie projektu, bo wpływa na przekroje instalacji, miejsce kotłowni i grubość ocieplenia. Opcje: pompa ciepła powietrzna (popularna, bez gazu), kocioł gazowy, kocioł na pellet. Pompa ciepła wymaga dobrego ocieplenia (U ≤ 0.15 W/m²K dla ścian)."
        },
        {
          "id": "projekt-warunki-sieci",
          "title": "Przekaż architektowi warunki techniczne od gestorów sieci",
          "type": "formal",
          "tip": "Architekt potrzebuje warunków przyłączenia energii, wody, kanalizacji i ewentualnie gazu do zaprojektowania przyłączy i instalacji. Bez nich projekt może wymagać poprawek po uzyskaniu warunków."
        },
        {
          "id": "projekt-odbiór",
          "title": "Odbierz projekt budowlany i sprawdź kompletność",
          "type": "formal",
          "tip": "Projekt budowlany powinien zawierać: projekt architektoniczno-budowlany, projekt zagospodarowania działki, opinie i uzgodnienia (np. ZUDP, rzeczoznawca p.poż. dla budynków powyżej 1 000 m³), oświadczenia projektantów. Sprawdź czy architekt złożył podpisy i pieczęcie na wszystkich rysunkach."
        }
      ]
    },
    {
      "id": "pozwolenie",
      "title": "III. Pozwolenie na budowę",
      "tasks": [
        {
          "id": "pnb-dokumenty",
          "title": "Skompletuj dokumenty do wniosku o pozwolenie na budowę",
          "type": "formal",
          "tip": "Wymagane dokumenty: wniosek PB-1 (formularz z gov.pl), 3 egzemplarze projektu budowlanego, oświadczenie o prawie do dysponowania nieruchomością na cele budowlane, decyzja WZ lub wypis z MPZP. Wniosek składa się do Starostwa Powiatowego lub Urzędu Miasta."
        },
        {
          "id": "pnb-zlozone",
          "title": "Złóż wniosek o pozwolenie na budowę",
          "type": "formal",
          "tip": "Organ ma 65 dni na wydanie decyzji. Jeśli wniosek ma braki — urząd wezwie do uzupełnienia (czas się zatrzymuje). Możliwość złożenia elektronicznie przez portal e-budownictwo.gunb.gov.pl. Opłata skarbowa: 1 zł za każdy m² pow. użytkowej (max 539 zł)."
        },
        {
          "id": "pnb-prawomocna",
          "title": "Poczekaj na prawomocność decyzji o pozwoleniu na budowę",
          "type": "formal",
          "tip": "Decyzja staje się prawomocna po 14 dniach od doręczenia wszystkim stronom (sąsiadom), jeśli nikt się nie odwołał. Nie zaczynaj budowy przed uzyskaniem prawomocności — to wykroczenie. Po 3 latach od prawomocności pozwolenie wygasa jeśli nie rozpoczęto budowy."
        },
        {
          "id": "pnb-kierownik",
          "title": "Ustanów kierownika budowy",
          "type": "formal",
          "tip": "Kierownik budowy musi mieć uprawnienia budowlane w odpowiedniej specjalności. Jest odpowiedzialny za prowadzenie dziennika budowy i nadzór nad wykonaniem zgodnym z projektem. Koszt: ok. 3 000–8 000 zł za cały nadzór."
        },
        {
          "id": "pnb-dziennik",
          "title": "Zarejestruj dziennik budowy",
          "type": "formal",
          "tip": "Od 2024 roku dziennik budowy prowadzony jest elektronicznie w systemie DOMB (dziennik.gunb.gov.pl). Kierownik budowy zakłada konto i rejestruje dziennik. Papierowy dziennik był obowiązkowy do 27.01.2023 dla nowych pozwoleń."
        },
        {
          "id": "pnb-zawiadomienie",
          "title": "Zawiadom organ nadzoru budowlanego (PINB) o zamiarze rozpoczęcia budowy",
          "type": "formal",
          "tip": "Zawiadomienie składa kierownik budowy minimum 7 dni przed planowanym rozpoczęciem robót. Dołącz: oświadczenie kierownika o przyjęciu obowiązków, dane projektantów, kopię uprawnień. Formularz: PB-9."
        }
      ]
    },
    {
      "id": "fundamenty",
      "title": "IV. Przygotowanie terenu i fundamenty",
      "tasks": [
        {
          "id": "fund-geodeta",
          "title": "Geodeta — wytyczenie budynku w terenie",
          "type": "formal",
          "tip": "Geodeta uprawniony wytycza narożniki budynku zgodnie z projektem zagospodarowania. Wytyczenie wpisuje do dziennika budowy. To obowiązkowy krok przed kopaniem wykopu. Koszt: ok. 800–1 500 zł."
        },
        {
          "id": "fund-ogrodzenie",
          "title": "Ogrodź plac budowy i ustaw tablicę informacyjną",
          "type": "formal",
          "tip": "Tablica informacyjna jest obowiązkiem prawnym — musi zawierać: numer pozwolenia, dane inwestora, dane kierownika budowy, planowany termin zakończenia. Ogrodzenie musi uniemożliwiać wejście osób nieuprawnionych."
        },
        {
          "id": "fund-wykop",
          "title": "Wykonaj wykop fundamentowy",
          "type": "technical",
          "tip": "Głębokość wykopu zgodna z projektem. Sprawdź czy grunt w dnie wykopu odpowiada temu z badania geotechnicznego. Jeśli natrafisz na inne warunki — natychmiast poinformuj kierownika budowy i projektanta. Nie zasypuj wykopu bez odbioru."
        },
        {
          "id": "fund-lawy",
          "title": "Wykonaj ławy lub płytę fundamentową",
          "type": "technical",
          "tip": "Beton fundamentowy zgodny z projektem (klasa minimum C16/20). Zbrojenie zgodnie z rysunkami projektu. Przed wylaniem betonu kierownik budowy powinien odebrać zbrojenie i wpisać do dziennika budowy."
        },
        {
          "id": "fund-izolacja",
          "title": "Wykonaj izolację przeciwwilgociową i termiczną fundamentów",
          "type": "technical",
          "tip": "Izolacja pozioma (ława — papa lub folia) i pionowa (ściana fundamentowa — masa bitumiczna + folia kubełkowa). Ocieplenie ław fundamentowych styropianem XPS (odporny na wodę). Niedostateczna izolacja = wilgoć w piwnicy lub na ścianach parteru."
        },
        {
          "id": "fund-przylacza",
          "title": "Wykonaj przyłącza (woda, kanalizacja, energia elektryczna)",
          "type": "technical",
          "tip": "Przyłącza buduje się na etapie fundamentów, bo rury muszą przechodzić przez lub pod fundamentem. Wykonaj je zanim zamurujesz ściany fundamentowe. Rury przepustowe przez ścianę muszą być w tulejach ochronnych."
        }
      ]
    },
    {
      "id": "stan-surowy-otwarty",
      "title": "V. Stan surowy otwarty",
      "tasks": [
        {
          "id": "sso-sciany-parter",
          "title": "Wykonaj ściany parteru",
          "type": "technical",
          "tip": "Technologia zgodna z projektem (beton komórkowy, ceramika poryzowana, keramzyt itp.). Sprawdź poziomowanie każdej warstwy. Szczelina dylatacyjna przy kominach. Bruzdy na instalacje wykonywać po wzniesieniu ścian, nie podczas murowania."
        },
        {
          "id": "sso-strop",
          "title": "Wykonaj strop nad parterem",
          "type": "technical",
          "tip": "Typ stropu zgodny z projektem (monolityczny, Teriva, Filigran, drewniany). Przed wylaniem stropu monolitycznego — odbiór zbrojenia przez kierownika budowy. Czas dojrzewania betonu stropu przed zdjęciem deskowania: min. 28 dni (zależnie od temperatury)."
        },
        {
          "id": "sso-sciany-pietro",
          "title": "Wykonaj ściany piętra (jeśli dotyczy)",
          "type": "technical",
          "tip": "Analogicznie jak ściany parteru. Zwróć uwagę na układanie przewodów wentylacyjnych i kominowych — przechodzą przez kilka kondygnacji i muszą być zaplanowane z wyprzedzeniem."
        },
        {
          "id": "sso-wieniec",
          "title": "Wykonaj wieniec żelbetowy i murłaty",
          "type": "technical",
          "tip": "Wieniec spina ściany i przenosi obciążenia z dachu. Murłaty (belki pod więźbę) kotwimy w wieńcu śrubami kotwiącymi. Murłaty impregnować środkiem ochrony drewna przed ułożeniem."
        },
        {
          "id": "sso-wiezba",
          "title": "Wykonaj więźbę dachową",
          "type": "technical",
          "tip": "Drewno na więźbę musi być suszone komorowo i zaimpregnowane. Projekt więźby powinien opracować konstruktor. Przed montażem sprawdź poziomowanie murłat. Wstępne krycie (folia lub membrana wstępnego krycia) montowane razem z więźbą — chroni budynek przed deszczem do czasu pokrycia."
        },
        {
          "id": "sso-kominy",
          "title": "Wykonaj kominy",
          "type": "technical",
          "tip": "Komin do kotła gazowego lub pompy ciepła (jeśli dotyczy): ceramiczny lub stalowy systemowy. Komin wentylacyjny: ceglany lub systemowy. Wysokość komina ponad kalenicą zgodna z normą (min. 0.6 m powyżej kalenicy w promieniu 10 m). Komin sprawdza kominiarz przed odbiorem."
        }
      ]
    },
    {
      "id": "stan-surowy-zamkniety",
      "title": "VI. Stan surowy zamknięty",
      "tasks": [
        {
          "id": "ssz-dach",
          "title": "Ułóż pokrycie dachowe",
          "type": "technical",
          "tip": "Kolejność: kontrłaty → łaty → pokrycie (dachówka ceramiczna, betonowa, blachodachówka, blacha na rąbek). Membrana wstępnego krycia musi być wentylowana — kontrłaty tworzą szczelinę wentylacyjną. Obróbki blacharskie (kominów, okien dachowych) wykonać szczelnie."
        },
        {
          "id": "ssz-okna",
          "title": "Zamontuj okna i drzwi zewnętrzne",
          "type": "technical",
          "tip": "Okna montować na ciepło (pianka + taśma paroprzepuszczalna na zewnątrz + taśma paroizolacyjna od wewnątrz). Parametr Uw dla okien: ≤ 0.9 W/m²K (standard) lub ≤ 0.6 W/m²K (pasywny). Sprawdź pionowanie i poziomowanie każdego okna przed ostatecznym montażem."
        },
        {
          "id": "ssz-parapety",
          "title": "Wykonaj parapety zewnętrzne i obróbki blacharskie",
          "type": "technical",
          "tip": "Parapety zewnętrzne z blachy z odpowiednim spadkiem (min. 5°) odprowadzającym wodę od elewacji. Rynny i rury spustowe montować na tym etapie — odprowadzają wodę z dachu i chronią fundamenty."
        },
        {
          "id": "ssz-szczelnosc",
          "title": "Sprawdź szczelność budynku przed sezonem grzewczym",
          "type": "technical",
          "tip": "Przed zimą budynek w stanie surowym zamkniętym powinien mieć: zamknięte wszystkie otwory okienne i drzwiowe, pokrycie dachu, odprowadzenie wody z dachu. Pozostawienie budynku bez pokrycia przez zimę grozi uszkodzeniem stropu i murów przez mróz."
        }
      ]
    },
    {
      "id": "instalacje",
      "title": "VII. Instalacje i wykończenie",
      "tasks": [
        {
          "id": "inst-elektryka",
          "title": "Wykonaj instalację elektryczną",
          "type": "technical",
          "tip": "Instalacja elektryczna musi być wykonana przez elektryka z odpowiednimi uprawnieniami (SEP do 1 kV). Projektuj obwody zgodnie z normą PN-HD 60364. Zaplanuj: obwody odbiorcze (po jednym na pomieszczenie), obwód kuchenki, pralki, klimatyzacji. Bruzdy zasypać przed tynkowaniem."
        },
        {
          "id": "inst-elektryka-odbiór",
          "title": "Odbiór instalacji elektrycznej — protokół pomiarowy",
          "type": "formal",
          "tip": "Obowiązkowy protokół pomiarów elektrycznych: rezystancja izolacji, ciągłość przewodów ochronnych, skuteczność ochrony przeciwporażeniowej. Wykonuje elektryk z uprawnieniami pomiarowymi. Protokół jest wymagany przy odbiorze budynku przez PINB."
        },
        {
          "id": "inst-wodkan",
          "title": "Wykonaj instalację wodociągową i kanalizacyjną",
          "type": "technical",
          "tip": "Rury kanalizacyjne w posadzce z odpowiednim spadkiem (min. 2% dla DN100). Izolacja rur wodociągowych ciepłej wody i cyrkulacji. Zawory odcinające przy każdym urządzeniu. Wewnętrzna kanalizacja musi być przewentylowana (pion kanalizacyjny ponad dach)."
        },
        {
          "id": "inst-ogrzewanie",
          "title": "Wykonaj instalację grzewczą",
          "type": "technical",
          "tip": "Ogrzewanie podłogowe: rury w wylewce, podłączone do rozdzielaczy. Grzejniki: na ścianach, z zaworami termostatycznymi. Pompę ciepła montuje się na zewnątrz (pompa powietrzna) lub w kotłowni (solanka-woda). Instalację grzewczą napełnić i sprawdzić ciśnienie przed wylewkami."
        },
        {
          "id": "inst-wentylacja",
          "title": "Wykonaj instalację wentylacji mechanicznej (rekuperacja)",
          "type": "technical",
          "tip": "Centralę rekuperacyjną montuje się zazwyczaj na poddaszu lub w kotłowni. Kanały wentylacyjne prowadzone w podwójnym suficie lub w posadzce. Uwaga: kanały muszą być zaizolowane termicznie w przestrzeni nieogrzewanej (poddasze). Rekuperator wymaga regularnej wymiany filtrów (co 3–6 miesięcy)."
        },
        {
          "id": "inst-tynki",
          "title": "Wykonaj tynki wewnętrzne",
          "type": "technical",
          "tip": "Tynki gipsowe (wewnątrz) lub cementowo-wapienne (łazienki). Przed tynkowaniem: wszystkie instalacje muszą być w brudach/bruzdach, okna zamknięte, temperatura powyżej +5°C. Tynk musi wyschnąć przed układaniem wylewki i podłóg (min. 4 tygodnie)."
        },
        {
          "id": "inst-wylewki",
          "title": "Wykonaj wylewki podłogowe",
          "type": "technical",
          "tip": "Wylewka anhydrytowa (szybkoschnąca) lub cementowa (twardsza). Na ogrzewaniu podłogowym: wylewka anhydrytowa min. 35 mm nad rurą, cementowa min. 45 mm. Wylewka anhydrytowa wymaga szlifowania i gruntowania przed układaniem podłogi."
        },
        {
          "id": "inst-elewacja",
          "title": "Wykonaj elewację (ocieplenie i tynk zewnętrzny)",
          "type": "technical",
          "tip": "System ETICS (styropian + siatka + tynk) lub elewacja wentylowana (wełna mineralna + okładzina). Grubość ocieplenia: min. 15 cm styropianu (λ=0.031–0.038) dla spełnienia WT 2021. Tynk silikonowy lub silikatowy — odporny na algi. Parapety zewnętrzne przed ociepleniem."
        }
      ]
    },
    {
      "id": "odbiory",
      "title": "VIII. Odbiory i formalności końcowe",
      "tasks": [
        {
          "id": "odb-dokumentacja",
          "title": "Skompletuj dokumentację powykonawczą",
          "type": "formal",
          "tip": "Dokumentacja powykonawcza: dziennik budowy (elektroniczny — DOMB), protokoły odbioru instalacji (elektryka, gaz), geodezyjna inwentaryzacja powykonawcza (geodeta uprawniony), oświadczenie kierownika budowy o zakończeniu budowy, atesty i certyfikaty wbudowanych materiałów."
        },
        {
          "id": "odb-geodezja",
          "title": "Zamów geodezyjną inwentaryzację powykonawczą",
          "type": "formal",
          "tip": "Geodeta mierzy rzeczywiste położenie budynku i nanosi go na mapę zasadniczą. Wynik trafia do zasobu geodezyjnego. Jest to obowiązkowy załącznik do zawiadomienia o zakończeniu budowy. Koszt: ok. 1 000–2 000 zł."
        },
        {
          "id": "odb-kominiarz",
          "title": "Odbiór kominiarniczy — protokół",
          "type": "formal",
          "tip": "Kominiarz sprawdza drożność i szczelność przewodów dymowych i wentylacyjnych. Protokół kominiarski jest wymagany przy odbiorze budynku. Zorganizuj odbiór przed zawiadomieniem PINB."
        },
        {
          "id": "odb-pinb",
          "title": "Zawiadom Powiatowy Inspektorat Nadzoru Budowlanego (PINB) o zakończeniu budowy",
          "type": "formal",
          "tip": "Formularz PB-16 składany przez inwestora lub kierownika budowy. Dołącz: oświadczenie kierownika, dziennik budowy, protokoły, inwentaryzację geodezyjną. PINB ma 14 dni na ewentualne wniesienie sprzeciwu. Jeśli nie wniesie — możesz użytkować budynek."
        },
        {
          "id": "odb-licznik",
          "title": "Zgłoś przyłącze i zamów montaż licznika energii elektrycznej",
          "type": "formal",
          "tip": "Po zakończeniu budowy złóż wniosek do dystrybutora energii o montaż licznika i zawarcie umowy o dostarczanie energii. Czas realizacji: 14–30 dni. Bez licznika nie możesz legalnie korzystać z prądu."
        },
        {
          "id": "odb-ewidencja",
          "title": "Zarejestruj budynek w ewidencji gruntów i budynków",
          "type": "formal",
          "tip": "Na podstawie geodezyjnej inwentaryzacji powykonawczej budynek zostaje wpisany do ewidencji przez geodetę. Sprawdź czy geodeta przekazał dokumentację do wydziału geodezji starostwa."
        },
        {
          "id": "odb-podatek",
          "title": "Zgłoś nieruchomość do podatku od nieruchomości w gminie",
          "type": "formal",
          "tip": "W ciągu 14 dni od dnia zakończenia budowy (lub dnia, w którym budynek zaczął być użytkowany) złóż IN-1 do gminy. Podatek od nieruchomości zależy od powierzchni użytkowej. Stawki ustalane są przez radę gminy."
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "require('./src/data/stages.json'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add src/data/stages.json
git commit -m "feat: add full Polish construction stages content (8 stages)"
```

---

## Task 4: useProgress Hook

**Files:**
- Create: `src/hooks/useProgress.ts`
- Test: `tests/useProgress.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/useProgress.test.ts`:
```ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProgress } from '../src/hooks/useProgress'
import type { Stage } from '../src/types'

const mockStage: Stage = {
  id: 'test-stage',
  title: 'Test Stage',
  tasks: [
    { id: 'task-1', title: 'Task 1', type: 'formal' },
    { id: 'task-2', title: 'Task 2', type: 'technical' },
  ],
}

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('starts with all tasks unchecked', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.isTaskDone('task-1')).toBe(false)
  })

  it('toggleTask marks task as done', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggleTask('task-1')
    })
    expect(result.current.isTaskDone('task-1')).toBe(true)
  })

  it('toggleTask unmarks a done task', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.toggleTask('task-1') })
    act(() => { result.current.toggleTask('task-1') })
    expect(result.current.isTaskDone('task-1')).toBe(false)
  })

  it('getStageProgress returns correct counts', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.toggleTask('task-1') })
    const progress = result.current.getStageProgress(mockStage.tasks)
    expect(progress.done).toBe(1)
    expect(progress.total).toBe(2)
  })

  it('persists progress to localStorage', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.toggleTask('task-1') })
    const stored = JSON.parse(localStorage.getItem('planer-budowlany-progress') ?? '{}')
    expect(stored['task-1']).toBe(true)
  })

  it('restores progress from localStorage on mount', () => {
    localStorage.setItem(
      'planer-budowlany-progress',
      JSON.stringify({ 'task-1': true })
    )
    const { result } = renderHook(() => useProgress())
    expect(result.current.isTaskDone('task-1')).toBe(true)
    expect(result.current.isTaskDone('task-2')).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/useProgress.test.ts
```

Expected: FAIL — module `../src/hooks/useProgress` not found.

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useProgress.ts`:
```ts
import { useState, useEffect } from 'react'
import type { Task, ProgressMap } from '../types'

const STORAGE_KEY = 'planer-budowlany-progress'

function loadFromStorage(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const toggleTask = (taskId: string) => {
    setProgress(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const isTaskDone = (taskId: string): boolean => !!progress[taskId]

  const getStageProgress = (tasks: Task[]): { done: number; total: number } => {
    const done = tasks.filter(t => progress[t.id]).length
    return { done, total: tasks.length }
  }

  return { toggleTask, isTaskDone, getStageProgress }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/useProgress.test.ts
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProgress.ts tests/useProgress.test.ts
git commit -m "feat: add useProgress hook with localStorage persistence"
```

---

## Task 5: TaskItem Component

**Files:**
- Create: `src/components/TaskItem.tsx`
- Test: `tests/TaskItem.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/TaskItem.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskItem } from '../src/components/TaskItem'
import type { Task } from '../src/types'

const formalTask: Task = {
  id: 'task-formal',
  title: 'Sprawdź MPZP',
  type: 'formal',
  tip: 'To jest wskazówka',
}

const technicalTask: Task = {
  id: 'task-tech',
  title: 'Badanie geotechniczne',
  type: 'technical',
}

describe('TaskItem', () => {
  it('renders task title', () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Sprawdź MPZP')).toBeInTheDocument()
  })

  it('checkbox is unchecked when isDone=false', () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked when isDone=true', () => {
    render(<TaskItem task={formalTask} isDone={true} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onToggle with taskId when checkbox clicked', async () => {
    const onToggle = vi.fn()
    render(<TaskItem task={formalTask} isDone={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('task-formal')
  })

  it('does not show tip button when task has no tip', () => {
    render(<TaskItem task={technicalTask} isDone={false} onToggle={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /wskazówka/i })).not.toBeInTheDocument()
  })

  it('shows tip text when tip button is clicked', async () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    const tipButton = screen.getByRole('button', { name: /wskazówka/i })
    await userEvent.click(tipButton)
    expect(screen.getByText('To jest wskazówka')).toBeInTheDocument()
  })

  it('hides tip text when tip button is clicked again', async () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    const tipButton = screen.getByRole('button', { name: /wskazówka/i })
    await userEvent.click(tipButton)
    await userEvent.click(tipButton)
    expect(screen.queryByText('To jest wskazówka')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/TaskItem.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement TaskItem**

Create `src/components/TaskItem.tsx`:
```tsx
import { useState } from 'react'
import type { Task } from '../types'

interface Props {
  task: Task
  isDone: boolean
  onToggle: (taskId: string) => void
}

export function TaskItem({ task, isDone, onToggle }: Props) {
  const [showTip, setShowTip] = useState(false)

  return (
    <li className={`flex flex-col gap-1 py-3 border-b border-sand-200 last:border-0 ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggle(task.id)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-sand-400 cursor-pointer"
        />
        <span className={`font-serif text-sm leading-snug ${isDone ? 'line-through text-stone-700' : 'text-stone-900'}`}>
          {task.title}
        </span>
        {task.tip && (
          <button
            onClick={() => setShowTip(v => !v)}
            className="ml-auto flex-shrink-0 text-xs text-sand-400 border border-sand-300 rounded px-2 py-0.5 hover:bg-sand-100 transition-colors"
            aria-label="wskazówka"
          >
            {showTip ? 'zwiń' : 'wskazówka'}
          </button>
        )}
      </div>
      {showTip && task.tip && (
        <p className="ml-7 text-xs text-stone-700 bg-sand-100 rounded p-2 leading-relaxed">
          {task.tip}
        </p>
      )}
    </li>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/TaskItem.test.tsx
```

Expected: 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TaskItem.tsx tests/TaskItem.test.tsx
git commit -m "feat: add TaskItem component with collapsible tip"
```

---

## Task 6: StageDetail Component

**Files:**
- Create: `src/components/StageDetail.tsx`
- Test: `tests/StageDetail.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/StageDetail.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StageDetail } from '../src/components/StageDetail'
import type { Stage } from '../src/types'

const stage: Stage = {
  id: 'stage-1',
  title: 'I. Działka',
  tasks: [
    { id: 't1', title: 'Formalność 1', type: 'formal', tip: 'tip1' },
    { id: 't2', title: 'Formalność 2', type: 'formal' },
    { id: 't3', title: 'Techniczna 1', type: 'technical' },
  ],
}

describe('StageDetail', () => {
  it('renders stage title', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('I. Działka')).toBeInTheDocument()
  })

  it('renders "Formalności" section when formal tasks exist', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('Formalności')).toBeInTheDocument()
  })

  it('renders "Wymagania techniczne" section when technical tasks exist', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('Wymagania techniczne')).toBeInTheDocument()
  })

  it('renders all task titles', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('Formalność 1')).toBeInTheDocument()
    expect(screen.getByText('Formalność 2')).toBeInTheDocument()
    expect(screen.getByText('Techniczna 1')).toBeInTheDocument()
  })

  it('renders 3 checkboxes for 3 tasks', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('shows progress count', () => {
    render(
      <StageDetail stage={stage} progress={{ 't1': true }} onToggle={vi.fn()} />
    )
    expect(screen.getByText(/1.*3|1 z 3/)).toBeInTheDocument()
  })

  it('does not render "Formalności" header when no formal tasks', () => {
    const techOnlyStage: Stage = {
      id: 's2',
      title: 'Tech only',
      tasks: [{ id: 'x1', title: 'Tech task', type: 'technical' }],
    }
    render(<StageDetail stage={techOnlyStage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.queryByText('Formalności')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/StageDetail.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement StageDetail**

Create `src/components/StageDetail.tsx`:
```tsx
import type { Stage, ProgressMap } from '../types'
import { TaskItem } from './TaskItem'

interface Props {
  stage: Stage
  progress: ProgressMap
  onToggle: (taskId: string) => void
}

export function StageDetail({ stage, progress, onToggle }: Props) {
  const formalTasks = stage.tasks.filter(t => t.type === 'formal')
  const technicalTasks = stage.tasks.filter(t => t.type === 'technical')
  const doneCount = stage.tasks.filter(t => progress[t.id]).length

  return (
    <section className="bg-white rounded-lg border border-sand-200 shadow-sm p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-xl text-stone-900">{stage.title}</h2>
        <span className="text-sm text-stone-700 font-sans">
          {doneCount} / {stage.tasks.length}
        </span>
      </div>

      {formalTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-400 mb-2">
            Formalności
          </h3>
          <ul>
            {formalTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isDone={!!progress[task.id]}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </div>
      )}

      {technicalTasks.length > 0 && (
        <div>
          <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-400 mb-2">
            Wymagania techniczne
          </h3>
          <ul>
            {technicalTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isDone={!!progress[task.id]}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/StageDetail.test.tsx
```

Expected: 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StageDetail.tsx tests/StageDetail.test.tsx
git commit -m "feat: add StageDetail component with formal/technical sections"
```

---

## Task 7: StageBar Component

**Files:**
- Create: `src/components/StageBar.tsx`
- Test: `tests/StageBar.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/StageBar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { StageBar } from '../src/components/StageBar'
import type { Stage } from '../src/types'

const stages: Stage[] = [
  {
    id: 'stage-a',
    title: 'I. Działka',
    tasks: [
      { id: 't1', title: 'T1', type: 'formal' },
      { id: 't2', title: 'T2', type: 'formal' },
    ],
  },
  {
    id: 'stage-b',
    title: 'II. Projekt',
    tasks: [
      { id: 't3', title: 'T3', type: 'technical' },
    ],
  },
  {
    id: 'stage-c',
    title: 'III. Pozwolenie',
    tasks: [
      { id: 't4', title: 'T4', type: 'formal' },
    ],
  },
]

describe('StageBar', () => {
  it('renders all stage short labels', () => {
    render(
      <StageBar stages={stages} currentIndex={0} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByText('I')).toBeInTheDocument()
    expect(screen.getByText('II')).toBeInTheDocument()
    expect(screen.getByText('III')).toBeInTheDocument()
  })

  it('marks current stage as active', () => {
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={vi.fn()} />
    )
    const activeButton = screen.getByRole('button', { name: /II/i })
    expect(activeButton).toHaveClass('bg-sand-400')
  })

  it('calls onSelect with index when stage button clicked', async () => {
    const onSelect = vi.fn()
    render(
      <StageBar stages={stages} currentIndex={0} progress={{}} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button', { name: /II/i }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('shows completion indicator when all tasks in a stage are done', () => {
    render(
      <StageBar
        stages={stages}
        currentIndex={0}
        progress={{ 't1': true, 't2': true }}
        onSelect={vi.fn()}
      />
    )
    // Stage I is complete — its button should show a checkmark or completion class
    const stageAButton = screen.getByRole('button', { name: /I/i })
    expect(stageAButton).toHaveAttribute('data-complete', 'true')
  })

  it('renders previous and next navigation buttons', () => {
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: /poprzedni/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /następny/i })).toBeInTheDocument()
  })

  it('previous button calls onSelect with currentIndex - 1', async () => {
    const onSelect = vi.fn()
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button', { name: /poprzedni/i }))
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it('next button calls onSelect with currentIndex + 1', async () => {
    const onSelect = vi.fn()
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button', { name: /następny/i }))
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('previous button is disabled at first stage', () => {
    render(
      <StageBar stages={stages} currentIndex={0} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: /poprzedni/i })).toBeDisabled()
  })

  it('next button is disabled at last stage', () => {
    render(
      <StageBar stages={stages} currentIndex={2} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: /następny/i })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/StageBar.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement StageBar**

Create `src/components/StageBar.tsx`:
```tsx
import type { Stage, ProgressMap } from '../types'

interface Props {
  stages: Stage[]
  currentIndex: number
  progress: ProgressMap
  onSelect: (index: number) => void
}

function getRomanNumeral(title: string): string {
  // Extract the roman numeral prefix from "I. Działka" → "I"
  return title.split('.')[0]
}

function isStageComplete(stage: Stage, progress: ProgressMap): boolean {
  return stage.tasks.length > 0 && stage.tasks.every(t => progress[t.id])
}

export function StageBar({ stages, currentIndex, progress, onSelect }: Props) {
  return (
    <nav className="bg-white border-b border-sand-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Stage tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {stages.map((stage, index) => {
            const isActive = index === currentIndex
            const complete = isStageComplete(stage, progress)
            const roman = getRomanNumeral(stage.title)

            return (
              <button
                key={stage.id}
                onClick={() => onSelect(index)}
                aria-label={stage.title}
                data-complete={complete ? 'true' : 'false'}
                className={`
                  flex-shrink-0 w-9 h-9 rounded-full text-sm font-serif font-semibold
                  transition-colors border relative
                  ${isActive
                    ? 'bg-sand-400 text-white border-sand-400'
                    : complete
                      ? 'bg-sand-100 text-sand-500 border-sand-300'
                      : 'bg-white text-stone-700 border-sand-200 hover:border-sand-400'}
                `}
              >
                {roman}
                {complete && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-sand-400 rounded-full text-white text-[8px] flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => onSelect(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Poprzedni"
            className="text-xs text-stone-700 border border-sand-200 rounded px-3 py-1 hover:border-sand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Poprzedni
          </button>
          <span className="text-xs text-stone-700 font-sans">
            {stages[currentIndex]?.title}
          </span>
          <button
            onClick={() => onSelect(currentIndex + 1)}
            disabled={currentIndex === stages.length - 1}
            aria-label="Następny"
            className="text-xs text-stone-700 border border-sand-200 rounded px-3 py-1 hover:border-sand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Następny →
          </button>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/StageBar.test.tsx
```

Expected: 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StageBar.tsx tests/StageBar.test.tsx
git commit -m "feat: add StageBar navigation component"
```

---

## Task 8: PDF Export Utility

**Files:**
- Create: `src/utils/pdfExport.ts`
- Test: `tests/pdfExport.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/pdfExport.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { generatePdf } from '../src/utils/pdfExport'
import type { Stage } from '../src/types'

const stages: Stage[] = [
  {
    id: 'stage-1',
    title: 'I. Działka',
    tasks: [
      { id: 't1', title: 'Sprawdź MPZP', type: 'formal', tip: 'wskazówka' },
      { id: 't2', title: 'Badanie gruntu', type: 'technical' },
    ],
  },
]

describe('generatePdf', () => {
  it('returns a Uint8Array (valid PDF bytes)', async () => {
    const result = await generatePdf(stages, { 't1': true })
    expect(result).toBeInstanceOf(Uint8Array)
  })

  it('returns non-empty bytes', async () => {
    const result = await generatePdf(stages, {})
    expect(result.length).toBeGreaterThan(100)
  })

  it('accepts empty progress map without throwing', async () => {
    await expect(generatePdf(stages, {})).resolves.toBeInstanceOf(Uint8Array)
  })

  it('accepts all-done progress map without throwing', async () => {
    await expect(generatePdf(stages, { 't1': true, 't2': true })).resolves.toBeInstanceOf(Uint8Array)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/pdfExport.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement pdfExport utility**

Create `src/utils/pdfExport.ts`:
```ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { Stage, ProgressMap } from '../types'

const COLORS = {
  gold:    rgb(0.608, 0.545, 0.431), // #9b8b6e
  dark:    rgb(0.173, 0.173, 0.173), // #2c2c2c
  gray:    rgb(0.420, 0.384, 0.345), // #6b6258
  light:   rgb(0.906, 0.878, 0.835), // #e8e0d5
}

const PAGE_MARGIN = 50
const PAGE_WIDTH  = 595  // A4
const PAGE_HEIGHT = 842  // A4
const LINE_HEIGHT = 18
const TASK_HEIGHT = 22

export async function generatePdf(
  stages: Stage[],
  progress: ProgressMap,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold)

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - PAGE_MARGIN

  const ensureSpace = (needed: number) => {
    if (y - needed < PAGE_MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - PAGE_MARGIN
    }
  }

  // Title
  page.drawText('Planer Budowlany', {
    x: PAGE_MARGIN, y,
    size: 20, font: fontBold, color: COLORS.dark,
  })
  y -= LINE_HEIGHT * 1.5

  // Date
  const dateStr = new Date().toLocaleDateString('pl-PL', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  page.drawText(`Wygenerowano: ${dateStr}`, {
    x: PAGE_MARGIN, y,
    size: 9, font: fontRegular, color: COLORS.gray,
  })
  y -= LINE_HEIGHT * 2

  for (const stage of stages) {
    ensureSpace(LINE_HEIGHT * 3)

    // Stage title
    page.drawText(stage.title, {
      x: PAGE_MARGIN, y,
      size: 13, font: fontBold, color: COLORS.gold,
    })
    y -= LINE_HEIGHT * 0.4

    // Divider
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end:   { x: PAGE_WIDTH - PAGE_MARGIN, y },
      thickness: 0.5, color: COLORS.light,
    })
    y -= LINE_HEIGHT

    for (const task of stage.tasks) {
      ensureSpace(TASK_HEIGHT + 4)

      const isDone = !!progress[task.id]
      const checkboxSize = 10
      const checkboxX = PAGE_MARGIN
      const checkboxY = y - checkboxSize + 2

      // Checkbox border
      page.drawRectangle({
        x: checkboxX, y: checkboxY,
        width: checkboxSize, height: checkboxSize,
        borderColor: COLORS.gold, borderWidth: 1,
        color: isDone ? COLORS.gold : undefined,
      })

      // Checkbox check mark
      if (isDone) {
        page.drawText('✓', {
          x: checkboxX + 1, y: checkboxY + 1,
          size: 8, font: fontBold, color: rgb(1, 1, 1),
        })
      }

      // Task label
      const maxTitleWidth = PAGE_WIDTH - PAGE_MARGIN * 2 - checkboxSize - 8
      const titleFontSize = 10
      // Wrap long titles at ~90 chars
      const words = task.title.split(' ')
      const lines: string[] = []
      let current = ''
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word
        if (fontRegular.widthOfTextAtSize(candidate, titleFontSize) > maxTitleWidth) {
          if (current) lines.push(current)
          current = word
        } else {
          current = candidate
        }
      }
      if (current) lines.push(current)

      let lineY = y
      for (const line of lines) {
        page.drawText(line, {
          x: PAGE_MARGIN + checkboxSize + 8, y: lineY,
          size: titleFontSize,
          font: isDone ? fontBold : fontRegular,
          color: isDone ? COLORS.gray : COLORS.dark,
        })
        lineY -= LINE_HEIGHT
      }

      y -= Math.max(TASK_HEIGHT, (lines.length) * LINE_HEIGHT) + 2
    }

    y -= LINE_HEIGHT * 0.8
  }

  return doc.save()
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/pdfExport.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/pdfExport.ts tests/pdfExport.test.ts
git commit -m "feat: add pdf-lib PDF export utility with checkboxes"
```

---

## Task 9: ExportButton Component

**Files:**
- Create: `src/components/ExportButton.tsx`
- Test: `tests/ExportButton.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/ExportButton.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExportButton } from '../src/components/ExportButton'
import type { Stage } from '../src/types'

// Mock pdfExport so tests don't run pdf-lib
vi.mock('../src/utils/pdfExport', () => ({
  generatePdf: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}))

const stages: Stage[] = [
  {
    id: 's1',
    title: 'I. Test',
    tasks: [{ id: 't1', title: 'Task', type: 'formal' }],
  },
]

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock URL.createObjectURL and anchor click
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock')
    global.URL.revokeObjectURL = vi.fn()
  })

  it('renders export button', () => {
    render(<ExportButton stages={stages} progress={{}} />)
    expect(screen.getByRole('button', { name: /eksport pdf/i })).toBeInTheDocument()
  })

  it('shows loading state while generating', async () => {
    const { generatePdf } = await import('../src/utils/pdfExport')
    let resolvePdf!: (v: Uint8Array) => void
    vi.mocked(generatePdf).mockReturnValueOnce(
      new Promise(resolve => { resolvePdf = resolve })
    )

    render(<ExportButton stages={stages} progress={{}} />)
    await userEvent.click(screen.getByRole('button', { name: /eksport pdf/i }))

    expect(screen.getByRole('button', { name: /generowanie/i })).toBeInTheDocument()
    resolvePdf(new Uint8Array([1]))
  })

  it('calls generatePdf with all stages and progress on click', async () => {
    const { generatePdf } = await import('../src/utils/pdfExport')
    render(<ExportButton stages={stages} progress={{ 't1': true }} />)
    await userEvent.click(screen.getByRole('button', { name: /eksport pdf/i }))
    expect(generatePdf).toHaveBeenCalledWith(stages, { 't1': true })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/ExportButton.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ExportButton**

Create `src/components/ExportButton.tsx`:
```tsx
import { useState } from 'react'
import type { Stage, ProgressMap } from '../types'
import { generatePdf } from '../utils/pdfExport'

interface Props {
  stages: Stage[]
  progress: ProgressMap
}

export function ExportButton({ stages, progress }: Props) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const bytes = await generatePdf(stages, progress)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'planer-budowlany.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      aria-label={loading ? 'Generowanie PDF…' : 'Eksport PDF'}
      className="flex items-center gap-2 px-4 py-2 text-sm font-sans border border-sand-300 rounded text-stone-700 hover:border-sand-400 hover:bg-sand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <span className="inline-block w-3 h-3 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
          Generowanie…
        </>
      ) : (
        <>
          ↓ Eksport PDF
        </>
      )}
    </button>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/ExportButton.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ExportButton.tsx tests/ExportButton.test.tsx
git commit -m "feat: add ExportButton with loading state and PDF download"
```

---

## Task 10: App Assembly

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Create: `index.html` (update title)

- [ ] **Step 1: Update index.html title**

In `index.html`, replace:
```html
<title>Vite + React + TS</title>
```
with:
```html
<title>Planer Budowlany</title>
```

- [ ] **Step 2: Write App.tsx**

Replace `src/App.tsx` with:
```tsx
import { useState } from 'react'
import stagesData from './data/stages.json'
import type { StagesData } from './types'
import { useProgress } from './hooks/useProgress'
import { StageBar } from './components/StageBar'
import { StageDetail } from './components/StageDetail'
import { ExportButton } from './components/ExportButton'

const { stages } = stagesData as StagesData

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toggleTask, isTaskDone, getStageProgress } = useProgress()

  const currentStage = stages[currentIndex]
  const { done, total } = getStageProgress(currentStage.tasks)
  const allDone = stages.every(s => s.tasks.every(t => isTaskDone(t.id)))

  const progressMap = Object.fromEntries(
    stages.flatMap(s => s.tasks.map(t => [t.id, isTaskDone(t.id)]))
  )

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white border-b border-sand-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-stone-900 tracking-tight">
              Planer Budowlany
            </h1>
            <p className="text-xs text-stone-700 mt-0.5 font-sans">
              Budowa domu jednorodzinnego — formalności i wymagania techniczne
            </p>
          </div>
          <ExportButton stages={stages} progress={progressMap} />
        </div>
      </header>

      {/* Stage navigation */}
      <StageBar
        stages={stages}
        currentIndex={currentIndex}
        progress={progressMap}
        onSelect={setCurrentIndex}
      />

      {/* Stage progress summary */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sand-400 rounded-full transition-all duration-300"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-xs font-sans text-stone-700 whitespace-nowrap">
            {done} z {total} zadań
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <StageDetail
          stage={currentStage}
          progress={progressMap}
          onToggle={toggleTask}
        />

        {allDone && (
          <div className="mt-6 text-center py-8 bg-white border border-sand-200 rounded-lg">
            <p className="font-serif text-lg text-stone-900">
              Gratulacje — wszystkie etapy ukończone!
            </p>
            <p className="text-sm text-stone-700 mt-1 font-sans">
              Eksportuj pełny plan jako PDF na pamiątkę.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Update main.tsx**

Replace `src/main.tsx` with:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Enable JSON import in tsconfig**

In `tsconfig.json`, inside `"compilerOptions"`, add:
```json
"resolveJsonModule": true
```

- [ ] **Step 5: Build to verify no TypeScript errors**

```bash
npm run build
```

Expected: `dist/` created, no errors. If there are type errors with JSON import, also add `"resolveJsonModule": true` to `tsconfig.app.json` (Vite uses this file).

- [ ] **Step 6: Start dev server and verify the app works**

```bash
npm run dev
```

Open `http://localhost:5173` in the browser. Verify:
- Header with "Planer Budowlany" title is visible
- Stage navigation bar with I–VIII buttons
- Checklist of the first stage (Działka i warunki zabudowy)
- Clicking a checkbox marks it done with line-through
- Clicking "Wskazówka" shows tip text
- Clicking stage buttons navigates between stages
- Progress bar fills as tasks are completed

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/main.tsx index.html tsconfig.json
git commit -m "feat: assemble full app — StageBar + StageDetail + ExportButton wired"
```

---

## Task 11: Vercel Deploy

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json for SPA routing**

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 3: Final build check**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add vercel.json
git commit -m "chore: add Vercel SPA routing config"
```

- [ ] **Step 5: Deploy to Vercel**

```bash
npx vercel --prod
```

If first deploy: follow CLI prompts (login, project name = `planer-budowlany`, root directory = `.`). Vercel auto-detects Vite.

Expected: deployment URL printed (e.g., `https://planer-budowlany.vercel.app`).

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|-----------------|-----------|
| 8 stages with formal/technical tasks | Task 3 (stages.json) |
| Checkboxes, progress in localStorage | Task 4 (useProgress) |
| Progress bar per stage | Task 7 (StageBar) |
| Stage navigation (prev/next) | Task 7 (StageBar) |
| Optional tips per task | Task 5 (TaskItem) |
| PDF export with checkboxes | Task 8 (pdfExport) |
| PDF download trigger | Task 9 (ExportButton) |
| Color palette: sand/gold | Task 1 (Tailwind config) + Task 10 (App) |
| Georgia serif typography | Task 1 (index.css) |
| Vercel deploy | Task 11 |

**Placeholder scan:** None found — all tasks contain complete code.

**Type consistency check:** `Stage`, `Task`, `ProgressMap` defined in Task 2 (`src/types.ts`) and used consistently across hooks, components, and utils. `StagesData` used in App.tsx matches the JSON wrapper type.
