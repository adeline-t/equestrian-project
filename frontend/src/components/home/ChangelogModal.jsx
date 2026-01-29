import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icons } from '../../lib/icons';
import '../../styles/components/modals.css';
import Modal from '../common/Modal';

export default function ChangelogModal({ isOpen, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchChangelog();
    }
  }, [isOpen]);

  const fetchChangelog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/CHANGELOG.md');
      if (!response.ok) {
        throw new Error('Impossible de charger le changelog');
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error('Erreur lors du chargement du changelog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="modal-title">
          <Icons.File />
          Historique des versions
        </h2>
      }
    >
      <div className="modal-body changelog-content">
        {loading && (
          <div className="changelog-loading">
            <p>Chargement du changelog...</p>
          </div>
        )}

        {error && (
          <div className="changelog-error">
            <Icons.AlertCircle />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="changelog-h1">{children}</h1>,
              h2: ({ children }) => <h2 className="changelog-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="changelog-h3">{children}</h3>,
              ul: ({ children }) => <ul className="changelog-list">{children}</ul>,
              li: ({ children }) => <li className="changelog-item">{children}</li>,
              strong: ({ children }) => <strong className="changelog-strong">{children}</strong>,
              p: ({ children }) => <p className="changelog-paragraph">{children}</p>,
              hr: () => <hr className="changelog-divider" />,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Fermer
        </button>
      </div>
    </Modal>
  );
}
