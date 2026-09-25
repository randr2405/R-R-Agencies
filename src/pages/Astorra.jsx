import PageWrapper from '../components/PageWrapper'

export default function Astorra() {
  return (
    <PageWrapper title="Astorra">
      <p className="division-intro">
        A B2B SaaS platform built for South African SMEs — everything a growing business
        needs to run operations in one place.
      </p>

      <div className="feature-grid">
        <div className="feature-item">
          <h3>Customers & Quotes</h3>
          <p>Track clients and generate professional quotes in minutes.</p>
        </div>
        <div className="feature-item">
          <h3>Invoicing</h3>
          <p>PDF invoices, automated overdue reminders, and recurring billing via PayFast.</p>
        </div>
        <div className="feature-item">
          <h3>Inventory</h3>
          <p>Stock tracking built to keep up with day-to-day business.</p>
        </div>
        <div className="feature-item">
          <h3>Staff & HR</h3>
          <p>Team management, pay runs, leave deductions, and bulk payslip export.</p>
        </div>
        <div className="feature-item">
          <h3>Bookings & Expenses</h3>
          <p>Keep appointments and outgoings organised alongside everything else.</p>
        </div>
        <div className="feature-item">
          <h3>AI Builder</h3>
          <p>Claude-powered tools built directly into the platform.</p>
        </div>
      </div>

      <p className="division-outro">
        Built on React, Firebase, and Supabase — designed and maintained in-house by R&R.
      </p>
    </PageWrapper>
  )
}