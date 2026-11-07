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

export function durationBreakdown(studySessions) {
  return studySessions.reduce(
    (breakdown, session) => {
      if (session.minutes < 45) breakdown.quick += 1;
      else if (session.minutes < 70) breakdown.focused += 1;
      else breakdown.deep += 1;
      breakdown.total += 1;
      return breakdown;
    },
    { quick: 0, focused: 0, deep: 0, total: 0 }
  );
}

function renderMetrics(studySessions) {
  const summary = summarizeSessions(studySessions);
  const metrics = [
    ["Focused time", formatDuration(summary.totalMinutes)],
    ["Active courses", String(summary.courseCount)],
    ["Average session", formatDuration(summary.averageMinutes)]
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

function renderDurationBreakdown(studySessions) {
  const breakdown = durationBreakdown(studySessions);
  const maximum = Math.max(breakdown.total, 1);
  const bands = [
    ["Quick review", "Under 45 minutes", breakdown.quick],
    ["Focused block", "45–69 minutes", breakdown.focused],
    ["Deep session", "70+ minutes", breakdown.deep]
  ];

  return bands
    .map(([label, range, count]) => {
      const width = Math.round((count / maximum) * 100);
      const sessionLabel = count === 1 ? "session" : "sessions";
      return `
        <div class="duration-band">
          <div class="duration-heading">
            <span><strong>${label}</strong><small>${range}</small></span>
            <span>${count} ${sessionLabel}</span>
          </div>
          <div class="duration-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="${breakdown.total}" aria-valuenow="${count}">
            <span class="duration-fill" style="width: ${width}%"></span>
          </div>
        </div>`;
    })
    .join("");
}

export function renderDashboard(studySessions, root = document) {
  root.querySelector("#metric-grid").innerHTML = renderMetrics(studySessions);
  root.querySelector("#study-chart").innerHTML = renderChart(studySessions);
  root.querySelector("#session-rows").innerHTML = renderRows(studySessions);
  root.querySelector("#session-count").textContent = `${studySessions.length} sessions`;
  root.querySelector("#duration-breakdown").innerHTML = renderDurationBreakdown(studySessions);

  const dates = minutesByDay(studySessions);
  if (dates.length > 0) {
    const first = new Date(`${dates[0].date}T00:00:00Z`);
    const last = new Date(`${dates.at(-1).date}T00:00:00Z`);
    root.querySelector("#week-label").textContent = `${dateFormatter.format(first)}–${dateFormatter.format(last)}`;
  }
}

