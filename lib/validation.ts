// Client-side validation for the complaint form. Same rules can be reused by the API later.
import { translate, type Lang } from './i18n/translate';

export interface ComplaintInput {
  name: string;
  ward: string;
  category: string;
  description: string;
  mobile: string;
  photo: File | null;
}

export type ComplaintErrors = Partial<Record<keyof ComplaintInput, string>>;

export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 500;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

/** Returns error messages in the given language (Hindi by default). */
export function validateComplaint(v: ComplaintInput, lang: Lang = 'hi'): ComplaintErrors {
  const msg = (key: Parameters<typeof translate>[1], vars?: Record<string, number>) => translate(lang, key, vars);
  const e: ComplaintErrors = {};
  if (!v.ward) e.ward = msg('err.ward');
  if (!v.category) e.category = msg('err.category');
  const len = v.description.trim().length;
  if (len === 0) e.description = msg('err.descEmpty');
  else if (len < DESCRIPTION_MIN) e.description = msg('err.descShort', { min: DESCRIPTION_MIN });
  else if (len > DESCRIPTION_MAX) e.description = msg('err.descLong', { max: DESCRIPTION_MAX });
  if (v.mobile && !/^[6-9]\d{9}$/.test(v.mobile)) e.mobile = msg('err.mobile');
  if (v.photo) {
    if (!v.photo.type.startsWith('image/')) e.photo = msg('err.photoType');
    else if (v.photo.size > PHOTO_MAX_BYTES) e.photo = msg('err.photoSize');
  }
  return e;
}
