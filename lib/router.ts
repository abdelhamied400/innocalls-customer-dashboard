export function silentRedirect(url: string) {
  window.history.replaceState(
    { ...window.history.state, as: url, url: url },
    "",
    url
  );
}
