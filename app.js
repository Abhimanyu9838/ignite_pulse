// ══════════════════════════════════════════
//  PULSE v2 — State & Data
// ══════════════════════════════════════════

const PASS = 'pulse2025';
let me = null; // current user key

// Real users (seeded)
let users = {
    abhimanyu: { name: 'Abhimanyu Verma', handle: '@abhimanyu', bio: 'Tech Visionary & UI expert. Building Pulse to ignite global conversations.', color: 'linear-gradient(135deg,#6366f1,#8b5cf6)', followers: ['nayasha', 'shashwat'], following: ['nayasha', 'shashwat', 'ashish'], website: '', cover: 'cover.png', email: 'abhimanyu@pulse.app', joined: 'March 2024', img: 'user-photo.jpg' },
    nayasha: { name: 'Nayasha', handle: '@nayasha', bio: 'Storyteller. Poet. Dreamer. Capturing moments in words and pictures.', color: 'linear-gradient(135deg,#ec4899,#f97316)', followers: ['abhimanyu', 'ashish'], following: ['shashwat', 'abhimanyu'], website: '', cover: 'linear-gradient(135deg,#ec4899,#8b5cf6)', email: 'nayasha@gmail.com', joined: 'Feb 2024' },
    shashwat: { name: 'Shashwat', handle: '@shashwat', bio: 'CS undergrad. Open source contributor. Coffee ≥ sleep.', color: 'linear-gradient(135deg,#06b6d4,#6366f1)', followers: ['abhimanyu', 'nayasha'], following: ['ashish', 'nayasha'], website: 'github.com/shashwat', cover: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', email: 'shashwat@gmail.com', joined: 'Jan 2024' },
    ashish: { name: 'Ashish', handle: '@ashish', bio: 'Startup founder. 0→1 builder. Obsessed with product-market fit.', color: 'linear-gradient(135deg,#10b981,#06b6d4)', followers: ['shashwat'], following: ['abhimanyu', 'nayasha'], website: 'ashish.xyz', cover: 'linear-gradient(135deg,#10b981,#6366f1)', email: 'ashish@gmail.com', joined: 'Apr 2024' },
};

let posts = [];
let bookmarks = JSON.parse(localStorage.getItem('pulse_bk') || '[]');
let notifs = [];
let dms = {};
let activeDMUser = null;
let selectedTag = 'Tech';
const TAGS = ['Tech', 'Science', 'Design', 'Culture', 'Business', 'Health', 'Space', 'AI', 'Art', 'Gaming', 'Finance', 'Philosophy'];
const COLORS = {
    Tech: '#6366f1', Science: '#06b6d4', Design: '#ec4899', Culture: '#f97316',
    Business: '#10b981', Health: '#f43f5e', Space: '#8b5cf6', AI: '#a855f7',
    Art: '#fb923c', Gaming: '#22d3ee', Finance: '#84cc16', Philosophy: '#e879f9'
};
const QUOTES = [
    '"The best time to plant a tree was 20 years ago. The second best time is now." — Proverb',
    '"Stay curious. Seek truth. Build things." — Paul Graham',
    '"Don\'t count the days. Make the days count." — Muhammad Ali',
    '"The universe is under no obligation to make sense to you." — Neil deGrasse Tyson',
    '"Move fast and break things… then fix them." — Silicon Valley wisdom',
    '"Every expert was once a beginner." — Helen Hayes',
    '"Your vibe is your tribe." — Unknown',
];

// ──────────────────────────────────────────
//  CACHE / AUTOFILL
// ──────────────────────────────────────────
function saveCreds(u) {
    try { localStorage.setItem('pulse_u', u); } catch (e) { }
}
function loadCreds() {
    try {
        const u = localStorage.getItem('pulse_u');
        if (u) { document.getElementById('li-u').value = u; }
    } catch (e) { }
}
window.addEventListener('DOMContentLoaded', loadCreds);

// ──────────────────────────────────────────
//  SEED DATA
// ──────────────────────────────────────────
function seed() {
    const T = Date.now();
    posts = [
        { id: 1, author: 'nayasha', title: 'Why slowing down is the most radical thing you can do', body: 'In a world that glorifies hustle, choosing stillness feels like rebellion. I spent three weeks offline — no Twitter, no Pulse, no LinkedIn. What I found surprised me. Clarity came in waves. Ideas returned. The noise I thought was inspiration was just... noise.', tag: 'Culture', likes: ['abhimanyu', 'shashwat', 'ashish'], comments: [{ author: 'abhimanyu', text: 'This hit different. Needed this today 🙏' }, { author: 'ashish', text: 'Three weeks is brave. I lasted three days lol' }], time: T - 1800000, views: 2341 },
        { id: 2, author: 'shashwat', title: 'I open-sourced my entire final year project — here\'s what happened', body: 'Two weeks after pushing to GitHub, 340 stars, 12 PRs, and 3 job offers. Open source is genuinely the best portfolio move for any CS student. Here\'s exactly what I built and why it resonated.', tag: 'Tech', likes: ['nayasha', 'abhimanyu'], comments: [{ author: 'nayasha', text: 'The PR from Google devs must have felt surreal!' }, { author: 'ashish', text: 'What was the project? Dropping a follow to find out 👀' }], time: T - 3600000, views: 4812, img: 'tech-post.png' },
        { id: 3, author: 'ashish', title: 'Turned down ₹3 Cr acquisition. The untold story.', body: 'Everyone congratulated me. My co-founder cried. My mom didn\'t speak to me for a week. Here\'s the full story of saying no to life-changing money and betting on ourselves instead.', tag: 'Business', likes: ['abhimanyu', 'nayasha', 'shashwat'], comments: [{ author: 'shashwat', text: 'The conviction here is insane. Respect.' }, { author: 'nayasha', text: 'Your mom\'s reaction lmaooo 😭 but also iconic' }], time: T - 7200000, views: 6103, poll: { q: 'Would you have taken the ₹3 Cr?', opts: ['Yes, take the money', 'No — keep building', 'Negotiate for more', 'Depends on the terms'], votes: [45, 28, 31, 19], voted: null } },
        { id: 4, author: 'abhimanyu', title: 'I redesigned my portfolio in 4 hours using Claude + Figma', body: 'The workflow was: mood board in 10 min → component library in 30 → full layout in 45 → micro-animations in 60. The rest was polish. AI didn\'t replace my creativity — it removed friction so creativity could flow faster.', tag: 'Design', likes: ['nayasha'], comments: [], time: T - 14400000, views: 1203, img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80' },
        { id: 5, author: 'nayasha', title: 'The Fermi Paradox is more disturbing than you think', body: 'We\'ve been running the Drake equation wrong. New calculations from Oxford suggest intelligent civilizations should be 10,000x more common than we assumed. So why is the universe silent? Three theories that will keep you up tonight.', tag: 'Space', likes: ['abhimanyu', 'shashwat', 'ashish'], comments: [{ author: 'abhimanyu', text: 'The dark forest theory haunts me.' }, { author: 'shashwat', text: 'Or we\'re in a simulation and the dev hasn\'t added other players yet 🤔' }], time: T - 86400000, views: 8872 },
        { id: 6, author: 'shashwat', title: 'The one data structure that will make you a better engineer', body: 'Most CS grads know arrays and linked lists. Fewer truly understand tries. Fewer still know when to use a Bloom filter. Here\'s a visual guide to the 5 underrated data structures I use at work every week.', tag: 'Tech', likes: ['abhimanyu', 'ashish'], comments: [{ author: 'ashish', text: 'Bloom filters changed how I think about caching.' }], time: T - 172800000, views: 3291 },
        { id: 7, author: 'ashish', title: 'Building in public changed everything for me', body: 'Month 1: 0 users, building in silence. Month 2: started tweeting progress. Month 3: 500 users, 3 partnerships, press coverage. The product didn\'t change. The visibility did. Build in public — even when it\'s scary.', tag: 'Business', likes: ['nayasha', 'shashwat'], comments: [{ author: 'nayasha', text: 'The courage to be vulnerable about failures is underrated.' }, { author: 'abhimanyu', text: 'Subscribed to your newsletter after this. Keep going 🚀' }], time: T - 259200000, views: 4445 },
    ];

    notifs = [
        { id: 1, type: 'like', from: 'nayasha', text: 'liked your post', sub: '"My design workflow"', time: T - 600000, read: false },
        { id: 2, type: 'follow', from: 'ashish', text: 'started following you', sub: '', time: T - 1800000, read: false },
        { id: 3, type: 'comment', from: 'shashwat', text: 'commented on your post', sub: '"Design with AI"', time: T - 7200000, read: false },
        { id: 4, type: 'like', from: 'nayasha', text: 'and 12 others liked your post', sub: '"Open source journey"', time: T - 86400000, read: true },
        { id: 5, type: 'mention', from: 'abhimanyu', text: 'mentioned you in a post', sub: 'Check it out!', time: T - 172800000, read: true },
    ];

    dms = {
        nayasha: { messages: [{ from: 'nayasha', text: 'Hey! Your last post was 🔥', time: T - 3600000 }, { from: 'me', text: 'Thank you!! Working on a follow-up already 😄', time: T - 3500000 }, { from: 'nayasha', text: 'Can\'t wait! Collab soon? 🤝', time: T - 3400000 }] },
        ashish: { messages: [{ from: 'ashish', text: 'Saw your design post — want to collaborate on something?', time: T - 86400000 }, { from: 'me', text: '100%! Let\'s set up a call', time: T - 86000000 }] },
        shashwat: { messages: [{ from: 'shashwat', text: 'Bhai check your GitHub — I just contributed to your repo!', time: T - 172800000 }] },
    };
}

// ──────────────────────────────────────────
//  AUTH
// ──────────────────────────────────────────
function authTab(t) {
    document.querySelectorAll('.atab').forEach((el, i) => el.classList.toggle('on', (t === 'login' && i === 0) || (t === 'signup' && i === 1)));
    document.getElementById('form-login').classList.toggle('on', t === 'login');
    document.getElementById('form-signup').classList.toggle('on', t === 'signup');
    document.getElementById('auth-err').style.display = 'none';
}
function showErr(msg) { const e = document.getElementById('auth-err'); e.textContent = msg; e.style.display = 'block'; }
function doLogin() {
    const u = document.getElementById('li-u').value.trim().toLowerCase().replace('@', '');
    const p = document.getElementById('li-p').value;
    if (!u) return showErr('Please enter your username.');
    if (p !== PASS) return showErr(`Incorrect password. Use "pulse2025" for demo.`);
    if (!users[u]) {
        const colors = ['linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#ec4899,#f97316)', 'linear-gradient(135deg,#06b6d4,#6366f1)', 'linear-gradient(135deg,#10b981,#06b6d4)'];
        users[u] = { name: u.charAt(0).toUpperCase() + u.slice(1), handle: '@' + u, bio: 'New to Pulse! 👋', color: colors[0], followers: [], following: [], cover: colors[0], email: '', joined: 'Just now' };
    }
    saveCreds(u);
    launchApp(u);
}
function doSignup() {
    const name = document.getElementById('su-n').value.trim();
    const u = document.getElementById('su-u').value.trim().toLowerCase().replace('@', '');
    const pass = document.getElementById('su-p').value;
    const bio = document.getElementById('su-b').value.trim();
    const email = document.getElementById('su-e').value.trim();
    if (!name || !u) return showErr('Full name and username are required.');
    if (pass.length < 6) return showErr('Password must be at least 6 characters.');
    const colors = ['linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#ec4899,#f97316)', 'linear-gradient(135deg,#06b6d4,#6366f1)', 'linear-gradient(135deg,#10b981,#06b6d4)'];
    const pick = colors[Object.keys(users).length % colors.length];
    users[u] = { name, handle: '@' + u, bio: bio || 'New to Pulse! 👋', color: pick, followers: [], following: [], cover: pick, email, website: '', joined: 'Just now' };
    saveCreds(u);
    launchApp(u);
    toast('🎉 Welcome to Pulse, ' + name + '!');
}
function gmailAuth() {
    const email = prompt('Enter your Gmail address for demo login:', 'yourname@gmail.com');
    if (!email || !email.includes('@')) return;
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const name = username.charAt(0).toUpperCase() + username.slice(1);
    if (!users[username]) {
        users[username] = {
            name, handle: '@' + username, bio: 'Joined via Google 🌐', email,
            color: 'linear-gradient(135deg,#6366f1,#ec4899)',
            cover: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            followers: [], following: [], website: '', joined: 'Just now'
        };
    }
    saveCreds(username);
    launchApp(username);
    toast('✅ Signed in with Google as ' + name);
}
function launchApp(u) {
    me = u;
    document.getElementById('auth').classList.remove('on');
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    setAvatar('nav-av', u);
    setAvatar('comp-av', u);
    seed();
    renderAll();
    goTab('feed');
}

// ──────────────────────────────────────────
//  AVATAR HELPERS
// ──────────────────────────────────────────
function setAvatar(elId, username) {
    const el = document.getElementById(elId);
    if (!el) return;
    const u = users[username];
    if (!u) return;
    if (u.img) {
        el.style.backgroundImage = `url(${u.img})`;
        el.textContent = '';
    } else {
        el.style.background = u.color;
        el.textContent = u.name[0].toUpperCase();
        el.style.color = '#fff';
    }
}
function avHTML(username, size = '40') {
    const u = users[username] || { name: '?', color: 'var(--s3)' };
    if (u.img) {
        return `<div class="av av-${size}" style="background-image:url(${u.img});background-size:cover;cursor:pointer" onclick="viewProfile('${username}')"></div>`;
    }
    return `<div class="av av-${size}" style="background:${u.color};color:#fff;cursor:pointer" onclick="viewProfile('${username}')">${u.name[0].toUpperCase()}</div>`;
}

// ──────────────────────────────────────────
//  NAVIGATION
// ──────────────────────────────────────────
let activeTab = 'feed';
function goTab(t) {
    activeTab = t;
    document.querySelectorAll('.tab-p').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('on'));
    document.querySelectorAll('.bn').forEach(b => b.classList.remove('on'));
    document.getElementById('p-' + t)?.classList.add('on');
    document.getElementById('ni-' + t)?.classList.add('on');
    document.getElementById('bn-' + t)?.classList.add('on');
    if (t === 'feed') renderFeed();
    if (t === 'explore') renderExplore();
    if (t === 'following') renderFollowing();
    if (t === 'notifications') renderNotifs();
    if (t === 'bookmarks') renderBookmarks();
    if (t === 'profile') renderMyProfile();
}
function feedTab(el, type) {
    document.querySelectorAll('.ftab').forEach(f => f.classList.remove('on'));
    el.classList.add('on');
    let list = [...posts];
    if (type === 'trending') list.sort((a, b) => (b.likes.length + b.views) - (a.likes.length + a.views));
    if (type === 'latest') list.sort((a, b) => b.time - a.time);
    if (type === 'following') list = list.filter(p => users[me]?.following.includes(p.author));
    renderPostList(list, 'feed-list');
}

// ──────────────────────────────────────────
//  RENDER
// ──────────────────────────────────────────
function renderAll() {
    renderFeed(); renderSidebar(); renderExplore(); renderFollowing(); renderNotifs(); renderBookmarks(); renderMyProfile(); renderDMList();
}
function renderFeed() {
    const list = [...posts].sort((a, b) => b.time - a.time);
    renderPostList(list, 'feed-list');
    renderSidebar();
}
function renderPostList(list, cId) {
    const c = document.getElementById(cId);
    if (!c) return;
    if (!list.length) { c.innerHTML = '<div class="empty"><div class="empty-ico">💫</div><p>Nothing here yet. Be first!</p></div>'; return; }
    c.innerHTML = list.map((p, i) => postHTML(p, i)).join('');
}
function postHTML(p, idx = 0) {
    const u = users[p.author] || { name: '?', color: 'var(--s3)', handle: '' };
    const liked = p.likes.includes(me);
    const saved = bookmarks.includes(p.id);
    const delay = Math.min(idx * 0.05, 0.4);
    return `<div class="post-card" id="pc-${p.id}" style="animation-delay:${delay}s">
    <div class="ph">
      ${avHTML(p.author, '40')}
      <div class="ph-info">
        <div class="ph-name" onclick="viewProfile('${p.author}')">${u.name}</div>
        <div class="ph-meta">${u.handle} · ${relTime(p.time)} · 👁 ${fmt(p.views)}</div>
      </div>
      <span class="post-tag-pill" style="color:${COLORS[p.tag] || 'var(--a1)'};border-color:${COLORS[p.tag] || 'var(--a1)'}44;background:${COLORS[p.tag] || 'var(--a1)'}15">${p.tag}</span>
      <button class="post-menu-btn" onclick="postMenu(${p.id},event)">⋯</button>
    </div>
    <div class="post-title" onclick="expandPost(${p.id})">${p.title}</div>
    <div class="post-body">${p.body}</div>
    ${p.img ? `<img class="post-img" src="${p.img}" alt="" loading="lazy" onerror="this.remove()">` : ''}
    ${p.poll ? pollHTML(p) : ''}
    <div class="post-actions">
      <button class="pact ${liked ? 'liked' : ''}" onclick="toggleLike(${p.id})">
        <span class="pact-ico">${liked ? '❤️' : '🤍'}</span>${fmt(p.likes.length)}
      </button>
      <button class="pact" onclick="toggleCmts(${p.id})">
        <span class="pact-ico">💬</span>${p.comments.length}
      </button>
      <button class="pact" onclick="sharePost(${p.id})"><span class="pact-ico">🔗</span></button>
      <button class="pact ${saved ? 'saved' : ''}" onclick="toggleSave(${p.id})">${saved ? '🔖' : '🏷️'}</button>
      ${p.author !== me ? `<button class="pact" onclick="dmUser('${p.author}')"><span class="pact-ico">💌</span></button>` : ''}
      <div class="view-count">👁 ${fmt(p.views)}</div>
    </div>
    <div class="comments-wrap" id="cmts-${p.id}">
      ${p.comments.map(c => cmtHTML(c)).join('')}
      <div class="c-input-row">
        <input type="text" placeholder="Add a thoughtful comment…" id="ci-${p.id}" onkeydown="if(event.key==='Enter')addCmt(${p.id})">
        <button class="c-send" onclick="addCmt(${p.id})">→</button>
      </div>
    </div>
  </div>`;
}
function cmtHTML(c) {
    const u = users[c.author] || { name: c.author, color: 'var(--s3)' };
    return `<div class="comment-item">
    ${avHTML(c.author, '32')}
    <div class="c-body">
      <div class="c-name">${u.name}</div>
      <div class="c-text">${c.text}</div>
    </div>
  </div>`;
}
function pollHTML(p) {
    const total = p.poll.votes.reduce((a, b) => a + b, 0) || 1;
    return `<div class="poll-wrap">
    <div class="poll-q">📊 ${p.poll.q}</div>
    ${p.poll.opts.map((o, i) => `
    <div class="poll-opt ${p.poll.voted === i ? 'poll-voted' : ''}" onclick="votePoll(${p.id},${i})">
      <div class="poll-fill" style="width:${p.poll.voted !== null ? Math.round(p.poll.votes[i] / total * 100) : 0}%"></div>
      <span class="poll-lbl">${o}</span>
      ${p.poll.voted !== null ? `<span class="poll-pct">${Math.round(p.poll.votes[i] / total * 100)}%</span>` : ''}
    </div>`).join('')}
    <div style="font-size:0.75rem;color:var(--t4);margin-top:0.4rem">${total} votes · ${p.poll.voted !== null ? 'You voted' : 'Vote to see results'}</div>
  </div>`;
}

function renderSidebar() {
    const tc = {};
    posts.forEach(p => { tc[p.tag] = (tc[p.tag] || 0) + p.views + (p.likes.length * 50) });
    const sorted = Object.entries(tc).sort((a, b) => b[1] - a[1]).slice(0, 7);
    document.getElementById('trending-w').innerHTML = sorted.map(([t, c]) => `
    <div class="trend-row" onclick="searchTopic(${JSON.stringify(t)})">
      <span class="trend-name" style="color:${COLORS[t] || 'var(--t1)'}">#${t}</span>
      <span class="trend-ct">${fmt(c)} pts</span>
    </div>`).join('');

    const others = Object.keys(users).filter(u => u !== me && !users[me]?.following.includes(u)).slice(0, 4);
    document.getElementById('wtf-w').innerHTML = others.map(u => `
    <div class="suggest-row">
      ${avHTML(u, '36')}
      <div class="sug-info">
        <div class="sug-name" onclick="viewProfile('${u}')">${users[u].name}</div>
        <div class="sug-handle">${users[u].handle} · ${(users[u].followers || []).length} followers</div>
      </div>
      <button class="fol-btn ${users[me]?.following.includes(u) ? 'fing' : ''}" id="fw-${u}" onclick="toggleFollow('${u}',this)">${users[me]?.following.includes(u) ? 'Following' : 'Follow'}</button>
    </div>`).join('');

    document.getElementById('quote-w').textContent = QUOTES[new Date().getDate() % QUOTES.length];

    const unread = notifs.filter(n => !n.read).length;
    document.getElementById('nb-count').textContent = unread;
    document.getElementById('nb-count').style.display = unread ? 'flex' : 'none';
    document.getElementById('ndot').style.display = unread ? 'block' : 'none';
}

function renderExplore() {
    const cats = [['🤖', 'AI & ML'], ['🚀', 'Space'], ['🎨', 'Design'], ['💼', 'Business'], ['🧬', 'Science'], ['🎮', 'Gaming'], ['💡', 'Philosophy'], ['💰', 'Finance'], ['🎵', 'Culture'], ['⚡', 'Tech'], ['🏥', 'Health'], ['🌍', 'Environment']];
    document.getElementById('exp-grid').innerHTML = cats.map(([ico, name]) => `
    <div class="exp-card" onclick="searchTopic(${JSON.stringify(name)})">
      <div class="exp-icon">${ico}</div>
      <div class="exp-name">${name}</div>
      <div class="exp-ct">${Math.floor(Math.random() * 900 + 100)} posts</div>
    </div>`).join('');
    const top = [...posts].sort((a, b) => b.likes.length - a.likes.length).slice(0, 4);
    renderPostList(top, 'exp-posts');
}

function renderFollowing() {
    const fp = posts.filter(p => (users[me]?.following || []).includes(p.author)).sort((a, b) => b.time - a.time);
    const c = document.getElementById('fol-posts');
    if (!fp.length) { c.innerHTML = '<div class="empty"><div class="empty-ico">👥</div><p>Follow people to see their posts here.</p></div>'; return; }
    renderPostList(fp, 'fol-posts');
}

function renderNotifs() {
    document.getElementById('ndot').style.display = 'none';
    const icons = { like: '❤️', follow: '👤', comment: '💬', mention: '📣' };
    document.getElementById('notif-list').innerHTML = notifs.map(n => `
    <div class="notif-card ${n.read ? '' : 'unread'}" onclick="markRead(${n.id})">
      <div class="notif-icon-wrap">${icons[n.type] || '🔔'}</div>
      <div>
        <div class="notif-text"><strong>${users[n.from]?.name || n.from}</strong> ${n.text}${n.sub ? ` <em style="color:var(--t3)">${n.sub}</em>` : ''}</div>
        <div class="notif-time">${relTime(n.time)}</div>
      </div>
      ${avHTML(n.from, '28')}
    </div>`).join('');
    notifs.forEach(n => n.read = true);
}

function renderBookmarks() {
    const bk = posts.filter(p => bookmarks.includes(p.id));
    const c = document.getElementById('bk-list');
    if (!bk.length) { c.innerHTML = '<div class="empty"><div class="empty-ico">🔖</div><p>Save posts to read later.</p></div>'; return; }
    renderPostList(bk, 'bk-list');
}

function renderMyProfile() { renderProfile(me); }
function renderProfile(username) {
    const u = users[username] || {};
    const userPosts = posts.filter(p => p.author === username).sort((a, b) => b.time - a.time);
    const isMe = username === me;
    const isFollowing = !isMe && (users[me]?.following || []).includes(username);
    const totalLikes = userPosts.reduce((a, p) => a + p.likes.length, 0);

    document.getElementById('prof-content').innerHTML = `
    <div class="profile-wrap">
      <div class="prof-cover" style="background:${(u.cover?.includes('.') || u.cover?.startsWith('http')) ? 'url(' + u.cover + ') center/cover' : u.cover || u.color || 'var(--grad)'}">
        <div class="prof-cover-overlay"></div>
      </div>

      <div class="prof-header">
        <div class="prof-av-wrap">
          <div class="prof-av" style="${u.img ? `background-image:url(${u.img});background-size:cover;` : `background:${u.color || 'var(--grad)'};`}color:#fff;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:2.2rem">
            ${u.img ? '' : (u.name?.[0]?.toUpperCase() || '?')}
          </div>
          <div class="online-ring"></div>
        </div>
        <div class="prof-actions">
          ${isMe
            ? `<button class="btn-outline" onclick="openEditProfile()">✏️ Edit Profile</button>`
            : `<button class="btn-outline" onclick="dmUser('${username}')">💌 DM</button>
               <button class="btn-follow-main ${isFollowing ? 'fing' : ''}" id="pf-fol-btn" onclick="toggleFollowProfile('${username}',this)">${isFollowing ? '✓ Following' : '+ Follow'}</button>`}
        </div>
      </div>

      <div class="prof-info">
        <div class="prof-name">${u.name || 'Unknown'}</div>
        <div class="prof-handle">${u.handle || ''}${u.email ? ` · <span style="color:var(--a4)">${u.email}</span>` : ''}</div>
        <div class="prof-bio">${u.bio || ''}</div>
        ${u.website ? `<div style="font-size:0.83rem;color:var(--a1);margin-bottom:0.8rem">🔗 ${u.website}</div>` : ''}
        ${u.joined ? `<div style="font-size:0.78rem;color:var(--t4);margin-bottom:1rem">📅 Joined ${u.joined}</div>` : ''}
        <div class="prof-stats">
          <div class="stat-item">
            <div class="stat-n">${userPosts.length}</div>
            <div class="stat-l">Posts</div>
          </div>
          <div class="stat-item" onclick="showFollowers('${username}')">
            <div class="stat-n">${(u.followers || []).length}</div>
            <div class="stat-l">Followers</div>
          </div>
          <div class="stat-item">
            <div class="stat-n">${(u.following || []).length}</div>
            <div class="stat-l">Following</div>
          </div>
          <div class="stat-item">
            <div class="stat-n">${fmt(totalLikes)}</div>
            <div class="stat-l">Likes</div>
          </div>
          <div class="stat-item">
            <div class="stat-n">${fmt(userPosts.reduce((a, p) => a + p.views, 0))}</div>
            <div class="stat-l">Views</div>
          </div>
        </div>
      </div>

      <div class="prof-posts-hd">Posts by ${isMe ? 'you' : u.name}</div>
      ${userPosts.length
            ? userPosts.map((p, i) => postHTML(p, i)).join('')
            : '<div class="empty"><div class="empty-ico">📝</div><p>No posts yet.</p></div>'}
    </div>`;
}

function viewProfile(username) {
    if (!users[username]) return;
    renderProfile(username);
    document.querySelectorAll('.tab-p').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('on'));
    document.querySelectorAll('.bn').forEach(b => b.classList.remove('on'));
    document.getElementById('p-profile').classList.add('on');
    document.getElementById('ni-profile')?.classList.add('on');
    document.getElementById('bn-profile')?.classList.add('on');
    activeTab = 'profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDMList() {
    const dmUsers = Object.keys(dms);
    document.getElementById('dm-conv-list').innerHTML = dmUsers.map(u => `
    <div class="dm-row ${activeDMUser === u ? 'on' : ''}" onclick="openDMChat('${u}')">
      ${avHTML(u, '40')}
      <div class="dm-info">
        <div class="dm-n">${users[u]?.name || u}</div>
        <div class="dm-p">${dms[u].messages.slice(-1)[0]?.text || ''}</div>
      </div>
      ${dms[u].messages.some(m => m.from !== me && !m.read) ? '<div class="dm-unread-dot"></div>' : ''}
    </div>`).join('');
}
function toggleDM() {
    const p = document.getElementById('dm-panel'), ov = document.getElementById('dm-ov');
    p.classList.toggle('open'); ov.classList.toggle('open');
}
function openDMChat(u) {
    activeDMUser = u;
    document.getElementById('dm-chat').classList.add('open');
    document.getElementById('dm-conv-list').parentElement.style.display = 'none';
    document.getElementById('dm-chat-name').textContent = users[u]?.name || u;
    setAvatar('dm-chat-av', u);
    const msgs = dms[u]?.messages || [];
    document.getElementById('dm-msgs').innerHTML = msgs.map(m => `<div class="msg ${m.from === me || m.from === 'me' ? 'sent' : 'recv'}">${m.text}</div>`).join('');
    setTimeout(() => { document.getElementById('dm-msgs').scrollTop = 9999 }, 50);
    renderDMList();
}
function closeDMChat() {
    document.getElementById('dm-chat').classList.remove('open');
    document.getElementById('dm-conv-list').parentElement.style.display = 'block';
    activeDMUser = null;
}
function sendMsg() {
    const inp = document.getElementById('dm-inp');
    const txt = inp.value.trim();
    if (!txt || !activeDMUser) return;
    if (!dms[activeDMUser]) dms[activeDMUser] = { messages: [] };
    dms[activeDMUser].messages.push({ from: me, text: txt, time: Date.now() });
    inp.value = '';
    openDMChat(activeDMUser);
    setTimeout(() => {
        const replies = ['That\'s interesting! 🤔', 'Tell me more!', 'lol yes exactly 😄', 'omg same!!', 'Have you seen the latest post on this? 👀', '❤️', 'Makes sense! Let\'s collab!'];
        dms[activeDMUser].messages.push({ from: activeDMUser, text: replies[Math.floor(Math.random() * replies.length)], time: Date.now() });
        if (activeDMUser === document.getElementById('dm-chat-name').textContent.toLowerCase()) openDMChat(activeDMUser);
        else renderDMList();
    }, 1000 + Math.random() * 1500);
}
function dmUser(username) {
    if (!dms[username]) dms[username] = { messages: [] };
    document.getElementById('dm-panel').classList.add('open');
    document.getElementById('dm-ov').classList.add('open');
    openDMChat(username);
    renderDMList();
}
function showNewDM() {
    const names = Object.keys(users).filter(u => u !== me).map(u => users[u].name + '(' + u + ')').join(', ');
    const input = prompt('Start a DM with (enter username): ' + names);
    if (input && users[input.trim().toLowerCase()]) dmUser(input.trim().toLowerCase());
}

function toggleLike(id) {
    const p = posts.find(x => x.id === id); if (!p) return;
    const i = p.likes.indexOf(me);
    if (i === -1) { p.likes.push(me); p.views++; addNotif(p.author, 'like', 'liked your post', '"' + p.title.slice(0, 30) + '"') }
    else p.likes.splice(i, 1);
    refreshPost(id);
    renderSidebar();
}
function toggleSave(id) {
    const i = bookmarks.indexOf(id);
    if (i === -1) { bookmarks.push(id); toast('🔖 Saved!') }
    else { bookmarks.splice(i, 1); toast('Removed from bookmarks') }
    try { localStorage.setItem('pulse_bk', JSON.stringify(bookmarks)) } catch (e) { }
    refreshPost(id);
}
function toggleCmts(id) {
    const el = document.getElementById('cmts-' + id);
    if (!el) return;
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
}
function addCmt(id) {
    const inp = document.getElementById('ci-' + id);
    const txt = inp?.value.trim(); if (!txt) return;
    const p = posts.find(x => x.id === id); if (!p) return;
    p.comments.push({ author: me, text: txt });
    inp.value = '';
    refreshPost(id);
    toast('💬 Comment posted!');
    addNotif(p.author, 'comment', 'commented on your post', '"' + p.title.slice(0, 30) + '"');
}
function votePoll(id, idx) {
    const p = posts.find(x => x.id === id); if (!p?.poll || p.poll.voted !== null) return;
    p.poll.votes[idx]++; p.poll.voted = idx;
    toast('📊 Vote recorded!'); refreshPost(id);
}
function sharePost(id) {
    const p = posts.find(x => x.id === id); if (!p) return;
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href + '?post=' + id).catch(() => { });
    toast('🔗 Link copied!');
}
function postMenu(id, e) {
    e.stopPropagation();
    const p = posts.find(x => x.id === id); if (!p) return;
    if (p.author === me) {
        if (confirm('Delete this post?')) {
            posts = posts.filter(x => x.id !== id);
            document.getElementById('pc-' + id)?.remove();
            toast('Post deleted.');
        }
    } else toast('🚩 Reported. Thanks!');
}
function expandPost(id) {
    const p = posts.find(x => x.id === id); if (!p) return;
    p.views++; refreshPost(id);
}

function toggleFollow(username, btn) {
    const m = users[me], t = users[username]; if (!m || !t) return;
    if (m.following.includes(username)) {
        m.following = m.following.filter(u => u !== username);
        t.followers = t.followers.filter(u => u !== me);
        btn.textContent = 'Follow'; btn.classList.remove('fing');
    } else {
        m.following.push(username); t.followers.push(me);
        btn.textContent = 'Following'; btn.classList.add('fing');
        toast('✅ Following ' + t.name);
        addNotif(username, 'follow', 'started following you', '');
    }
    renderSidebar();
}
function toggleFollowProfile(username, btn) {
    toggleFollow(username, btn);
    setTimeout(() => renderProfile(username), 100);
}

function openPostModal() {
    const tp = document.getElementById('tag-picker');
    if (tp) tp.innerHTML = TAGS.map(t => `<div class="chip-tag ${t === selectedTag ? 'on' : ''}" onclick="pickTag('${t}',this)" style="${t === selectedTag ? 'color:' + COLORS[t] + ';border-color:' + COLORS[t] + '44;background:' + COLORS[t] + '18' : ''}">⬤ ${t}</div>`).join('');
    openM('m-post');
}
function pickTag(t, el) {
    selectedTag = t;
    document.querySelectorAll('.chip-tag').forEach(e => { e.classList.remove('on'); e.removeAttribute('style') });
    el.classList.add('on');
    el.style.color = COLORS[t]; el.style.borderColor = COLORS[t] + '44'; el.style.background = COLORS[t] + '18';
}
function submitPost() {
    const title = document.getElementById('p-t').value.trim();
    const body = document.getElementById('p-b').value.trim();
    const img = document.getElementById('p-i').value.trim();
    if (!title || !body) return toast('❗ Title and body required.');
    const np = { id: Date.now(), author: me, title, body, tag: selectedTag, likes: [], comments: [], time: Date.now(), views: 1, img: img || null };
    posts.unshift(np);
    closeM('m-post');
    document.getElementById('p-t').value = '';
    document.getElementById('p-b').value = '';
    document.getElementById('p-i').value = '';
    goTab('feed'); toast('⚡ Posted!');
}
function openPollModal() { openM('m-poll'); }
function submitPoll() {
    const q = document.getElementById('pol-q').value.trim();
    const a = document.getElementById('pol-a').value.trim();
    const b = document.getElementById('pol-b').value.trim();
    const c = document.getElementById('pol-c').value.trim();
    const d = document.getElementById('pol-d').value.trim();
    if (!q || !a || !b) return toast('❗ Question and 2 options required.');
    const opts = [a, b, ...(c ? [c] : []), ...(d ? [d] : [])];
    const np = { id: Date.now(), author: me, title: q, body: 'Cast your vote below! 👇', tag: 'Poll', likes: [], comments: [], time: Date.now(), views: 1, poll: { q, opts, votes: opts.map(() => 0), voted: null } };
    posts.unshift(np);
    closeM('m-poll');
    ['pol-q', 'pol-a', 'pol-b', 'pol-c', 'pol-d'].forEach(id => { const el = document.getElementById(id); if (el) el.value = '' });
    goTab('feed'); toast('📊 Poll live!');
}

function openEditProfile() {
    const u = users[me];
    document.getElementById('ep-n').value = u.name || '';
    document.getElementById('ep-u').value = (u.handle || '').replace('@', '');
    document.getElementById('ep-b').value = u.bio || '';
    document.getElementById('ep-w').value = u.website || '';
    document.getElementById('cover-picker').style.background = (u.cover?.includes('.') || u.cover?.startsWith('http')) ? 'url(' + u.cover + ') center/cover' : u.cover || u.color || 'var(--grad)';
    openM('m-edit');
}
function saveProfile() {
    const u = users[me];
    u.name = document.getElementById('ep-n').value.trim() || u.name;
    const newHandle = document.getElementById('ep-u').value.trim().replace('@', '');
    u.handle = '@' + (newHandle || newHandle || me);
    u.bio = document.getElementById('ep-b').value.trim();
    u.website = document.getElementById('ep-w').value.trim();
    closeM('m-edit');
    setAvatar('nav-av', me); setAvatar('comp-av', me);
    renderMyProfile(); toast('✅ Profile updated!');
}
const coverGrads = ['linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#ec4899,#f97316)', 'linear-gradient(135deg,#06b6d4,#10b981)', 'linear-gradient(135deg,#8b5cf6,#ec4899)', 'linear-gradient(135deg,#f97316,#ec4899)'];
let coverIdx = 0;
function pickCover() {
    coverIdx = (coverIdx + 1) % coverGrads.length;
    const el = document.getElementById('cover-picker');
    el.style.background = coverGrads[coverIdx];
    users[me].cover = coverGrads[coverIdx];
}

let srchT;
function liveSearch(q) {
    clearTimeout(srchT);
    if (!q.trim()) { if (activeTab === 'search') goTab('feed'); return; }
    srchT = setTimeout(() => {
        const r = posts.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.body.toLowerCase().includes(q.toLowerCase()) || p.tag.toLowerCase().includes(q.toLowerCase()) || users[p.author]?.name.toLowerCase().includes(q.toLowerCase()));
        document.querySelectorAll('.tab-p').forEach(p => p.classList.remove('on'));
        document.getElementById('p-search').classList.add('on');
        activeTab = 'search';
        renderPostList(r, 'srch-list');
        if (!r.length) document.getElementById('srch-list').innerHTML = `<div class="empty"><div class="empty-ico">🔍</div><p>No results for "${q}"</p></div>`;
    }, 300);
}
function searchTopic(t) {
    document.getElementById('srch-inp').value = t;
    liveSearch(t);
}

function addNotif(toUser, type, text, sub) {
    if (toUser === me) return;
    notifs.unshift({ id: Date.now(), type, from: me, text, sub, time: Date.now(), read: false });
    renderSidebar();
}
function markRead(id) { const n = notifs.find(x => x.id === id); if (n) n.read = true; }

function showFollowers(username) {
    const u = users[username];
    if (!u || !u.followers.length) return toast('No followers yet.');
    const names = u.followers.map(f => users[f]?.name || f).join(', ');
    alert('Followers: ' + names);
}

function refreshPost(id) {
    const el = document.getElementById('pc-' + id);
    if (el) { const p = posts.find(x => x.id === id); if (p) el.outerHTML = postHTML(p) }
}
function openM(id) { document.getElementById(id).classList.add('open') }
function closeM(id) { document.getElementById(id).classList.remove('open') }
function relTime(ts) {
    const d = Date.now() - ts;
    if (d < 60000) return 'just now';
    if (d < 3600000) return Math.floor(d / 60000) + 'm';
    if (d < 86400000) return Math.floor(d / 3600000) + 'h';
    return Math.floor(d / 86400000) + 'd';
}
function fmt(n) { return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n }
let _toastT;
function toast(msg) {
    const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('show'), 2800);
}

document.querySelectorAll('.modal-bg').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open') }));
document.addEventListener('keydown', e => {
    if (e.key === 'n' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') openPostModal();
});
