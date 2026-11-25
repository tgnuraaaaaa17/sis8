/**
 * NoticeBar — операция нәтижесі (success / error хабарламасы).
 *
 * Хабарлама 4 секундтан кейін өз жолымен жабылады: App-дегі useEffect
 * cleanup-ы таймерді тазартады (жаңа хабарлама келсе немесе компонент
 * unmount болса — ескі таймер іске қосылмайды).
 */
export default function NoticeBar({ notice, onDismiss }) {
  if (!notice) return null;

  return (
    <div className={`notice notice--${notice.type}`} role="status">
      <span className="notice__text">{notice.text}</span>
      <button type="button" className="notice__close" onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
