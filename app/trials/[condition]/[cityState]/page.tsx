
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function Page(props: any) {
  return (
    <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>SSR Debug Page (Level 3)</h1>
      <p>This page is running with zero dependencies to isolate the 500 Route Error.</p>
      <hr style={{ margin: '2rem auto', maxWidth: '300px', opacity: 0.1 }} />
      <div style={{ textAlign: 'left', display: 'inline-block', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
         <h4 style={{ margin: '0 0 1rem 0' }}>Route Parameters:</h4>
         <pre style={{ margin: 0 }}>{JSON.stringify(props.params, null, 2)}</pre>
      </div>
      <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#64748b' }}>
         Deployment Time: {new Date().toISOString()}
      </p>
    </div>
  );
}
