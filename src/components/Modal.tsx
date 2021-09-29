import ReactModal from "react-modal";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const modalStyles: ReactModal.Styles = {
  content: {
    width: "45rem",
    maxWidth: "95%",
    height: "420px",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "modalAnimation 200ms",
  },
  overlay: {
    background: "rgba(0,0,0,0.7)",
  },
};

ReactModal.setAppElement("#__next");
export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
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
