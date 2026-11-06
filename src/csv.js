const columns = [
  ["Course", "course"],
  ["Topic", "topic"],
  ["Date", "date"],
  ["Minutes", "minutes"]
];

export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function sessionsToCsv(studySessions) {
  const header = columns.map(([label]) => csvCell(label)).join(",");
  const rows = studySessions.map((session) =>
    columns.map(([, key]) => csvCell(session[key])).join(",")
  );

  return [header, ...rows].join("\r\n");
}

export function downloadSessionsCsv(studySessions, documentRef = document, urlRef = URL) {
  const blob = new Blob([sessionsToCsv(studySessions)], { type: "text/csv;charset=utf-8" });
  const objectUrl = urlRef.createObjectURL(blob);
  const link = documentRef.createElement("a");

  link.href = objectUrl;
  link.download = "study-sessions.csv";
  link.click();
  urlRef.revokeObjectURL(objectUrl);
}

