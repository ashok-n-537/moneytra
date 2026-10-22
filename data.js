/**
 * Nexus Bank - Mock Data & Persistence Layer
 */

const INITIAL_DATA = {
  user: {
    name: "Ashok",
    email: "ashok@nexusbank.io",
    tier: "Nexus Platinum Member",
    accountNo: "NX-9482-7104-33",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  accounts: [
    {
      id: "acc_checking",
      type: "Checking Account",
      number: "•••• 4892",
      balance: 24850.40,
      currency: "USD",
      growth: "+14.2%",
      icon: "fa-wallet",
      primary: true
    },
    {
      id: "acc_savings",
      type: "High-Yield Savings",
      number: "•••• 9104",
      balance: 48200.00,
      currency: "USD",
      growth: "+4.8% APY",
      icon: "fa-piggy-bank",
      primary: false
    },
    {
      id: "acc_investment",
      type: "Portfolio Investment",
      number: "•••• 3318",
      balance: 112400.75,
      currency: "USD",
      growth: "+22.6%",
      icon: "fa-chart-line",
      primary: false
    },
    {
      id: "acc_crypto",
      type: "Crypto Vault",
      number: "•••• 8840",
      balance: 18650.20,
      currency: "USD",
      growth: "-2.1%",
      icon: "fa-coins",
      primary: false
    }
  ],
  cards: [
    {
      id: "card_black",
      name: "Nexus Obsidian Infinite",
      brand: "VISA",
      type: "Credit Card",
      number: "4921 8834 9102 4892",
      holder: "ASHOK",
      expiry: "08/28",
      cvv: "749",
      limit: 50000,
      spent: 12450,
      frozen: false,
      color: "gradient-obsidian",
      isPrimary: true
    },
    {
      id: "card_sapphire",
      name: "Nexus World Elite",
      brand: "MASTERCARD",
      type: "Debit Card",
      number: "5412 7701 3349 1920",
      holder: "ASHOK",
      expiry: "11/27",
      cvv: "312",
      limit: 25000,
      spent: 3890,
      frozen: false,
      color: "gradient-sapphire",
      isPrimary: false
    }
  ],
  contacts: [
    {
      id: "c1",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      email: "sarah.j@techmail.com",
      accountNo: "NX-8812-401",
      recent: true
    },
    {
      id: "c2",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      email: "alex.r@designhub.io",
      accountNo: "NX-4390-112",
      recent: true
    },
    {
      id: "c3",
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      email: "m.chen@quantum.org",
      accountNo: "NX-5514-902",
      recent: true
    },
    {
      id: "c4",
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      email: "emma.w@creatives.co",
      accountNo: "NX-9102-774",
      recent: true
    },
    {
      id: "c5",
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      email: "david.k@innovate.net",
      accountNo: "NX-1049-883",
      recent: false
    }
  ],
  transactions: [
    {
      id: "tx_101",
      title: "Apple Flagship Store",
      category: "Shopping",
      type: "debit",
      amount: 1299.00,
      date: "2026-09-12T14:32:00",
      vendorLogo: "fa-apple",
      status: "completed",
      account: "Checking Account",
      notes: "MacBook Air M3 Purchase"
    },
    {
      id: "tx_102",
      title: "Global Tech Corp Salary",
      category: "Income",
      type: "credit",
      amount: 8450.00,
      date: "2026-09-10T09:00:00",
      vendorLogo: "fa-briefcase",
      status: "completed",
      account: "Checking Account",
      notes: "Bi-weekly Payroll Deposit"
    },
    {
      id: "tx_103",
      title: "Stripe Creator Payout",
      category: "Income",
      type: "credit",
      amount: 2150.00,
      date: "2026-09-08T18:15:00",
      vendorLogo: "fa-stripe",
      status: "completed",
      account: "Checking Account",
      notes: "SaaS Subscription Revenue"
    },
    {
      id: "tx_104",
      title: "Uber Eats Gourmet",
      category: "Food & Dining",
      type: "debit",
      amount: 58.40,
      date: "2026-09-07T20:45:00",
      vendorLogo: "fa-utensils",
      status: "completed",
      account: "Checking Account",
      notes: "Dinner delivery with team"
    },
    {
      id: "tx_105",
      title: "Netflix Ultra HD",
      category: "Bills & Utilities",
      type: "debit",
      amount: 22.99,
      date: "2026-09-05T04:10:00",
      vendorLogo: "fa-film",
      status: "completed",
      account: "Checking Account",
      notes: "Monthly subscription"
    },
    {
      id: "tx_106",
      title: "Vanguard S&P 500 Index",
      category: "Investment",
      type: "debit",
      amount: 1500.00,
      date: "2026-09-01T10:00:00",
      vendorLogo: "fa-chart-pie",
      status: "completed",
      account: "Portfolio Investment",
      notes: "Automated Monthly SIP"
    },
    {
      id: "tx_107",
      title: "Starbucks Reserve",
      category: "Food & Dining",
      type: "debit",
      amount: 12.50,
      date: "2026-08-30T08:20:00",
      vendorLogo: "fa-mug-hot",
      status: "completed",
      account: "Checking Account",
      notes: "Morning Coffee"
    },
    {
      id: "tx_108",
      title: "Tesla Supercharger Station",
      category: "Transport",
      type: "debit",
      amount: 34.20,
      date: "2026-08-28T17:50:00",
      vendorLogo: "fa-bolt",
      status: "completed",
      account: "Checking Account",
      notes: "EV Charge 65kWh"
    },
    {
      id: "tx_109",
      title: "Transfer to Sarah Jenkins",
      category: "Transfers",
      type: "debit",
      amount: 350.00,
      date: "2026-08-25T11:30:00",
      vendorLogo: "fa-paper-plane",
      status: "completed",
      account: "Checking Account",
      notes: "Weekend Trip Share"
    }
  ],
  savingsGoals: [
    {
      id: "goal_house",
      name: "Dream Villa Deposit",
      target: 150000,
      current: 88500,
      category: "Real Estate",
      color: "#6366f1",
      icon: "fa-house-chimney"
    },
    {
      id: "goal_car",
      name: "Tesla Cybertruck",
      target: 65000,
      current: 48200,
      category: "Vehicle",
      color: "#06b6d4",
      icon: "fa-car-side"
    },
    {
      id: "goal_japan",
      name: "Kyoto Autumn Tour",
      target: 12000,
      current: 10400,
      category: "Travel",
      color: "#ec4899",
      icon: "fa-plane-departure"
    },
    {
      id: "goal_emergency",
      name: "Emergency Reserve",
      target: 30000,
      current: 25000,
      category: "Safety",
      color: "#10b981",
      icon: "fa-shield-halved"
    }
  ],
  bills: [
    {
      id: "bill_cloud",
      name: "AWS Cloud Infrastructure",
      amount: 145.00,
      dueDate: "2026-09-18",
      category: "Technology",
      autoPay: true,
      icon: "fa-cloud"
    },
    {
      id: "bill_gym",
      name: "Equinox Fitness Club",
      amount: 120.00,
      dueDate: "2026-09-22",
      category: "Health",
      autoPay: true,
      icon: "fa-dumbbell"
    },
    {
      id: "bill_power",
      name: "Metropolitan Electric",
      amount: 168.40,
      dueDate: "2026-09-25",
      category: "Utilities",
      autoPay: false,
      icon: "fa-plug"
    },
    {
      id: "bill_insurance",
      name: "Allianz Global Health",
      amount: 340.00,
      dueDate: "2026-10-01",
      category: "Insurance",
      autoPay: true,
      icon: "fa-file-contract"
    }
  ],
  analytics: {
    monthlySpending: [
      { month: "Apr", amount: 4200 },
      { month: "May", amount: 3800 },
      { month: "Jun", amount: 5100 },
      { month: "Jul", amount: 4600 },
      { month: "Aug", amount: 6200 },
      { month: "Sep", amount: 3422 }
    ],
    categories: [
      { name: "Shopping", percentage: 35, color: "#8b5cf6" },
      { name: "Investment", percentage: 25, color: "#10b981" },
      { name: "Food & Dining", percentage: 18, color: "#f59e0b" },
      { name: "Bills & Utilities", percentage: 12, color: "#3b82f6" },
      { name: "Transport", percentage: 10, color: "#ec4899" }
    ]
  }
};

class StorageManager {
  static STORAGE_KEY = "NEXUS_BANK_DATA_V1";

  static getData() {
    const dataStr = localStorage.getItem(this.STORAGE_KEY);
    if (!dataStr) {
      this.saveData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    try {
      return JSON.parse(dataStr);
    } catch (e) {
      console.error("Error parsing stored bank data", e);
      return INITIAL_DATA;
    }
  }

  static saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static addTransaction(tx) {
    const data = this.getData();
    tx.id = "tx_" + Date.now();
    tx.date = new Date().toISOString();
    data.transactions.unshift(tx);

    // Update checking account balance
    const checkingAcc = data.accounts.find(a => a.id === "acc_checking");
    if (checkingAcc) {
      if (tx.type === "debit") {
        checkingAcc.balance -= parseFloat(tx.amount);
      } else {
        checkingAcc.balance += parseFloat(tx.amount);
      }
    }

    // Update primary card spent if applicable
    if (tx.type === "debit") {
      const primaryCard = data.cards.find(c => c.isPrimary);
      if (primaryCard) {
        primaryCard.spent += parseFloat(tx.amount);
      }
    }

    this.saveData(data);
    return data;
  }

  static depositToGoal(goalId, amount) {
    const data = this.getData();
    const goal = data.savingsGoals.find(g => g.id === goalId);
    if (goal) {
      goal.current += parseFloat(amount);
      
      // Deduct from checking account
      const checkingAcc = data.accounts.find(a => a.id === "acc_checking");
      if (checkingAcc) {
        checkingAcc.balance -= parseFloat(amount);
      }

      // Add transaction record
      data.transactions.unshift({
        id: "tx_" + Date.now(),
        title: `Vault Deposit: ${goal.name}`,
        category: "Savings Goal",
        type: "debit",
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        vendorLogo: "fa-piggy-bank",
        status: "completed",
        account: "Checking Account",
        notes: `Direct allocation to ${goal.name}`
      });

      this.saveData(data);
    }
    return data;
  }

  static toggleCardFreeze(cardId) {
    const data = this.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (card) {
      card.frozen = !card.frozen;
      this.saveData(data);
    }
    return data;
  }

  static payBill(billId) {
    const data = this.getData();
    const bill = data.bills.find(b => b.id === billId);
    if (bill) {
      const checkingAcc = data.accounts.find(a => a.id === "acc_checking");
      if (checkingAcc) {
        checkingAcc.balance -= parseFloat(bill.amount);
      }

      data.transactions.unshift({
        id: "tx_" + Date.now(),
        title: `Bill Payment: ${bill.name}`,
        category: "Bills & Utilities",
        type: "debit",
        amount: parseFloat(bill.amount),
        date: new Date().toISOString(),
        vendorLogo: bill.icon || "fa-file-invoice-dollar",
        status: "completed",
        account: "Checking Account",
        notes: `Paid bill #${bill.id}`
      });

      this.saveData(data);
    }
    return data;
  }

  static resetData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }
}
