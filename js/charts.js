/**
 * KM Insight — Chart Factory
 * Manages Chart.js instances with responsive options
 */

const ChartFactory = (function() {

  const instances = {};

  const PALETTE = {
    blue: ['#1A56DB','#2563EB','#3B82F6','#60A5FA','#93C5FD','#BFDBFE','#DBEAFE'],
    semantic: { green: '#16A34A', red: '#DC2626', amber: '#F59E0B', blue: '#1A56DB' }
  };

  const BASE_OPTIONS = {
    responsive: true,
    maintainAspectRatio: true,
    resizeDelay: 100,
    plugins: {
      legend: {
        labels: { font: { family: "'DM Sans',sans-serif", size: 11 }, color: '#4B5563', padding: 16, usePointStyle: true, pointStyleWidth: 8 }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { family: "'DM Sans',sans-serif", size: 12, weight: '600' },
        bodyFont: { family: "'DM Sans',sans-serif", size: 11.5 },
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        boxPadding: 4,
      }
    },
    scales: {
      x: { grid: { display: false, drawBorder: false }, ticks: { font: { size: 10, family: "'DM Sans',sans-serif" }, color: '#9CA3AF', maxRotation: 0 } },
      y: { grid: { color: '#F3F4F6', drawBorder: false }, ticks: { font: { size: 10, family: "'DM Sans',sans-serif" }, color: '#9CA3AF' }, border: { display: false } }
    },
    animation: { duration: 800, easing: 'easeOutQuart' }
  };

  function deepMerge(a, b) {
    const out = { ...a };
    for (const k in b) {
      if (typeof b[k] === 'object' && b[k] !== null && !Array.isArray(b[k])) {
        out[k] = deepMerge(a[k] || {}, b[k]);
      } else {
        out[k] = b[k];
      }
    }
    return out;
  }

  function create(id, type, data, extraOptions = {}) {
    destroy(id);
    const el = document.getElementById(id);
    if (!el) return null;
    const ctx = el.getContext('2d');
    const opts = deepMerge(BASE_OPTIONS, extraOptions);
    instances[id] = new Chart(ctx, { type, data, options: opts });
    return instances[id];
  }

  function destroy(id) {
    if (instances[id]) { instances[id].destroy(); delete instances[id]; }
  }

  function destroyByPrefix(prefix) {
    Object.keys(instances).forEach(k => { if (k.startsWith(prefix)) destroy(k); });
  }

  function exists(id) { return !!instances[id]; }

  // ── DONUT ────────────────────────────────────────
  function donut(id, labels, data, colors = PALETTE.blue.slice(0, labels.length)) {
    return create(id, 'doughnut', {
      labels,
      datasets: [{ data, backgroundColor: colors, borderColor: '#fff', borderWidth: 2.5, hoverOffset: 6 }]
    }, {
      aspectRatio: 1.6,
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 }, boxWidth: 10 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
            }
          }
        }
      },
      animation: { animateScale: true, animateRotate: true, duration: 1000 }
    });
  }

  // ── LINE (dual optional) ─────────────────────────
  function line(id, labels, datasets, extra = {}) {
    return create(id, 'line', { labels, datasets }, deepMerge({
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { display: datasets.length > 1, position: 'bottom', labels: { padding: 14 } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#F3F4F6' }, border: { display: false } }
      }
    }, extra));
  }

  // ── BAR (horizontal or vertical) ─────────────────
  function bar(id, labels, data, colors = PALETTE.blue[0], horizontal = false) {
    const opts = deepMerge({
      indexAxis: horizontal ? 'y' : 'x',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: horizontal ? '#F3F4F6' : 'transparent' }, border: { display: false } },
        y: { grid: { color: horizontal ? 'transparent' : '#F3F4F6' }, border: { display: false } }
      }
    }, horizontal ? {} : { scales: { x: { grid: { display: false } }, y: { grid: { color: '#F3F4F6' } } } });
    return create(id, 'bar', {
      labels,
      datasets: [{ data, backgroundColor: colors, borderRadius: 5, borderSkipped: false }]
    }, opts);
  }

  function barMultiColor(id, labels, data, colors, horizontal = false) {
    return bar(id, labels, data, colors, horizontal);
  }

  // ── STACKED BAR ──────────────────────────────────
  function stackedBar(id, labels, datasets, horizontal = false) {
    // Apply barThickness to all datasets
    datasets.forEach(ds => {
      ds.barThickness = horizontal ? 28 : 24;
      ds.maxBarThickness = horizontal ? 32 : 28;
    });
    return create(id, 'bar', { labels, datasets }, {
      indexAxis: horizontal ? 'y' : 'x',
      aspectRatio: horizontal ? 2.2 : 1.8,
      plugins: { legend: { position: 'bottom', labels: { padding: 14 } } },
      scales: {
        x: { stacked: true, grid: { display: !horizontal, color: '#F3F4F6' }, border: { display: false } },
        y: { stacked: true, grid: { display: horizontal, color: '#F3F4F6' }, border: { display: false } }
      },
      animation: { duration: 900 }
    });
  }

  // ── SCATTER ──────────────────────────────────────
  function scatter(id, points) {
    return create(id, 'scatter', {
      datasets: [{
        label: 'Contributors',
        data: points,
        backgroundColor: 'rgba(26,86,219,0.7)',
        borderColor: '#1A56DB',
        borderWidth: 1.5,
        pointRadius: 7,
        pointHoverRadius: 11,
        pointHoverBackgroundColor: '#1A56DB',
      }]
    }, {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const p = ctx.raw;
              return `Views: ${p.x.toLocaleString()}, Helpful: ${p.y}%`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Total Views', font: { family: "'DM Sans',sans-serif", size: 11, weight: '600' }, color: '#6B7280' },
          grid: { color: '#F3F4F6' }, border: { display: false },
          ticks: { callback: v => (v / 1000) + 'k', font: { size: 10 }, color: '#9CA3AF' }
        },
        y: {
          title: { display: true, text: 'Avg Helpful %', font: { family: "'DM Sans',sans-serif", size: 11, weight: '600' }, color: '#6B7280' },
          grid: { color: '#F3F4F6' }, border: { display: false }, min: 70, max: 100,
          ticks: { callback: v => v + '%', font: { size: 10 }, color: '#9CA3AF' }
        }
      }
    });
  }

  // ── PUBLIC ───────────────────────────────────────
  return {
    create, destroy, destroyByPrefix, exists,
    donut, line, bar, barMultiColor, stackedBar, scatter,
    PALETTE, instances,
  };
})();
