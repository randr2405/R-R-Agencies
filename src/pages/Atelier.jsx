import { Link } from 'react-router-dom'

export default function Atelier() {
  return (
    <div className="division-page">
      <Link to="/" className="back-link">← Back to hub</Link>
      <h1>R&R Atelier</h1>
      <p>Nails.</p>
    </div>
  )
}