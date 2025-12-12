const API_URL = 'http://localhost:8000';
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyzeBtn').addEventListener('click', analyzeStock);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

async function analyzeStock() {
    const symbol = document.getElementById('symbol').value.toUpperCase();
    const market = document.getElementById('market').value;
    
    if (!symbol) {
        alert('Please enter a stock symbol');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol, market })
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

function displayResults(data) {
    displayMetricsTable(data.metrics);
    displayCharts(data.metrics);
    displayAnomalies(data.anomalies);
    displayAnalystNotes(data.analyst_notes, data.summary);
    document.getElementById('resultsSection').classList.remove('hidden');
}

function displayMetricsTable(metrics) {
    const tbody = document.querySelector('#metricsTable tbody');
    tbody.innerHTML = '';
    metrics.forEach(m => {
        const row = `<tr>
            <td>${m.year}</td>
            <td>${m.revenue.toFixed(1)}</td>
            <td>${m.ebitda.toFixed(1)}</td>
            <td>${m.operating_margin.toFixed(1)}</td>
            <td>${m.roe.toFixed(1)}</td>
            <td>${m.debt_to_equity.toFixed(2)}</td>
            <td>${m.working_capital_days.toFixed(0)}</td>
            <td>${m.cash_ratio.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function displayCharts(metrics) {
    const years = metrics.map(m => m.year);
    
    const chartConfigs = [
        { id: 'revenueChart', label: 'Revenue', data: metrics.map(m => m.revenue), borderColor: '#4CAF50' },
        { id: 'marginChart', label: 'Op. Margin %', data: metrics.map(m => m.operating_margin), borderColor: '#2196F3' },
        { id: 'roeChart', label: 'ROE %', data: metrics.map(m => m.roe), borderColor: '#FF9800' },
        { id: 'debtChart', label: 'D/E Ratio', data: metrics.map(m => m.debt_to_equity), borderColor: '#F44336' },
        { id: 'wcChart', label: 'WC Days', data: metrics.map(m => m.working_capital_days), borderColor: '#9C27B0' },
        { id: 'cashChart', label: 'Cash Ratio', data: metrics.map(m => m.cash_ratio), borderColor: '#00BCD4' }
    ];
    
    chartConfigs.forEach(config => {
        const ctx = document.getElementById(config.id).getContext('2d');
        if (charts[config.id]) charts[config.id].destroy();
        charts[config.id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{ label: config.label, data: config.data, borderColor: config.borderColor, tension: 0.4 }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    });
}

function displayAnomalies(anomalies) {
    const container = document.getElementById('anomaliesContainer');
    container.innerHTML = anomalies.map(a => `
        <div class="anomaly-card anomaly-${a.severity.toLowerCase()}">
            <div class="severity-badge">${a.severity}</div>
            <h4>${a.metric}</h4>
            <p>${a.description}</p>
            <p class="recommendation">💡 ${a.recommendation}</p>
        </div>
    `).join('');
}

function displayAnalystNotes(notes, summary) {
    document.getElementById('analystNotes').innerHTML = `<p>${notes}</p>`;
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}
