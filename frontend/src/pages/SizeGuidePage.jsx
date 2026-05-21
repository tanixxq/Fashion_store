import { sizeCharts } from "../data/sizeCharts";

export default function SizeGuidePage({ onBack }) {
  return (
    <div className="page-shell static-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Home
      </button>
      <div className="page-head">
        <span className="eyebrow">Fit guide</span>
        <h2>Size charts</h2>
        <p>Measure twice, order once.</p>
      </div>
      {Object.entries(sizeCharts).map(([key, chart]) => (
        <div key={key} className="page-card size-guide-block">
          <h3>{chart.title}</h3>
          <table className="pdp-size-table">
            <thead>
              <tr>
                {chart.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
