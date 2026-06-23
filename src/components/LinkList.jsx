import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { getNetworkRule } from '../networks/networkRules.js';

export default function LinkList({ links, editingId, onEdit, onMove, onRemove }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Ordenacao</span>
          <h2>Links cadastrados</h2>
        </div>
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
              <span className="network-avatar" style={{ '--network-color': network.accent }}>
                <IconRenderer icon={network.Icon} size={20} />
              </span>

              <div className="manage-copy">
                <strong>{link.label}</strong>
                <span>{link.url}</span>
              </div>

              <div className="manage-actions" aria-label={`Acoes para ${link.label}`}>
                <button
                  type="button"
                  title="Subir"
                  aria-label="Subir"
                  disabled={index === 0}
                  onClick={() => onMove(link.id, -1)}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  title="Descer"
                  aria-label="Descer"
                  disabled={index === links.length - 1}
                  onClick={() => onMove(link.id, 1)}
                >
                  <ArrowDown size={16} />
                </button>
                <button type="button" title="Editar" aria-label="Editar" onClick={() => onEdit(link)}>
                  <Pencil size={16} />
                </button>
                <button
                  className="danger"
                  type="button"
                  title="Remover"
                  aria-label="Remover"
                  onClick={() => onRemove(link.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
