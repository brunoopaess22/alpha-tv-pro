(() => {
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activate(tab) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault(); activate(tabs[target]); tabs[target].focus();
    });
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  fetch('/api/versao', { signal: controller.signal }).then(response => {
    if (!response.ok) throw new Error('Version unavailable');
    return response.json();
  }).then(data => {
    if (!data || typeof data.versao !== 'string' || !/^\d+(\.\d+){1,3}$/.test(data.versao)) throw new Error('Invalid version');
    document.getElementById('release-label').textContent = `Versão ${data.versao} disponível`;
    const parts = ['Android 6.0+'];
    if (typeof data.tamanho === 'number' && Number.isFinite(data.tamanho) && data.tamanho > 0) parts.push(`${(data.tamanho / 1048576).toFixed(1).replace('.', ',')} MB`);
    const date = data.publicado ? new Date(data.publicado) : null;
    if (date && !Number.isNaN(date.getTime())) parts.push(`Atualizado em ${date.toLocaleDateString('pt-BR')}`);
    document.getElementById('download-meta').textContent = parts.join(' · ');
    if (typeof data.url === 'string') {
      try {
        const url = new URL(data.url);
        if (url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.startsWith('/brunoopaess22/alpha-tv-pro/releases/download/') && /\.apk$/i.test(url.pathname)) document.querySelectorAll('[data-download]').forEach(link => { link.href = url.href; });
      } catch { /* Keep the working /apk fallback. */ }
    }
  }).catch(() => {
    document.getElementById('download-meta').textContent = 'APK para Android 6.0+. Download disponível pelo botão.';
  }).finally(() => clearTimeout(timeout));
})();
