import React, { useState, useEffect } from 'react';
import { Activity, DayInfo } from '../types';
import { X, Clock, Calendar, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: {
    id?: string;
    title: string;
    startTime: string;
    endTime?: string;
    description?: string;
    category?: string;
  }) => void;
  initialActivity?: Activity | null;
  dayInfo: DayInfo;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialActivity,
  dayInfo,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Geral');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setStartTime(initialActivity.startTime);
      setEndTime(initialActivity.endTime || '');
      setDescription(initialActivity.description || '');
      setCategory(initialActivity.category || 'Geral');
    } else {
      setTitle('');
      setStartTime('14:00');
      setEndTime('');
      setDescription('');
      setCategory('Geral');
    }
    setError('');
  }, [initialActivity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da atividade.');
      return;
    }
    if (!startTime.trim()) {
      setError('Por favor, informe o horário de início.');
      return;
    }

    onSave({
      id: initialActivity ? initialActivity.id : undefined,
      title: title.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim() ? endTime.trim() : undefined,
      description: description.trim() ? description.trim() : undefined,
      category,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-[#13161D] border border-[#252A33] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#252A33] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#22C55E]" />
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                {initialActivity ? 'EDITAR ETAPA' : 'NOVA ETAPA // DIMO'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8B919E] hover:text-white hover:bg-[#181C26] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            {/* Date Display */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B919E] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>DATA DA JORNADA</span>
              </label>
              <div className="p-2 rounded-lg bg-[#0B0D12] border border-[#252A33] text-xs font-mono text-white">
                {dayInfo.label}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B919E] mb-1">
                TÍTULO DA ATIVIDADE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Treino de Força, Café, Estudar..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D12] border border-[#252A33] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white text-sm placeholder:text-neutral-600 outline-none transition-all"
                autoFocus
              />
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono text-[#8B919E] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>INÍCIO *</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0D12] border border-[#252A33] focus:border-emerald-500 text-white text-xs font-mono outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8B919E] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#8B919E]" />
                  <span>FIM (OPCIONAL)</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0D12] border border-[#252A33] focus:border-emerald-500 text-white text-xs font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B919E] mb-1 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-[#8B919E]" />
                <span>DESCRIÇÃO (OPCIONAL)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Detalhes ou anotações para esta etapa..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B0D12] border border-[#252A33] focus:border-emerald-500 text-white text-xs leading-relaxed placeholder:text-neutral-600 outline-none transition-all resize-none"
              />
            </div>

            {/* Quick Category Buttons */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B919E] mb-1">
                CATEGORIA
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Rotina', 'Foco', 'Recuperação', 'Saúde', 'Estudo'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                          : 'bg-[#181C26] text-[#8B919E] border border-[#252A33] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#252A33] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-[#181C26] border border-[#252A33] text-xs font-mono text-[#8B919E] hover:text-white transition-colors cursor-pointer"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>SALVAR ETAPA</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
