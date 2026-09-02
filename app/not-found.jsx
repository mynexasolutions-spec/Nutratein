import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container section empty-state">
      <div className="icon">🧭</div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
