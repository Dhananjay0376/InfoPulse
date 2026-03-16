import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, FileType, Code, Braces } from 'lucide-react';
import type { Customer } from '../types/customer';
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  exportToWord,
  exportToJSON,
  exportToXML,
} from '../utils/exportUtils';

interface Props {
  customers: Customer[];
}

const exportOptions = [
  { label: 'PDF Document', icon: FileText, color: 'text-red-500', bg: 'bg-red-50', fn: exportToPDF },
  { label: 'Excel Spreadsheet', icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50', fn: exportToExcel },
  { label: 'CSV File', icon: FileSpreadsheet, color: 'text-teal-500', bg: 'bg-teal-50', fn: exportToCSV },
  { label: 'Word Document', icon: FileType, color: 'text-blue-600', bg: 'bg-blue-50', fn: exportToWord },
  { label: 'JSON File', icon: Braces, color: 'text-amber-600', bg: 'bg-amber-50', fn: exportToJSON },
  { label: 'XML File', icon: Code, color: 'text-purple-600', bg: 'bg-purple-50', fn: exportToXML },
];

export default function ExportMenu({ customers }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={customers.length === 0}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
      >
        <Download size={16} />
        Export Data
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50"
          >
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Export as</p>
            {exportOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => {
                  opt.fn(customers);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <span className={`rounded-lg p-2 ${opt.bg}`}>
                  <opt.icon size={16} className={opt.color} />
                </span>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
