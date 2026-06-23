import { Globe2, Mail } from 'lucide-react';
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaMedium,
  FaPatreon,
  FaPinterestP,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { SiBuymeacoffee, SiGooglemaps, SiKofi, SiOnlyfans, SiSubstack } from 'react-icons/si';

const webProtocols = new Set(['http:', 'https:']);
const allowedProtocols = new Set(['http:', 'https:', 'mailto:']);

function withProtocol(input) {
  const value = input.trim();

  if (!value) {
    throw new Error('Informe uma URL.');
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function toUrl(input) {
  try {
    const url = new URL(withProtocol(input));

    if (!allowedProtocols.has(url.protocol)) {
      throw new Error('Use apenas URLs HTTP, HTTPS ou email.');
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

  if (!webProtocols.has(url.protocol)) {
    throw new Error('Use uma URL HTTP ou HTTPS.');
  }

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

function normalizeHandle(input, baseUrl, pattern, transform = (value) => value) {
  const value = input.trim().replace(/^@/, '');

  if (pattern.test(value)) {
    return `${baseUrl}/${transform(value)}`;
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

function normalizeEmail(input) {
  const value = input.trim();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `mailto:${value}`;
  }

  const url = toUrl(value);

  if (url.protocol !== 'mailto:') {
    throw new Error('Informe um email valido.');
  }

  return url.toString();
}

function isEmailInput(input) {
  const value = input.trim();
  return value.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function makeRule({ id, name, domains, Icon, accent, normalize, getLabel, validate }) {
  return {
    id,
    name,
    domains,
    Icon,
    accent,
    normalize: normalize || normalizeWebUrl,
    validate: validate || ((url) => hostMatches(new URL(url), domains)),
    getLabel: getLabel || (() => name),
  };
}

export const networkRules = [
  makeRule({
    id: 'instagram',
    name: 'Instagram',
    domains: ['instagram.com'],
    Icon: FaInstagram,
    accent: '#e4405f',
    normalize: (input) =>
      normalizeHandle(input, 'https://instagram.com', /^[a-zA-Z0-9._]{1,30}$/),
    getLabel: (url) => {
      const handle = lastPathSegment(new URL(url));
      return handle ? `@${handle}` : 'Instagram';
    },
  }),
  makeRule({
    id: 'tiktok',
    name: 'TikTok',
    domains: ['tiktok.com'],
    Icon: FaTiktok,
    accent: '#111111',
    normalize: (input) =>
      normalizeHandle(input, 'https://www.tiktok.com', /^[a-zA-Z0-9._]{2,24}$/, (value) =>
        value.startsWith('@') ? value : `@${value}`,
      ),
    getLabel: (url) => lastPathSegment(new URL(url)) || 'TikTok',
  }),
  makeRule({
    id: 'youtube',
    name: 'YouTube',
    domains: ['youtube.com', 'youtu.be'],
    Icon: FaYoutube,
    accent: '#ff0033',
  }),
  makeRule({
    id: 'x',
    name: 'X',
    domains: ['x.com', 'twitter.com'],
    Icon: FaXTwitter,
    accent: '#111111',
    normalize: (input) => normalizeHandle(input, 'https://x.com', /^[a-zA-Z0-9_]{1,15}$/),
    getLabel: (url) => {
      const handle = lastPathSegment(new URL(url));
      return handle ? `@${handle}` : 'X';
    },
  }),
  makeRule({
    id: 'threads',
    name: 'Threads',
    domains: ['threads.net'],
    Icon: FaThreads,
    accent: '#111111',
    normalize: (input) => normalizeHandle(input, 'https://threads.net', /^[a-zA-Z0-9._]{1,30}$/),
    getLabel: (url) => {
      const handle = lastPathSegment(new URL(url));
      return handle ? `@${handle}` : 'Threads';
    },
  }),
  makeRule({
    id: 'twitch',
    name: 'Twitch',
    domains: ['twitch.tv'],
    Icon: FaTwitch,
    accent: '#9146ff',
  }),
  makeRule({
    id: 'facebook',
    name: 'Facebook',
    domains: ['facebook.com', 'fb.com'],
    Icon: FaFacebookF,
    accent: '#1877f2',
  }),
  makeRule({
    id: 'linkedin',
    name: 'LinkedIn',
    domains: ['linkedin.com'],
    Icon: FaLinkedinIn,
    accent: '#0a66c2',
  }),
  makeRule({
    id: 'whatsapp',
    name: 'WhatsApp',
    domains: ['wa.me', 'whatsapp.com', 'api.whatsapp.com'],
    Icon: FaWhatsapp,
    accent: '#25d366',
    normalize: normalizeWhatsApp,
  }),
  makeRule({
    id: 'telegram',
    name: 'Telegram',
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    Icon: FaTelegram,
    accent: '#26a5e4',
    normalize: (input) => normalizeHandle(input, 'https://t.me', /^[a-zA-Z0-9_]{5,32}$/),
    getLabel: (url) => {
      const handle = lastPathSegment(new URL(url));
      return handle ? `@${handle}` : 'Telegram';
    },
  }),
  makeRule({
    id: 'discord',
    name: 'Discord',
    domains: ['discord.gg', 'discord.com', 'discordapp.com'],
    Icon: FaDiscord,
    accent: '#5865f2',
  }),
  makeRule({
    id: 'github',
    name: 'GitHub',
    domains: ['github.com'],
    Icon: FaGithub,
    accent: '#24292f',
  }),
  makeRule({
    id: 'spotify',
    name: 'Spotify',
    domains: ['spotify.com', 'open.spotify.com'],
    Icon: FaSpotify,
    accent: '#1db954',
  }),
  makeRule({
    id: 'soundcloud',
    name: 'SoundCloud',
    domains: ['soundcloud.com'],
    Icon: FaSoundcloud,
    accent: '#ff5500',
  }),
  makeRule({
    id: 'pinterest',
    name: 'Pinterest',
    domains: ['pinterest.com', 'pin.it'],
    Icon: FaPinterestP,
    accent: '#bd081c',
  }),
  makeRule({
    id: 'snapchat',
    name: 'Snapchat',
    domains: ['snapchat.com'],
    Icon: FaSnapchat,
    accent: '#fffc00',
  }),
  makeRule({
    id: 'patreon',
    name: 'Patreon',
    domains: ['patreon.com'],
    Icon: FaPatreon,
    accent: '#ff424d',
  }),
  makeRule({
    id: 'kofi',
    name: 'Ko-fi',
    domains: ['ko-fi.com'],
    Icon: SiKofi,
    accent: '#29abe0',
  }),
  makeRule({
    id: 'buyMeACoffee',
    name: 'Buy Me a Coffee',
    domains: ['buymeacoffee.com'],
    Icon: SiBuymeacoffee,
    accent: '#ffdd00',
  }),
  makeRule({
    id: 'substack',
    name: 'Substack',
    domains: ['substack.com'],
    Icon: SiSubstack,
    accent: '#ff6719',
  }),
  makeRule({
    id: 'onlyfans',
    name: 'OnlyFans',
    domains: ['onlyfans.com'],
    Icon: SiOnlyfans,
    accent: '#00aff0',
  }),
  makeRule({
    id: 'behance',
    name: 'Behance',
    domains: ['behance.net'],
    Icon: FaBehance,
    accent: '#1769ff',
  }),
  makeRule({
    id: 'dribbble',
    name: 'Dribbble',
    domains: ['dribbble.com'],
    Icon: FaDribbble,
    accent: '#ea4c89',
  }),
  makeRule({
    id: 'medium',
    name: 'Medium',
    domains: ['medium.com'],
    Icon: FaMedium,
    accent: '#111111',
  }),
  makeRule({
    id: 'googleMaps',
    name: 'Google Maps',
    domains: ['maps.app.goo.gl', 'google.com', 'goo.gl'],
    Icon: SiGooglemaps,
    accent: '#34a853',
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
    Icon: FaGoogle,
    accent: '#4285f4',
    getLabel: () => 'Perfil Google',
  }),
  makeRule({
    id: 'email',
    name: 'Email',
    domains: [],
    Icon: Mail,
    accent: '#111827',
    normalize: normalizeEmail,
    validate: (url) => new URL(url).protocol === 'mailto:',
    getLabel: (url) => new URL(url).pathname,
  }),
  makeRule({
    id: 'website',
    name: 'Website',
    domains: [],
    Icon: Globe2,
    accent: '#111827',
    validate: (url) => webProtocols.has(new URL(url).protocol),
    getLabel: hostLabel,
  }),
];

export function getNetworkRule(id) {
  return networkRules.find((network) => network.id === id) || networkRules.at(-1);
}

export function inferNetworkFromUrl(input) {
  if (isEmailInput(input)) {
    return getNetworkRule('email');
  }

  const normalized = normalizeWebUrl(input);

  return (
    networkRules.find((network) => {
      if (network.id === 'website' || network.id === 'email') {
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
