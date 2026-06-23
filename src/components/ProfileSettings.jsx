import { readImageFile } from '../utils/images.js';

export default function ProfileSettings({ profile, onChange, onResetVisual }) {
  async function handleImageChange(field, file) {
    if (!file) {
      return;
    }

    try {
      const dataUrl = await readImageFile(file);
      onChange(field, dataUrl);
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Perfil</h2>
      </div>

      <label className="field">
        <span>Nome</span>
        <input
          type="text"
          value={profile.name}
          onChange={(event) => onChange('name', event.target.value)}
        />
      </label>

      <label className="field">
        <span>Usuario</span>
        <input
          type="text"
          value={profile.handle}
          onChange={(event) => onChange('handle', event.target.value)}
        />
      </label>

      <label className="field">
        <span>Bio</span>
        <textarea
          rows="3"
          value={profile.bio}
          onChange={(event) => onChange('bio', event.target.value)}
        />
      </label>

      <div className="upload-grid">
        <ImageField
          id="profile-photo"
          label="Foto"
          onChange={(file) => handleImageChange('photoUrl', file)}
          onReset={() => onResetVisual('photoUrl')}
        />
        <ImageField
          id="background-image"
          label="Fundo"
          onChange={(file) => handleImageChange('backgroundUrl', file)}
          onReset={() => onResetVisual('backgroundUrl')}
        />
      </div>
    </section>
  );
}

function ImageField({ id, label, onChange, onReset }) {
  return (
    <div className="image-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
      <button className="text-button" type="button" onClick={onReset}>
        Resetar
      </button>
    </div>
  );
}
