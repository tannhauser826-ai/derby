const output = document.querySelector('#output');

const byId = (id) => document.querySelector(`#${id}`);

const base = () => byId('baseUrl').value.replace(/\/$/, '');

const write = (title, data) => {
  output.textContent = `${title}\n\n${JSON.stringify(data, null, 2)}`;
};

const request = async (path, query = {}) => {
  const url = new URL(`${base()}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url);
  const text = await res.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  return {
    ok: res.ok,
    status: res.status,
    url: url.toString(),
    body,
  };
};

const handlers = {
  dates: () => request('/dates'),
  recommendations: () =>
    request('/recommendations', {
      date: byId('recDate').value,
      mode: byId('recMode').value,
      limit: byId('recLimit').value,
    }),
  races: () => request('/races', { date: byId('racesDate').value }),
  raceDetail: () => request(`/races/${byId('raceId').value}`),
  participants: () => request(`/races/${byId('partRaceId').value}/participants`),
  stories: () =>
    request('/stories', {
      type: byId('storyType').value,
      query: byId('storyQuery').value,
      tags: byId('storyTags').value,
    }),
  seatGuide: () => request('/guides/seats', { mode: byId('seatMode').value }),
  events: () => request('/events', { date: byId('eventsDate').value }),
};

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const action = button.getAttribute('data-action');

    try {
      const result = await handlers[action]();
      write(`${action} (${result.status})`, result);
    } catch (error) {
      write(`${action} (error)`, {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
});
