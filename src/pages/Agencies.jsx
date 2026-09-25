import { Link } from 'react-router-dom'

export default function Agencies() {
  return (
    <div className="division-page">
      <Link to="/" className="back-link">← Back to hub</Link>
      <h1>R&R Agencies</h1>
      <p>Branding and custom creative work.</p>
    </div>
  )
}