import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { SurveyStats } from "../../lib/types";
import Button from "../../ui/Button";
import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SurveyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SurveyStats[]>("/api/v1/surveys/stats")
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSent = stats.reduce((sum, s) => sum + s.sent, 0);
  const totalCompleted = stats.reduce((sum, s) => sum + s.completed, 0);
  const totalPending = stats.reduce((sum, s) => sum + s.pending, 0);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Dashboard</h1>
        <a href="/admin/surveys/new">
          <Button variant="primary">Create Survey</Button>
        </a>
      </div>

      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-value">{stats.length}</div>
          <div className="admin-dashboard__stat-label">Total Surveys</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-value">{totalSent}</div>
          <div className="admin-dashboard__stat-label">Surveys Sent</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-value">{totalCompleted}</div>
          <div className="admin-dashboard__stat-label">Completed</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <div className="admin-dashboard__stat-value">{totalPending}</div>
          <div className="admin-dashboard__stat-label">Pending</div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : stats.length === 0 ? (
        <p className="admin-dashboard__empty">No surveys yet. Create your first survey to get started.</p>
      ) : (
        <table className="admin-dashboard__table">
          <thead>
            <tr>
              <th>Survey</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>
                  <span className={`admin-dashboard__status admin-dashboard__status--${s.status}`}>
                    {s.status}
                  </span>
                </td>
                <td>{s.sent}</td>
                <td>{s.completed}</td>
                <td>{s.pending}</td>
                <td>
                  <a href={`/admin/surveys/${s.id}`}>View</a>
                  {" | "}
                  <a href={`/admin/surveys/${s.id}/edit`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
