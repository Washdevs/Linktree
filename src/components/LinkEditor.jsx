import { Plus, Sparkles, X } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { networkRules } from '../networks/networkRules.js';

export default function LinkEditor({ form, error, isEditing, onCancel, onChange, onSubmit }) {
  function updateField(field, value) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="panel link-editor" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">{isEditing ? 'Atualizar destino' : 'Novo destino'}</span>
          <h2>{isEditing ? 'Editar link' : 'Adicionar rede'}</h2>
        </div>
        {isEditing ? (
          <button className="icon-button ghost" type="button" onClick={onCancel} title="Cancelar">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="network-picker" aria-label="Escolha a rede">
        <button
          className={`network-option ${form.networkId === 'detect' ? 'is-active' : ''}`}
          type="button"
          onClick={() => updateField('networkId', 'detect')}
        >
          <span className="network-option-icon">
            <Sparkles size={20} />
          </span>
          <span>Auto</span>
        </button>

        {networkRules.map((network) => (
          <button
            className={`network-option ${form.networkId === network.id ? 'is-active' : ''}`}
            key={network.id}
            type="button"
            onClick={() => updateField('networkId', network.id)}
          >
            <span className="network-option-icon" style={{ '--network-color': network.accent }}>
              <IconRenderer icon={network.Icon} size={20} />
            </span>
            <span>{network.name}</span>
          </button>
        ))}
      </div>

      <label className="field compact-field">
        <span>URL ou usuario</span>
        <input
          type="text"
          inputMode="url"
          placeholder="instagram.com/seuperfil"
          value={form.url}
          onChange={(event) => updateField('url', event.target.value)}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-button" type="submit">
        <Plus size={18} />
        {isEditing ? 'Salvar alteracao' : 'Adicionar link'}
      </button>
    </form>
  );
}
