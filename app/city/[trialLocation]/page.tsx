
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  params: {
    trialLocation: string;
  };
}

export default function Page(props: PageProps) {
  return (
    <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>FLAT ROUTE SUCCESS</h1>
      <p>This is a flat dynamic route at level 2 depth.</p>
      <pre style={{ background: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', display: 'inline-block' }}>
         Params: {JSON.stringify(props.params, null, 2)}
      </pre>
    </div>
  );
}
