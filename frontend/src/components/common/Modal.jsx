import React from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal.jsx';
import { Icons } from '../../lib/icons';
import '../../styles/common/modals.css';
import '../../styles/common/buttons.css';

/**
 * Reusable Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string|React.ReactNode} props.title - Modal title (can include icons)
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size ('small', 'medium', 'large', 'xlarge')
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

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  className: PropTypes.string,
};

export default Modal;
