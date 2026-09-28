import React, { useState, useEffect } from 'react';
import { Activity, DayInfo, RpgIconId } from '../types';
import { X, Clock, Calendar, Check, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RpgIcon, RPG_ICON_OPTIONS, inferRpgIcon } from './RpgIcon';

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
    icon?: RpgIconId;
  }) => void;
  initialActivity?: Activity | null;
  initialTitle?: string;
  defaultStartTime?: string;
  dayInfo: DayInfo;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialActivity,
  initialTitle = '',
  defaultStartTime,
  dayInfo,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Rotina');
  const [selectedIcon, setSelectedIcon] = useState<RpgIconId>('scroll');
  const [manuallySelectedIcon, setManuallySelectedIcon] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setStartTime(initialActivity.startTime);
      setEndTime(initialActivity.endTime || '');
      setDescription(initialActivity.description || '');
      setCategory(initialActivity.category || 'Rotina');
      setSelectedIcon(initialActivity.icon || inferRpgIcon(initialActivity.title, initialActivity.category));
      setManuallySelectedIcon(Boolean(initialActivity.icon));
    } else {
      const initT = initialTitle || '';
      setTitle(initT);
      setStartTime(defaultStartTime || '08:00');
      setEndTime('');
      setDescription('');
      setCategory('Rotina');
      setSelectedIcon(inferRpgIcon(initT, 'Rotina'));
      setManuallySelectedIcon(false);
    }
    setError('');
  }, [initialActivity, initialTitle, defaultStartTime, isOpen]);

  // Auto-infer icon when title changes unless user manually chose an icon
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (error) setError('');
    if (!manuallySelectedIcon) {
      setSelectedIcon(inferRpgIcon(val, category));
    }
  };

  const handleSelectIcon = (iconId: RpgIconId) => {
    setSelectedIcon(iconId);
    setManuallySelectedIcon(true);
  };

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
      icon: selectedIcon,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#141410]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-[#FAF8F0] border border-[#C4C0AB] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#C4C0AB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#141410]" />
              <span className="text-xs font-mono text-[#141410] font-semibold tracking-wider uppercase">
                {initialActivity ? 'EDITAR ATIVIDADE' : 'NOVA ATIVIDADE // DIMO'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#777567] hover:text-[#141410] hover:bg-[#C4C0AB]/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {error}
              </div>
            )}

            {/* Date Display */}
            <div>
              <label className="block text-[11px] font-mono text-[#777567] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#141410]" />
                <span>DATA DA JORNADA</span>
              </label>
              <div className="p-2 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] text-xs font-mono text-[#141410]">
                {dayInfo.label}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-mono text-[#777567] mb-1">
                TÍTULO DA ATIVIDADE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Café, Trabalho, Treino, Almoço, Estudar..."
                className="w-full px-3 py-2 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] focus:border-[#141410] focus:ring-1 focus:ring-[#141410] text-[#141410] text-sm placeholder:text-[#9D9988] outline-none transition-all"
                autoFocus
              />
            </div>

            {/* RPG Icon Selector */}
            <div>
              <label className="block text-[11px] font-mono text-[#777567] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#141410]" />
                  <span>SÍMBOLO DA JORNADA (RPG)</span>
                </span>
                <span className="text-[10px] text-[#9D9988] font-mono">
                  {RPG_ICON_OPTIONS.find((o) => o.id === selectedIcon)?.desc}
                </span>
              </label>
              <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-[#EDE8D0]/80 border border-[#C4C0AB]">
                {RPG_ICON_OPTIONS.map((opt) => {
                  const isSelected = selectedIcon === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectIcon(opt.id)}
                      title={`${opt.label} — ${opt.desc}`}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF8F0] border-2 border-[#141410] shadow-xs scale-105'
                          : 'bg-[#EDE8D0] hover:bg-[#FAF8F0] border border-transparent hover:border-[#C4C0AB]'
                      }`}
                    >
                      <RpgIcon
                        icon={opt.id}
                        size={22}
                        variant={isSelected ? 'default' : 'muted'}
                      />
                      <span className="text-[9px] font-mono mt-1 text-[#545248] truncate max-w-full">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono text-[#777567] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#141410]" />
                  <span>INÍCIO *</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] focus:border-[#141410] text-[#141410] text-xs font-mono outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#777567] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#9D9988]" />
                  <span>FIM (OPCIONAL)</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] focus:border-[#141410] text-[#141410] text-xs font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono text-[#777567] mb-1 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-[#777567]" />
                <span>DESCRIÇÃO (OPCIONAL)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Detalhes ou anotações para esta etapa..."
                className="w-full px-3 py-2 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] focus:border-[#141410] text-[#141410] text-xs leading-relaxed placeholder:text-[#9D9988] outline-none transition-all resize-none"
              />
            </div>

            {/* Quick Category Buttons */}
            <div>
              <label className="block text-[11px] font-mono text-[#777567] mb-1">
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
                          ? 'bg-[#141410] text-[#EDE8D0] border border-[#141410] font-semibold'
                          : 'bg-[#EDE8D0] text-[#777567] border border-[#C4C0AB] hover:text-[#141410] hover:border-[#9D9988]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#C4C0AB] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-[#EDE8D0] border border-[#C4C0AB] text-xs font-mono text-[#777567] hover:text-[#141410] hover:border-[#9D9988] transition-colors cursor-pointer"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141410] hover:bg-[#33312B] text-[#EDE8D0] text-xs font-mono font-bold tracking-wider transition-all shadow-[0_2px_10px_rgba(20,20,16,0.15)] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>SALVAR ATIVIDADE</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
