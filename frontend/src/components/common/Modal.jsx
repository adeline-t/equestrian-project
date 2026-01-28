import React from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal.jsx';
import { Icons } from '../../lib/icons';
import '../../styles/app.css';

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
const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', className = '' }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className={`modal modal--${size} ${className}`} onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            {title && (
              <div className="modal-header modal-header-flex">
                {typeof title === 'string' ? <h2>{title}</h2> : title}

                {/* bouton close toujours aligné à droite */}
                <button className="btn-close" onClick={onClose} aria-label="Close modal">
                  <Icons.Close />
                </button>
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
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
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Modal;
