import { useEffect, useState } from 'react';
import LinkEditor from './components/LinkEditor.jsx';
import LinkList from './components/LinkList.jsx';
import ProfilePreview from './components/ProfilePreview.jsx';
import ProfileSettings from './components/ProfileSettings.jsx';
import { createDefaultProfile } from './data/defaultProfile.js';
import { createLinkPayload } from './networks/networkRules.js';
import { loadProfile, saveProfile } from './utils/storage.js';

const emptyLinkForm = {
  networkId: 'detect',
  url: '',
};

function makeId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `link-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile(createDefaultProfile()));
  const [linkForm, setLinkForm] = useState(emptyLinkForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  function updateProfileField(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetVisual(field) {
    const defaults = createDefaultProfile();
    updateProfileField(field, defaults[field]);
  }

  function submitLink(event) {
    event.preventDefault();
    setFormError('');

    try {
      const payload = createLinkPayload(linkForm);

      setProfile((current) => {
        const nextLink = {
          ...payload,
          id: editingId || makeId(),
        };

        if (!editingId) {
          return {
            ...current,
            links: [...current.links, nextLink],
          };
        }

        return {
          ...current,
          links: current.links.map((link) => (link.id === editingId ? nextLink : link)),
        };
      });

      setLinkForm(emptyLinkForm);
      setEditingId(null);
    } catch (error) {
      setFormError(error.message);
    }
  }

  function editLink(link) {
    setEditingId(link.id);
    setFormError('');
    setLinkForm({
      networkId: link.networkId,
      url: link.url,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormError('');
    setLinkForm(emptyLinkForm);
  }

  function removeLink(id) {
    if (editingId === id) {
      cancelEdit();
    }

    setProfile((current) => ({
      ...current,
      links: current.links.filter((link) => link.id !== id),
    }));
  }

  function moveLink(id, direction) {
    setProfile((current) => {
      const currentIndex = current.links.findIndex((link) => link.id === id);
      const nextIndex = currentIndex + direction;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= current.links.length) {
        return current;
      }

      const links = [...current.links];
      const [link] = links.splice(currentIndex, 1);
      links.splice(nextIndex, 0, link);

      return {
        ...current,
        links,
      };
    });
  }

  const shellStyle = {
    '--background-image': `url("${profile.backgroundUrl}")`,
  };

  return (
    <main className="app-shell" style={shellStyle}>
      <section className="workspace" aria-label="Linktree editor">
        <ProfilePreview profile={profile} />

        <section className="editor" aria-label="Profile controls">
          <ProfileSettings
            profile={profile}
            onChange={updateProfileField}
            onResetVisual={resetVisual}
          />

          <LinkEditor
            form={linkForm}
            error={formError}
            isEditing={Boolean(editingId)}
            onCancel={cancelEdit}
            onChange={setLinkForm}
            onSubmit={submitLink}
          />

          <LinkList
            links={profile.links}
            editingId={editingId}
            onEdit={editLink}
            onMove={moveLink}
            onRemove={removeLink}
          />
        </section>
      </section>
    </main>
  );
}
