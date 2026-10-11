const FALLBACK_DISPLAY_NAME = 'Player';
const UNICODE__PATTERN = /[\p{L}\p{N}]/u;

export const getProfileName = (displayName: string, email: string): string => {
  const name = displayName.trim();
  const emailName = email.split('@', 1)[0].trim();

  return name || emailName || FALLBACK_DISPLAY_NAME;
}

export const getInitials = (name: string): string | undefined => {
  const firstTwoWords = name.trim().split(/\s+/).slice(0, 2);

  const characters: string[] = [];

  for (const word of firstTwoWords) {
    const matchedWord = word.match(UNICODE__PATTERN)
    if (matchedWord) {
      characters.push(matchedWord[0])
    }
  }

  return characters.join('').toUpperCase() || undefined;
}