// Bar Chart
const ctxBar = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3, 7],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Line Chart
const ctxLine = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Visitors',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
