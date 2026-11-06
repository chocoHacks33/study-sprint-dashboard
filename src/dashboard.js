const dateFormatter = new Intl.DateTimeFormat("en-SG", {
  day: "numeric",
  month: "short",
  timeZone: "UTC"
});

const dayFormatter = new Intl.DateTimeFormat("en-SG", {
  weekday: "short",
  timeZone: "UTC"
});

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder}m`;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

export function summarizeSessions(studySessions) {
  const totalMinutes = studySessions.reduce((sum, session) => sum + session.minutes, 0);
  const courses = new Set(studySessions.map((session) => session.course));
  const averageMinutes = studySessions.length === 0 ? 0 : Math.round(totalMinutes / studySessions.length);

  return {
    totalMinutes,
    courseCount: courses.size,
    averageMinutes
  };
}

export function minutesByDay(studySessions) {
  const totals = new Map();

  for (const session of studySessions) {
    totals.set(session.date, (totals.get(session.date) ?? 0) + session.minutes);
  }

  return [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, minutes]) => ({ date, minutes }));
}

export function calculateStudyStreak(studySessions) {
  const studyDates = new Set(
    studySessions
      .map((session) => session.date)
      .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
  );

  if (studyDates.size === 0) return 0;

  const latestDate = [...studyDates].sort().at(-1);
  const cursor = new Date(`${latestDate}T00:00:00Z`);
  let streak = 0;

  while (studyDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

function renderMetrics(studySessions) {
  const summary = summarizeSessions(studySessions);
  const metrics = [
    ["Focused time", formatDuration(summary.totalMinutes)],
    ["Active courses", String(summary.courseCount)],
    ["Average session", formatDuration(summary.averageMinutes)],
    ["Latest streak", `${calculateStudyStreak(studySessions)} days`]
  ];

  return metrics
    .map(
      ([label, value]) => `
        <article class="metric-card">
          <span class="metric-label">${label}</span>
          <strong class="metric-value">${value}</strong>
        </article>`
    )
    .join("");
}

function renderChart(studySessions) {
  const dailyTotals = minutesByDay(studySessions).slice(-7);
  const maximum = Math.max(...dailyTotals.map((day) => day.minutes), 1);

  return dailyTotals
    .map(({ date, minutes }) => {
      const height = Math.max(4, Math.round((minutes / maximum) * 100));
      const parsedDate = new Date(`${date}T00:00:00Z`);
      return `
        <div class="chart-day">
          <span class="chart-value">${minutes}m</span>
          <div class="chart-track" aria-label="${dayFormatter.format(parsedDate)}: ${minutes} minutes">
            <span class="chart-bar" style="height: ${height}%"></span>
          </div>
          <span class="chart-label">${dayFormatter.format(parsedDate)}</span>
        </div>`;
    })
    .join("");
}

function renderRows(studySessions) {
  return [...studySessions]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map(
      (session) => `
        <tr>
          <td><span class="course-pill">${escapeHtml(session.course)}</span></td>
          <td>${escapeHtml(session.topic)}</td>
          <td>${dateFormatter.format(new Date(`${session.date}T00:00:00Z`))}</td>
          <td>${formatDuration(session.minutes)}</td>
        </tr>`
    )
    .join("");
}

export function renderDashboard(studySessions, root = document) {
  root.querySelector("#metric-grid").innerHTML = renderMetrics(studySessions);
  root.querySelector("#study-chart").innerHTML = renderChart(studySessions);
  root.querySelector("#session-rows").innerHTML = renderRows(studySessions);
  root.querySelector("#session-count").textContent = `${studySessions.length} sessions`;

  const dates = minutesByDay(studySessions);
  if (dates.length > 0) {
    const first = new Date(`${dates[0].date}T00:00:00Z`);
    const last = new Date(`${dates.at(-1).date}T00:00:00Z`);
    root.querySelector("#week-label").textContent = `${dateFormatter.format(first)}–${dateFormatter.format(last)}`;
  }
}

