import { authService } from './api/auth.service.js';

// GUARDIÁN DE AUTENTICACIÓN
(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    authService.logout();
  }
})();

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelector('.sidebar-nav');

const pageNames = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  centros: 'Centros de Formación',
  ambientes: 'Ambientes de Formación',
  billing: 'Billing',
  notifications: 'Notifications',
  profile: 'Perfil',
  'sign-in': 'Sign In',
  'sign-up': 'Sign Up'
};

console.log("main.js cargado. El script principal está listo.");

const loadContent = async (page) => {
  console.log(`Paso 2: Se llamó a loadContent con el parámetro: '${page}'`);
  try {
    const response = await fetch(`pages/${page}.html`);
    console.log("Paso 3: Se intentó hacer fetch. Respuesta recibida:", response);

    if (!response.ok) {
      throw new Error(`Error de red: ${response.status} - ${response.statusText}`);
    }
    const html = await response.text();
    mainContent.innerHTML = html;
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active', 'bg-success', 'text-white');
      } else {
        link.classList.remove('active', 'bg-success', 'text-white');
      }
    });

    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb && pageNames[page]) {
      breadcrumb.textContent = pageNames[page];
    }

    if (page === 'dashboard') {
      import('./pages/dashboard.js')
        .then(dashboardModule => {
          dashboardModule.init();
        })
        .catch(err => {
          console.error("No se pudo cargar el módulo del dashboard:", err);
        });
    }

    if (page === 'usuarios') {
      import('./pages/users.js')
        .then(usersModule => usersModule.init());
    }

    if (page === 'centros') {
      import('./pages/centros.js')
        .then(centrosModule => {
          console.log('Módulo de centros cargado correctamente');
          centrosModule.init();
        })
        .catch(err => {
          console.error('No se pudo cargar el módulo de centros:', err);
        });
    }

    if (page === 'ambientes') {
      import('./pages/ambientes.js')
        .then(ambientesModule => {
          console.log('Módulo de ambientes cargado correctamente');
          ambientesModule.init();
        })
        .catch(err => {
          console.error('No se pudo cargar el módulo de ambientes:', err);
        });
    }
    // Puedes agregar más imports dinámicos para otras páginas aquí

  } catch (error) {
    console.error("¡ERROR! Algo falló dentro de loadContent:", error);
    mainContent.innerHTML = `<h3 class="text-center text-danger p-5">No se pudo cargar el contenido. Revisa la consola (F12).</h3>`;
  }
};

navLinks.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-page]');
  if (link) {
    event.preventDefault();
    const pageToLoad = link.dataset.page;
    console.log(`Paso 1: Clic detectado. Se va a cargar la página: '${pageToLoad}'`);
    loadContent(pageToLoad);
  }
});

// LOGOUT
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    authService.logout();
  });
}

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
  loadContent('dashboard');
});