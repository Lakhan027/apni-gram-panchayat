// TDD: written before lib/nrega.ts existed.
import { describe, expect, it } from 'vitest';
import {
  NREGA_NAME,
  NREGA_NAME_HI,
  validateJobCardApplication,
  validateWorkApplication,
  type JobCardApplication,
  type WorkApplication,
} from '@/lib/nrega';

const work: WorkApplication = {
  name: 'रामलाल',
  fatherName: 'मोहनलाल',
  jobCard: 'RJ-17-012-005-001/123',
  village: 'Appliyas',
  mobile: '9876543210',
};

const card: JobCardApplication = {
  name: 'सीता देवी',
  fatherName: 'हरिराम',
  age: '35',
  gender: 'female',
  village: 'Appliyas',
  ward: '3',
  adults: '4',
  mobile: '9876543210',
};

describe('NREGA_NAME', () => {
  it('is the new scheme name, exactly', () => {
    expect(NREGA_NAME).toBe('VB—G RAM G (NREGA)');
    expect(NREGA_NAME_HI).toBe('वीबी—जी राम जी (नरेगा)');
  });
});

describe('validateWorkApplication', () => {
  it('accepts a complete application', () => {
    expect(validateWorkApplication(work)).toEqual({});
  });

  it('makes every field mandatory, with Hindi messages', () => {
    const e = validateWorkApplication({ name: ' ', fatherName: '', jobCard: '', village: '', mobile: '' });
    expect(Object.keys(e).sort()).toEqual(['fatherName', 'jobCard', 'mobile', 'name', 'village']);
    expect(e.name).toBe('कृपया आवेदक का नाम लिखें।');
    expect(e.mobile).toBe('कृपया मोबाइल नंबर लिखें।');
  });

  it('checks the 10-digit mobile number', () => {
    expect(validateWorkApplication({ ...work, mobile: '12345' }).mobile).toBe('कृपया सही 10 अंकों का मोबाइल नंबर लिखें।');
    expect(validateWorkApplication({ ...work, mobile: '1234567890' }).mobile).toBeDefined();
    expect(validateWorkApplication({ ...work, mobile: '6123456789' }).mobile).toBeUndefined();
  });

  it('checks names and job card number format', () => {
    expect(validateWorkApplication({ ...work, name: 'A1' }).name).toBeDefined();
    expect(validateWorkApplication({ ...work, name: 'Ram Lal' }).name).toBeUndefined();
    expect(validateWorkApplication({ ...work, jobCard: 'abc' }).jobCard).toBeDefined();
    expect(validateWorkApplication({ ...work, jobCard: 'RJ 17 012' }).jobCard).toBeDefined();
    expect(validateWorkApplication({ ...work, jobCard: 'RJ-17-012-005-001/123' }).jobCard).toBeUndefined();
  });

  it('can return English messages', () => {
    expect(validateWorkApplication({ ...work, village: '' }, 'en').village).toBe("Please enter the village name.");
  });
});

describe('validateJobCardApplication', () => {
  it('accepts a complete application', () => {
    expect(validateJobCardApplication(card)).toEqual({});
  });

  it('makes every field mandatory', () => {
    const empty = Object.fromEntries(Object.keys(card).map((k) => [k, ''])) as unknown as JobCardApplication;
    expect(Object.keys(validateJobCardApplication(empty)).sort()).toEqual(Object.keys(card).sort());
  });

  it('requires an adult applicant and a sensible household size', () => {
    expect(validateJobCardApplication({ ...card, age: '17' }).age).toBe('आवेदक की आयु कम से कम 18 वर्ष होनी चाहिए।');
    expect(validateJobCardApplication({ ...card, age: '18' }).age).toBeUndefined();
    expect(validateJobCardApplication({ ...card, age: 'abc' }).age).toBeDefined();
    expect(validateJobCardApplication({ ...card, adults: '0' }).adults).toBeDefined();
    expect(validateJobCardApplication({ ...card, adults: '21' }).adults).toBeDefined();
  });

  it('checks the mobile number', () => {
    expect(validateJobCardApplication({ ...card, mobile: '98765' }).mobile).toBeDefined();
  });
});
