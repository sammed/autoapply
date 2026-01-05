import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import FilterOptions from '../components/FilterOptions';
import WebSocketComponent from '../components/WebSocket';
import ApplicationsTable from '../components/ApplicationTable';
import { Application } from '../types';
import { getSocket } from '../utils/socketManager';
import Image from 'next/image';

interface Filters {
  jobTitle: string;
  location: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [filters, setFilters] = useState<Filters>({ jobTitle: '', location: '' });

  const applyFilters = (apps: Application[], filters: Filters): Application[] => {
    const jobTitleFilter = filters.jobTitle.trim().toLowerCase();
    const locationFilter = filters.location.trim().toLowerCase();

    return apps.filter((app) => {
      const headline = app.data.headline?.toLowerCase?.() ?? '';
      const employerName = app.data.employer?.name?.toLowerCase?.() ?? '';
      const city = app.data.workplace_address?.city?.toLowerCase?.() ?? '';

      const jobMatch =
        !jobTitleFilter ||
        headline.includes(jobTitleFilter) ||
        employerName.includes(jobTitleFilter);

      const locationMatch = !locationFilter || city.includes(locationFilter);

      return jobMatch && locationMatch;
    });
  };

  const handleFilter = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      setFilteredApplications(applyFilters(applications, newFilters));
    },
    [applications],
  );

  const handleApplicationsUpdate = useCallback(
    (apps: Application[]) => {
      setApplications(apps);
      setFilteredApplications(applyFilters(apps, filters));
    },
    [filters],
  );

  const hasFilters =
    filters.jobTitle.trim().length > 0 || filters.location.trim().length > 0;

  const appsToShow = hasFilters ? filteredApplications : applications;

  const handleSelectApplication = (app: Application) => {
    router.push(`/applications/${app.id}`);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Job Applications Dashboard</h1>
      <FilterOptions onFilter={handleFilter} />
      <WebSocketComponent onApplicationsUpdate={handleApplicationsUpdate} />
      <ApplicationsTable applications={appsToShow} socket={getSocket()} onSelect={handleSelectApplication}/>

    </Layout>
  );
}
