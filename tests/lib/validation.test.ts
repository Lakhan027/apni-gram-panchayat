import { describe, expect, it } from 'vitest';
import { PHOTO_MAX_BYTES, validateComplaint, type ComplaintInput } from '@/lib/validation';

const valid: ComplaintInput = {
  name: '',
  ward: '3',
  category: 'पानी',
  description: 'हमारे वार्ड में तीन दिन से पानी नहीं आ रहा है।',
  mobile: '',
  photo: null,
};

const file = (type: string, size: number) => {
  const f = new File(['x'], 'p', { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};

describe('validateComplaint', () => {
  it('accepts a complete form with optional fields empty', () => {
    expect(validateComplaint(valid)).toEqual({});
  });

  it('requires ward, category and description', () => {
    const e = validateComplaint({ ...valid, ward: '', category: '', description: '   ' });
    expect(Object.keys(e).sort()).toEqual(['category', 'description', 'ward']);
    expect(e.description).toBe('कृपया शिकायत / सुझाव का विवरण लिखें।');
  });

  it('enforces 20–500 characters on the trimmed description', () => {
    expect(validateComplaint({ ...valid, description: 'छोटा' }).description).toMatch('कम से कम 20');
    expect(validateComplaint({ ...valid, description: `  ${'क'.repeat(20)}  ` }).description).toBeUndefined();
    expect(validateComplaint({ ...valid, description: 'क'.repeat(500) }).description).toBeUndefined();
    expect(validateComplaint({ ...valid, description: 'क'.repeat(501) }).description).toMatch('500');
  });

  it('checks the optional 10-digit mobile number', () => {
    expect(validateComplaint({ ...valid, mobile: '9876543210' }).mobile).toBeUndefined();
    expect(validateComplaint({ ...valid, mobile: '12345' }).mobile).toBeDefined();
    expect(validateComplaint({ ...valid, mobile: '1234567890' }).mobile).toBeDefined(); // must start 6–9
    expect(validateComplaint({ ...valid, mobile: '98765432101' }).mobile).toBeDefined();
  });

  it('accepts only images up to 5 MB', () => {
    expect(validateComplaint({ ...valid, photo: file('image/png', 1000) }).photo).toBeUndefined();
    expect(validateComplaint({ ...valid, photo: file('image/jpeg', PHOTO_MAX_BYTES) }).photo).toBeUndefined();
    expect(validateComplaint({ ...valid, photo: file('image/jpeg', PHOTO_MAX_BYTES + 1) }).photo).toMatch('5 MB');
    expect(validateComplaint({ ...valid, photo: file('application/pdf', 10) }).photo).toMatch('चित्र');
  });
});
