import { Link } from 'react-router-dom'

export default function Astorra() {
  return (
    <div className="division-page">
      <Link to="/" className="back-link">← Back to hub</Link>
      <h1>Astorra</h1>
      <p>Custom business software — invoices, customer tracking, quotes, inventory, and more.</p>
    </div>
  )
}