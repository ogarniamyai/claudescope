# Changelog

Format wzorowany na [Keep a Changelog](https://keepachangelog.com/), wersjonowanie wg [SemVer](https://semver.org/).

## [1.1.0] – 2026-06-13

### Dodane
- Build dla Safari na macOS – paczka `claudex-safari-*.zip` z aplikacją zawierającą rozszerzenie, dołączana do każdego release'a obok wersji Chrome i Firefox.
- `CHANGELOG.md` – historia zmian.

### Zmienione
- Workflow `release.yml` rozbity na trzy joby: `build-web` (Chrome + Firefox na Ubuntu), `build-safari` (macOS) oraz `publish` (zbiera artefakty i publikuje release).
- README rozszerzone o sekcję instalacji w Safari.

## [1.0.0] – 2026-06-12

### Dodane
- Pierwsza publiczna wersja ClaudeX.
- Panel boczny na claude.ai z licznikami limitu 5-godzinnego, tygodniowego, cyklu rozliczeniowego, czasu aktywności oraz wskaźnikiem godzin szczytu.
- Panel szczegółowy: rozkład promptów według modelu, limity sesji, szczegóły subskrypcji, mapa godzin szczytu, historia aktywności.
- Build i automatyczna publikacja paczek `claudex-chrome-*.zip` oraz podpisanego `claudex-firefox-*.xpi` z GitHub Actions po push'u taga `v*`.

[1.1.0]: https://github.com/ogarniamyai/claudex/releases/tag/v1.1.0
[1.0.0]: https://github.com/ogarniamyai/claudex/releases/tag/v1.0.0
