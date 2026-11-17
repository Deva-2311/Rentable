const http = require('http');

http.get('http://localhost:3000/admin/dashboard', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('Admin Command Center')) {
      console.log('Admin Command Center found!');
    }
    if (data.includes('AdminSidebar')) {
      console.log('AdminSidebar found in HTML (somehow)');
    }
    if (data.includes('RENTABLE<span class="text-forest-light3 text-sm ml-2">ADMIN</span>')) {
      console.log('RENTABLE ADMIN sidebar title found!');
    } else {
      console.log('Sidebar title NOT found in SSR.');
    }
    if (data.includes('Breadcrumbs')) {
      console.log('Breadcrumbs found');
    }
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
