// ConfirmationDialog.js

import { Modal } from "nextjs-headless-modal";

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="bg-white p-8">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;