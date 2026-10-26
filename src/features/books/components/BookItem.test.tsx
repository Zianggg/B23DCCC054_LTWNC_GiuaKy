import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeBook } from '../../../test/test-utils';
import { BookItem } from './BookItem';

function setup(overrides: Partial<Parameters<typeof BookItem>[0]> = {}) {
  const props = {
    book: makeBook(),
    isBorrowed: false,
    onBorrow: jest.fn(),
    onReturn: jest.fn(),
    ...overrides,
  };
  render(<BookItem {...props} />);
  return { ...props, user: userEvent.setup() };
}

describe('<BookItem />', () => {
  it('hiển thị đúng tên, tác giả, thể loại, năm xuất bản và số bản còn lại', () => {
    setup({ book: makeBook({ title: 'Kinh tế học vi mô', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2018, available: 2, total: 3 }) });

    expect(screen.getByRole('heading', { name: 'Kinh tế học vi mô' })).toBeInTheDocument();
    expect(screen.getByText('N. Gregory Mankiw')).toBeInTheDocument();
    expect(screen.getByText('Kinh tế')).toBeInTheDocument();
    expect(screen.getByText('2018')).toBeInTheDocument();
    expect(screen.getByText(/Còn lại:/)).toHaveTextContent('Còn lại: 2/3');
  });

  it('click "Mượn" gọi onBorrow đúng 1 lần với đúng id', async () => {
    const { user, onBorrow, onReturn } = setup({ book: makeBook({ id: 'b7' }) });

    await user.click(screen.getByRole('button', { name: 'Mượn' }));

    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('b7');
    expect(onReturn).not.toHaveBeenCalled();
  });

  it('nút "Mượn" bị vô hiệu hoá khi sách đã hết bản', async () => {
    const { user, onBorrow } = setup({ book: makeBook({ available: 0 }) });
    const button = screen.getByRole('button', { name: 'Mượn' });

    expect(button).toBeDisabled();
    expect(screen.getByText('Hết sách')).toBeInTheDocument();
    await user.click(button);
    expect(onBorrow).not.toHaveBeenCalled();
  });

  it('cuốn đang mượn hiển thị nút "Trả" và gọi onReturn với đúng id', async () => {
    const { user, onReturn } = setup({ book: makeBook({ id: 'b3' }), isBorrowed: true });

    expect(screen.queryByRole('button', { name: 'Mượn' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Trả' }));
    expect(onReturn).toHaveBeenCalledWith('b3');
  });
});
