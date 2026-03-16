import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ isOpen, count, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 rounded-xl p-2 text-gray-400 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete {count > 1 ? `${count} Customers` : 'Customer'}?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. {count > 1 ? 'These records' : 'This record'} will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:shadow-xl transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
