// VB—G RAM G (NREGA) services: names, form types and validation (frontend only, nothing is sent or stored).
import { translate, type Lang, type MessageKey } from './i18n/translate';

/** Scheme name, used as-is in both languages. */
export const NREGA_NAME = 'VB—G RAM G (NREGA)';

/** Hindi form of the scheme name, used in Hindi text. */
export const NREGA_NAME_HI = 'वीबी—जी राम जी (नरेगा)';

/** Exact label for the third option, in both languages — never renamed. */
export const MISTOL_LABEL = 'मिसटोल';

export interface WorkApplication {
  name: string;
  fatherName: string;
  jobCard: string;
  village: string;
  mobile: string;
}

export interface JobCardApplication {
  name: string;
  fatherName: string;
  age: string;
  gender: string;
  village: string;
  ward: string;
  adults: string;
  mobile: string;
}

export type Errors<T> = Partial<Record<keyof T, string>>;

const NAME = /^[\p{L}\p{M} .]{2,60}$/u;
const JOB_CARD = /^[A-Za-z0-9][A-Za-z0-9/-]{5,29}$/;
const MOBILE = /^[6-9]\d{9}$/;

function rules(lang: Lang) {
  const msg = (key: MessageKey) => translate(lang, key);
  return {
    name(v: string, emptyKey: MessageKey) {
      const s = v.trim();
      if (!s) return msg(emptyKey);
      return NAME.test(s) ? undefined : msg('nerr.nameFormat');
    },
    required(v: string, key: MessageKey) {
      return v.trim() ? undefined : msg(key);
    },
    mobile(v: string) {
      if (!v.trim()) return msg('nerr.mobile');
      return MOBILE.test(v.trim()) ? undefined : msg('err.mobile');
    },
  };
}

function clean<T>(e: Errors<T>): Errors<T> {
  return Object.fromEntries(Object.entries(e).filter(([, v]) => v)) as Errors<T>;
}

export function validateWorkApplication(v: WorkApplication, lang: Lang = 'hi'): Errors<WorkApplication> {
  const r = rules(lang);
  const jobCard = v.jobCard.trim();
  return clean<WorkApplication>({
    name: r.name(v.name, 'nerr.name'),
    fatherName: r.name(v.fatherName, 'nerr.fatherName'),
    jobCard: !jobCard ? translate(lang, 'nerr.jobCard') : JOB_CARD.test(jobCard) ? undefined : translate(lang, 'nerr.jobCardFormat'),
    village: r.required(v.village, 'nerr.village'),
    mobile: r.mobile(v.mobile),
  });
}

export function validateJobCardApplication(v: JobCardApplication, lang: Lang = 'hi'): Errors<JobCardApplication> {
  const r = rules(lang);
  const msg = (key: MessageKey) => translate(lang, key);
  const age = v.age.trim();
  const adults = v.adults.trim();
  return clean<JobCardApplication>({
    name: r.name(v.name, 'nerr.name'),
    fatherName: r.name(v.fatherName, 'nerr.fatherOrHusband'),
    age: !age ? msg('nerr.age') : !/^\d{1,3}$/.test(age) || Number(age) > 100 ? msg('nerr.ageFormat') : Number(age) < 18 ? msg('nerr.ageMin') : undefined,
    gender: r.required(v.gender, 'nerr.gender'),
    village: r.required(v.village, 'nerr.village'),
    ward: r.required(v.ward, 'err.ward'),
    adults: !adults ? msg('nerr.adults') : !/^\d{1,2}$/.test(adults) || Number(adults) < 1 || Number(adults) > 20 ? msg('nerr.adultsRange') : undefined,
    mobile: r.mobile(v.mobile),
  });
}
