import { getNetworkRule } from '../networks/networkRules.js';

export default function ProfilePreview({ profile }) {
  return (
    <section className="preview" aria-label="Preview">
      <div className="profile-block">
        <img className="profile-photo" src={profile.photoUrl} alt="Foto do perfil" />
        <h1>{profile.name}</h1>
        <p className="handle">{profile.handle}</p>
        <p className="bio">{profile.bio}</p>
      </div>

      <nav className="preview-links" aria-label="Links do perfil">
        {profile.links.map((link) => {
          const network = getNetworkRule(link.networkId);

          return (
            <a
              className="preview-link"
              href={link.url}
              key={link.id}
              rel="noreferrer"
              target="_blank"
              style={{ '--network-accent': network.accent }}
            >
              {network.icon ? (
                <img src={network.icon} alt="" aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{network.initials}</span>
              )}
              <strong>{link.label}</strong>
            </a>
          );
        })}
      </nav>
    </section>
  );
}
