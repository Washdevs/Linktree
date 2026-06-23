import { ExternalLink, Share2, Sparkle, UserRound } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { getNetworkRule } from '../networks/networkRules.js';

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function shareProfile() {
  const shareData = {
    title: document.title,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
    return;
  }

  navigator.clipboard?.writeText(window.location.href);
}

export default function PublicLinkTree({ profile, isPreview = false }) {
  const shellStyle = {
    '--profile-bg': profile.backgroundUrl ? `url("${profile.backgroundUrl}")` : 'none',
  };
  const initials = initialsFromName(profile.name);

  return (
    <main className={`public-shell ${isPreview ? 'is-preview' : ''}`} style={shellStyle}>
      <section className="public-card" aria-label="Arvore de links">
        <div className="public-actions">
          <span className="brand-mark" aria-hidden="true">
            <Sparkle size={19} />
          </span>
          {!isPreview ? (
            <button className="icon-button glass" type="button" onClick={shareProfile} title="Compartilhar">
              <Share2 size={18} />
            </button>
          ) : null}
        </div>

        <header className="public-profile">
          {profile.photoUrl ? (
            <img className="public-photo" src={profile.photoUrl} alt="Foto do perfil" />
          ) : (
            <span className="public-photo placeholder" aria-hidden="true">
              {initials || <UserRound size={30} />}
            </span>
          )}
          <h1>{profile.name}</h1>
          <p className="handle">{profile.handle}</p>
          <p className="bio">{profile.bio}</p>
        </header>

        <nav className="public-links" aria-label="Links">
          {profile.links.map((link) => {
            const network = getNetworkRule(link.networkId);

            return (
              <a
                className="public-link"
                href={link.url}
                key={link.id}
                rel="noreferrer"
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                style={{ '--network-color': network.accent }}
              >
                <span className="public-link-icon">
                  <IconRenderer icon={network.Icon} size={22} />
                </span>
                <strong>{link.label}</strong>
                <ExternalLink className="public-link-arrow" size={17} />
              </a>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
