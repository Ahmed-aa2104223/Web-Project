import React from 'react';

export default function StatCard({ title, content }) {
  return (
    <div className="stat-card">
      <h2 className="stat-card-title">{title}</h2>
      <p className="stat-card-content">{content}</p>
    </div>
  );
}