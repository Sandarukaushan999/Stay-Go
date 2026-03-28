// Sidebar toggle for mobile
document.getElementById('sidebarToggle').onclick = function() {
  document.getElementById('sidebar').classList.toggle('open');
};

// Simple chart using Chart.js (optional, for demo)
window.onload = function() {
  if (window.Chart) {
    const ctx = document.getElementById('ticketChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [{
          data: [42, 33, 17, 8],
          backgroundColor: ['#BAF91A', '#E2FF99', '#876DFF', '#101312'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { display: true, position: 'bottom' }
        },
        cutout: '70%',
      }
    });
  }
};
