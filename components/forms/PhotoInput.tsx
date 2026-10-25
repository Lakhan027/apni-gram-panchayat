'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface PhotoInputProps {
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
  describedBy?: string;
  invalid?: boolean;
}

export default function PhotoInput({ id, file, onChange, describedBy, invalid }: PhotoInputProps) {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const remove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="block w-full min-h-[44px] rounded-[10px] border border-dashed border-line bg-white p-2 text-[15px] file:mr-3 file:min-h-[40px] file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:font-semibold file:text-green-900"
      />
      {preview && file && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-ground p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          <img src={preview} alt={t('form.photoPreview')} className="h-20 w-20 rounded-lg object-cover" />
          <span className="min-w-0 flex-1 break-all text-[14px] text-muted">{file.name}</span>
          <button
            type="button"
            onClick={remove}
            className="inline-flex min-h-[44px] items-center gap-1 rounded-[10px] px-3 font-semibold text-status-holdText hover:bg-status-holdBg"
          >
            <Trash2 size={16} aria-hidden="true" /> {t('form.remove')}
          </button>
        </div>
      )}
      {!file && (
        <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
          <ImagePlus size={14} aria-hidden="true" /> {t('form.photoHint')}
        </p>
      )}
    </div>
  );
}
