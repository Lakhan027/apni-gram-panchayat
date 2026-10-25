import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from '@/components/ui/Button';
import DataTable, { type Column } from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import FilterChips from '@/components/ui/FilterChips';
import ProgressBar from '@/components/ui/ProgressBar';
import SearchInput from '@/components/ui/SearchInput';
import StatusBadge from '@/components/ui/StatusBadge';
import Breadcrumb from '@/components/layout/Breadcrumb';

describe('StatusBadge', () => {
  it('shows the Hindi label, not colour alone', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('प्रगति पर')).toBeInTheDocument();
  });
});

describe('ProgressBar', () => {
  it('exposes a clamped value to assistive tech', () => {
    render(<ProgressBar value={130} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('renders a link when href is given', () => {
    render(<Button href="/works">कार्य</Button>);
    expect(screen.getByRole('link', { name: 'कार्य' })).toHaveAttribute('href', '/works');
  });
  it('renders a type=button by default and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>दबाएँ</Button>);
    const btn = screen.getByRole('button', { name: 'दबाएँ' });
    expect(btn).toHaveAttribute('type', 'button');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('FilterChips', () => {
  it('marks the active chip and reports changes', async () => {
    const onChange = vi.fn();
    render(
      <FilterChips
        label="स्थिति"
        value="all"
        onChange={onChange}
        options={[{ value: 'all', label: 'सभी' }, { value: 'done', label: 'पूर्ण' }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'सभी' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'पूर्ण' }));
    expect(onChange).toHaveBeenCalledWith('done');
  });
});

describe('SearchInput', () => {
  it('has a label and a clear button once there is text', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchInput id="s" label="खोजें" value="" onChange={onChange} />);
    expect(screen.getByLabelText('खोजें')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'खोज साफ़ करें' })).not.toBeInTheDocument();
    rerender(<SearchInput id="s" label="खोजें" value="abc" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'खोज साफ़ करें' }));
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('DataTable', () => {
  type Row = { id: string; name: string; amount: number };
  const rows: Row[] = [{ id: '1', name: 'सड़क', amount: 10 }, { id: '2', name: 'नाली', amount: 20 }];
  const columns: Column<Row>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id, hideOnCard: true },
    { key: 'name', header: 'नाम', primary: true, render: (r) => r.name },
    { key: 'amount', header: 'राशि', align: 'right', render: (r) => r.amount },
  ];

  it('renders a phone card list and a table from the same rows', () => {
    render(<DataTable rows={rows} columns={columns} getKey={(r) => r.id} caption="परीक्षण" />);
    const list = screen.getByRole('list', { name: 'परीक्षण' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    // card view: primary column is the heading, hidden column is skipped
    expect(within(list).queryByText('ID')).not.toBeInTheDocument();
    expect(within(list).getAllByText('राशि')).toHaveLength(2);

    const table = screen.getByRole('table', { name: 'परीक्षण' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['ID', 'नाम', 'राशि']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
  });
});

describe('EmptyState', () => {
  it('shows title and action', () => {
    render(<EmptyState title="कुछ नहीं मिला" action={<button>रीसेट</button>} />);
    expect(screen.getByRole('status')).toHaveTextContent('कुछ नहीं मिला');
    expect(screen.getByRole('button', { name: 'रीसेट' })).toBeInTheDocument();
  });
});

describe('Breadcrumb', () => {
  it('starts at होम and marks the current page', () => {
    render(<Breadcrumb items={[{ label: 'विकास कार्य', href: '/works' }, { label: 'W-001' }]} />);
    expect(screen.getByRole('link', { name: 'होम' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'विकास कार्य' })).toHaveAttribute('href', '/works');
    expect(screen.getByText('W-001')).toHaveAttribute('aria-current', 'page');
  });
});
