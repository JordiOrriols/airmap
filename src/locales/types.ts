export interface Translation {
  [key: string]: string;
}

export interface Locale {
  translation: Translation;
}
