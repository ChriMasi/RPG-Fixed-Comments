

[See English version below](#english-version)


# Commenti RPG per VS Code

**Repository:** [github.com/ChriMasi/RPG-Fixed-Comments](https://github.com/ChriMasi/RPG-Fixed-Comments)

Estensione per la gestione rapida dei commenti nei file RPG, RPGLE, LF, DSPF su IBM i.

## Funzionalità principali
- **Aggiungi/rimuovi commento in colonna 7**: `Ctrl+ù` (`Ctrl+oem_2`)
	- Se non ci sono asterischi, inserisce un solo `*` in colonna 7.
	- Se ci sono asterischi consecutivi (fino a 9, o tutti se attivi l'opzione avanzata), li rimuove tutti.
- **Inserisci N asterischi (2-9)**: `Ctrl+NumPad *` seguito da `2`...`9` oppure `NumPad2`...`NumPad9`
- **Pulizia universale**: `Ctrl+NumPad *` seguito da `0` oppure `NumPad0`
	- Rimuove tutti gli asterischi consecutivi dalla colonna 7 (fino a 9 o tutti, vedi impostazione avanzata)
- **Trasforma selezione in asterischi**: `Ctrl+Alt+NumPad *`
	- Ogni selezione viene sostituita da una sequenza di `*` della stessa lunghezza

## Impostazione avanzata
- `commentirpg.fullUniversalCleaner` (boolean, default: `false`)
	- Se attivo, i comandi di pulizia rimuovono tutti gli asterischi consecutivi dalla colonna 7 fino al primo carattere non `*`.
	- **Attenzione**: può interferire con righe speciali come `*INZSR` o `*PSSR` se costituite da soli asterischi prima del codice.

## Esempi di shortcut
- `Ctrl+ù` → toggle commento in colonna 7 (aggiungi/togli)
- `Ctrl+NumPad *` + `3` → inserisci/togli 3 asterischi da colonna 7
- `Ctrl+NumPad *` + `0` → pulizia universale asterischi
- `Ctrl+Alt+NumPad *` → trasforma selezione in asterischi

## Lingue supportate
- RPG, RPGLE, LF, DSPF (estensioni: `.rpg`, `.rpgle`, `.lf`, `.dspf`, ...)

---

# English version

[Versione italiana sopra](#commenti-rpg-per-vs-code)


# RPG Comments for VS Code

**Repository:** [github.com/ChriMasi/RPG-Fixed-Comments](https://github.com/ChriMasi/RPG-Fixed-Comments)

Extension for fast comment management in RPG, RPGLE, LF, DSPF files on IBM i.

## Main features
- **Add/remove comment in column 7**: `Ctrl+ù` (`Ctrl+oem_2`)
	- If there are no asterisks, inserts a single `*` in column 7.
	- If there are consecutive asterisks (up to 9, or all if advanced option enabled), removes them all.
- **Insert N asterisks (2-9)**: `Ctrl+NumPad *` then `2`...`9` or `NumPad2`...`NumPad9`
- **Universal cleaner**: `Ctrl+NumPad *` then `0` or `NumPad0`
	- Removes all consecutive asterisks from column 7 (up to 9 or all, see advanced setting)
- **Transform selection to asterisks**: `Ctrl+Alt+NumPad *`
	- Each selection is replaced by a sequence of `*` of the same length

## Advanced setting
- `commentirpg.fullUniversalCleaner` (boolean, default: `false`)
	- If enabled, cleaning commands remove all consecutive asterisks from column 7 up to the first non-`*` character.
	- **Warning**: may interfere with special lines like `*INZSR` or `*PSSR` if made only of asterisks before the code.

## Shortcut examples
- `Ctrl+ù` → toggle comment in column 7 (add/remove)
- `Ctrl+NumPad *` + `3` → insert/remove 3 asterisks from column 7
- `Ctrl+NumPad *` + `0` → universal asterisk cleaner
- `Ctrl+Alt+NumPad *` → transform selection to asterisks

## Supported languages
- RPG, RPGLE, LF, DSPF (extensions: `.rpg`, `.rpgle`, `.lf`, `.dspf`, ...)
