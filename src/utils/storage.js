const storageKey = 'minimal-linktree-profile-v1';

export function loadProfile(defaultProfile) {
  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return defaultProfile;
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultProfile,
      ...parsed,
      links: Array.isArray(parsed.links) ? parsed.links : defaultProfile.links,
    };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile) {
  window.localStorage.setItem(storageKey, JSON.stringify(profile));
}
