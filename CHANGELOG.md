# Changelog

Format wzorowany na [Keep a Changelog](https://keepachangelog.com/), wersjonowanie wg [SemVer](https://semver.org/).

## [1.1.4] - 2026-06-13

### Naprawione
- `release.yml` przestaje automatycznie podpisywać Firefox XPI jako unlisted. Auto-sign przy każdym tagu spalał kolejne numery wersji na AMO, blokując pierwsze listed submission (1.1.0 do 1.1.3 były tam zarezerwowane jako unlisted). Workflow teraz buduje tylko niepodpisany `claudex-firefox-X.Y.Z-source.xpi` jako artefakt. Podpisywanie i wgrywanie do AMO odbywa się przez `publish-stores.yml` (channel listed) lub ręcznie przez AMO Developer Hub.

## [1.1.3] - 2026-06-13

### Dodane
- Workflow `publish-stores.yml`, ręczny przycisk w GitHub Actions do publikowania do Chrome Web Store i Mozilla AMO. Wybierasz wersję i sklep, klikasz Run.
- `LICENSE` (proprietary, All Rights Reserved) i `PRIVACY.md`.
- `store-assets/` z zrzutami 1280x800 dla CWS.

### Zmienione
- Wersja podbita do 1.1.3, żeby zwolnić numer dla pierwszej listed publikacji na AMO (wersje 1.1.0 do 1.1.2 są tam już zarejestrowane jako unlisted, więc tej samej wersji nie da się zgłosić ponownie).
- README i PRIVACY: usunięte em-dashe i en-dashe, ton bardziej naturalny, dodana sekcja o licencji.

## [1.1.2] - 2026-06-13

### Usunięte
- Build dla Safari (`claudex-safari-*.zip`) został wycofany. Na macOS 15+ Safari Web Extensions wymagają podpisu Apple Developer ID, żeby PluginKit zarejestrował `.appex`. Niepodpisana paczka nie jest możliwa do zainstalowania nawet z włączonym „Allow Unsigned Extensions". Wracamy do tematu, gdy podpis Apple Developer ID będzie dostępny.

### Zmienione
- Workflow `release.yml` zredukowany do `build-web` plus `publish` (job `build-safari` usunięty).
- README: usunięta sekcja instalacji w Safari.

## [1.1.1] - 2026-06-13

### Naprawione
- Safari: aplikacja `ClaudeX.app` w paczce 1.1.0 była zupełnie niepodpisana, przez co macOS pokazywał „ClaudeX jest uszkodzona i nie można jej otworzyć". W workflow włączony został podpis ad-hoc (`codesign --sign -`). Gatekeeper pokazuje teraz standardowe ostrzeżenie „nieznany deweloper", które obchodzi się prawym-klikiem, Otwórz, zamiast blokować start aplikacji.
- README: instrukcja dla Safari uzupełniona o komendę `xattr -dr com.apple.quarantine` jako fallback dla użytkowników, którzy zostali z paczką 1.1.0 lub trafią na flagę kwarantanny.

## [1.1.0] - 2026-06-13

### Dodane
- Build dla Safari na macOS, paczka `claudex-safari-*.zip` z aplikacją zawierającą rozszerzenie, dołączana do każdego release'a obok wersji Chrome i Firefox.
- `CHANGELOG.md`, historia zmian.

### Zmienione
- Workflow `release.yml` rozbity na trzy joby: `build-web` (Chrome plus Firefox na Ubuntu), `build-safari` (macOS) oraz `publish` (zbiera artefakty i publikuje release).
- README rozszerzone o sekcję instalacji w Safari.

## [1.0.0] - 2026-06-12

### Dodane
- Pierwsza publiczna wersja ClaudeX.
- Panel boczny na claude.ai z licznikami limitu 5-godzinnego, tygodniowego, cyklu rozliczeniowego, czasu aktywności oraz wskaźnikiem godzin szczytu.
- Panel szczegółowy: rozkład promptów według modelu, limity sesji, szczegóły subskrypcji, mapa godzin szczytu, historia aktywności.
- Build i automatyczna publikacja paczek `claudex-chrome-*.zip` oraz podpisanego `claudex-firefox-*.xpi` z GitHub Actions po push'u taga `v*`.

[1.1.4]: https://github.com/ogarniamyai/claudex/releases/tag/v1.1.4
[1.1.3]: https://github.com/ogarniamyai/claudex/releases/tag/v1.1.3
[1.1.2]: https://github.com/ogarniamyai/claudex/releases/tag/v1.1.2
[1.1.1]: https://github.com/ogarniamyai/claudex/releases/tag/v1.1.1
[1.1.0]: https://github.com/ogarniamyai/claudex/releases/tag/v1.1.0
[1.0.0]: https://github.com/ogarniamyai/claudex/releases/tag/v1.0.0
