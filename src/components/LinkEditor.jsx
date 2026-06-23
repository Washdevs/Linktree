import { networkRules } from '../networks/networkRules.js';

export default function LinkEditor({ form, error, isEditing, onCancel, onChange, onSubmit }) {
  function updateField(field, value) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="panel-heading">
        <h2>{isEditing ? 'Editar link' : 'Novo link'}</h2>
        {isEditing ? (
          <button className="text-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
        ) : null}
      </div>

      <label className="field">
        <span>Rede</span>
        <select
          value={form.networkId}
          onChange={(event) => updateField('networkId', event.target.value)}
        >
          <option value="detect">Detectar pela URL</option>
          {networkRules.map((network) => (
            <option key={network.id} value={network.id}>
              {network.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>URL</span>
        <input
          type="text"
          inputMode="url"
          placeholder="https://instagram.com/perfil"
          value={form.url}
          onChange={(event) => updateField('url', event.target.value)}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-button" type="submit">
        {isEditing ? 'Atualizar link' : 'Salvar link'}
      </button>
    </form>
  );
}
