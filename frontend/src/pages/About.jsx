export default function About() {
  const modules = [
    'Farmer & FPO Registration', 'Produce Listing & Quality Grading', 'Collection Hub Network',
    'Low-cost Vehicle Fleet (E-rickshaw, Tractor, Tempo)', 'Terrain-adjusted Cost Calculator',
    'Government Subsidy Integration', 'Transport Booking & Scheduling', 'Real-time Shipment Tracking',
    'Mandi Market Price Dashboard', 'Crop Advisory & Pest Alerts', 'Weather-based Transport Warnings',
    'Transporter Job Management', 'Admin Analytics Dashboard', 'Interactive NE Region Map',
  ];

  const tech = ['React 18 + Vite', 'Tailwind CSS', 'React Router', 'Leaflet Maps', 'Recharts', 'Node.js + Express', 'SQLite (better-sqlite3)', 'JWT Authentication', 'REST API'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-forest-900">About This Project</h1>
      <p className="mt-4 text-lg text-gray-700 leading-relaxed">
        <strong>AgriRoute NE</strong> is an end-semester full-stack project addressing a critical problem in India's North Eastern Region:
        remote tribal and hill farmers grow high-value produce (ginger, pineapple, cardamom, sticky rice) but lack affordable
        first-mile transport to the nearest motorable road and mandi.
      </p>

      <section className="mt-10 card">
        <h2 className="font-display text-xl font-semibold">Problem Statement</h2>
        <p className="mt-3 text-gray-600">
          In Karbi Anglong, Imphal hills, Khasi villages, and Ziro plateau, farms are often 5–15 km from the nearest highway.
          High transport cost and perishability cause post-harvest losses up to 30%. This platform coordinates village collection hubs,
          local transporters, and government subsidies to reduce cost and connect farmers to markets.
        </p>
      </section>

      <section className="mt-8 card">
        <h2 className="font-display text-xl font-semibold">Modules Implemented (Start → End)</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {modules.map(m => <li key={m} className="flex items-center gap-2 text-sm"><span className="text-forest-600">✓</span>{m}</li>)}
        </ul>
      </section>

      <section className="mt-8 card">
        <h2 className="font-display text-xl font-semibold">Technology Stack</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map(t => <span key={t} className="rounded-lg bg-forest-100 px-3 py-1 text-sm font-medium text-forest-800">{t}</span>)}
        </div>
      </section>

      <section className="mt-8 card bg-forest-50">
        <h2 className="font-display text-xl font-semibold">Future Enhancements</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>GPS live tracking via mobile app</li>
          <li>Integration with e-NAM and ONDC</li>
          <li>IoT cold-chain sensors for perishables</li>
          <li>ML-based demand forecasting</li>
          <li>Multi-language (Assamese, Khasi, Mizo, Manipuri)</li>
        </ul>
      </section>
    </div>
  );
}
