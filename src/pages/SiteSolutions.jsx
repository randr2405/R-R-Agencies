import { Link } from 'react-router-dom'

export default function SiteSolutions() {
  return (
    <div className="division-page">
      <Link to="/" className="back-link">← Back to hub</Link>
      <h1>Site Solutions</h1>
      <p>Websites, apps, custom software, business plans, brand management.</p>
    </div>
  )
}