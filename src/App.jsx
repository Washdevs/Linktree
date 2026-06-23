import { useEffect, useMemo, useState } from 'react';
import { Eye, Settings2 } from 'lucide-react';
import LinkEditor from './components/LinkEditor.jsx';
import LinkList from './components/LinkList.jsx';
import PublicLinkTree from './components/PublicLinkTree.jsx';
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

function getViewMode() {
  const params = new URLSearchParams(window.location.search);
  const explicitView = params.get('view');

  if (explicitView === 'public') {
    return 'public';
  }

  if (explicitView === 'owner') {
    return 'owner';
  }

  if (window.location.pathname.startsWith('/public')) {
    return 'public';
  }

  if (['3001', '5174', '8081'].includes(window.location.port)) {
    return 'public';
  }

  return 'owner';
}

export default function App() {
  const [profile, setProfile] = useState(createDefaultProfile);
  const [isReady, setIsReady] = useState(false);
  const [linkForm, setLinkForm] = useState(emptyLinkForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const viewMode = useMemo(getViewMode, []);
  const isOwner = viewMode === 'owner';

  useEffect(() => {
    let isMounted = true;

    loadProfile(createDefaultProfile()).then((loadedProfile) => {
      if (!isMounted) {
        return;
      }

      setProfile(loadedProfile);
      setIsReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isOwner) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      saveProfile(profile);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isOwner, isReady, profile]);

  function updateProfileField(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetVisual(field) {
    updateProfileField(field, '');
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

  if (!isReady) {
    return <div className="loading-screen">Carregando perfil...</div>;
  }

  if (!isOwner) {
    return <PublicLinkTree profile={profile} />;
  }

  return (
    <main className="owner-shell">
      <section className="owner-header">
        <div>
          <span className="eyebrow">
            <Settings2 size={15} />
            Painel do criador
          </span>
          <h1>Monte sua arvore de links</h1>
        </div>
        <a className="public-port-link" href="http://localhost:8081" target="_blank" rel="noreferrer">
          <Eye size={18} />
          Ver porta publica
        </a>
      </section>

      <section className="owner-grid" aria-label="Editor de links">
        <section className="owner-panel-stack">
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

        <aside className="owner-preview" aria-label="Preview publico">
          <PublicLinkTree profile={profile} isPreview />
        </aside>
      </section>
    </main>
  );
}
