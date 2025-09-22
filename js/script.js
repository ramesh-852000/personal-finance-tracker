// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// DOM Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionForm = document.getElementById('transactionForm');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const transactionsEl = document.getElementById('transactions');

// Load transactions
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Functions
function renderTransactions() {
    transactionsEl.innerHTML = '';
    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.className = t.type;
        li.innerHTML = `
      <span>${t.description} - $${t.amount}</span>
      <button onclick="deleteTransaction(${index})">🗑️</button>
    `;
        transactionsEl.appendChild(li);
    });
    updateSummary();
    updateCharts();
}

function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = income - expense;

    incomeEl.textContent = `$${income}`;
    expensesEl.textContent = `$${expense}`;
    balanceEl.textContent = `$${balance}`;
}

function addTransaction(e) {
    e.preventDefault();
    const description = descriptionEl.value.trim();
    const amount = amountEl.value.trim();
    const type = typeEl.value;

    if (description && amount) {
        transactions.push({ description, amount, type });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        descriptionEl.value = '';
        amountEl.value = '';
        renderTransactions();
    }
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

// Charts
let pieChart, barChart;
function updateCharts() {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

    const ctxPie = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        }
    });

    const ctxBar = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Amount $',
                data: [income, expense],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// Event Listeners
transactionForm.addEventListener('submit', addTransaction);

// Initial Render
renderTransactions();
