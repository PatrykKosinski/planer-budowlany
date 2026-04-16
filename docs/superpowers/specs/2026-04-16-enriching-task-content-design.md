# Design: Wzbogacanie treści tasków — obrazki i głębszy research

**Data:** 2026-04-16
**Projekt:** Planer Budowlany

---

## Cel

Wzbogacenie ~50 artykułów markdown w `src/content/tasks/` o:
- Głębszy research: aktualne koszty, terminy urzędowe, podstawy prawne
- Nowe sekcje: FAQ (3–5 pytań) i Przykład z życia
- Obrazki techniczne z Wikimedia Commons, przechowywane lokalnie

---

## Struktura plików obrazków

Obrazki przechowywane w repozytorium:

```
public/images/tasks/
  [taskId]/
    [nazwa-obrazka].jpg
```

Przykład:
```
public/images/tasks/fund-lawy/lawy-przekroj.jpg
```

Odwołanie w markdown:
```markdown
![Schemat ław fundamentowych](/images/tasks/fund-lawy/lawy-przekroj.jpg)
```

---

## Zmiany w kodzie

**Plik:** `src/components/TaskItem.tsx`

Dodać klasy Tailwind prose dla obrazków w istniejącym bloku `prose`:

```tsx
prose-img:rounded prose-img:max-w-full prose-img:my-3
```

Nie są potrzebne żadne inne zmiany — ReactMarkdown już renderuje tagi `![...]()`.

---

## Szablon promptu dla Perplexity

Używać raz na etap budowy (wklejać 5–7 tasków naraz):

```
Jesteś ekspertem od polskiego prawa budowlanego i procesu budowy domu jednorodzinnego.
Poniżej masz artykuły z aplikacji dla inwestorów indywidualnych. Dla każdego artykułu:

1. Sprawdź i uzupełnij fakty — aktualne koszty (2024/2025), terminy urzędowe,
   podstawy prawne (numer ustawy/rozporządzenia)
2. Dodaj sekcję FAQ (3–5 pytań które zadaje inwestor)
3. Dodaj sekcję Przykład z życia (konkretna sytuacja, 2–3 zdania)
4. Jeśli są linki do formularzy lub serwisów rządowych — dodaj je
5. Zachowaj oryginalny styl i język — prosty, praktyczny, po polsku
6. Nie usuwaj żadnych istniejących sekcji

---
[WKLEJ TUTAJ TREŚĆ PLIKÓW MD]
```

Po Perplexity — wkleić wynik do ChatGPT lub Gemini z prośbą o korektę stylu:
> "Sprawdź czy styl jest spójny i naturalny. Popraw jeśli coś brzmi sztucznie."

---

## Workflow — krok po kroku (8 etapów)

Dla każdego z 8 etapów budowy:

1. **Przygotuj batch** — otwórz wszystkie `.md` z etapu (np. `dzialka-*`), skopiuj treści do promptu
2. **Perplexity** — wklej prompt + treści, skopiuj wzbogacone artykuły z powrotem do plików
3. **ChatGPT/Gemini** — wklej wynik, poproś o korektę stylu i spójności
4. **Wikimedia Commons** (`commons.wikimedia.org`) — dla każdego tasku znajdź 1–2 obrazki techniczne, pobierz do `public/images/tasks/[taskId]/`
5. **Dodaj obrazki do markdown** — wklej `![opis](/images/tasks/[taskId]/nazwa.jpg)` w artykule
6. **Sprawdź w przeglądarce** — `npm run dev`, otwórz task, sprawdź artykuł i obrazek

**Szacowany czas:** 1–2 godziny na etap, łącznie 8–16 godzin.

---

## Narzędzia i ich rola

| Narzędzie | Rola |
|---|---|
| Perplexity | Research faktów, kosztów, przepisów (szuka w sieci) |
| ChatGPT / Gemini | Korekta stylu, spójność języka |
| Wikimedia Commons | Obrazki techniczne z wolną licencją (CC) |
| NotebookLM | Nie używać — nie nadaje się do tego zastosowania |

---

## Etapy budowy i foldery tasków

| Etap | Prefix tasków |
|---|---|
| Działka | `dzialka-*` |
| Projekt | `projekt-*` |
| Pozwolenie na budowę | `pnb-*` |
| Fundamenty | `fund-*` |
| Stan surowy otwarty | `sso-*` |
| Stan surowy zamknięty | `ssz-*` |
| Instalacje | `inst-*` |
| Odbiór | `odb-*` |
