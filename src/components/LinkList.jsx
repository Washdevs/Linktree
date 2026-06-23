import { getNetworkRule } from '../networks/networkRules.js';

export default function LinkList({ links, editingId, onEdit, onMove, onRemove }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Links</h2>
        <span className="count">{links.length}</span>
      </div>

      <div className="link-list">
        {links.length === 0 ? <p className="empty-state">Nenhum link salvo.</p> : null}

        {links.map((link, index) => {
          const network = getNetworkRule(link.networkId);

          return (
            <article
              className={`manage-row ${editingId === link.id ? 'is-editing' : ''}`}
              key={link.id}
            >
              <NetworkAvatar network={network} />

              <div className="manage-copy">
                <strong>{link.label}</strong>
                <span>{link.url}</span>
              </div>

              <div className="manage-actions" aria-label={`Acoes para ${link.label}`}>
                <button
                  type="button"
                  aria-label="Subir"
                  disabled={index === 0}
                  onClick={() => onMove(link.id, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Descer"
                  disabled={index === links.length - 1}
                  onClick={() => onMove(link.id, 1)}
                >
                  ↓
                </button>
                <button type="button" onClick={() => onEdit(link)}>
                  Editar
                </button>
                <button className="danger" type="button" onClick={() => onRemove(link.id)}>
                  Remover
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NetworkAvatar({ network }) {
  if (network.icon) {
    return <img className="network-avatar" src={network.icon} alt="" aria-hidden="true" />;
  }

  return (
    <span className="network-avatar fallback" aria-hidden="true">
      {network.initials}
    </span>
  );
}
