import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, PieChart, TrendingUp, TrendingDown, Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import StatCard from './components/StatCard';
import BudgetBar from './components/BudgetBar';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Need');
  const [type, setType] = useState('expense');

  useEffect(() => {
    const saved = localStorage.getItem('budgetTrackerData');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetTrackerData', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category: type === "income" ? "Income" : category,
      type,
      date: new Date().toLocaleDateString()
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setTransactions([]);
    }
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, c) => a + c.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((a, c) => a + c.amount, 0);
  const balance = totalIncome - totalExpenses;

  const needsSpent = transactions.filter(t => t.category === "Need").reduce((a, c) => a + c.amount, 0);
  const wantsSpent = transactions.filter(t => t.category === "Want").reduce((a, c) => a + c.amount, 0);
  const savingsSpent = transactions.filter(t => t.category === "Savings").reduce((a, c) => a + c.amount, 0);

  const targetNeeds = totalIncome * 0.5;
  const targetWants = totalIncome * 0.3;
  const targetSavings = totalIncome * 0.2;

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow border">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-7 h-7 text-blue-600" />
              Smart Budget Planner
            </h1>
            <p className="text-sm text-slate-500">Track flow & monitor the 50/30/20 rule</p>
          </div>

          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg">
            <RefreshCw size={16} />
            Reset Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard title="Total Income" amount={totalIncome} icon={<TrendingUp />} bg="bg-emerald-50" color="text-emerald-700" />
          <StatCard title="Total Expenses" amount={totalExpenses} icon={<TrendingDown />} bg="bg-rose-50" color="text-rose-700" />
          <StatCard title="Balance" amount={balance} icon={<DollarSign />} bg="bg-blue-50" color="text-blue-700" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT – Form + List */}
          <div className="lg:col-span-2 space-y-6">

            {/* Add Transaction */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-slate-400" />
                Add Transaction
              </h2>

              <form onSubmit={handleAddTransaction} className="space-y-4">

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="text-xs font-medium">Type</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button type="button" onClick={() => setType("expense")}
                        className={`flex-1 py-2 rounded-md ${type === "expense" ? "bg-white shadow text-rose-600" : ""}`}>
                        Expense
                      </button>
                      <button type="button" onClick={() => { setType("income"); setCategory("Income"); }}
                        className={`flex-1 py-2 rounded-md ${type === "income" ? "bg-white shadow text-emerald-600" : ""}`}>
                        Income
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs font-medium">Category</label>
                    <select 
                      disabled={type === "income"}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-2.5 w-full bg-slate-50 border rounded-lg"
                    >
                      <option value="Need">Needs</option>
                      <option value="Want">Wants</option>
                      <option value="Savings">Savings & Investments</option>
                    </select>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 bg-slate-50 border rounded-lg"
                  />

                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-3 bg-slate-50 border rounded-lg"
                  />
                </div>

                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold">
                  Add Transaction
                </button>

              </form>
            </div>

            {/* Transaction List */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h2 className="font-semibold mb-4">Recent Transactions</h2>

              {transactions.length === 0 ? (
                <p className="text-center text-slate-400 py-12">No transactions yet. Add income to start.</p>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-slate-50 p-4 mb-3 rounded-xl">
                    <div>
                      <p className="font-semibold">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                      </span>
                      <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* RIGHT – 50/30/20 */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow border sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-lg">50/30/20 Analysis</h2>
              </div>

              {totalIncome === 0 ? (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                  <AlertCircle className="inline w-5 h-5 mr-2" />
                  Add your income to see budget targets.
                </div>
              ) : (
                <>
                  <BudgetBar label="Needs (50%)" current={needsSpent} target={targetNeeds} color="bg-indigo-500" subtext="Rent, groceries, utilities" />
                  <BudgetBar label="Wants (30%)" current={wantsSpent} target={targetWants} color="bg-pink-500" subtext="Shopping, entertainment" />
                  <BudgetBar label="Savings (20%)" current={savingsSpent} target={targetSavings} color="bg-amber-500" subtext="Investments, emergency fund" isSavings />

                  <p className="text-xs text-center text-slate-500 mt-4">
                    Based on Total Income: <strong>${totalIncome.toLocaleString()}</strong>
                  </p>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
