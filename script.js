let currentRole = 'admin';

// Global mock action handler for interactive buttons
function mockAction(message) {
  showToast(message);
}

// Toast notification system
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg> ${message}`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fadeOut');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

// Role selection on Login
function setRole(r) {
  currentRole = r;
  document.getElementById('tab-admin').classList.toggle('active', r === 'admin');
  document.getElementById('tab-res').classList.toggle('active', r === 'resident');
  
  document.getElementById('field-school').style.display = r === 'resident' ? 'block' : 'none';
  document.getElementById('demo-hint-admin').style.display = r === 'admin' ? 'block' : 'none';
  document.getElementById('demo-hint-res').style.display = r === 'resident' ? 'block' : 'none';
  
  document.getElementById('login-email').value = r === 'admin' ? 'admin@suptech.ma' : 'fatima@suptech.ma';
}

// Login action
function doLogin() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  if(currentRole === 'admin') {
    document.getElementById('admin-screen').classList.add('active');
    buildMainCharts();
    showToast("Bienvenue sur le panel d'administration FRDISI");
  } else {
    document.getElementById('res-screen').classList.add('active');
    showToast("Connexion réussie à votre espace résident");
  }
}

// Logout action
function doLogout() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('login-screen').classList.add('active');
  showToast("Déconnexion réussie");
}

// Navigation Admin
function aNav(view, el) {
  document.querySelectorAll('#admin-screen .view').forEach(v => v.classList.remove('active'));
  document.getElementById(view).classList.add('active');
  
  if(el) {
    document.querySelectorAll('#admin-screen .nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  
  // Close sidebar on mobile if open
  const sidebar = document.querySelector('#admin-screen .sidebar');
  if (sidebar && sidebar.classList.contains('open')) toggleSidebar();
  
  const titles = {
    'a-dash': 'Tableau de bord',
    'a-residents': 'Gestion des résidents',
    'a-chambres': 'Gestion des chambres',
    'a-paiements': 'Paiements',
    'a-reclamations': 'Réclamations',
    'a-admins': 'Administrateurs',
    'a-stats': 'Statistiques'
  };
  document.getElementById('a-page-title').textContent = titles[view] || '';
  
  if(view === 'a-chambres') buildRoomGrid();
  if(view === 'a-stats') buildStatsCharts();
}

// Navigation Resident
function rNav(view, el) {
  document.querySelectorAll('#res-screen .view').forEach(v => v.classList.remove('active'));
  document.getElementById(view).classList.add('active');
  
  if(el) {
    document.querySelectorAll('#res-screen .nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  
  // Close sidebar on mobile if open
  const sidebar = document.querySelector('#res-screen .sidebar');
  if (sidebar && sidebar.classList.contains('open')) toggleSidebar();
  
  const titles = {
    'r-dash': 'Mon tableau de bord',
    'r-chambre': 'Ma chambre & QR Code',
    'r-paiements': 'Mes paiements',
    'r-factures': 'Mes factures',
    'r-reclamations': 'Mes réclamations',
    'r-reservation': 'Réservation 2025-2026'
  };
  document.getElementById('r-page-title').textContent = titles[view] || '';
}

// Modal handling
function openModal(id) { document.getElementById('modal-' + id).classList.add('open'); }
function closeModal(id) { document.getElementById('modal-' + id).classList.remove('open'); }

// Actions on Modals
function addResident() {
  closeModal('resident');
  showSuccess('Résident ajouté !', 'Le compte résident FRDISI a été créé. Un email a été envoyé.');
}

function addAdmin() {
  const email = document.getElementById('new-admin-email').value || 'nouvel.admin@suptech.ma';
  closeModal('admin');
  showSuccess('Administrateur créé !', 'Le compte admin a été créé pour ' + email);
}

function submitReclamation() {
  closeModal('reclamation');
  showSuccess('Réclamation envoyée', 'Votre demande a été transmise au service technique de l\'UIB/FRDISI.');
}

function showSuccess(title, body) {
  document.getElementById('success-title').textContent = title;
  document.getElementById('success-body').textContent = body;
  openModal('success');
}

// Grid generation
function buildRoomGrid() {
  const g = document.getElementById('room-grid-a');
  if(g.children.length) return;
  
  const st = ['occ','occ','occ','free','occ','occ','res','occ','occ','occ','free','occ','occ','occ','free','occ','res','occ','occ','free'];
  const tp = ['I','I','D','D','I','D','D','I','I','D','D','I','D','I','I','I','D','D','I','D'];
  
  for(let i=0; i<20; i++){
    const d = document.createElement('div');
    d.className = 'room-cell';
    d.onclick = () => mockAction("Options pour la chambre " + (101+i));
    
    if(st[i] === 'occ') { d.style.background = 'rgba(46,204,113,0.1)'; d.style.borderColor = '#2ecc71'; }
    else if(st[i] === 'res') { d.style.background = 'rgba(243,156,18,0.1)'; d.style.borderColor = '#f39c12'; }
    
    d.innerHTML = `
      <div class="fw-bold" style="color: ${st[i] === 'occ' ? '#27ae60' : st[i] === 'res' ? '#d35400' : 'var(--text-muted)'}">${101+i}</div>
      <div class="text-xs text-muted mt-8">${tp[i] === 'I' ? 'Indiv.' : 'Double'}</div>
    `;
    g.appendChild(d);
  }
}

// Chart.js Configuration
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#64748b";

let chartsBuilt = false;
function buildStatsCharts() {
  if(chartsBuilt) return; chartsBuilt = true;
  
  new Chart(document.getElementById('recStatsChart'), {
    type: 'doughnut',
    data: {
      labels: ['WiFi', 'Plomberie', 'Électricité', 'Autre'],
      datasets: [{
        data: [35, 28, 22, 15],
        backgroundColor: ['#00d2ff', '#3a7bd5', '#f39c12', '#95a5a6'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
  });
  
  new Chart(document.getElementById('ecoleStatsChart'), {
    type: 'bar',
    data: {
      labels: ['SupTech Santé', 'SupTech Env.'],
      datasets: [{
        label: 'Résidents',
        data: [26, 21],
        backgroundColor: ['#00d2ff', '#3a7bd5'],
        borderRadius: 6, borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } }
    }
  });
}

let mainBuilt = false;
function buildMainCharts() {
  if(mainBuilt) return; mainBuilt = true;
  
  new Chart(document.getElementById('revChart'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
      datasets: [{
        label: 'Revenus (DH)',
        data: [48000, 51000, 49500, 53000, 52500],
        backgroundColor: 'rgba(0, 210, 255, 0.8)',
        borderRadius: 6, borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => Math.round(v/1000) + 'k' } }
      }
    }
  });
  
  new Chart(document.getElementById('occChart'), {
    type: 'doughnut',
    data: {
      labels: ['Occupées', 'Libres'],
      datasets: [{
        data: [38, 12],
        backgroundColor: ['#3a7bd5', '#ecf0f1'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
  });
}

// Select Reclamation Category
function selectCategory(btn, category) {
  document.querySelectorAll('.btn-category').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('reclamation-type').value = category;
}

// Mobile Sidebar Toggle
function toggleSidebar() {
  const screen = currentRole === 'admin' ? document.getElementById('admin-screen') : document.getElementById('res-screen');
  const sidebar = screen.querySelector('.sidebar');
  sidebar.classList.toggle('open');
  
  let overlay = screen.querySelector('.sidebar-overlay');
  if(!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleSidebar;
    screen.appendChild(overlay);
  }
  
  if(sidebar.classList.contains('open')) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
}
