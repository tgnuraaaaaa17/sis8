import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router';
import BarList from '../components/BarList.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import StatCard from '../components/StatCard.jsx';
import StateMessage from '../components/StateMessage.jsx';
import useAllPlaces from '../hooks/useAllPlaces.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { selectDashboardRegions, selectFilteredTopRatedPlaces } from '../features/dashboard/dashboardSlice.js';
import { STATUS_OPTIONS } from '../utils/constants.js';
import { formatPrice, formatRating } from '../utils/format.js';
import { computeStats, countBy } from '../utils/stats.js';

/** Builds a /places link that keeps the dashboard filters. */
function placesLink(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const text = query.toString();
  return text ? `/places?${text}` : '/places';
}

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const { status, places, error, reload } = useAllPlaces();

  // The filters live in the URL: /dashboard?region=Almaty&status=seasonal
  const [searchParams, setSearchParams] = useSearchParams();
  const region = searchParams.get('region') ?? '';
  const rawStatus = searchParams.get('status') ?? '';
  const statusFilter = STATUS_OPTIONS.some((option) => option.value === rawStatus) ? rawStatus : '';

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  const regions = useSelector(selectDashboardRegions);

  const filtered = useMemo(
    () =>
      places
        .filter((place) => !region || place.region === region)
        .filter((place) => !statusFilter || place.status === statusFilter),
    [places, region, statusFilter],
  );

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const byCategory = useMemo(() => countBy(filtered, 'category'), [filtered]);
  const byRegion = useMemo(() => countBy(filtered, 'region'), [filtered]);
  const byStatus = useMemo(() => countBy(filtered, 'status'), [filtered]);
  const topRated = useSelector((state) => selectFilteredTopRatedPlaces(state, region, statusFilter));

  const statusLabel = (value) =>
    STATUS_OPTIONS.find((option) => option.value === value)?.label || value;

  function renderBody() {
    if (status === 'error') {
      return (
        <StateMessage
          variant="error"
          title="The statistics could not be loaded"
          text={error}
          actionLabel="Try again"
          onAction={reload}
        />
      );
    }

    if (status === 'loading') {
      return (
        <div className="stats" aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div className="stat stat--skeleton" key={index}>
              <span className="skeleton__row skeleton__row--short" />
              <span className="skeleton__row skeleton__row--title" />
            </div>
          ))}
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <StateMessage
          variant="empty"
          title="No places match these filters"
          text="Change the region or the status to see statistics."
          actionLabel="Reset filters"
          onAction={() => setSearchParams({})}
        />
      );
    }

    return (
      <>
        <section className="stats" aria-label="Key numbers">
          <StatCard label="Places" value={stats.total} hint={`${stats.featuredCount} featured`} />
          <StatCard
            label="Average rating"
            value={stats.averageRating === null ? '—' : `★ ${formatRating(stats.averageRating)}`}
            hint="out of 5"
          />
          <StatCard
            label="Average ticket"
            value={stats.averagePrice === null ? '—' : formatPrice(Math.round(stats.averagePrice))}
            hint={`${stats.freeCount} with free entry`}
          />
          <StatCard
            label="Visited"
            value={`${stats.visitedCount} of ${stats.total}`}
            hint={`${Math.round((stats.visitedCount / stats.total) * 100)}% of the plan`}
          />
          <StatCard label="Time to see everything" value={`${stats.totalHours} h`} hint="sum of visit times" />
        </section>

        <div className="breakdowns">
          <BarList
            title="By category"
            items={byCategory}
            getLink={(item) => placesLink({ category: item.label, region, status: statusFilter })}
          />
          <BarList
            title="By region"
            items={byRegion}
            getLink={(item) => placesLink({ region: item.label, status: statusFilter })}
          />
          <BarList
            title="By status"
            items={byStatus.map((item) => ({ ...item, value: item.label, label: statusLabel(item.label) }))}
            getLink={(item) => placesLink({ region, status: item.value })}
          />
        </div>

        <section>
          <div className="section-head">
            <h2 className="section-head__title">Top rated</h2>
            <Link to={placesLink({ region, status: statusFilter, sort: 'rating-desc' })} className="section-head__link">
              See all in the list
            </Link>
          </div>
          <ul className="card-list card-list--grid">
            {topRated.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Dashboard" text="Numbers calculated from the places in the database.">
        <button type="button" className="btn btn--ghost" onClick={reload} disabled={status === 'loading'}>
          {status === 'loading' ? '⟳ Loading…' : '⟳ Reload'}
        </button>
      </PageHeader>

      <section className="toolbar" aria-label="Dashboard filters">
        <div className="toolbar__row">
          <label className="select">
            <span className="select__label">Region</span>
            <select
              className="select__input"
              value={region}
              onChange={(event) => setFilter('region', event.target.value)}
              disabled={status !== 'success'}
            >
              <option value="">All regions</option>
              {region && !regions.includes(region) ? <option value={region}>{region}</option> : null}
              {regions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <div className="segmented" role="group" aria-label="Status">
            {[{ value: '', label: 'All' }, ...STATUS_OPTIONS].map((option) => (
              <button
                key={option.value || 'all'}
                type="button"
                className={`segmented__item${statusFilter === option.value ? ' segmented__item--active' : ''}`}
                aria-pressed={statusFilter === option.value}
                onClick={() => setFilter('status', option.value)}
                disabled={status !== 'success'}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {renderBody()}
    </>
  );
}
