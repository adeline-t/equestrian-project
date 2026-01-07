import React from 'react';
import Portal from './Portal.jsx';
import { Icons } from '../../lib/icons';
import '../../styles/common/modal.css';
import '../../styles/common/modal.css';
import '../../styles/common/buttons.css';

/**
 * Reusable Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string|React.ReactNode} props.title - Modal title (can include icons)
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size ('small', 'medium', 'large')
 * @param {string} props.className - Additional CSS classes
 */
const Modal = ({ isOpen, onClose, title, children, footer, size = 'medium', className = '' }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className={`modal-content ${size} ${className}`} onClick={(e) => e.stopPropagation()}>
          {title && (
            <div className="modal-header">
              <h2
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#2d3748',
                }}
              >
                {title}
              </h2>
              <button className="btn-close" onClick={onClose} aria-label="Close modal">
                <Icons.Close />
              </button>
            </div>
          )}

          <div className="modal-body">{children}</div>

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
