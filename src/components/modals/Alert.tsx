import { Modal, ModalProps } from "components/Modal";

interface Props extends ModalProps {
  title: string;
}

export const AlertModal = ({ children, isOpen, title, onClose }: Props) => {
  return (
    <Modal style={{ width: "30em" }} isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <header className="py-2">
          <h1 className="text-2xl font-semibold dark:text-white">{title}</h1>
        </header>

        {children}
      </div>
    </Modal>
  );
};
