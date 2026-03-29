export const dynamic = "force-static";

export default function NotFound() {
  return (
    <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
      </div>
    </main>
  );
}
