export function StatCard({ label, value }) {
  return (
    <div className="col-md-3">
      <div className="card text-center shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{label}</h5>
          <p className="card-text fs-3 fw-bold text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}