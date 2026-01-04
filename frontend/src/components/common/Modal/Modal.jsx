import React from 'react';
import Portal from '../../../components/common/Portal';
import { Icons } from '../../../lib/libraries/icons';
import './Modal.css';

/**
 * Reusable Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size ('small', 'medium', 'large')
 * @param {string} props.className - Additional CSS classes
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className={`modal-content ${size} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="modal-header">
              <h2>{title}</h2>
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