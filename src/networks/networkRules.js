import { defaultIcons } from '../data/defaultProfile.js';

const allowedProtocols = new Set(['http:', 'https:']);

function withProtocol(input) {
  const value = input.trim();

  if (!value) {
    throw new Error('Informe uma URL.');
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function toUrl(input) {
  try {
    const url = new URL(withProtocol(input));

    if (!allowedProtocols.has(url.protocol)) {
      throw new Error('Use apenas URLs HTTP ou HTTPS.');
    }

    url.hash = '';
    return url;
  } catch (error) {
    if (error.message.includes('HTTP')) {
      throw error;
    }

    throw new Error('URL invalida.');
  }
}

function hostMatches(url, domains) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function normalizeWebUrl(input) {
  const url = toUrl(input);
  url.protocol = 'https:';
  return url.toString();
}

function lastPathSegment(url) {
  const segments = url.pathname.split('/').filter(Boolean);
  return segments.at(-1) || '';
}

function hostLabel(input) {
  try {
    return new URL(input).hostname.replace(/^www\./, '');
  } catch {
    return 'Website';
  }
}

function normalizeHandle(input, baseUrl, pattern) {
  const value = input.trim().replace(/^@/, '');

  if (pattern.test(value)) {
    return `${baseUrl}/${value}`;
  }

  return normalizeWebUrl(input);
}

function normalizeWhatsApp(input) {
  const value = input.trim();
  const digits = value.replace(/\D/g, '');
  const phoneLike = /^\+?[\d\s().-]{8,22}$/.test(value);

  if (phoneLike && digits.length >= 8) {
    return `https://wa.me/${digits}`;
  }

  return normalizeWebUrl(value);
}

function makeRule({ id, name, domains, icon, initials, accent, normalize, getLabel, validate }) {
  return {
    id,
    name,
    domains,
    icon: icon || null,
    initials,
    accent,
    normalize: normalize || normalizeWebUrl,
    validate: validate || ((url) => hostMatches(new URL(url), domains)),
    getLabel: getLabel || (() => name),
  };
}

export const networkRules = [
  makeRule({
    id: 'whatsapp',
    name: 'WhatsApp',
    domains: ['wa.me', 'whatsapp.com', 'api.whatsapp.com'],
    icon: defaultIcons.whatsapp,
    initials: 'WA',
    accent: '#1f9d55',
    normalize: normalizeWhatsApp,
  }),
  makeRule({
    id: 'instagram',
    name: 'Instagram',
    domains: ['instagram.com'],
    icon: defaultIcons.instagram,
    initials: 'IG',
    accent: '#d9467e',
    normalize: (input) =>
      normalizeHandle(input, 'https://instagram.com', /^[a-zA-Z0-9._]{1,30}$/),
    getLabel: (url) => {
      const handle = lastPathSegment(new URL(url));
      return handle ? `@${handle}` : 'Instagram';
    },
  }),
  makeRule({
    id: 'youtube',
    name: 'YouTube',
    domains: ['youtube.com', 'youtu.be'],
    initials: 'YT',
    accent: '#d61f1f',
    getLabel: () => 'YouTube',
  }),
  makeRule({
    id: 'telegram',
    name: 'Telegram',
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    initials: 'TG',
    accent: '#249bd7',
    normalize: (input) => normalizeHandle(input, 'https://t.me', /^[a-zA-Z0-9_]{5,32}$/),
    getLabel: (url) => {
      const handle = lastPathSegment(new URL(url));
      return handle ? `@${handle}` : 'Telegram';
    },
  }),
  makeRule({
    id: 'googleMaps',
    name: 'Google Maps',
    domains: ['maps.app.goo.gl', 'google.com', 'goo.gl'],
    icon: defaultIcons.location,
    initials: 'MAP',
    accent: '#18864b',
    validate: (url) => {
      const parsed = new URL(url);
      const path = parsed.pathname.toLowerCase();
      return hostMatches(parsed, ['maps.app.goo.gl', 'goo.gl']) || path.includes('/maps');
    },
    getLabel: () => 'Localizacao',
  }),
  makeRule({
    id: 'google',
    name: 'Google',
    domains: ['g.co', 'google.com'],
    icon: defaultIcons.google,
    initials: 'GO',
    accent: '#3871e0',
    getLabel: () => 'Perfil Google',
  }),
  makeRule({
    id: 'website',
    name: 'Website',
    domains: [],
    initials: 'WWW',
    accent: '#111827',
    validate: (url) => allowedProtocols.has(new URL(url).protocol),
    getLabel: hostLabel,
  }),
];

export function getNetworkRule(id) {
  return networkRules.find((network) => network.id === id) || networkRules.at(-1);
}

export function inferNetworkFromUrl(input) {
  const normalized = normalizeWebUrl(input);

  return (
    networkRules.find((network) => {
      if (network.id === 'website') {
        return false;
      }

      try {
        return network.validate(normalized);
      } catch {
        return false;
      }
    }) || getNetworkRule('website')
  );
}

export function createLinkPayload({ networkId, url }) {
  const selectedNetwork = networkId === 'detect' ? inferNetworkFromUrl(url) : getNetworkRule(networkId);
  const normalizedUrl = selectedNetwork.normalize(url);

  if (!selectedNetwork.validate(normalizedUrl)) {
    throw new Error(`A URL nao corresponde a ${selectedNetwork.name}.`);
  }

  return {
    networkId: selectedNetwork.id,
    label: selectedNetwork.getLabel(normalizedUrl),
    url: normalizedUrl,
  };
}
