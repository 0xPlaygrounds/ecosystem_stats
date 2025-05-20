async function initializeDashboard() {
  try {
    const res = await fetch('data/metrics/daily/github_metrics.json');
    const json = await res.json();
    const entries = json.entries || [];
    if (entries.length === 0) return;

    const latest = entries[entries.length - 1];
    const prev = entries.length > 1 ? entries[entries.length - 2] : latest;
    const first = entries[0];

    const stars = latest.stars || 0;
    const starsGrowth = stars - (prev.stars || 0);
    const daysSinceStart = Math.floor((new Date(latest.timestamp) - new Date(first.timestamp)) / 86400000);
    const starVelocity = daysSinceStart > 0 ? Math.round(stars / daysSinceStart) : 0;

    document.getElementById('currentStars').textContent = stars.toLocaleString();
    document.getElementById('starsGrowthRate').textContent = `+${starsGrowth} since last update`;
    document.getElementById('starVelocity').textContent = starVelocity;
    document.getElementById('velocityTrend').textContent = `${daysSinceStart} days since launch`;
  } catch (err) {
    console.error('Error loading metrics', err);
  }
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
