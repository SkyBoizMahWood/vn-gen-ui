type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: Readonly<ConfirmDialogProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-50">
      <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
} 