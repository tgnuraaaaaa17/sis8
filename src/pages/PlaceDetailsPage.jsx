import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import NoticeBar from '../components/NoticeBar.jsx';
import PlaceDetails from '../components/PlaceDetails.jsx';
import PlaceForm from '../components/PlaceForm.jsx';
import StateMessage from '../components/StateMessage.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import useNotice from '../hooks/useNotice.js';
import usePlace from '../hooks/usePlace.js';
import usePlaceForm from '../hooks/usePlaceForm.js';
import { fetchDashboardPlaces } from '../features/dashboard/dashboardSlice.js';
import { removePlace, toggleVisited } from '../features/placeDetails/placeDetailsSlice.js';
import { isActionLocked, lockAction, unlockAction } from '../utils/actionLock.js';

/** /places/:id — `key={id}` resets all state when the id in the URL changes. */
export default function PlaceDetailsPage() {
  const { id } = useParams();
  return <PlaceDetailsContent key={id} id={id} />;
}

function PlaceDetailsContent({ id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, place, error, loadedAt, reload } = usePlace(id);
  const { notice, showNotice, dismissNotice } = useNotice();
  const [isPending, setIsPending] = useState(false);

  useDocumentTitle(place ? place.name : 'Place details');

  const form = usePlaceForm({
    onSaved: (saved) => {
      reload();
      dispatch(fetchDashboardPlaces());
      showNotice('success', `“${saved.name}” has been saved.`);
    },
  });

  // "default" means the page was opened directly, so there is nothing to go back to.
  function handleBack() {
    if (location.key !== 'default') navigate(-1);
    else navigate('/places');
  }

  function handleToggleVisited() {
    if (!place || isActionLocked(place.id)) return;

    // The id is captured when the action starts, so the answer can only update this place.
    const placeId = place.id;
    const nextCompleted = !place.completed;

    lockAction(placeId);
    setIsPending(true);

    dispatch(toggleVisited({ id: placeId, completed: nextCompleted }))
      .unwrap()
      .then((updated) => {
        dispatch(fetchDashboardPlaces());
        showNotice(
          'success',
          `“${updated.name}” is now ${updated.completed ? 'marked as visited' : 'back in the plan'}.`,
        );
      })
      .catch((requestError) => {
        showNotice('error', requestError?.message || 'The place could not be updated.');
      })
      .finally(() => {
        unlockAction(placeId);
        setIsPending(false);
      });
  }

  function handleDelete() {
    if (!place || isActionLocked(place.id)) return;
    if (!window.confirm(`Remove “${place.name}”?`)) return;

    const placeId = place.id;
    const placeName = place.name;

    lockAction(placeId);
    setIsPending(true);

    dispatch(removePlace(placeId))
      .unwrap()
      .then(() => {
        dispatch(fetchDashboardPlaces());
        navigate('/places', {
          replace: true,
          state: { notice: { type: 'success', text: `“${placeName}” has been removed.` } },
        });
      })
      .catch((requestError) => {
        showNotice('error', requestError?.message || 'The place could not be removed.');
      })
      .finally(() => {
        unlockAction(placeId);
        setIsPending(false);
      });
  }

  function renderContent() {
    if (status === 'loading') {
      return (
        <div className="detail detail--loading" aria-busy="true">
          <div className="skeleton__media detail__media-skeleton" />
          <div className="skeleton">
            <span className="skeleton__row skeleton__row--title" />
            <span className="skeleton__row" />
            <span className="skeleton__row" />
            <span className="skeleton__row skeleton__row--short" />
            <span className="skeleton__row" />
            <span className="skeleton__row skeleton__row--short" />
          </div>
        </div>
      );
    }

    if (status === 'notfound') {
      return (
        <StateMessage
          variant="empty"
          title="Place not found"
          text={`There is no place with the id “${id}”. It may have been removed, or the address is mistyped.`}
        />
      );
    }

    if (status === 'error') {
      return (
        <StateMessage
          variant="error"
          title="The place could not be loaded"
          text={error}
          actionLabel="Try again"
          onAction={reload}
        />
      );
    }

    return (
      <>
        {form.mode ? (
          <PlaceForm
            mode={form.mode}
            draft={form.draft}
            status={form.status}
            error={form.error}
            onChange={form.change}
            onSubmit={form.submit}
            onCancel={form.cancel}
          />
        ) : null}

        <PlaceDetails
          place={place}
          loadedAt={loadedAt}
          isPending={isPending}
          onToggleVisited={handleToggleVisited}
          onEdit={() => form.startEdit(place)}
          onDelete={handleDelete}
          onReload={reload}
        />
      </>
    );
  }

  return (
    <>
      <nav className="crumbs" aria-label="Page navigation">
        <button type="button" className="btn btn--ghost btn--small" onClick={handleBack}>
          ← Back
        </button>
        <Link to="/places" className="btn btn--ghost btn--small">
          All places
        </Link>
      </nav>

      <NoticeBar notice={notice} onDismiss={dismissNotice} />

      {renderContent()}
    </>
  );
}
