# Changelog

Format wzorowany na [Keep a Changelog](https://keepachangelog.com/), wersjonowanie wg [SemVer](https://semver.org/).

## [1.2.5] - 2026-06-17

### Naprawione
- Cache org id przeżywał przelogowanie. `OG.org.resolve()` trzymało `og.orgId` w `chrome.storage` bez TTL ani inwalidacji, więc po przelogowaniu z konta darmowego na płatne ekstensja dalej wołała `/api/organizations/<stary-org-id>/subscription_details`, dostawała 404 i interpretowała to jako Plan Darmowy (mimo że user był na paid). Teraz cache org id żyje tylko w pamięci content scriptu — refresh strony resetuje go i wymusza świeży probe. Persistent storage zostaje jako fallback gdy probe padnie (offline, endpoint down).

## [1.2.4] - 2026-06-17

### Dodane
- Plan darmowy w panelu subskrypcji. Endpoint `/api/organizations/{org}/subscription_details` na kontach free zwraca 404 — ClaudeScope traktuje to teraz jako sygnał „Plan darmowy" zamiast błędu fetcha. W mini pasku i w głównym panelu zamiast kółka z procentami i dniami do końca cyklu pokazujemy duży napis „Plan darmowy". Wcześniej free userzy widzieli czerwony banner „Nie udało się pobrać danych subskrypcji." bo 404 leciało do tej samej ścieżki co realne błędy 5xx.

## [1.2.3] - 2026-06-15

### Zmienione
- Firefox `strict_min_version` podniesiony z `140.0` na `142.0`. Firefox for Android dostał `data_collection_permissions` dopiero w 142 (desktop w 140), więc walidator AMO dalej zgłaszał ostrzeżenie pod kątem Androida. Bump do 142 zamyka temat dla obu platform jednym numerem.

## [1.2.2] - 2026-06-15

### Zmienione
- Firefox `strict_min_version` podniesiony z `115.0` na `140.0`. Powód: `data_collection_permissions` (dodane w 1.2.1) Firefox zna dopiero od wersji 140, więc na 115-139 to pole było ignorowane i walidator AMO zgłaszał 2 ostrzeżenia kosmetyczne. Tracimy teoretycznie userów ESR 115 i 128, ale dla wtyczki do `claude.ai` to praktycznie nieistotna baza.

## [1.2.1] - 2026-06-15

### Naprawione
- AMO validator odrzucał paczkę `claudescope-firefox-1.2.0-source.xpi` z błędem „The `data_collection_permissions` property is missing". Mozilla od kilku tygodni wymaga zadeklarowania, jakie dane wtyczka zbiera i transmituje (Firefox built-in data consent). Workflow `release.yml` i `publish-stores.yml` dorzucają teraz przy budowie Firefox XPI: `browser_specific_settings.gecko.data_collection_permissions = { required: ["none"] }`. ClaudeScope nic nie wysyła na zewnątrz, więc „none" to prawda. Dotyczy tylko Firefox — Chrome ignoruje to pole, więc paczka CWS bez zmian.

## [1.2.0] - 2026-06-15

### Zmienione
- Rebrand: ClaudeX -> ClaudeScope. Wymieniona nazwa we wszystkich tekstach widocznych dla użytkownika (manifest, drawer, tooltipy, logi w konsoli) oraz w wewnętrznych identyfikatorach (mount id w shadow DOM, kanał message bus, beacon model-readera).
- Logo: nowy znak (heksagon z wskaźnikiem typu „gauge") zamiast siatki neuronów. Plik `assets/mark.svg`, ikony `assets/mark-{16,32,48,128}.png` przerenderowane z `assets/icon.svg` (ciemnoniebieski zaokrąglony kwadrat + gauge) przez `sharp` z kernelem lanczos3.
- `assets/logo-inverted.svg` zamienione: wcześniej była tam wordmark marki ogarniamy.ai, teraz pełen logotyp ClaudeScope (mark + napis) na ciemne tło. Z drawer header'a wyleciał redundantny pill „CLAUDESCOPE".
- Mini panel: przy resecie limitu tygodniowego pokazujemy teraz nazwę dnia, np. „sobota 04:00" zamiast samej godziny. Sama godzina przy tygodniówce była myląca — nie było wiadomo, czy chodzi o jutro, czy za 5 dni. Reset 5h dalej tylko godzina (zwykle ten sam dzień).
- Firefox extension ID podmieniony na `claudescope@ogarniamy.ai`. To oznacza nowy listing na AMO — userzy ClaudeX nie dostaną auto-update, muszą sami zainstalować ClaudeScope. ID dla CWS nie zmienia się, więc tam jest klasyczny update.
- URL repo zmieniony z `ogarniamyai/claudex` na `ogarniamyai/claudescope` — zaktualizowane w README, PRIVACY, CHANGELOG, `config/runtime.config.json` (selfUpdate configUrl), workflows.
- Artefakty z release.yml: `claudescope-chrome-X.Y.Z.zip` i `claudescope-firefox-X.Y.Z-source.xpi` zamiast `claudex-*`.
- README przepisane pod technicznego czytelnika: instalacja, dev/build, mapa katalogów `src/`, prywatność, licencja. Bez screenów i copy marketingowego — to idzie na blog ogarniamy.ai.
- Store-assets (5 obrazków 1280×800) przerenderowane: brand text po lewej, prawdziwy screen z `readme-assets/` po prawej. Nazwa ClaudeX i stare logo zniknęły, copy 01-hero i 03-modele dopieszczone.

### Naprawione
- `readme-assets/extension-prompts-per-model.png` i `extension-usage.png` przycięte, żeby pozbyć się starego logo i stopki „ClaudeX 1.0.0".

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

[1.2.5]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.2.5
[1.2.4]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.2.4
[1.2.3]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.2.3
[1.2.2]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.2.2
[1.2.1]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.2.1
[1.2.0]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.2.0
[1.1.4]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.1.4
[1.1.3]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.1.3
[1.1.2]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.1.2
[1.1.1]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.1.1
[1.1.0]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.1.0
[1.0.0]: https://github.com/ogarniamyai/claudescope/releases/tag/v1.0.0
