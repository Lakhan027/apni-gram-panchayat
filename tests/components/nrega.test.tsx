// TDD: written before the VB—G RAM G (NREGA) options, forms and मिसटोल page existed.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import NregaOptions from '@/components/nrega/NregaOptions';
import WorkApplicationForm from '@/components/nrega/WorkApplicationForm';
import JobCardForm from '@/components/nrega/JobCardForm';
import MistolList from '@/components/nrega/MistolList';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { getMgnregaWorks, getWagePayments } from '@/lib/data';

beforeEach(() => localStorage.clear());

describe('NregaOptions', () => {
  it('shows the three options separately, keeping the exact label मिसटोल', () => {
    render(<NregaOptions />);
    expect(screen.getByRole('link', { name: /कार्य के लिए आवेदन/ })).toHaveAttribute('href', '/mgnrega/apply-work');
    expect(screen.getByRole('link', { name: /नया जॉब कार्ड बनाने हेतु/ })).toHaveAttribute('href', '/mgnrega/new-job-card');
    expect(screen.getByRole('link', { name: /मिसटोल/ })).toHaveAttribute('href', '/mgnrega/mistol');
    expect(screen.queryByText(/muster roll|मस्टर रोल/i)).not.toBeInTheDocument();
  });

  it('keeps मिसटोल unchanged in English', async () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <NregaOptions />
      </LanguageProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('link', { name: /Apply for work/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /मिसटोल/ })).toBeInTheDocument();
  });
});

describe('WorkApplicationForm', () => {
  const submit = () => userEvent.click(screen.getByRole('button', { name: 'जमा करें' }));

  it('has the five required fields', () => {
    render(<WorkApplicationForm />);
    for (const label of ['आवेदक का नाम', 'पिता का नाम', 'जॉब कार्ड नंबर', 'गाँव का नाम', 'मोबाइल नंबर']) {
      expect(screen.getByLabelText(new RegExp(label))).toHaveAttribute('aria-required', 'true');
    }
  });

  it('shows an error under every empty field and focuses the first', async () => {
    render(<WorkApplicationForm />);
    await submit();
    expect(screen.getAllByRole('alert')).toHaveLength(5);
    expect(screen.getByLabelText(/आवेदक का नाम/)).toHaveFocus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('rejects a wrong mobile number', async () => {
    render(<WorkApplicationForm />);
    await userEvent.type(screen.getByLabelText(/मोबाइल नंबर/), '12345');
    await submit();
    expect(screen.getByText('कृपया सही 10 अंकों का मोबाइल नंबर लिखें।')).toBeInTheDocument();
  });

  it('shows a success popup after a valid submit, then resets', async () => {
    render(<WorkApplicationForm />);
    await userEvent.type(screen.getByLabelText(/आवेदक का नाम/), 'रामलाल');
    await userEvent.type(screen.getByLabelText(/पिता का नाम/), 'मोहनलाल');
    await userEvent.type(screen.getByLabelText(/जॉब कार्ड नंबर/), 'RJ-17-012-005-001/123');
    await userEvent.type(screen.getByLabelText(/गाँव का नाम/), 'Appliyas');
    await userEvent.type(screen.getByLabelText(/मोबाइल नंबर/), '9876543210');
    await submit();
    const dialog = await screen.findByRole('dialog', { name: 'आवेदन सफलतापूर्वक जमा हो गया' });
    expect(within(dialog).getByText(/रामलाल/)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'ठीक है' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/आवेदक का नाम/)).toHaveValue('');
  });
});

describe('JobCardForm', () => {
  it('validates all fields and shows a success popup', async () => {
    render(<JobCardForm />);
    await userEvent.click(screen.getByRole('button', { name: 'जमा करें' }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(8);

    await userEvent.type(screen.getByLabelText(/आवेदक का नाम/), 'सीता देवी');
    await userEvent.type(screen.getByLabelText(/पिता \/ पति का नाम/), 'हरिराम');
    await userEvent.type(screen.getByLabelText(/आयु/), '35');
    await userEvent.selectOptions(screen.getByLabelText(/लिंग/), 'female');
    await userEvent.type(screen.getByLabelText(/गाँव का नाम/), 'Appliyas');
    await userEvent.selectOptions(screen.getByLabelText(/वार्ड/), '3');
    await userEvent.type(screen.getByLabelText(/वयस्क सदस्य/), '4');
    await userEvent.type(screen.getByLabelText(/मोबाइल नंबर/), '9876543210');
    await userEvent.click(screen.getByRole('button', { name: 'जमा करें' }));
    expect(await screen.findByRole('dialog', { name: 'आवेदन सफलतापूर्वक जमा हो गया' })).toBeInTheDocument();
  });

  it('does not ask for Aadhaar or bank details', () => {
    render(<JobCardForm />);
    expect(screen.queryByLabelText(/आधार|बैंक/)).not.toBeInTheDocument();
  });
});

describe('MistolList', () => {
  it('lists every record without worker names, with references only when verified', async () => {
    const [rows, works] = await Promise.all([getWagePayments(), getMgnregaWorks()]);
    render(<MistolList rows={rows} works={works} />);
    expect(screen.getAllByRole('article')).toHaveLength(rows.length);
    for (const r of rows) {
      const card = screen.getByText(r.musterRoll).closest('article')!;
      if (r.status === 'verified') expect(card).toHaveTextContent(r.referenceNo!);
      else expect(card).not.toHaveTextContent('FTO-');
    }
  });

  it('filters by work and searches by number', async () => {
    const [rows, works] = await Promise.all([getWagePayments(), getMgnregaWorks()]);
    render(<MistolList rows={rows} works={works} />);
    await userEvent.selectOptions(screen.getByLabelText('कार्य'), 'M-001');
    expect(screen.getAllByRole('article')).toHaveLength(rows.filter((r) => r.workId === 'M-001').length);
    await userEvent.selectOptions(screen.getByLabelText('कार्य'), 'all');
    await userEvent.type(screen.getByLabelText('मिसटोल नंबर खोजें'), '1043');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await userEvent.type(screen.getByLabelText('मिसटोल नंबर खोजें'), 'xyz');
    expect(screen.getByText('कोई मिसटोल नहीं मिला')).toBeInTheDocument();
  });
});
