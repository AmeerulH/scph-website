type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object in the research source.");
  return value as RecordValue;
}
function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}
function key(value: unknown): string {
  const result = text(value, "Stable key");
  if (!/^[A-Za-z0-9_-]+$/.test(result)) throw new Error("Keys must use letters, numbers, underscores or hyphens.");
  return result;
}
function rows(value: unknown, label: string): RecordValue[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  const result = value.map(record);
  const keys = result.map((row) => key(row.key ?? row._key));
  if (new Set(keys).size !== keys.length) throw new Error(`${label} contains duplicate keys.`);
  return result;
}

export function prepareResearchSchedule(source: unknown, document: RecordValue) {
  const input = record(source);
  const sessions = rows(input.sessions, "Sessions");
  if (!sessions.length) throw new Error("Supply at least one approved research session.");
  const days = Array.isArray(document.days) ? document.days.map(record) : [];
  return sessions.map((incoming) => {
    const dayId = text(incoming.day, "Day");
    if (dayId !== "day2" && dayId !== "day3") throw new Error("Research imports support day2 and day3 only.");
    const matches = days.filter((day) => day.tabId === dayId);
    if (matches.length !== 1) throw new Error(`Expected one existing ${dayId} in the programme.`);
    const day = matches[0];
    const sessionKey = key(incoming.key);
    const existing = (Array.isArray(day.sessions) ? day.sessions.map(record) : []).find((session) => session._key === sessionKey);
    if (existing && existing.type !== "research") throw new Error(`Refusing to overwrite non-research session ${sessionKey}.`);
    const existingSlots = Array.isArray(existing?.workshops) ? existing.workshops.map(record) : [];
    const halls = rows(incoming.halls, "Halls");
    if (!halls.length) throw new Error("Supply at least one hall in each approved research session.");
    const workshops = halls.map((hall) => {
      const hallKey = key(hall.key);
      const oldSlot = existingSlots.find((slot) => slot._key === hallKey);
      const oldPresentations = Array.isArray(oldSlot?.presentations) ? oldSlot.presentations.map(record) : [];
      return {
        ...oldSlot, _key: hallKey, _type: "programmeWorkshop",
        number: text(hall.number, "Hall number"), title: text(hall.title, "Hall title"),
        ...(typeof hall.venueLine === "string" && hall.venueLine.trim() ? {venueLine: hall.venueLine.trim()} : {}),
        presentations: rows(hall.presentations, "Presentations").map((row) => {
          const rowKey = key(row.key);
          return {...oldPresentations.find((old) => old._key === rowKey), _key: rowKey, _type: "programmeResearchPresentation",
            presenterName: text(row.presenterName, "Presenter name"), presentationTitle: text(row.presentationTitle, "Presentation title")};
        }),
      };
    });
    return {
      dayId,
      path: `days[_key==${JSON.stringify(text(day._key, "Existing day key"))}].sessions`,
      existing: Boolean(existing),
      session: {
        ...existing, _key: sessionKey, _type: "programmeSession", type: "research",
        title: text(incoming.title, "Session title"), time: text(incoming.time, "Session time"),
        ...(typeof incoming.venueLine === "string" && incoming.venueLine.trim() ? {venueLine: incoming.venueLine.trim()} : {}),
        workshops,
      },
    };
  });
}
