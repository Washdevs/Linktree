import { ImagePlus, RotateCcw, UserRound, Wallpaper } from 'lucide-react';
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
        <div>
          <span className="panel-kicker">Identidade</span>
          <h2>Perfil publico</h2>
        </div>
      </div>

      <div className="profile-fields">
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
      </div>

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
          icon={<UserRound size={18} />}
          label="Foto de perfil"
          onChange={(file) => handleImageChange('photoUrl', file)}
          onReset={() => onResetVisual('photoUrl')}
        />
        <ImageField
          id="background-image"
          icon={<Wallpaper size={18} />}
          label="Imagem de fundo"
          onChange={(file) => handleImageChange('backgroundUrl', file)}
          onReset={() => onResetVisual('backgroundUrl')}
        />
      </div>
    </section>
  );
}

function ImageField({ id, icon, label, onChange, onReset }) {
  return (
    <div className="image-field">
      <div className="image-field-header">
        {icon}
        <label htmlFor={id}>{label}</label>
      </div>
      <label className="file-button" htmlFor={id}>
        <ImagePlus size={17} />
        Trocar imagem
      </label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
      <button className="text-button inline-button" type="button" onClick={onReset}>
        <RotateCcw size={15} />
        Remover
      </button>
    </div>
  );
}
