export const dynamic = 'force-dynamic';

export default async function TrialPage(props: any) {
  return (
    <div style={{ padding: '5rem', textAlign: 'center' }}>
      <h1>Debug Mode: Page Loaded</h1>
      <pre>{JSON.stringify(props.params, null, 2)}</pre>
    </div>
  );
}
