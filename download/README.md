The `crowdin-synchronization/download` GitHub action updates the translations in the [OBS Studio repository](https://github.com/obsproject/obs-studio):

- Translation files
  - Removes empty lines.
  - Removes translations equal to their source text.
  - Replaces manually placed line breaks by translators with `\n`.
- `UI/xdg-data/com.obsproject.Studio.desktop`
- `UI/data/locale.ini`
  - Copies the name of the language from the `Language` string.
  - Languages with at least 60% will be added.
  - Languages with less than 30% will be removed.
- `AUTHORS`
  - Git contributors
  - Translators
