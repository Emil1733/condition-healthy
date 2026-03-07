
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function Page() {
  return (
    <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>Static Level 3 Test Page</h1>
      <p>If you see this, the 3rd-level routing is working for static segments.</p>
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#64748b' }}>
         Deployment Time: {new Date().toISOString()}
      </div>
    </div>
  );
}
