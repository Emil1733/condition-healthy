"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body style={{ padding: "2rem", fontFamily: "monospace", color: "red", backgroundColor: "black" }}>
        <h1>CRITICAL EDGE RUNTIME CRASH</h1>
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid red" }}>
            <h2>Error Message:</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>{error.message || "Unknown Error String"}</pre>
            
            <h2 style={{ marginTop: "2rem" }}>Stack Trace:</h2>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", color: "#ffa5a5" }}>
                {error.stack || "No stack trace provided by Edge environment."}
            </pre>
            
            <h2 style={{ marginTop: "2rem" }}>Digest:</h2>
            <pre>{error.digest || "None"}</pre>
        </div>
      </body>
    </html>
  );
}
