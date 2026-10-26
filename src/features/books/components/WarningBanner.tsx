import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Icon } from '../../../components/Icon';
import { dismissWarning, selectWarning } from '../booksSlice';

export function WarningBanner() {
  const dispatch = useAppDispatch();
  const warning = useAppSelector(selectWarning);
  if (!warning) return null;

  return (
    <div className="banner banner-warning" role="alert">
      <Icon name="alert" />
      <p>{warning}</p>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={() => dispatch(dismissWarning())}
        aria-label="Đóng cảnh báo"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
