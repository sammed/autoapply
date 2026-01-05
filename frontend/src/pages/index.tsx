import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Welcome to Job Applications</h1>
    </Layout>
  );
}