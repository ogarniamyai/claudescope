# Polityka prywatności ClaudeScope

_Polish version below. English version follows._

## Po polsku

**Data ostatniej aktualizacji:** 2026-06-13

ClaudeScope to rozszerzenie do przeglądarki tworzone przez **ogarniamy.ai**, które pokazuje wykorzystanie limitów konta claude.ai, czas aktywności, datę odnowienia subskrypcji i godziny szczytu.

### Jakie dane są zbierane?

**Żadne nie opuszczają Twojej przeglądarki.** ClaudeScope nie wysyła nic na żaden zewnętrzny serwer. Po prostu nie ma serwera ClaudeScope.

Wszystko co rozszerzenie robi:

- Czyta dane Twojego konta z `claude.ai` bezpośrednio w Twojej przeglądarce (te same dane, które widzisz na stronie).
- Zapisuje wyliczone wartości (procent wykorzystania, historię aktywności, statystyki promptów) w lokalnym magazynie przeglądarki (`chrome.storage.local`).
- Wszystkie obliczenia wykonują się lokalnie w Twojej przeglądarce.

### Gdzie dane są przechowywane?

Wyłącznie w pamięci lokalnej Twojej przeglądarki na Twoim urządzeniu. Dane nie są synchronizowane między urządzeniami przez ClaudeScope. Jeśli odinstalujesz rozszerzenie albo wyczyścisz dane przeglądarki, wszystko znika razem z nimi.

### Komu dane są udostępniane?

Nikomu. Brak zewnętrznych serwerów, brak analityki, brak śledzenia, brak reklam, brak sprzedaży danych.

### Z jakich uprawnień korzysta rozszerzenie?

- `storage`, do zapisu danych lokalnie w przeglądarce.
- `host_permissions: https://claude.ai/*`, żeby móc odczytywać dane Twojego konta wyłącznie na stronie `claude.ai`. Rozszerzenie nie ma dostępu do żadnej innej strony.

### Konta, logowanie, śledzenie

ClaudeScope nie wymaga rejestracji, nie ma kont, nie loguje, nie używa cookie poza tym, czego wymaga `claude.ai`.

### Kontakt

Pytania o prywatność: napisz issue na https://github.com/ogarniamyai/claudescope/issues lub na adres wskazany w sklepie z rozszerzeniami.

---

## In English

**Last updated:** 2026-06-13

ClaudeScope is a browser extension built by **ogarniamy.ai** that surfaces your claude.ai account usage, active time, subscription renewal and peak hours.

### What data is collected?

**None of it leaves your browser.** ClaudeScope has no backend. There is no ClaudeScope server.

What the extension does:

- Reads your account data from `claude.ai` directly inside your browser (the same data the page already shows you).
- Stores computed values (usage percentages, activity history, prompt statistics) in the browser's local storage (`chrome.storage.local`).
- All computation happens locally in your browser.

### Where is the data stored?

Only in your browser's local storage on your device. ClaudeScope does not sync data across devices. Uninstalling the extension or clearing browser data removes everything.

### Who is the data shared with?

Nobody. No remote servers, no analytics, no tracking, no ads, no data sales.

### Permissions used by the extension

- `storage`, to save data locally in the browser.
- `host_permissions: https://claude.ai/*`, to read your account data only on `claude.ai`. The extension has no access to any other site.

### Accounts, login, tracking

ClaudeScope requires no registration, has no accounts, performs no logins, and uses no cookies beyond what `claude.ai` itself requires.

### Contact

Privacy questions: open an issue at https://github.com/ogarniamyai/claudescope/issues or use the contact email shown on the extension's store page.
