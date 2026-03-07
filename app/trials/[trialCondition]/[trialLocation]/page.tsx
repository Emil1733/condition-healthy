
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  params: {
    trialCondition: string;
    trialLocation: string;
  };
}

export default async function Page(props: PageProps) {
  try {
    const params = props.params;
    const condition = params?.trialCondition || "unknown";
    const cityState = params?.trialLocation || "unknown";

    return (
      <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#2563eb' }}>SSR DIAGNOSTIC SUCCESS</h1>
        <p>The page rendered correctly at level 3 (Unique Segments).</p>
        <pre style={{ background: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', display: 'inline-block' }}>
           Params: {JSON.stringify(params, null, 2)}
        </pre>
      </div>
    );
  } catch (err: any) {
    return (
      <div style={{ padding: '5rem', fontFamily: 'monospace', color: 'red', textAlign: 'left' }}>
        <h1 style={{ borderBottom: '2px solid red' }}>SSR FATAL ERROR</h1>
        <h2>Message:</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{err?.message || String(err)}</pre>
        <h2>Stack:</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{err?.stack || "No stack trace available"}</pre>
        <h2>Digest:</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{err?.digest || "None"}</pre>
      </div>
    );
  }
}
