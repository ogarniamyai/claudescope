# ClaudeScope

Rozszerzenie przeglądarki dla `claude.ai`. Czyta z API konta (te same endpointy, których używa sama strona) i renderuje w panelu bocznym: limity 5h / 7d, cykl rozliczeniowy, godziny szczytu, czas aktywności, rozkład promptów per model. Wszystko liczy się lokalnie, nic nie wychodzi z przeglądarki.

Tworzone przez [ogarniamy.ai](https://ogarniamy.ai).

## Instalacja

Paczki gotowe do instalacji znajdziesz w [najnowszym release'ie](https://github.com/ogarniamyai/claudescope/releases/latest).

**Chrome / Edge / Brave / Opera / Vivaldi / Arc**
1. Pobierz `claudescope-chrome-*.zip` i rozpakuj. Folder musi pozostać na dysku — przeglądarka ładuje wtyczkę bezpośrednio z niego.
2. `chrome://extensions` → włącz tryb dewelopera → „Załaduj rozpakowane" → wskaż folder.

**Firefox**
1. Pobierz `claudescope-firefox-*.xpi`.
2. Otwórz plik w Firefoksie (drag&drop na okno albo `Plik → Otwórz plik`).

Aktualizacja: nowy `.xpi` w Firefoksie sam się podmieni. W Chromium podmień zawartość folderu i kliknij refresh w `chrome://extensions`.

## Development

To jest waniliowy MV3 content script bez bundlera ani transpilacji. Edytujesz pliki, klikasz refresh w `chrome://extensions`, zmiany są widoczne.

```
# załaduj jako unpacked:
chrome://extensions → tryb dewelopera → "Załaduj rozpakowane" → wskaż katalog repo
```

`manifest.json` deklaruje listę skryptów ładowanych po kolei jako jeden content script na `https://claude.ai/*`. Kolejność ma znaczenie — `core/ns.js` musi pojechać pierwszy, `boot.js` ostatni. Build do paczek `.zip` / `.xpi` robi `.github/workflows/release.yml` przy push'u taga `v*` — lokalnie nic nie kompilujesz.

Wersję trzymaj zsynchronizowaną między `manifest.json` a tagiem git. Workflow `publish-stores.yml` przeflashowuje wersję z taga do manifestu przed buildem, ale na lokalnym disku zostawia stary numer.

## Architektura

```
src/
├── core/      podstawa: namespace OG, semver, zegar, etykiety, magazyn (storage)
├── feed/      pobieranie danych z claude.ai (usage, billing, peak window)
├── capture/   przechwytywanie modelu z requestów /completion (injected script + relay)
├── pulse/     liczniki: obecność (presence), ledger zdarzeń, dziennik użycia, rollup statystyk
├── surface/   warstwa UI: shadow DOM host, mini panel (rail), drawer, kafelki, skin
└── boot.js    spina to wszystko po DOMContentLoaded
```

Globalny namespace `OG` (definiowany w `core/ns.js`) służy za szynę komunikacji między modułami — każdy plik dopisuje swoje API do `OG.*`, `boot.js` orkiestruje cykl render. Konfiguracja runtime (URL-e API, interwał pollu, peak windows, progi alertów) siedzi w `config/runtime.config.json` i jest ściągana z jsDelivr przy starcie (z fallbackiem do wersji wbudowanej w paczkę), żeby dało się tuningować zachowanie bez wypychania nowej wersji do sklepów.

Capture modelu robi się w sandboxie strony — `capture/model-reader.injected.js` jest wstrzykiwany jako `<script>` i podpina się pod `window.fetch` + `XMLHttpRequest.prototype.send`, żeby wyciągać nazwę modelu z body POST-a do `/completion`. Komunikuje się z resztą wtyczki przez `window.postMessage` (kanał `claudescope`).

UI żyje w shadow DOM zamontowanym do `<html>` — żadne style claude.ai nie wyciekają w żadną stronę. Skin trzymany jako stringified CSS w `surface/skin.js`.

## Prywatność

Wtyczka ma dostęp wyłącznie do `claude.ai`. Nie ma backendu, nie wysyła nic na zewnątrz, dane lecą do `chrome.storage.local`. Pełny tekst: [PRIVACY.md](PRIVACY.md).

## Licencja

Proprietary, All Rights Reserved. Kod jest publiczny dla transparencji bezpieczeństwa — nie jest open source. Pull requesty nie są przyjmowane. Pełny tekst: [LICENSE](LICENSE). Bugi i sugestie: [issues](https://github.com/ogarniamyai/claudescope/issues).
