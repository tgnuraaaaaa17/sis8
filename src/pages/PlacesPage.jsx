import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import NoticeBar from '../components/NoticeBar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import PlaceFilters from '../components/PlaceFilters.jsx';
import PlaceForm from '../components/PlaceForm.jsx';
import PlaceListSkeleton from '../components/PlaceListSkeleton.jsx';
import StateMessage from '../components/StateMessage.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import useNotice from '../hooks/useNotice.js';
import usePlaceForm from '../hooks/usePlaceForm.js';
import usePlaces from '../hooks/usePlaces.js';
import { DEFAULT_SORT, SORT_OPTIONS, STATUS_OPTIONS } from '../utils/constants.js';

const PAGE_SKELETONS = 6;

function toPage(value) {
  const number = parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : 1;
}

/**
 * Places list. Search, filters, sorting and the page number live in the URL
 * (?q=canyon&category=Nature&sort=rating-desc&page=2), so the page can be
 * shared, refreshed and used with the browser Back / Forward buttons.
 */
export default function PlacesPage() {
  useDocumentTitle('Places');

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const region = searchParams.get('region') ?? '';
  const rawStatus = searchParams.get('status') ?? '';
  const status = STATUS_OPTIONS.some((option) => option.value === rawStatus) ? rawStatus : '';
  const rawSort = searchParams.get('sort');
  const sort = SORT_OPTIONS.some((option) => option.value === rawSort) ? rawSort : DEFAULT_SORT;
  const page = toPage(searchParams.get('page'));

  const list = usePlaces({ search: q, category, region, status, sort, page });
  const { notice, showNotice, dismissNotice } = useNotice();

  const form = usePlaceForm({
    onSaved: (saved) => {
      list.reload();
      showNotice('success', `“${saved.name}” has been saved.`);
    },
  });

  // A message sent from another page (for example "place removed").
  useEffect(() => {
    const incoming = location.state?.notice;
    if (!incoming) return;

    showNotice(incoming.type, incoming.text);
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null });
  }, [location.state]);

  // The URL asked for a page that does not exist (for example after removals).
  // Only a response to the CURRENT page number may correct the URL; otherwise
  // the previous response would undo a click on the pagination.
  useEffect(() => {
    const isAnswerToCurrentPage = list.requestedPage === page;
    if ((list.status === 'success' || list.status === 'empty') && isAnswerToCurrentPage && list.page !== page) {
      updateParams({ page: list.page }, { replace: true });
    }
  }, [list.status, list.page, list.requestedPage, page]);

  function updateParams(changes, options) {
    const next = new URLSearchParams(searchParams);

    // Any change except the page number returns to the first page.
    if (!('page' in changes)) next.delete('page');

    Object.entries(changes).forEach(([key, value]) => {
      const isDefault =
        value === '' ||
        value == null ||
        (key === 'sort' && value === DEFAULT_SORT) ||
        (key === 'page' && Number(value) === 1);

      if (isDefault) next.delete(key);
      else next.set(key, String(value));
    });

    setSearchParams(next, options);
  }

  function handleFilterChange(field, value) {
    // Typing in the search box must not fill the history with one entry per letter.
    updateParams({ [field]: value }, field === 'q' ? { replace: true } : undefined);
  }

  function handlePageChange(nextPage) {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const hasActiveFilters = Boolean(q || category || region || status);
  const isLoading = list.status === 'loading';

  function renderResults() {
    if (list.status === 'error') {
      return (
        <StateMessage
          variant="error"
          title="The list could not be loaded"
          text={list.error}
          actionLabel="Try again"
          onAction={list.reload}
        />
      );
    }

    if (isLoading && list.places.length === 0) {
      return <PlaceListSkeleton count={PAGE_SKELETONS} />;
    }

    if (list.status === 'empty') {
      return (
        <StateMessage
          variant="empty"
          title="No places found"
          text={
            hasActiveFilters
              ? 'Nothing matches the current search and filters. Try changing them.'
              : 'The list is empty. Add the first place with the “+ Add place” button.'
          }
          actionLabel={hasActiveFilters ? 'Reset filters' : 'Add a place'}
          onAction={hasActiveFilters ? () => setSearchParams({}) : form.startCreate}
        />
      );
    }

    return (
      <>
        <ul className={`card-list card-list--grid${isLoading ? ' card-list--loading' : ''}`}>
          {list.places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </ul>
        <Pagination page={list.page} totalPages={list.totalPages} onChange={handlePageChange} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Places" text="Find a place worth the trip." />

      <NoticeBar notice={notice} onDismiss={dismissNotice} />

      <PlaceFilters
        values={{ q, category, region, status, sort }}
        facets={list.facets}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onChange={handleFilterChange}
        onReset={() => setSearchParams({})}
        onReload={list.reload}
        onCreate={form.startCreate}
      />

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

      <div className="results-bar">
        <p className="results-bar__count">
          {list.status === 'error'
            ? 'Request failed'
            : `Found ${list.total} place${list.total === 1 ? '' : 's'}`}
          {isLoading ? <span className="results-bar__hint"> · loading…</span> : null}
        </p>
      </div>

      <section aria-label="Places">{renderResults()}</section>
    </>
  );
}
