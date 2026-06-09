/**
 * KM Insight — Multi-Dimensional Data Model
 * Supports filtering by: timeRange, location, product, topic, service
 */

const DataModel = (function() {

  // ── Dimension values ──────────────────────────────
  const DIMENSIONS = {
    timeRange: ['7d','30d','90d','365d'],
    location: ['All','NA','EMEA','AP','LA'],
    product: ['All','ISG','IDG','MBG'],
    topic: ['All','Technical Knowledge','SOP','How-To','Product Knowledge'],
    service: ['All','Premier Support','Standard Warranty','Premium Care']
  };

  // ── Helper: deterministic random from seed string ─
  function seededRandom(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i) | 0;
    const x = Math.sin(h) * 10000;
    return x - Math.floor(x);
  }

  function hashFloat(seed, min, max) {
    return min + seededRandom(seed) * (max - min);
  }

  function hashInt(seed, min, max) {
    return Math.floor(hashFloat(seed, min, max + 0.999));
  }

  // ── Date helpers ──────────────────────────────────
  function today() { return new Date('2026-06-08'); }
  function daysAgo(n) { const d = today(); d.setDate(d.getDate() - n); return d; }
  function formatDate(d) { return `${d.getMonth()+1}/${d.getDate()}`; }
  function formatDateLong(d) { const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${m[d.getMonth()]} ${d.getDate()}`; }

  // ── Multipliers per dimension ─────────────────────
  const MULTIPLIERS = {
    timeRange: { '7d': 0.25, '30d': 1, '90d': 3, '365d': 12 },
    location: { 'All': 1, 'NA': 0.38, 'EMEA': 0.28, 'AP': 0.22, 'LA': 0.12 },
    product: { 'All': 1, 'ISG': 0.35, 'IDG': 0.42, 'MBG': 0.23 },
    topic: { 'All': 1, 'Technical Knowledge': 0.45, 'SOP': 0.15, 'How-To': 0.25, 'Product Knowledge': 0.10 },
    service: { 'All': 1, 'Premier Support': 0.18, 'Standard Warranty': 0.52, 'Premium Care': 0.30 }
  };

  // Combined multiplier for a filter set
  function getMultiplier(filters) {
    return Object.keys(filters).reduce((acc, key) => {
      const val = filters[key];
      if (val && val !== 'All' && MULTIPLIERS[key] && MULTIPLIERS[key][val]) {
        return acc * MULTIPLIERS[key][val];
      }
      return acc;
    }, 1);
  }

  // ── KPI Base Values (at 30d / All / All / All / All) ─
  const KPI_BASE = {
    totalViews: 1245600,
    helpfulPct: 84.5,
    activityRate: 42,
    slaCompliance: 96.2,
    totalArticles: 12480,
    drafts: 342,
    inReview: 156,
    published: 10892,
    archived: 1090,
    activeContributors: 87,
    newArticlesMonth: 203,
    avgReviewCycle: 3.2,
    pendingReviews: 156,
    brokenLinks: 14,
    expiring: 25,
    orphaned: 32,
    metadataIssues: 8,
    uniqueVisitors: 89200,
    avgTimeOnPage: 135, // seconds
    bounceRate: 38.5,
    pagesPerSession: 4.2,
    totalSearches: 85000,
    searchCTR: 72.3,
    zeroResultRate: 4.5,
    aiResolutionRate: 68.0,
    totalChannelCalls: 2340000,
    superAgentCalls: 890000,
    pdGuideCalls: 540000,
    nbaCalls: 420000,
    lenaCalls: 290000,
    openTasks: 47,
    overdueTasks: 12,
    avgResolutionDays: 3.2,
    closedThisMonth: 89,
    reopenRate: 4.5,
  };

  // ── Generate KPI values with filters ──────────────
  function getKPIs(filters) {
    const m = getMultiplier(filters);
    const timeMul = MULTIPLIERS.timeRange[filters.timeRange || '30d'];
    const k = {};

    // Views/searches/channels scale by time AND dimensions
    k.totalViews = Math.round(KPI_BASE.totalViews * m);
    k.uniqueVisitors = Math.round(KPI_BASE.uniqueVisitors * m);
    k.totalSearches = Math.round(KPI_BASE.totalSearches * m);
    k.totalChannelCalls = Math.round(KPI_BASE.totalChannelCalls * m);
    k.superAgentCalls = Math.round(KPI_BASE.superAgentCalls * m);
    k.pdGuideCalls = Math.round(KPI_BASE.pdGuideCalls * m);
    k.nbaCalls = Math.round(KPI_BASE.nbaCalls * m);
    k.lenaCalls = Math.round(KPI_BASE.lenaCalls * m);

    // Articles scale differently — more stable
    const articleMul = Math.sqrt(m); // dampen article count variation
    k.totalArticles = Math.round(KPI_BASE.totalArticles * articleMul);
    k.drafts = Math.round(KPI_BASE.drafts * articleMul);
    k.inReview = Math.round(KPI_BASE.inReview * articleMul);
    k.published = Math.round(KPI_BASE.published * articleMul);
    k.archived = Math.round(KPI_BASE.archived * articleMul);
    k.orphaned = Math.round(KPI_BASE.orphaned * articleMul);

    // Percentages vary slightly with filters
    k.helpfulPct = +(KPI_BASE.helpfulPct + hashFloat(filtersStr(filters)+'helpful', -3, 2)).toFixed(1);
    k.activityRate = +(KPI_BASE.activityRate + hashFloat(filtersStr(filters)+'activity', -3, 4)).toFixed(1);
    k.slaCompliance = +(KPI_BASE.slaCompliance + hashFloat(filtersStr(filters)+'sla', -2, 1)).toFixed(1);
    k.searchCTR = +(KPI_BASE.searchCTR + hashFloat(filtersStr(filters)+'ctr', -5, 4)).toFixed(1);
    k.zeroResultRate = +(KPI_BASE.zeroResultRate + hashFloat(filtersStr(filters)+'zero', -1, 2)).toFixed(1);
    k.aiResolutionRate = +(KPI_BASE.aiResolutionRate + hashFloat(filtersStr(filters)+'ai', -3, 3)).toFixed(1);
    k.bounceRate = +(KPI_BASE.bounceRate + hashFloat(filtersStr(filters)+'bounce', -3, 3)).toFixed(1);
    k.pagesPerSession = +(KPI_BASE.pagesPerSession + hashFloat(filtersStr(filters)+'pps', -0.3, 0.5)).toFixed(1);

    // Contributors & tasks — less filter-sensitive
    k.activeContributors = Math.max(5, Math.round(KPI_BASE.activeContributors * Math.sqrt(m)));
    k.newArticlesMonth = Math.max(5, Math.round(KPI_BASE.newArticlesMonth * Math.sqrt(m)));
    k.pendingReviews = Math.max(5, Math.round(KPI_BASE.pendingReviews * Math.sqrt(m)));
    k.openTasks = Math.max(3, Math.round(KPI_BASE.openTasks * Math.sqrt(m)));
    k.overdueTasks = Math.max(0, Math.round(KPI_BASE.overdueTasks * Math.sqrt(m)));
    k.closedThisMonth = Math.max(5, Math.round(KPI_BASE.closedThisMonth * Math.sqrt(m)));

    // Absolute counts that don't scale with filters
    k.brokenLinks = Math.max(0, Math.round(KPI_BASE.brokenLinks + hashFloat(filtersStr(filters)+'broken', -3, 5)));
    k.expiring = Math.max(0, Math.round(KPI_BASE.expiring + hashFloat(filtersStr(filters)+'expire', -5, 8)));
    k.metadataIssues = Math.max(0, Math.round(KPI_BASE.metadataIssues + hashFloat(filtersStr(filters)+'meta', -2, 4)));

    // Time
    k.avgReviewCycle = +(KPI_BASE.avgReviewCycle + hashFloat(filtersStr(filters)+'review', -1, 1.5)).toFixed(1);
    k.avgResolutionDays = +(KPI_BASE.avgResolutionDays + hashFloat(filtersStr(filters)+'res', -0.5, 1)).toFixed(1);
    k.avgTimeOnPage = Math.round(KPI_BASE.avgTimeOnPage + hashFloat(filtersStr(filters)+'time', -15, 20));

    return k;
  }

  function filtersStr(f) {
    return `${f.timeRange}_${f.location}_${f.product}_${f.topic}_${f.service}`;
  }

  // ── Daily trend data ──────────────────────────────
  function getDailyTrend(filters, days = 30) {
    const baseViews = 43000 * getMultiplier(filters);
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = daysAgo(i);
      const seed = filtersStr(filters) + i;
      const weekday = d.getDay();
      const weekendMul = (weekday === 0 || weekday === 6) ? 0.65 : 1;
      const noise = hashFloat(seed, 0.85, 1.15);
      const trend = 1 + (days - i) * 0.003; // slight growth
      const views = Math.round(baseViews * weekendMul * noise * trend);
      result.push({ date: formatDateLong(d), views, visitors: Math.round(views * hashFloat(seed+'v', 0.07, 0.09)) });
    }
    return result;
  }

  // ── Monthly data ──────────────────────────────────
  function getMonthlyData(filters, months = 12) {
    const m = getMultiplier(filters);
    const labels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
    const baseDraft = [280,290,310,300,320,315,330,325,340,335,350,342];
    const baseReview = [120,130,125,140,135,145,150,148,155,152,160,156];
    const basePub = [9800,9900,10000,10100,10200,10300,10400,10550,10680,10780,10850,10892];
    const baseArch = [800,820,850,870,900,920,950,970,1000,1030,1060,1090];

    const dampen = Math.sqrt(m);
    return {
      labels: labels.slice(-months),
      draft: baseDraft.slice(-months).map(v => Math.round(v * dampen)),
      review: baseReview.slice(-months).map(v => Math.round(v * dampen)),
      published: basePub.slice(-months).map(v => Math.round(v * dampen)),
      archived: baseArch.slice(-months).map(v => Math.round(v * dampen)),
    };
  }

  // ── Topic distribution ────────────────────────────
  function getTopicDistribution(filters) {
    const seed = filtersStr(filters);
    const base = [45, 25, 15, 10, 5];
    const labels = ['Device Issue Solving','How-To Guide','Parts Replacement SOP','HMM','Other'];
    // Jitter based on filters
    let values = base.map((v, i) => {
      const jitter = hashFloat(seed + 'topic' + i, -3, 3);
      return Math.max(2, v + jitter);
    });
    // Normalize to 100
    const sum = values.reduce((a, b) => a + b, 0);
    values = values.map(v => Math.round(v / sum * 100));
    // Adjust last to ensure exactly 100
    const total = values.slice(0, -1).reduce((a, b) => a + b, 0);
    values[values.length - 1] = 100 - total;
    return { labels, values };
  }

  // ── Product ranking ───────────────────────────────
  function getProductRanking(filters) {
    const base = [
      { name: 'ThinkPad', views: 285000 },
      { name: 'ThinkSystem', views: 240000 },
      { name: 'ThinkVision', views: 195000 },
      { name: 'Yoga', views: 165000 },
      { name: 'ideapad', views: 142000 },
      { name: 'Legion', views: 128000 },
      { name: 'ThinkCentre', views: 105000 },
      { name: 'ThinkStation', views: 88000 },
      { name: 'Moto', views: 72000 },
      { name: 'Tablet', views: 58000 },
    ];
    const m = getMultiplier(filters);
    // If specific product selected, boost it
    const seed = filtersStr(filters);
    return base.map((p, i) => {
      let mul = m;
      if (filters.product !== 'All') {
        const prodMap = { 'ISG': ['ThinkSystem','ThinkEdge','Storage','ThinkStation'],
          'IDG': ['ThinkPad','ThinkVision','Yoga','ideapad','Legion','ThinkCentre'],
          'MBG': ['Moto','Tablet','Motorola'] };
        const prods = prodMap[filters.product] || [];
        if (prods.includes(p.name)) mul *= 2.2;
        else mul *= 0.3;
      }
      const noise = hashFloat(seed + p.name, 0.9, 1.1);
      return { ...p, views: Math.round(p.views * mul * noise) };
    }).sort((a, b) => b.views - a.views);
  }

  // ── Region data ───────────────────────────────────
  function getRegionData(filters) {
    const regions = ['North America','EMEA','Asia Pacific','Latin America'];
    const base = [473000, 349000, 274000, 149000];
    const m = getMultiplier(filters);
    return regions.map((r, i) => {
      let mul = m;
      if (filters.location !== 'All') {
        const locMap = { 'NA': 'North America', 'EMEA': 'EMEA', 'AP': 'Asia Pacific', 'LA': 'Latin America' };
        if (locMap[filters.location] === r) mul *= 2.5;
        else mul *= 0.35;
      }
      return { name: r, views: Math.round(base[i] * mul) };
    });
  }

  // ── Search funnel ─────────────────────────────────
  function getSearchFunnel(filters) {
    const m = getMultiplier(filters);
    const searches = Math.round(KPI_BASE.totalSearches * m);
    const shown = Math.round(searches * 0.955);
    const clicked = Math.round(searches * 0.723);
    const helpful = Math.round(searches * 0.615);
    const resolved = Math.round(searches * 0.444);
    return { searches, shown, clicked, helpful, resolved };
  }

  // ── Top search terms ──────────────────────────────
  function getTopSearchTerms(filters) {
    const base = ['screen flickering','no power','firmware update','battery drain','driver download','blue screen','wifi issue','overheating','keyboard not working','slow performance'];
    const seed = filtersStr(filters);
    return base.map((term, i) => ({
      term,
      volume: Math.round((4200 - i * 280) * hashFloat(seed + term, 0.7, 1.3)),
      ctr: +(hashFloat(seed + term + 'ctr', 60, 92)).toFixed(1),
    }));
  }

  // ── Zero result searches ──────────────────────────
  function getZeroResultTerms(filters) {
    const base = [
      { term: 'Legion Go S Linux drivers', volume: 850, trend: '↑ 35%', component: 'Software > Drivers' },
      { term: 'R34W-30 downgrade firmware', volume: 420, trend: '↑ 18%', component: 'Display > Firmware' },
      { term: 'ThinkPad X1 Gen12 BIOS', volume: 310, trend: '↑ 22%', component: 'System > BIOS' },
      { term: 'Yoga 9i stylus setup', volume: 280, trend: '→ Flat', component: 'Accessories > Stylus' },
      { term: 'Chromebook recovery', volume: 195, trend: '↑ 8%', component: 'OS > ChromeOS' },
      { term: 'ISG RAID config guide', volume: 165, trend: '↑ 12%', component: 'Storage > RAID' },
      { term: 'ThinkPad dock firmware', volume: 142, trend: '↑ 15%', component: 'Accessories > Dock' },
      { term: 'Legion laptop Linux dual boot', volume: 128, trend: '↑ 20%', component: 'Software > OS' },
    ];
    const m = getMultiplier(filters);
    const seed = filtersStr(filters);
    return base.map((r, i) => ({
      ...r,
      volume: Math.max(20, Math.round(r.volume * m * hashFloat(seed + r.term, 0.6, 1.4))),
    }));
  }

  // ── Contributors ──────────────────────────────────
  function getContributors(filters) {
    const base = [
      { name: 'Zhang*', geo: 'AP-CAP', articles: 15, views: 24500, helpful: 92.1, rating: 'Exceeds' },
      { name: 'M. Smith', geo: 'NA-US', articles: 12, views: 18200, helpful: 89.5, rating: 'Meets' },
      { name: 'L. Müller', geo: 'EMEA-DACH', articles: 9, views: 22100, helpful: 94.0, rating: 'Exceeds' },
      { name: 'R. Patel', geo: 'NA-CA', articles: 8, views: 15300, helpful: 88.2, rating: 'Meets' },
      { name: 'A. Chen', geo: 'AP-CN', articles: 7, views: 12800, helpful: 91.3, rating: 'Exceeds' },
      { name: 'K. Suzuki', geo: 'AP-JP', articles: 6, views: 10500, helpful: 87.0, rating: 'Meets' },
      { name: 'J. Kim', geo: 'AP-KR', articles: 6, views: 9800, helpful: 85.5, rating: 'Meets' },
      { name: 'S. Brown', geo: 'EMEA-UK', articles: 5, views: 8200, helpful: 82.3, rating: 'Developing' },
      { name: 'Y. Tanaka', geo: 'AP-JP', articles: 4, views: 7600, helpful: 90.1, rating: 'Exceeds' },
      { name: 'D. Lee', geo: 'NA-US', articles: 4, views: 6900, helpful: 84.8, rating: 'Meets' },
    ];
    const m = Math.sqrt(getMultiplier(filters));
    const seed = filtersStr(filters);
    return base.map(c => ({
      ...c,
      articles: Math.max(1, Math.round(c.articles * m)),
      views: Math.round(c.views * m * hashFloat(seed + c.name, 0.85, 1.15)),
      helpful: +(c.helpful + hashFloat(seed + c.name + 'h', -2, 2)).toFixed(1),
    }));
  }

  // ── Bad case tasks ────────────────────────────────
  function getBadCaseTasks(filters) {
    const base = [
      { id: '#142', source: 'Portal FB', type: 'Incorrect info', article: 'No Power Troubleshooting', priority: 'P1', owner: 'Li', status: 'In Progress' },
      { id: '#141', source: 'Zero Search', type: 'Missing coverage', article: 'Linux Driver Install Guide', priority: 'P1', owner: 'Wang', status: 'Open' },
      { id: '#140', source: 'Channel FB', type: 'Low relevance', article: 'Battery Replacement SOP', priority: 'P2', owner: 'Chen', status: 'In Review' },
      { id: '#139', source: 'Portal FB', type: 'Outdated steps', article: 'BIOS Update Procedure', priority: 'P2', owner: 'Li', status: 'Open' },
      { id: '#138', source: 'NBA FB', type: 'Confusing text', article: 'Warranty Check Guide', priority: 'P3', owner: 'Smith', status: 'Blocked' },
      { id: '#137', source: 'Portal FB', type: 'Missing details', article: 'Screen Flickering Fix', priority: 'P2', owner: 'Zhang*', status: 'Open' },
      { id: '#136', source: 'Low CTR', type: 'Poor search match', article: 'Power Supply Check', priority: 'P3', owner: 'Patel', status: 'Closed' },
      { id: '#135', source: 'Portal FB', type: 'Wrong product info', article: 'Memory Compatibility List', priority: 'P2', owner: 'Müller', status: 'In Progress' },
    ];
    // Filter by product/topic
    return base.filter(t => {
      if (filters.product !== 'All') {
        const prodMap = { 'ISG': ['ThinkSystem','SR650','Server','Storage','RAID'],
          'IDG': ['ThinkPad','ThinkVision','Yoga','ideapad','Legion','ThinkCentre'],
          'MBG': ['Moto','Tablet','Motorola','Chromebook'] };
        const keywords = prodMap[filters.product] || [];
        if (!keywords.some(k => t.article.includes(k))) return false;
      }
      return true;
    });
  }

  // ── Expiring / Orphaned articles ──────────────────
  function getExpiringArticles(filters) {
    const base = [
      { title: 'ThinkSystem SR650 Memory Replacement SOP', status: 'Active', expires: '2026-06-15', owner: 'Admin_Li', action: 'Renew' },
      { title: 'Premier Support Cross-Region Service Policy', status: 'In Review', expires: '2026-06-10', owner: 'J. Doe', action: 'Escalate' },
      { title: 'Lenovo Vantage Installation Error 0x800', status: 'Active', expires: '—', owner: 'System', action: 'Archive' },
      { title: 'BIOS Update Guide for ThinkPad X1 Gen 12', status: 'Active', expires: '2026-06-18', owner: 'Zhang*', action: 'Renew' },
      { title: 'Legacy Driver Pack for Windows 7 (EOL)', status: 'Active', expires: '2026-06-08', owner: 'System', action: 'Archive' },
      { title: 'ThinkVision R34W-30 Firmware Update', status: 'Active', expires: '2026-06-22', owner: 'Chen', action: 'Renew' },
      { title: 'ThinkEdge SE350 Hardware Maintenance', status: 'In Review', expires: '2026-06-14', owner: 'Patel', action: 'Escalate' },
    ];
    const seed = filtersStr(filters);
    // Filter by product keywords
    if (filters.product !== 'All') {
      const prodMap = { 'ISG': ['ThinkSystem','ThinkEdge','Storage','Server'],
        'IDG': ['ThinkPad','ThinkVision','Yoga','ideapad','Legion','ThinkCentre'],
        'MBG': ['Moto','Tablet','Chromebook'] };
      const keywords = prodMap[filters.product] || [];
      return base.filter(a => keywords.some(k => a.title.includes(k)));
    }
    return base;
  }

  // ── Governance: Broken links trend ────────────────
  function getBrokenLinkTrend(filters) {
    const base = [22, 18, 25, 20, 16, 14];
    const seed = filtersStr(filters);
    return base.map((v, i) => Math.max(0, Math.round(v + hashFloat(seed + 'broken' + i, -4, 5))));
  }

  // ── Governance: Orphaned by topic ─────────────────
  function getOrphanedByTopic(filters) {
    const base = [12, 8, 6, 4, 2];
    const labels = ['Device Issue Solving','How-To Guide','SOP','Product Knowledge','HMM'];
    const m = Math.sqrt(getMultiplier(filters));
    const seed = filtersStr(filters);
    return {
      labels,
      values: base.map((v, i) => Math.max(0, Math.round(v * m * hashFloat(seed + 'orph' + i, 0.7, 1.3)))),
    };
  }

  // ── Channel data ──────────────────────────────────
  function getChannelDistribution(filters) {
    const base = [38, 23, 18, 12, 9];
    const labels = ['Super Agent','PD Guide','NBA','LENA','Resolve App'];
    const seed = filtersStr(filters);
    let values = base.map((v, i) => Math.max(1, v + hashFloat(seed + 'ch' + i, -3, 3)));
    const sum = values.reduce((a, b) => a + b, 0);
    values = values.map(v => Math.round(v / sum * 100));
    const total = values.slice(0, -1).reduce((a, b) => a + b, 0);
    values[values.length - 1] = 100 - total;
    return { labels, values };
  }

  function getChannelTrend(filters) {
    const labels = ['Jan','Feb','Mar','Apr','May','Jun'];
    const m = getMultiplier(filters);
    const seed = filtersStr(filters);
    return {
      labels,
      superAgent: [320,340,360,375,400,445].map(v => Math.round(v * m * hashFloat(seed+'sa', 0.92, 1.08))),
      pdGuide: [250,260,255,265,270,270].map(v => Math.round(v * m * hashFloat(seed+'pd', 0.92, 1.08))),
      nba: [180,190,195,200,205,210].map(v => Math.round(v * m * hashFloat(seed+'nba', 0.92, 1.08))),
      lena: [120,130,135,140,142,145].map(v => Math.round(v * m * hashFloat(seed+'lena', 0.92, 1.08))),
      resolve: [80,85,88,92,95,100].map(v => Math.round(v * m * hashFloat(seed+'res', 0.92, 1.08))),
    };
  }

  // ── Channel content type stacked ──────────────────
  function getChannelContentType(filters) {
    const seed = filtersStr(filters);
    const channels = ['Super Agent','PD Guide','NBA','LENA','Resolve App'];
    const types = ['PD / Troubleshooting','How-To Guide','Hot Tips / Known Issue','SOP','Product Knowledge'];
    const base = [
      [45,30,10,10,5], [60,15,20,5,0], [25,15,50,10,0],
      [70,10,5,10,5], [30,40,10,10,10]
    ];
    const data = base.map((row, ci) =>
      row.map((v, ti) => Math.max(0, Math.min(100, v + hashFloat(seed + 'ctype' + ci + ti, -5, 5))))
    );
    // Normalize rows to 100
    return data.map(row => {
      const s = row.reduce((a, b) => a + b, 0);
      return row.map(v => Math.round(v / s * 100));
    });
  }

  // ── Task status breakdown ─────────────────────────
  function getTaskStatusBreakdown(filters) {
    const m = Math.sqrt(getMultiplier(filters));
    const seed = filtersStr(filters);
    return [
      Math.max(3, Math.round(47 * m * hashFloat(seed+'ts0', 0.85, 1.15))),
      Math.max(2, Math.round(28 * m * hashFloat(seed+'ts1', 0.85, 1.15))),
      Math.max(2, Math.round(18 * m * hashFloat(seed+'ts2', 0.85, 1.15))),
      Math.max(0, Math.round(12 * m * hashFloat(seed+'ts3', 0.7, 1.3))),
      Math.max(5, Math.round(89 * m * hashFloat(seed+'ts4', 0.85, 1.15))),
    ];
  }

  // ── Article deep dive: scroll depth ───────────────
  function getScrollDepth() {
    return [100, 65, 20, 8];
  }

  // ── Article deep dive: daily views ────────────────
  function getArticleDailyViews() {
    return [55,48,62,58,70,75,68,80,72,65,60,55,52,48,45,50,58,62,55,60];
  }

  // ── Article crosslinks ────────────────────────────
  function getCrosslinks() {
    return [
      { name: 'GPU Driver Update', rate: 30 },
      { name: 'Monitor Settings Config', rate: 22 },
      { name: 'Cable Connection Check', rate: 18 },
      { name: 'Firmware Update Guide', rate: 15 },
      { name: 'Warranty Claim SOP', rate: 15 },
    ];
  }

  // ── Scheduled reports ─────────────────────────────
  function getScheduledReports() {
    return [
      { name: 'Weekly Usage Summary', frequency: 'Every Monday 8AM', format: 'HTML + PDF', recipients: '8', status: 'Active' },
      { name: 'Monthly Content Health', frequency: '1st of Month', format: 'XLSX + PDF', recipients: '5', status: 'Active' },
      { name: 'Broken Link Alert', frequency: 'Every Friday 9AM', format: 'HTML', recipients: '3', status: 'Active' },
      { name: 'Zero-Result Search Digest', frequency: 'Every Wednesday 10AM', format: 'HTML', recipients: '4', status: 'Active' },
      { name: 'Contributor Performance', frequency: 'Monthly', format: 'XLSX', recipients: '6', status: 'Paused' },
      { name: 'Channel Consumption', frequency: 'Every Monday 7AM', format: 'HTML + CSV', recipients: '7', status: 'Active' },
      { name: 'SLA Compliance Report', frequency: 'Monthly', format: 'PDF', recipients: '3', status: 'Active' },
      { name: 'Orphaned Content Report', frequency: 'Monthly', format: 'XLSX', recipients: '2', status: 'Active' },
    ];
  }

  // ── Recent activity feed ──────────────────────────
  function getRecentActivity(filters) {
    const base = [
      { time: '10:32', user: 'Li', action: 'created article', subject: 'ThinkPad X1 Gen12 BIOS Update' },
      { time: '09:15', user: 'Wang', action: 'edited draft', subject: 'Yoga 9i Stylus Setup Guide' },
      { time: '08:47', user: 'Chen', action: 'submitted for review', subject: 'Legion Go S Linux Driver Install' },
      { time: '08:30', user: 'Smith', action: 'created draft', subject: 'R34W-30 Firmware Downgrade' },
      { time: '07:55', user: 'Müller', action: 'published', subject: 'Premier Support SLA Policy v3' },
      { time: '07:20', user: 'Zhang*', action: 'archived', subject: 'Windows 7 Driver Pack (EOL)' },
      { time: '06:45', user: 'Patel', action: 'updated', subject: 'ThinkSystem SR650 Memory SOP' },
      { time: '06:12', user: 'Kim', action: 'created draft', subject: 'Chromebook Recovery Procedure' },
    ];
    const m = Math.sqrt(getMultiplier(filters));
    return base.slice(0, Math.max(3, Math.round(base.length * Math.min(1, m))));
  }

  // ── Governance: unused tags ───────────────────────
  function getUnusedTags(filters) {
    const base = [
      { name: 'Windows 7', uses: 0 },
      { name: 'Vista', uses: 0 },
      { name: '32-bit', uses: 2 },
      { name: 'Legacy BIOS', uses: 0 },
      { name: 'Old Driver', uses: 1 },
      { name: 'XP Mode', uses: 0 },
      { name: 'IDE Cable', uses: 0 },
      { name: 'Floppy Disk', uses: 0 },
    ];
    const m = getMultiplier(filters);
    return base.map(t => ({
      ...t,
      uses: Math.max(0, Math.round(t.uses * m * hashFloat(filtersStr(filters)+t.name, 0.5, 1.2))),
    }));
  }

  // ── Alerts ────────────────────────────────────────
  function getAlerts(filters) {
    const k = getKPIs(filters);
    return [
      { type: 'critical', icon: '🔗', count: k.brokenLinks, text: 'Broken Links detected across active articles', desc: 'Last scan: 2 hours ago' },
      { type: 'warning', icon: '📅', count: k.expiring, text: 'Articles expiring within 7 days', desc: 'Across product families' },
      { type: 'warning', icon: '⏱️', count: Math.max(0, Math.round(k.avgReviewCycle > 5 ? k.avgReviewCycle - 5 + 2 : 0)), text: 'SLA breaches — exceeding review cycle', desc: `Avg delay: ${Math.max(0, (k.avgReviewCycle - 3.2)).toFixed(1)} days` },
      { type: 'info', icon: '🏷️', count: k.metadataIssues, text: 'Taxonomy tags unused for 180+ days', desc: 'Recommended cleanup' },
    ].filter(a => a.count > 0);
  }

  // ── Public API ────────────────────────────────────
  return {
    DIMENSIONS,
    getKPIs,
    getDailyTrend,
    getMonthlyData,
    getTopicDistribution,
    getProductRanking,
    getRegionData,
    getSearchFunnel,
    getTopSearchTerms,
    getZeroResultTerms,
    getContributors,
    getBadCaseTasks,
    getExpiringArticles,
    getBrokenLinkTrend,
    getOrphanedByTopic,
    getChannelDistribution,
    getChannelTrend,
    getChannelContentType,
    getTaskStatusBreakdown,
    getScrollDepth,
    getArticleDailyViews,
    getCrosslinks,
    getScheduledReports,
    getRecentActivity,
    getUnusedTags,
    getAlerts,
    getMultiplier,
    formatDateLong,
  };
})();
