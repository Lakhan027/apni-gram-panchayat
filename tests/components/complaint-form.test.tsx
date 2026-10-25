import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import ComplaintForm from '@/components/forms/ComplaintForm';

beforeAll(() => {
  // jsdom has no object URLs; the photo preview needs them.
  URL.createObjectURL = () => 'blob:preview';
  URL.revokeObjectURL = () => {};
});

const submit = () => userEvent.click(screen.getByRole('button', { name: 'शिकायत जमा करें' }));

async function fillValid() {
  await userEvent.selectOptions(screen.getByLabelText(/वार्ड/), '3');
  await userEvent.selectOptions(screen.getByLabelText(/श्रेणी/), 'पानी');
  await userEvent.type(screen.getByLabelText(/विवरण/), 'हमारे वार्ड में तीन दिन से पानी नहीं आ रहा है।');
}

describe('ComplaintForm', () => {
  it('shows Hindi errors for required fields and focuses the first one', async () => {
    render(<ComplaintForm />);
    await submit();
    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toEqual(['कृपया अपना वार्ड चुनें।', 'कृपया शिकायत की श्रेणी चुनें।', 'कृपया शिकायत / सुझाव का विवरण लिखें।']);
    expect(screen.getByLabelText(/वार्ड/)).toHaveFocus();
    expect(screen.getByLabelText(/वार्ड/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/वार्ड/)).toHaveAttribute('aria-describedby', 'c-ward-error');
  });

  it('clears a field error as soon as it is fixed', async () => {
    render(<ComplaintForm />);
    await submit();
    await userEvent.selectOptions(screen.getByLabelText(/वार्ड/), '2');
    expect(screen.queryByText('कृपया अपना वार्ड चुनें।')).not.toBeInTheDocument();
  });

  it('counts description characters', async () => {
    render(<ComplaintForm />);
    await userEvent.type(screen.getByLabelText(/विवरण/), 'नमस्ते');
    expect(screen.getByText(`${'नमस्ते'.length} / 500`)).toBeInTheDocument();
  });

  it('keeps only digits in the mobile field and validates it', async () => {
    render(<ComplaintForm />);
    await fillValid();
    const mobile = screen.getByLabelText(/मोबाइल/);
    await userEvent.type(mobile, '98a76');
    expect(mobile).toHaveValue('9876');
    await submit();
    expect(screen.getByText('कृपया सही 10 अंकों का मोबाइल नंबर लिखें।')).toBeInTheDocument();
    expect(mobile).toHaveFocus();
  });

  it('previews a photo, removes it, and rejects non-images', async () => {
    render(<ComplaintForm />);
    const input = screen.getByLabelText(/फ़ोटो/) as HTMLInputElement;
    await userEvent.upload(input, new File(['x'], 'nal.png', { type: 'image/png' }));
    expect(screen.getByAltText('चुनी गई फ़ोटो का पूर्वावलोकन')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /हटाएँ/ }));
    expect(screen.queryByAltText('चुनी गई फ़ोटो का पूर्वावलोकन')).not.toBeInTheDocument();

    await fillValid();
    await userEvent.upload(input, new File(['x'], 'a.pdf', { type: 'application/pdf' }), { applyAccept: false });
    await submit();
    expect(screen.getByText('केवल चित्र (फ़ोटो) फ़ाइल ही चुनें।')).toBeInTheDocument();
  });

  it('on a valid submit never claims the complaint was registered', async () => {
    render(<ComplaintForm />);
    await fillValid();
    await submit();
    expect(screen.getByRole('button', { name: /जमा हो रहा है/ })).toBeDisabled();
    const msg = await screen.findByText(/आपकी शिकायत कहीं दर्ज नहीं हुई है/, {}, { timeout: 2000 });
    expect(msg).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'नया फ़ॉर्म भरें' }));
    expect(screen.getByLabelText(/विवरण/)).toHaveValue('');
  });
});
