const DEMO_FLAG_KEY = 'seedhahissab-demo-mode';

export function setDemoMode(on: boolean): void {
  if (on) {
    localStorage.setItem(DEMO_FLAG_KEY, '1');
  } else {
    localStorage.removeItem(DEMO_FLAG_KEY);
  }
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_FLAG_KEY) === '1';
}
