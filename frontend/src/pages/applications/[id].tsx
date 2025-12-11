import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Application, type ApplicationDetails } from '../../types';
import { fetchApplicationById } from '../../utils/api';
import ApplicationDetailsComponent from '../../components/ApplicationDetailsComponent';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    setLoading(true);
    setError(null);

    fetchApplicationById(id)
      .then((app) => {
        console.log('🚀 ~ ApplicationDetailPage ~ app:', app);
        setApplication(app);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load application');
        setLoading(false);
      });
  }, [id]);

  return (
    <Layout>
      <nav
        className="mb-6 flex items-center rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 text-gray-300"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-300 hover:text-white"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Dashboard
            </Link>
          </li>

          <li>
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>

              <span className="ml-1 text-sm font-medium text-gray-400 md:ml-2">
                Application
              </span>
            </div>
          </li>

          {application && (
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">
                  {application.headline || `Application #${application.id}`}
                </span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      {loading && <p>Loading application...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {application && <ApplicationDetailsComponent application={application} />}
    </Layout>
  );
}
