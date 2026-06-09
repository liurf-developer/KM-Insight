/**
 * KM Insight — Application Logic
 * SPA routing, filter management, page rendering, toast notifications
 */

(function() {

  // ── State ─────────────────────────────────────────
  const state = {
    currentPage: 'executive',
    filters: { timeRange: '30d', location: 'All', product: 'All', topic: 'All', service: 'All' },
    defaultFilters: { timeRange: '30d', location: 'All', product: 'All', topic: 'All', service: 'All' },
  };

  const PAGE_LIST = ['executive','lifecycle','contributors','governance','taxonomy','portal','search','channel','badcase','article','reports'];

  // ── Toast ─────────────────────────────────────────
  function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer') || (() => {
      const el = document.createElement('div');
      el.id = 'toastContainer'; el.className = 'toast-container';
      document.body.appendChild(el); return el;
    })();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '!' : 'ℹ';
    toast.innerHTML = `<span style="font-size:16px;font-weight:700;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, duration);
  }

  // ── Helpers ───────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  function fmtNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return n.toLocaleString();
    return String(n);
  }

  function fmtDelta(n) {
    if (n > 0) return { cls: 'up', txt: `↑ ${n}%`, good: true };
    if (n < 0) return { cls: 'down', txt: `↓ ${Math.abs(n)}%`, good: false };
    return { cls: '', txt: '→ 0%', good: true };
  }

  // ── KPI Card Builder ──────────────────────────────
  function buildKPICard(label, value, delta, unit = '', extraCls = '') {
    const d = typeof delta === 'object' ? delta : fmtDelta(delta);
    return `<div class="kpi-card ${extraCls}"><div class="kpi-accent"></div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}${unit ? `<small>${unit}</small>` : ''}</div>
      ${d.txt ? `<div class="kpi-delta ${d.cls}">${d.txt} <span style="color:#6B7280;font-weight:400;">vs prev.</span></div>` : ''}
    </div>`;
  }

  // ── Table Renderer ────────────────────────────────
  function renderTable(elId, headers, rows, cellFns = {}) {
    const el = $(elId); if (!el) return;
    const th = headers.map((h, i) => `<th data-col="${i}">${h} <span class="sort-arrow">↕</span></th>`).join('');
    const tr = rows.map((r, ri) => `<tr style="animation-delay:${ri * 0.03}s">${
      r.map((cell, ci) => {
        const fn = cellFns[ci];
        const v = fn ? fn(cell) : cell;
        return `<td>${v}</td>`;
      }).join('')
    }</tr>`).join('');
    el.innerHTML = `<thead><tr>${th}</tr></thead><tbody>${tr}</tbody>`;
  }

  function renderAlertList(elId, alerts) {
    const el = $(elId); if (!el) return;
    el.innerHTML = alerts.map(a => `<div class="alert-item ${a.type}">
      <span class="alert-icon">${a.icon}</span>
      <div><span class="alert-count">${a.count}</span> ${a.text}<br><div class="alert-desc">${a.desc}</div></div>
    </div>`).join('');
  }

  // ── Navigation ────────────────────────────────────
  function navigateTo(page) {
    if (!PAGE_LIST.includes(page)) return;
    state.currentPage = page;
    document.querySelectorAll('.sidebar-item').forEach(i => {
      i.classList.toggle('active', i.dataset.page === page);
    });
    document.querySelectorAll('.page-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'page-' + page);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderCurrentPage();
    showToast(`Loaded: ${pageTitle(page)}`, 'info', 1500);
  }

  function pageTitle(p) {
    const map = { executive: 'Executive Overview', lifecycle: 'Content Lifecycle', contributors: 'Contributor Center',
      governance: 'Governance Health', taxonomy: 'Taxonomy Explorer', portal: 'Portal Usage',
      search: 'Search Analytics', channel: 'Channel Consumption', badcase: 'Bad Case & Tasks',
      article: 'Article Deep Dive', reports: 'Reports & Export' };
    return map[p] || p;
  }

  // ── Filter Management ─────────────────────────────
  function initFilters() {
    const selects = document.querySelectorAll('.filter-select');
    selects.forEach(sel => {
      sel.addEventListener('change', () => {
        const key = sel.dataset.filter;
        state.filters[key] = sel.value;
        sel.classList.toggle('has-value', sel.value !== 'All' && !sel.value.includes('Last'));
        updateFilterReset();
        showToast(`Filter updated: ${key} = ${sel.value}`, 'info', 1200);
        renderCurrentPage();
      });
    });

    $('filterReset')?.addEventListener('click', () => {
      Object.assign(state.filters, state.defaultFilters);
      document.querySelectorAll('.filter-select').forEach(sel => {
        sel.value = state.filters[sel.dataset.filter];
        sel.classList.remove('has-value');
      });
      updateFilterReset();
      showToast('Filters reset to defaults', 'info', 1200);
      renderCurrentPage();
    });

    updateFilterReset();
  }

  function updateFilterReset() {
    const btn = $('filterReset');
    const anyFilter = Object.entries(state.filters).some(([k, v]) => v !== 'All' && !v.includes('Last'));
    btn.disabled = !anyFilter;
    btn.style.opacity = anyFilter ? '1' : '0.4';
    document.querySelector('.filter-bar')?.classList.toggle('has-filter', anyFilter);
  }

  // ── Page Renderers ────────────────────────────────
  function renderCurrentPage() {
    const f = state.filters;
    const prefix = state.currentPage;
    ChartFactory.destroyByPrefix(prefix);
    switch (prefix) {
      case 'executive': renderExecutive(f); break;
      case 'lifecycle': renderLifecycle(f); break;
      case 'contributors': renderContributors(f); break;
      case 'governance': renderGovernance(f); break;
      case 'taxonomy': renderTaxonomy(f); break;
      case 'portal': renderPortal(f); break;
      case 'search': renderSearch(f); break;
      case 'channel': renderChannel(f); break;
      case 'badcase': renderBadcase(f); break;
      case 'article': renderArticle(f); break;
      case 'reports': renderReports(f); break;
    }
  }

  // ── EXECUTIVE ─────────────────────────────────────
  function renderExecutive(f) {
    const k = DataModel.getKPIs(f);
    const kpiRow = $('execKPIs');
    if (kpiRow) {
      kpiRow.innerHTML =
        buildKPICard('Total Views', fmtNum(k.totalViews), 5.2) +
        buildKPICard('Helpful %', k.helpfulPct.toFixed(1), -0.5, '%') +
        buildKPICard('Activity Rate', k.activityRate.toFixed(1), 2.1, '%') +
        buildKPICard('SLA Compliance', k.slaCompliance.toFixed(1), -1.3, '%', 'success');
    }

    const topic = DataModel.getTopicDistribution(f);
    ChartFactory.donut('execTopicDonut', topic.labels, topic.values, ChartFactory.PALETTE.blue.slice(0, topic.labels.length));

    const trend = DataModel.getDailyTrend(f, 30);
    ChartFactory.line('execViewTrend', trend.map(d=>d.date), [
      { label: 'Total Views', data: trend.map(d=>d.views), borderColor: '#1A56DB', backgroundColor: 'rgba(26,86,219,0.05)', fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2 },
      { label: 'Unique Visitors', data: trend.map(d=>d.visitors), borderColor: '#93C5FD', borderDash: [5,3], tension: 0.35, pointRadius: 0, borderWidth: 2 }
    ]);

    const contrib = DataModel.getContributors(f).slice(0, 6);
    renderTable('execContribTable',
      ['Rank','Contributor','Geo','Articles','Views','Helpful%','Rating'],
      contrib.map((c, i) => [i<3?['🥇','🥈','🥉'][i]:i+1, c.name, c.geo, c.articles, c.views.toLocaleString(), c.helpful.toFixed(1)+'%', c.rating]),
      { 6: v => `<span class="tag-pill ${v==='Exceeds'?'green':'blue'}">${v}</span>` }
    );

    renderAlertList('execAlerts', DataModel.getAlerts(f));
  }

  // ── LIFECYCLE ─────────────────────────────────────
  function renderLifecycle(f) {
    const k = DataModel.getKPIs(f);
    const kpiRow = $('lcKPIs');
    if (kpiRow) {
      kpiRow.innerHTML =
        buildKPICard('Total Articles', fmtNum(k.totalArticles), 0) +
        buildKPICard('Drafts', fmtNum(k.drafts), 8, '', 'warn') +
        buildKPICard('In Review', fmtNum(k.inReview), 0) +
        buildKPICard('Published', fmtNum(k.published), 0, '', 'success') +
        buildKPICard('Archived', fmtNum(k.archived), 0);
    }

    const monthly = DataModel.getMonthlyData(f, 12);
    ChartFactory.stackedBar('lcStackedBar', monthly.labels, [
      { label: 'Published', data: monthly.published, backgroundColor: '#60A5FA' },
      { label: 'Draft', data: monthly.draft, backgroundColor: '#F59E0B' },
      { label: 'In Review', data: monthly.review, backgroundColor: '#93C5FD' },
      { label: 'Archived', data: monthly.archived, backgroundColor: '#D1D5DB' },
    ]);

    const draftAges = ['< 7 days','7–30 days','30–60 days','60–90 days','> 90 days'];
    const draftCounts = [
      Math.round(k.drafts * 0.29),
      Math.round(k.drafts * 0.29),
      Math.round(k.drafts * 0.20),
      Math.round(k.drafts * 0.09),
      Math.round(k.drafts * 0.13),
    ];
    ChartFactory.barMultiColor('lcDraftAging', draftAges, draftCounts, ['#60A5FA','#60A5FA','#60A5FA','#F59E0B','#EF4444'], true);

    ChartFactory.barMultiColor('lcApprovalTimeline', ['Draft → Review','Review → Approved','Approved → Published','Total Cycle'],
      [4.5, 1.2, 0.8, 6.5],
      ['#EF4444','#60A5FA','#60A5FA','#1A56DB'], true);

    const exp = DataModel.getExpiringArticles(f);
    renderTable('lcExpiringTable',
      ['Article Title','Status','Expires','Owner','Action'],
      exp.map(e => [e.title, e.status, e.expires, e.owner, e.action]),
      {
        1: v => `<span class="tag-pill ${v==='Active'?'green':'amber'}">${v}</span>`,
        4: v => `<button class="btn ${v==='Archive'?'btn-danger':'btn-outline'} btn-sm">${v}</button>`
      }
    );
  }

  // ── CONTRIBUTORS ──────────────────────────────────
  function renderContributors(f) {
    const k = DataModel.getKPIs(f);
    const row = $('contribKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Active Contributors', fmtNum(k.activeContributors), 12) +
        buildKPICard('New Articles This Month', fmtNum(k.newArticlesMonth), 8) +
        buildKPICard('Avg Review Cycle', k.avgReviewCycle.toFixed(1), -0.8, 'd') +
        buildKPICard('Pending Reviews', fmtNum(k.pendingReviews), 5, '', 'warn');
    }

    const contrib = DataModel.getContributors(f);
    renderTable('contribLeaderboard',
      ['#','Contributor','Geo','Articles','Views','Helpful%','Rating'],
      contrib.map((c, i) => [i+1, c.name, c.geo, c.articles, c.views.toLocaleString(), c.helpful.toFixed(1)+'%', c.rating]),
      { 6: v => `<span class="tag-pill ${v==='Exceeds'?'green':v==='Meets'?'blue':'amber'}">${v}</span>` }
    );

    const activity = DataModel.getRecentActivity(f);
    $('contribActivity').innerHTML = activity.map(a => `<div class="alert-item info" style="padding:8px 12px;border-left-width:2px;">
      <span style="font-family:var(--font-mono);font-size:11px;color:var(--gray-400);flex-shrink:0;">${a.time}</span>
      <div><strong>${a.user}</strong> ${a.action}<br><span class="alert-desc">${a.subject}</span></div>
    </div>`).join('');

    const points = contrib.map(c => ({ x: c.views, y: c.helpful, r: Math.sqrt(c.articles) * 2.5 }));
    ChartFactory.scatter('contribScatter', points);
  }

  // ── GOVERNANCE ────────────────────────────────────
  function renderGovernance(f) {
    const k = DataModel.getKPIs(f);
    const row = $('govKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Broken Links', k.brokenLinks, 0, '', 'danger') +
        buildKPICard('Expiring Articles', k.expiring, 0, '', 'warn') +
        buildKPICard('Orphaned Articles', k.orphaned, 0, '', 'warn') +
        buildKPICard('Metadata Issues', k.metadataIssues, 0);
    }

    ChartFactory.line('govBrokenTrend', ['Jan','Feb','Mar','Apr','May','Jun'],
      [{ label: 'Broken Links', data: DataModel.getBrokenLinkTrend(f), borderColor: '#DC2626', backgroundColor: 'rgba(220,38,38,0.05)', fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2 }],
      { plugins: { legend: { display: false } } });

    const orphaned = DataModel.getOrphanedByTopic(f);
    ChartFactory.barMultiColor('govOrphanedBar', orphaned.labels, orphaned.values,
      ['#F59E0B','#F59E0B','#F59E0B','#FBBF24','#FCD34D'], true);

    const tags = DataModel.getUnusedTags(f);
    $('govUnusedTags').innerHTML = tags.map(t => `<div style="padding:12px 16px;background:${t.uses===0?'#FEF2F2':'#FFFBEB'};border-radius:8px;border:1.5px solid ${t.uses===0?'#FECACA':'#FDE68A'};text-align:center;min-width:110px;transition:transform 0.15s;">
      <div style="font-weight:600;font-size:14px;color:var(--gray-800);">${t.name}</div>
      <div style="font-size:11px;color:var(--gray-500);margin:5px 0;font-family:var(--font-mono);">${t.uses} uses · 180d</div>
      <button class="btn ${t.uses===0?'btn-danger':'btn-outline'} btn-sm" style="margin-top:2px;">${t.uses===0?'Archive':'Review'}</button>
    </div>`).join('');
  }

  // ── TAXONOMY ──────────────────────────────────────
  function renderTaxonomy(f) {
    // Tree is static enough
    const m = DataModel.getMultiplier(f);
    const tree = $('taxTree');
    if (tree) {
      const isgArticles = Math.round(3240 * m);
      const idgArticles = Math.round(4800 * m);
      const mbgArticles = Math.round(2100 * m);
      tree.innerHTML = `
        <div style="margin-bottom:14px;"><strong style="color:var(--blue-700);font-size:14px;">▼ Product</strong></div>
        <div style="margin-left:16px;margin-bottom:6px;"><span style="color:var(--blue-600);cursor:pointer;font-weight:500;">▼ ISG</span> <span style="color:var(--gray-400);font-size:11px;">(${fmtNum(isgArticles)})</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ ThinkSystem <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(isgArticles*0.57))}</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ ThinkEdge <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(isgArticles*0.17))}</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ Storage <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(isgArticles*0.26))}</span></div>
        <div style="margin-left:16px;margin:8px 0 6px;"><span style="color:var(--blue-600);cursor:pointer;font-weight:500;">▼ IDG</span> <span style="color:var(--gray-400);font-size:11px;">(${fmtNum(idgArticles)})</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ ThinkPad <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(idgArticles*0.44))}</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ ThinkVision <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(idgArticles*0.25))}</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ Yoga <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(idgArticles*0.14))}</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">├─ ideapad <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(idgArticles*0.11))}</span></div>
        <div style="margin-left:36px;color:var(--gray-600);">└─ Legion <span style="color:var(--gray-400);font-size:11px;">${fmtNum(Math.round(idgArticles*0.06))}</span></div>
        <div style="margin-left:16px;margin-top:8px;"><span style="color:var(--blue-600);cursor:pointer;font-weight:500;">▼ MBG</span> <span style="color:var(--gray-400);font-size:11px;">(${fmtNum(mbgArticles)})</span></div>
      `;
    }

    const prodRank = DataModel.getProductRanking(f).slice(0, 10);
    ChartFactory.barMultiColor('taxTreemap', prodRank.map(p=>p.name), prodRank.map(p=>p.views),
      ChartFactory.PALETTE.blue.slice(0, 10), true);

    $('taxLowCoverage').innerHTML = [
      { t: 'ThinkEdge SE350', d: `${Math.round(15*m)} articles — new product, low coverage yet high search demand`, a: 'Create Content' },
      { t: 'Legion Go S', d: `${Math.round(8*m)} articles — high search volume, minimal knowledge base`, a: 'Create Content' },
      { t: 'Yoga 9i Gen12', d: `${Math.round(12*m)} articles — recently launched, many uncovered topics`, a: 'Expand Coverage' },
    ].map(i => `<div class="alert-item warning"><span class="alert-icon">⚠️</span><div><strong>${i.t}</strong><br><span class="alert-desc">${i.d}</span></div><button class="btn btn-outline btn-sm" style="margin-left:auto;">${i.a}</button></div>`).join('');

    $('taxGaps').innerHTML = [
      { t: 'Linux Drivers', d: `0 articles · ${Math.round(850*m)} searches/month · strong demand signal`, a: '+ Draft' },
      { t: 'BIOS Update (ISG)', d: `3 articles · gap in server product line`, a: '+ Draft' },
      { t: 'Chromebook Recovery', d: `0 articles · ${Math.round(195*m)} searches/month · growing trend`, a: '+ Draft' },
      { t: 'Firmware Downgrade', d: `1 article · ${Math.round(420*m)} searches/month · under-served`, a: '+ Draft' },
    ].map(i => `<div class="alert-item critical"><span class="alert-icon">🔴</span><div><strong>${i.t}</strong><br><span class="alert-desc">${i.d}</span></div><button class="btn btn-primary btn-sm" style="margin-left:auto;">${i.a}</button></div>`).join('');
  }

  // ── PORTAL ────────────────────────────────────────
  function renderPortal(f) {
    const k = DataModel.getKPIs(f);
    const row = $('portalKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Total Views', fmtNum(k.totalViews), 5.2) +
        buildKPICard('Unique Visitors', fmtNum(k.uniqueVisitors), 3.1) +
        buildKPICard('Avg Time on Page', `${Math.floor(k.avgTimeOnPage/60)}m ${k.avgTimeOnPage%60}s`, 12, '', '', k.avgTimeOnPage > 140 ? 'success' : '') +
        buildKPICard('Bounce Rate', k.bounceRate.toFixed(1), -2.1, '%', k.bounceRate < 40 ? 'success' : '') +
        buildKPICard('Pages / Session', k.pagesPerSession.toFixed(1), 0.3);
    }

    const trend = DataModel.getDailyTrend(f, 30);
    ChartFactory.line('portalDailyView', trend.map(d=>d.date), [
      { label: 'Total Views', data: trend.map(d=>d.views), borderColor: '#1A56DB', backgroundColor: 'rgba(26,86,219,0.05)', fill: true, tension: 0.35, pointRadius: 0, borderWidth: 2 },
      { label: 'Unique Visitors', data: trend.map(d=>d.visitors), borderColor: '#93C5FD', borderDash: [5,3], tension: 0.35, pointRadius: 0, borderWidth: 2 }
    ]);

    const prods = DataModel.getProductRanking(f);
    ChartFactory.barMultiColor('portalProductBar', prods.map(p=>p.name), prods.map(p=>p.views),
      ChartFactory.PALETTE.blue.slice(0, prods.length), true);

    const regions = DataModel.getRegionData(f);
    ChartFactory.barMultiColor('portalRegionBar', regions.map(r=>r.name), regions.map(r=>r.views),
      ['#1A56DB','#3B82F6','#60A5FA','#93C5FD']);

    ChartFactory.donut('portalDeviceDonut', ['Desktop','Mobile','Tablet'], [58, 35, 7],
      ['#1A56DB','#60A5FA','#BFDBFE']);
  }

  // ── SEARCH ────────────────────────────────────────
  function renderSearch(f) {
    const k = DataModel.getKPIs(f);
    const row = $('searchKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Total Searches', fmtNum(k.totalSearches), 12) +
        buildKPICard('Search CTR', k.searchCTR.toFixed(1), 2.1, '%') +
        buildKPICard('Zero-Result Rate', k.zeroResultRate.toFixed(1), -0.8, '%', k.zeroResultRate < 5 ? 'success' : 'warn') +
        buildKPICard('AI Resolution Rate', k.aiResolutionRate.toFixed(1), 3.5, '%');
    }

    const funnel = DataModel.getSearchFunnel(f);
    const fData = [funnel.searches, funnel.shown, funnel.clicked, funnel.helpful, funnel.resolved];
    const fLabels = ['Total Searches','Results Shown','Clicked (Top 4)','Marked Helpful','Resolved'];
    ChartFactory.barMultiColor('searchFunnel', fLabels, fData,
      ['#1A56DB','#3B82F6','#60A5FA','#93C5FD','#BFDBFE'], true);

    const terms = DataModel.getTopSearchTerms(f);
    ChartFactory.barMultiColor('searchTopTerms', terms.map(t=>t.term), terms.map(t=>t.volume),
      ChartFactory.PALETTE.blue.slice(0, terms.length), true);

    const zeros = DataModel.getZeroResultTerms(f);
    renderTable('searchZeroResult',
      ['Search Term','Volume','Trend','Component','Action'],
      zeros.map(z => [z.term, z.volume.toLocaleString(), z.trend, z.component, '+ Create Draft']),
      { 4: v => `<button class="btn btn-outline btn-sm">${v}</button>` }
    );
  }

  // ── CHANNEL ───────────────────────────────────────
  function renderChannel(f) {
    const k = DataModel.getKPIs(f);
    const row = $('channelKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Total Calls', fmtNum(k.totalChannelCalls), 8.2) +
        buildKPICard('Super Agent', fmtNum(k.superAgentCalls), 12) +
        buildKPICard('PD Guide', fmtNum(k.pdGuideCalls), 5) +
        buildKPICard('NBA', fmtNum(k.nbaCalls), 9) +
        buildKPICard('LENA', fmtNum(k.lenaCalls), 7);
    }

    const dist = DataModel.getChannelDistribution(f);
    ChartFactory.donut('chanDonut', dist.labels, dist.values, ChartFactory.PALETTE.blue.slice(0, dist.labels.length));

    const trend = DataModel.getChannelTrend(f);
    ChartFactory.line('chanTrend', trend.labels, [
      { label: 'Super Agent', data: trend.superAgent, borderColor: '#1A56DB', tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'PD Guide', data: trend.pdGuide, borderColor: '#3B82F6', tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'NBA', data: trend.nba, borderColor: '#60A5FA', tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'LENA', data: trend.lena, borderColor: '#93C5FD', tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'Resolve', data: trend.resolve, borderColor: '#BFDBFE', tension: 0.3, pointRadius: 3, borderWidth: 2 },
    ]);

    const types = DataModel.getChannelContentType(f);
    const channels = ['Super Agent','PD Guide','NBA','LENA','Resolve App'];
    const typeNames = ['PD / Troubleshooting','How-To Guide','Hot Tips / Known Issue','SOP','Product Knowledge'];
    const colors = ['#1A56DB','#3B82F6','#60A5FA','#93C5FD','#BFDBFE'];
    ChartFactory.stackedBar('chanStackedBar', channels,
      typeNames.map((t, ti) => ({
        label: t,
        data: types.map(row => row[ti]),
        backgroundColor: colors[ti],
      })), true);
  }

  // ── BAD CASE ──────────────────────────────────────
  function renderBadcase(f) {
    const k = DataModel.getKPIs(f);
    const row = $('bcKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Open Tasks', fmtNum(k.openTasks), -8) +
        buildKPICard('Overdue Tasks', fmtNum(k.overdueTasks), -3, '', 'danger') +
        buildKPICard('Avg Resolution', k.avgResolutionDays.toFixed(1), 0.5, 'd') +
        buildKPICard('Closed This Mo.', fmtNum(k.closedThisMonth), 15, '', 'success') +
        buildKPICard('Reopen Rate', k.reopenRate.toFixed(1), -0.8, '%');
    }

    ChartFactory.donut('bcTaskTypeDonut', ['Content Fix','New Content','Archive','Enrich','Other'], [35,25,18,12,10]);

    ChartFactory.barMultiColor('bcSourceBar',
      ['Portal Feedback','Zero-Result','Channel Feedback','Low CTR','SLA Breach'],
      [42,28,18,12,8],
      ChartFactory.PALETTE.blue.slice(0, 5), true);

    const tasks = DataModel.getBadCaseTasks(f);
    renderTable('bcTaskTable',
      ['ID','Source','Issue Type','Article','Priority','Owner','Status','Action'],
      tasks.map(t => [t.id, t.source, t.type, t.article, t.priority, t.owner, t.status, 'View']),
      {
        4: v => `<span class="tag-pill ${v==='P1'?'red':v==='P2'?'amber':'blue'}">${v}</span>`,
        6: v => `<span class="tag-pill ${v==='Closed'?'green':v==='Blocked'?'amber':'blue'}">${v}</span>`,
        7: v => `<button class="btn btn-outline btn-sm">${v}</button>`
      }
    );

    const status = DataModel.getTaskStatusBreakdown(f);
    ChartFactory.barMultiColor('bcStatusBar',
      ['Open','In Progress','In Review','Blocked','Closed'], status,
      ['#1A56DB','#3B82F6','#60A5FA','#F59E0B','#16A34A'], true);
  }

  // ── ARTICLE ───────────────────────────────────────
  function renderArticle(f) {
    // Article KPIs are mostly static
    const row = $('articleKPIs');
    if (row) {
      row.innerHTML =
        buildKPICard('Total Views', '1,200', 0, '', '', '') +
        buildKPICard('Helpful %', '88.5', 0, '%', '', '') +
        buildKPICard('Avg Time', '1m 45s', 0, '', '', '') +
        buildKPICard('Bounce Rate', '42', 0, '%', '', '') +
        buildKPICard('Activity Rate', '55', 0, '%', '', '') +
        buildKPICard('Load Time', '3.2', 0, 's', 'danger', '');
    }

    ChartFactory.barMultiColor('adScrollDepth',
      ['25% (Above fold)','50% (Troubleshooting)','75% (Video)','100% (Bottom)'],
      DataModel.getScrollDepth(),
      ['#60A5FA','#3B82F6','#F59E0B','#EF4444']);

    ChartFactory.line('adDailyViews',
      Array.from({length:20},(_,i)=>`May ${20+i}`),
      [{ label: 'Views', data: DataModel.getArticleDailyViews(), borderColor: '#1A56DB', backgroundColor: 'rgba(26,86,219,0.05)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 }],
      { plugins: { legend: { display: false } } });

    const cross = DataModel.getCrosslinks();
    ChartFactory.barMultiColor('adCrosslinkBar',
      cross.map(c=>c.name), cross.map(c=>c.rate),
      ChartFactory.PALETTE.blue.slice(0, cross.length), true);
  }

  // ── REPORTS ───────────────────────────────────────
  function renderReports(f) {
    const reports = DataModel.getScheduledReports();
    renderTable('reportsScheduled',
      ['Report Name','Frequency','Format','Recipients','Status','Action'],
      reports.map(r => [r.name, r.frequency, r.format, r.recipients + ' people', r.status, 'Edit']),
      {
        4: v => `<span class="tag-pill ${v==='Active'?'green':'amber'}">${v}</span>`,
        5: v => `<button class="btn btn-ghost btn-sm">${v}</button> <button class="btn btn-ghost btn-sm">Run Now</button>`
      }
    );
  }

  // ── INIT ──────────────────────────────────────────
  function init() {
    // Loading animation
    setTimeout(() => {
      document.getElementById('loadingOverlay')?.classList.add('hidden');
    }, 600);

    // Sidebar nav
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => navigateTo(item.dataset.page));
    });

    // Filter init
    initFilters();

    // Initial render
    renderCurrentPage();

    // Window resize: charts auto-resize via Chart.js responsive mode,
    // but we debounce just in case
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        Object.values(ChartFactory.instances || {}).forEach(c => c?.resize?.());
      }, 150);
    });

    console.log('KM Insight Dashboard initialized. Pages:', PAGE_LIST.length);
  }

  // Expose for console debugging
  window.KMInsight = { state, navigateTo, DataModel, ChartFactory };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
