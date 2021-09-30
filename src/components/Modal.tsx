import type * as React from "react";
import ReactModal from "react-modal";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

ReactModal.setAppElement("#__next");
export const Modal = ({ children, isOpen, style, onClose }: ModalProps) => {
  const modalStyles: ReactModal.Styles = {
    content: {
      width: "45rem",
      maxWidth: "95%",
      height: "max-content",

      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      animation: "modalAnimation 200ms",
      ...style,
    },
    overlay: {
      background: "rgba(0,0,0,0.7)",
    },
  };

  return (
    <ReactModal
      className="dark:bg-dark-gray bg-gray-200 rounded-md"
      style={modalStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      {children}
    </ReactModal>
  );
};
