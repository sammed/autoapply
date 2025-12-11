import React from 'react';
import { Application, type ApplicationDetails } from '../types';

interface ApplicationDetailsProps {
  application: ApplicationDetails;
}

function isHtmlString(value: string) {
  console.log('🚀 ~ isHtmlString ~ value:', value);
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Ej angivet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatLocation(app: ApplicationDetails) {
  const loc = (app as any).location ?? app.data?.workplace_address;
  if (!loc) return 'Ej angivet';

  const parts = [loc.city, loc.municipality, loc.region, loc.country].filter(
    Boolean,
  );

  return parts.join(', ') || 'Ej angivet';
}

function formatScope(scope?: { min: number; max: number }) {
  if (!scope) return 'Ej angivet';
  if (scope.min === 0 && scope.max === 100) return '0–100% (varierande)';
  if (scope.min === scope.max) return `${scope.min}%`;
  return `${scope.min}–${scope.max}%`;
}

function formatDescription(text?: string | null) {
  console.log('🚀 ~ formatDescription ~ text:', text);
  if (!text) return null;
  return text.split(/\n{2,}/).map((para, index) => (
    <p key={index} className="mb-3 whitespace-pre-line leading-relaxed">
      {para.trim()}
    </p>
  ));
}


function formatMatchScore(relevance?: number) {
  if (relevance == null) return 'Ej angivet';
  const pct = Math.round(relevance * 100);
  return `${pct} %`;
}

function getCoordinates(app: ApplicationDetails): [number, number] | null {
  const loc = (app as any).location ?? app.data?.workplace_address;
  const coords = loc?.coordinates;
  if (Array.isArray(coords) && coords.length === 2) {
    const [lng, lat] = coords;
    if (typeof lat === 'number' && typeof lng === 'number') {
      return [lat, lng];
    }
  }
  return null;
}

function buildMapsUrl(app: ApplicationDetails): string | null {
  const coords = getCoordinates(app);
  if (!coords) return null;
  const [lat, lng] = coords;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

const ApplicationDetailsComponent: React.FC<ApplicationDetailsProps> = ({
  application,
}) => {
  const data = application.data;
  const contact = data.application_contacts?.[0];
  const descriptionText =
    data.description?.text_formatted ||
    data.description?.text ||
    (application as any).description;

  const mapsUrl = buildMapsUrl(application);
  const mustHaveWorkExp = data.must_have?.work_experiences || [];
  const occupationFieldLabel = data.occupation_field?.label;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <header className="border-b border-gray-700 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {application.headline || data.headline}
            </h1>
            <p className="text-gray-300">
              {data.employer?.workplace ||
                data.employer?.name ||
                (application as any).employer}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {formatLocation(application)}
            </p>
          </div>

          {data.logo_url && (
            <img
              src={data.logo_url}
              alt={data.employer?.name || (application as any).employer}
              className="h-16 w-16 object-contain bg-white rounded-md p-1"
            />
          )}
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {data.occupation?.label && (
            <span className="rounded-full bg-blue-900/40 px-3 py-1 text-blue-200 border border-blue-700/60">
              {data.occupation.label}
            </span>
          )}
          {data.working_hours_type?.label && (
            <span className="rounded-full bg-purple-900/40 px-3 py-1 text-purple-200 border border-purple-700/60">
              {data.working_hours_type.label}
            </span>
          )}
          {data.duration?.label && (
            <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-emerald-200 border border-emerald-700/60">
              {data.duration.label}
            </span>
          )}
          {data.employment_type?.label && (
            <span className="rounded-full bg-gray-800 px-3 py-1 text-gray-200 border border-gray-600">
              {data.employment_type.label}
            </span>
          )}
        </div>
      </header>

      {/* Summary bar */}
      <section className="grid gap-3 rounded-lg border border-gray-700 bg-gray-900/70 p-4 text-sm text-gray-200 md:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Matchning
          </p>
          <p className="mt-1 text-base font-semibold">
            {formatMatchScore(data.relevance)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Erfarenhet
          </p>
          <p className="mt-1">
            {data.experience_required
              ? 'Erfarenhet krävs'
              : 'Erfarenhet är meriterande'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Körkort
          </p>
          <p className="mt-1">
            {data.driving_license_required
              ? 'Körkort krävs'
              : 'Körkort ej krav'}
          </p>
          {data.driving_license?.label && (
            <p className="text-xs text-gray-400">{data.driving_license.label}</p>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Tillgång till bil
          </p>
          <p className="mt-1">
            {data.access_to_own_car
              ? 'Egen bil önskas'
              : 'Egen bil ej angivet'}
          </p>
        </div>
      </section>

      {/* Chips for field & must-have experience */}
      {(occupationFieldLabel || mustHaveWorkExp.length > 0) && (
        <section className="rounded-lg border border-gray-700 bg-gray-900/60 p-4 text-sm text-gray-200">
          <h2 className="text-sm font-semibold text-white mb-2">
            Profil & kompetens
          </h2>
          <div className="flex flex-wrap gap-2">
            {occupationFieldLabel && (
              <span className="rounded-full bg-indigo-900/40 px-3 py-1 text-indigo-200 border border-indigo-700/60 text-xs">
                Område: {occupationFieldLabel}
              </span>
            )}
            {mustHaveWorkExp.map((exp, idx) => (
              <span
                key={`${exp.concept_id}-${idx}`}
                className="rounded-full bg-teal-900/40 px-3 py-1 text-teal-200 border border-teal-700/60 text-xs"
              >
                Erfarenhet: {exp.label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Content layout */}
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Left: Description */}
        <section className="space-y-3">
          <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
          <h2 className="text-lg font-semibold text-white">Om tjänsten</h2>
            {descriptionText ? (
              isHtmlString(descriptionText) ? (
                <div
                  className="prose prose-sm prose-invert max-w-none leading-relaxed pt-2"
                  dangerouslySetInnerHTML={{ __html: descriptionText }}
                />
              ) : (
                <div className="prose prose-sm prose-invert max-w-none leading-relaxed pt-2">
                  {formatDescription(descriptionText)}
                </div>
              )
            ) : (
              <p className="text-sm text-gray-300">Ingen beskrivning tillgänglig.</p>
            )}
          </div>

          {/* Links */}
          <div className="mt-4 flex flex-wrap gap-3">
            {data.webpage_url && (
              <a
                href={data.webpage_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Visa annons hos Arbetsförmedlingen
              </a>
            )}

            {data.application_details?.url && (
              <a
                href={data.application_details.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded border border-blue-500 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/10"
              >
                Ansök på arbetsgivarens sida
              </a>
            )}
          </div>
        </section>

        {/* Right: Sidebar / Quick facts */}
        <aside className="space-y-4 rounded-lg border border-gray-700 bg-gray-900/60 p-4 text-sm text-gray-200">
          <h2 className="text-base font-semibold text-white mb-2">
            Snabbfakta
          </h2>

          <dl className="space-y-2">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Ort</dt>
              <dd className="text-right">{formatLocation(application)}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Antal tjänster</dt>
              <dd className="text-right">
                {data.number_of_vacancies ?? 'Ej angivet'}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Omfattning</dt>
              <dd className="text-right">
                {formatScope(data.scope_of_work)}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Arbetstid</dt>
              <dd className="text-right">
                {data.working_hours_type?.label || 'Ej angivet'}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Anställningsform</dt>
              <dd className="text-right">
                {data.employment_type?.label || 'Ej angivet'}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Lön</dt>
              <dd className="text-right">
                {data.salary_description ||
                  data.salary_type?.label ||
                  'Ej angivet'}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Sista ansökningsdag</dt>
              <dd className="text-right">
                {formatDateTime(
                  (application as any).application_deadline ||
                    data.application_deadline,
                )}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Publicerad</dt>
              <dd className="text-right">
                {formatDateTime(data.publication_date)}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-400">Källa</dt>
              <dd className="text-right">
                {(application as any).source || data.source_type || 'Ej angivet'}
              </dd>
            </div>
          </dl>

          {/* Map */}
          {mapsUrl && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => window.open(mapsUrl, '_blank')}
                className="w-full rounded border border-green-500 px-3 py-2 text-xs font-medium text-green-200 hover:bg-green-500/10"
              >
                Öppna plats i Google Maps
              </button>
            </div>
          )}

          {/* Contact */}
          <div className="mt-4 border-t border-gray-700 pt-3">
            <h3 className="text-sm font-semibold text-white mb-1">
              Kontakt
            </h3>
            {contact ? (
              <div className="space-y-1">
                <p>
                  {contact.description}
                  {contact.contact_type && ` – ${contact.contact_type}`}
                </p>
                {contact.email && (
                  <p className="text-xs text-blue-300 break-all">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </p>
                )}
                {contact.telephone && (
                  <p className="text-xs text-blue-300">
                    <a href={`tel:${contact.telephone}`}>
                      {contact.telephone}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Ingen kontaktperson angiven.
              </p>
            )}
          </div>

          {/* Employer site */}
          {data.employer?.url && (
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-white mb-1">
                Arbetsgivare
              </h3>
              <p className="text-xs text-blue-300 break-all">
                <a href={data.employer.url} target="_blank" rel="noreferrer">
                  {data.employer.url}
                </a>
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ApplicationDetailsComponent;
