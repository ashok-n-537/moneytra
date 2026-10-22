/**
 * Nexus Bank - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let bankData = StorageManager.getData();
  let privacyMode = localStorage.getItem('NEXUS_PRIVACY_MODE') === 'true';
  let activeTheme = localStorage.getItem('NEXUS_THEME') || 'dark';
  let activeCardId = 'card_black';
  let selectedContactId = bankData.contacts[0]?.id || null;
  let activeCategory = 'all';
  let searchQuery = '';

  let cashflowChartInstance = null;
  let categoryChartInstance = null;

  // Initial UI Sync
  initTheme();
  initPrivacyMode();
  updateGreeting();
  renderAll();

  // Attach Event Listeners
  setupEventListeners();

  /* ==========================================================================
     Theme & Privacy Mode Management
     ========================================================================== */
  function initTheme() {
    document.documentElement.setAttribute('data-theme', activeTheme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.className = activeTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }

  function toggleTheme() {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('NEXUS_THEME', activeTheme);
    initTheme();
    renderCharts(); // Re-render charts for theme color adaptation
    showToast(`Switched to ${activeTheme} mode`, 'info');
  }

  function initPrivacyMode() {
    const privacyBtn = document.getElementById('privacyToggleBtn');
    const privacyIcon = document.getElementById('privacyIcon');
    if (privacyMode) {
      privacyBtn?.classList.add('active');
      if (privacyIcon) privacyIcon.className = 'fa-solid fa-eye-slash';
    } else {
      privacyBtn?.classList.remove('active');
      if (privacyIcon) privacyIcon.className = 'fa-solid fa-eye';
    }
  }

  function togglePrivacyMode() {
    privacyMode = !privacyMode;
    localStorage.setItem('NEXUS_PRIVACY_MODE', privacyMode);
    initPrivacyMode();
    renderAccounts();
    renderTransactions();
    renderVaults();
    renderCards();
    showToast(privacyMode ? 'Account balances hidden' : 'Account balances visible', 'info');
  }

  function formatCurrency(amount) {
    if (privacyMode) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function updateGreeting() {
    const greetingText = document.getElementById('greetingText');
    const currentDateDisplay = document.getElementById('currentDateDisplay');
    const sidebarUserName = document.getElementById('sidebarUserName');
    if (greetingText && bankData.user) {
      const hour = new Date().getHours();
      let timeOfDay = 'Good morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'Good afternoon';
      else if (hour >= 17) timeOfDay = 'Good evening';
      greetingText.innerHTML = `${timeOfDay}, ${bankData.user.name.split(' ')[0]}! 👋`;
    }
    if (sidebarUserName && bankData.user) {
      sidebarUserName.textContent = bankData.user.name;
    }
    if (currentDateDisplay) {
      const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
      currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }
  }

  /* ==========================================================================
     Render Engines
     ========================================================================== */
  function renderAll() {
    renderAccounts();
    renderCards();
    renderContacts();
    renderTransactions();
    renderVaults();
    renderBills();
    renderCharts();
  }

  // 1. Accounts Grid
  function renderAccounts() {
    const grid = document.getElementById('accountsGrid');
    if (!grid) return;

    grid.innerHTML = bankData.accounts.map(acc => `
      <div class="account-card">
        <div class="account-header">
          <div class="account-icon">
            <i class="fa-solid ${acc.icon}"></i>
          </div>
          <span class="growth-badge ${acc.growth.startsWith('+') ? 'positive' : 'negative'}">
            ${acc.growth}
          </span>
        </div>
        <h3>${acc.type}</h3>
        <div class="account-balance ${privacyMode ? 'privacy-hidden' : ''}">
          ${formatCurrency(acc.balance)}
        </div>
        <div class="account-number">${acc.number}</div>
      </div>
    `).join('');
  }

  // 2. 3D Credit Card Render & Controls
  function renderCards() {
    const card = bankData.cards.find(c => c.id === activeCardId) || bankData.cards[0];
    if (!card) return;

    const creditCard3D = document.getElementById('creditCard3D');
    const cardBrandText = document.getElementById('cardBrandText');
    const cardNumberDisplay = document.getElementById('cardNumberDisplay');
    const cardHolderText = document.getElementById('cardHolderText');
    const cardExpiryText = document.getElementById('cardExpiryText');
    const cardCvvText = document.getElementById('cardCvvText');
    const freezeToggle = document.getElementById('freezeCardToggle');

    if (creditCard3D) {
      creditCard3D.className = `credit-card-3d ${card.color === 'gradient-sapphire' ? 'sapphire' : ''}`;
    }
    if (cardBrandText) cardBrandText.textContent = card.brand;
    if (cardHolderText) cardHolderText.textContent = card.holder;
    if (cardExpiryText) cardExpiryText.textContent = card.expiry;
    if (cardCvvText) cardCvvText.textContent = card.cvv;
    if (freezeToggle) freezeToggle.checked = card.frozen;

    if (cardNumberDisplay) {
      if (privacyMode) {
        cardNumberDisplay.innerHTML = `<span>••••</span> <span>••••</span> <span>••••</span> <span>${card.number.slice(-4)}</span>`;
      } else {
        const parts = card.number.split(' ');
        cardNumberDisplay.innerHTML = parts.map(p => `<span>${p}</span>`).join(' ');
      }
    }
  }

  // 3. Contacts Carousel
  function renderContacts() {
    const carousel = document.getElementById('contactsCarousel');
    if (!carousel) return;

    carousel.innerHTML = bankData.contacts.map(c => `
      <div class="contact-pill ${c.id === selectedContactId ? 'selected' : ''}" data-id="${c.id}">
        <img src="${c.avatar}" alt="${c.name}" class="contact-avatar">
        <span>${c.name.split(' ')[0]}</span>
      </div>
    `).join('');

    carousel.querySelectorAll('.contact-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        selectedContactId = pill.getAttribute('data-id');
        renderContacts();
      });
    });
  }

  // 4. Transactions List with Filters & Search
  function renderTransactions() {
    const tableBody = document.getElementById('transactionsTableBody');
    const txCountBadge = document.getElementById('txCountBadge');
    if (!tableBody) return;

    let filtered = bankData.transactions.filter(tx => {
      const matchCat = activeCategory === 'all' || tx.category === activeCategory;
      const matchSearch = searchQuery === '' || 
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (txCountBadge) {
      txCountBadge.textContent = `${filtered.length} transactions`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-tertiary);">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 24px; margin-bottom: 8px;"></i>
            <p>No transactions found matching your filter criteria.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(tx => {
      const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr data-id="${tx.id}">
          <td>
            <div class="vendor-cell">
              <div class="vendor-icon">
                <i class="fa-solid ${tx.vendorLogo || 'fa-receipt'}"></i>
              </div>
              <div class="vendor-info">
                <h5>${tx.title}</h5>
                <p>${tx.notes || tx.category}</p>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size: 12px; font-weight: 600; color: var(--text-secondary); background: var(--bg-input); padding: 4px 10px; border-radius: var(--radius-sm);">
              ${tx.category}
            </span>
          </td>
          <td style="font-size: 13px; color: var(--text-secondary); font-family: var(--font-mono);">${formattedDate}</td>
          <td style="font-size: 13px; color: var(--text-tertiary);">${tx.account}</td>
          <td>
            <span class="tx-amount ${tx.type} ${privacyMode ? 'privacy-hidden' : ''}">
              ${tx.type === 'debit' ? '-' : '+'}${formatCurrency(tx.amount)}
            </span>
          </td>
          <td>
            <span class="status-badge ${tx.status}">
              ${tx.status}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 5. Savings Goal Vaults
  function renderVaults() {
    const grid = document.getElementById('vaultGrid') || document.getElementById('vaultsGrid');
    if (!grid) return;

    grid.innerHTML = bankData.savingsGoals.map(goal => {
      const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
      return `
        <div class="vault-card">
          <div class="vault-header">
            <div class="vault-icon" style="color: ${goal.color}; background: ${goal.color}20;">
              <i class="fa-solid ${goal.icon}"></i>
            </div>
            <button class="chip-btn deposit-goal-btn" data-id="${goal.id}" data-name="${goal.name}">
              <i class="fa-solid fa-plus"></i> Deposit
            </button>
          </div>
          <div>
            <h4 style="font-size: 16px; font-weight: 700;">${goal.name}</h4>
            <span style="font-size: 12px; color: var(--text-tertiary);">${goal.category} Vault</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${percent}%; background: ${goal.color};"></div>
          </div>
          <div class="vault-stats">
            <span style="font-weight: 700; color: var(--text-primary);" class="${privacyMode ? 'privacy-hidden' : ''}">${formatCurrency(goal.current)}</span>
            <span style="color: var(--text-tertiary);">${percent}% of ${privacyMode ? '••••' : '$' + goal.target.toLocaleString()}</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach deposit button listeners
    grid.querySelectorAll('.deposit-goal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const goalId = btn.getAttribute('data-id');
        const goalName = btn.getAttribute('data-name');
        openDepositModal(goalId, goalName);
      });
    });
  }

  // 6. Bills & Subscriptions Grid
  function renderBills() {
    const grid = document.getElementById('billsGrid');
    if (!grid) return;

    grid.innerHTML = bankData.bills.map(bill => `
      <div class="vault-card">
        <div class="vault-header">
          <div class="vault-icon" style="color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12);">
            <i class="fa-solid ${bill.icon}"></i>
          </div>
          <button class="btn-primary pay-bill-btn" data-id="${bill.id}" style="padding: 6px 14px; font-size: 12px;">
            Pay ${formatCurrency(bill.amount)}
          </button>
        </div>
        <div>
          <h4 style="font-size: 15px; font-weight: 700;">${bill.name}</h4>
          <p style="font-size: 12px; color: var(--text-secondary);">Due Date: ${bill.dueDate}</p>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; border-top: 1px solid var(--border-glass); padding-top: 12px;">
          <span style="color: var(--text-tertiary);">Auto-Pay</span>
          <span style="font-weight: 700; color: ${bill.autoPay ? 'var(--accent-emerald)' : 'var(--text-tertiary)'};">
            ${bill.autoPay ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.pay-bill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const billId = btn.getAttribute('data-id');
        bankData = StorageManager.payBill(billId);
        renderAll();
        showToast('Bill payment processed successfully!', 'success');
        if (window.confetti) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
      });
    });
  }

  // 7. Interactive Analytics Charts with Chart.js
  function renderCharts() {
    const isDark = activeTheme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    // Line / Bar Chart for Cashflow
    const cashflowCanvas = document.getElementById('cashflowChart');
    if (cashflowCanvas) {
      const ctx = cashflowCanvas.getContext('2d');
      if (cashflowChartInstance) cashflowChartInstance.destroy();

      const labels = bankData.analytics.monthlySpending.map(item => item.month);
      const dataValues = bankData.analytics.monthlySpending.map(item => item.amount);

      const gradient = ctx.createLinearGradient(0, 0, 0, 260);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

      cashflowChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Cash Outflow ($)',
            data: dataValues,
            borderColor: '#6366f1',
            borderWidth: 3,
            fill: true,
            backgroundColor: gradient,
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#101624' : '#ffffff',
              titleColor: isDark ? '#ffffff' : '#0f172a',
              bodyColor: isDark ? '#94a3b8' : '#475569',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              borderWidth: 1,
              padding: 12
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
            }
          }
        }
      });
    }

    // Category Doughnut Chart
    const catCanvas = document.getElementById('categoryDoughnutChart');
    if (catCanvas) {
      const ctx = catCanvas.getContext('2d');
      if (categoryChartInstance) categoryChartInstance.destroy();

      categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: bankData.analytics.categories.map(c => c.name),
          datasets: [{
            data: bankData.analytics.categories.map(c => c.percentage),
            backgroundColor: bankData.analytics.categories.map(c => c.color),
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                font: { family: 'Plus Jakarta Sans', size: 11 },
                usePointStyle: true,
                padding: 14
              }
            }
          },
          cutout: '72%'
        }
      });
    }
  }

  /* ==========================================================================
     Event Handlers & Interactivity
     ========================================================================== */
  function setupEventListeners() {
    // Theme Toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

    // Privacy Toggle
    document.getElementById('privacyToggleBtn')?.addEventListener('click', togglePrivacyMode);

    // Mobile Sidebar Navigation Toggle
    document.getElementById('mobileNavToggle')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('mobile-open');
    });

    // Sidebar Tab Clicking
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('sidebar')?.classList.remove('mobile-open');
      });
    });

    // 3D Card Flip
    const creditCard3D = document.getElementById('creditCard3D');
    creditCard3D?.addEventListener('click', () => {
      creditCard3D.classList.toggle('flipped');
    });

    // Card Selection Chips (Obsidian / Sapphire)
    document.getElementById('cardSelectBlack')?.addEventListener('click', () => {
      activeCardId = 'card_black';
      document.getElementById('cardSelectBlack').classList.add('active');
      document.getElementById('cardSelectSapphire').classList.remove('active');
      renderCards();
    });

    document.getElementById('cardSelectSapphire')?.addEventListener('click', () => {
      activeCardId = 'card_sapphire';
      document.getElementById('cardSelectSapphire').classList.add('active');
      document.getElementById('cardSelectBlack').classList.remove('active');
      renderCards();
    });

    // Freeze Card Toggle
    document.getElementById('freezeCardToggle')?.addEventListener('change', (e) => {
      bankData = StorageManager.toggleCardFreeze(activeCardId);
      const isFrozen = e.target.checked;
      showToast(isFrozen ? 'Card frozen successfully' : 'Card unfrozen', isFrozen ? 'warning' : 'success');
    });

    // Copy Card Number to Clipboard
    document.getElementById('copyCardNoBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = bankData.cards.find(c => c.id === activeCardId);
      if (card) {
        navigator.clipboard.writeText(card.number.replace(/\s+/g, ''));
        showToast('Card number copied to clipboard!', 'success');
      }
    });

    // Quick Transfer Amount Chips
    document.querySelectorAll('.quick-amt').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-val');
        const input = document.getElementById('quickAmountInput');
        if (input) input.value = val;
      });
    });

    // Quick Transfer Form Submit
    document.getElementById('quickTransferForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const amountInput = document.getElementById('quickAmountInput');
      const amount = parseFloat(amountInput.value);
      const contact = bankData.contacts.find(c => c.id === selectedContactId) || bankData.contacts[0];

      if (!amount || amount <= 0) {
        showToast('Please enter a valid transfer amount', 'warning');
        return;
      }

      // Process Transfer
      const tx = {
        title: `Transfer to ${contact.name}`,
        category: 'Transfers',
        type: 'debit',
        amount: amount,
        vendorLogo: 'fa-paper-plane',
        status: 'completed',
        account: 'Checking Account',
        notes: `Instant P2P Transfer to ${contact.email}`
      };

      bankData = StorageManager.addTransaction(tx);
      amountInput.value = '';
      renderAll();

      showReceiptModal(tx.id, contact.name, amount);
    });

    // Send Money Modal Trigger
    document.getElementById('openSendMoneyModalBtn')?.addEventListener('click', () => {
      document.getElementById('transferModal')?.classList.add('active');
    });

    document.getElementById('closeTransferModal')?.addEventListener('click', () => {
      document.getElementById('transferModal')?.classList.remove('active');
    });

    // Modal Send Form Submit
    document.getElementById('modalTransferForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const recipient = document.getElementById('modalRecipient').value;
      const amount = parseFloat(document.getElementById('modalAmount').value);
      const notes = document.getElementById('modalNotes').value;

      const tx = {
        title: `Transfer to ${recipient}`,
        category: 'Transfers',
        type: 'debit',
        amount: amount,
        vendorLogo: 'fa-paper-plane',
        status: 'completed',
        account: 'Checking Account',
        notes: notes || 'Instant Wire Transfer'
      };

      bankData = StorageManager.addTransaction(tx);
      document.getElementById('transferModal')?.classList.remove('active');
      document.getElementById('modalTransferForm').reset();
      renderAll();

      showReceiptModal(tx.id, recipient, amount);
    });

    // Deposit Goal Modal Listeners
    document.getElementById('closeDepositModal')?.addEventListener('click', () => {
      document.getElementById('depositModal')?.classList.remove('active');
    });

    document.getElementById('modalDepositForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const goalId = document.getElementById('depositGoalId').value;
      const amount = parseFloat(document.getElementById('depositAmount').value);

      bankData = StorageManager.depositToGoal(goalId, amount);
      document.getElementById('depositModal')?.classList.remove('active');
      document.getElementById('modalDepositForm').reset();
      renderAll();

      showToast(`Deposited ${formatCurrency(amount)} into vault!`, 'success');
      if (window.confetti) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    });

    // Close Receipt Modal
    document.getElementById('closeReceiptBtn')?.addEventListener('click', () => {
      document.getElementById('receiptModal')?.classList.remove('active');
    });

    // Category Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-cat');
        renderTransactions();
      });
    });

    // Global Search Input
    document.getElementById('globalSearchInput')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTransactions();
    });
  }

  function openDepositModal(goalId, goalName) {
    const modal = document.getElementById('depositModal');
    document.getElementById('depositGoalId').value = goalId;
    document.getElementById('depositGoalName').textContent = `Allocating funds to: ${goalName}`;
    modal?.classList.add('active');
  }

  function showReceiptModal(txId, recipient, amount) {
    document.getElementById('receiptTxId').textContent = txId;
    document.getElementById('receiptRecipient').textContent = recipient;
    document.getElementById('receiptAmount').textContent = formatCurrency(amount);
    document.getElementById('receiptDate').textContent = new Date().toLocaleString();
    document.getElementById('receiptModal')?.classList.add('active');

    if (window.confetti) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  }

  /* ==========================================================================
     Toast System
     ========================================================================== */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
