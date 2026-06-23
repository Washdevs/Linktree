const storageKey = 'minimal-linktree-profile-v2';

function mergeProfile(defaultProfile, profile) {
  return {
    ...defaultProfile,
    ...profile,
    links: Array.isArray(profile?.links) ? profile.links : defaultProfile.links,
  };
}

function loadLocalProfile(defaultProfile) {
  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return defaultProfile;
    }

    return mergeProfile(defaultProfile, JSON.parse(stored));
  } catch {
    return defaultProfile;
  }
}

export async function loadProfile(defaultProfile) {
  try {
    const response = await fetch('/api/profile', {
      cache: 'no-store',
    });

    if (response.ok) {
      return mergeProfile(defaultProfile, await response.json());
    }
  } catch {
    return loadLocalProfile(defaultProfile);
  }

  return loadLocalProfile(defaultProfile);
}

export async function saveProfile(profile) {
  try {
    const response = await fetch('/api/profile', {
      body: JSON.stringify(profile),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });

    if (response.ok) {
      return;
    }
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(profile));
}
