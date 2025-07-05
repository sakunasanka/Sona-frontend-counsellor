import React, { useState } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { 
  HandCoins, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users,
  MoreHorizontal,
  BarChart3
} from 'lucide-react';

interface Transaction {
  id: number;
  type: 'session' | 'bonus' | 'withdrawal' | 'refund';
  client: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  sessionType: string;
  duration?: number;
}

interface EarningsStats {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingAmount: number;
  totalSessions: number;
  avgPerSession: number;
}

const CounsellorEarnings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [filterType, setFilterType] = useState('all');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Sample data
  const stats: EarningsStats = {
    totalEarnings: 12500.00,
    thisMonth: 2800.00,
    lastMonth: 2400.00,
    pendingAmount: 450.00,
    totalSessions: 156,
    avgPerSession: 80.13
  };

  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'session',
      client: 'Anonymous User #1234',
      amount: 75.00,
      date: 'July 4, 2025',
      time: '2:30 PM',
      status: 'completed',
      sessionType: 'Individual Therapy',
      duration: 60
    },
    {
      id: 2,
      type: 'session',
      client: 'Sarah Johnson',
      amount: 90.00,
      date: 'July 3, 2025',
      time: '10:00 AM',
      status: 'completed',
      sessionType: 'Couple Therapy',
      duration: 90
    },
    {
      id: 3,
      type: 'bonus',
      client: 'Platform Bonus',
      amount: 50.00,
      date: 'July 2, 2025',
      time: '11:45 AM',
      status: 'completed',
      sessionType: 'Performance Bonus'
    },
    {
      id: 4,
      type: 'session',
      client: 'Anonymous User #5678',
      amount: 75.00,
      date: 'July 1, 2025',
      time: '4:15 PM',
      status: 'pending',
      sessionType: 'Individual Therapy',
      duration: 60
    },
    {
      id: 5,
      type: 'withdrawal',
      client: 'Bank Transfer',
      amount: -500.00,
      date: 'June 30, 2025',
      time: '9:00 AM',
      status: 'completed',
      sessionType: 'Withdrawal'
    }
  ];

  const monthlyData = [
    { month: 'Jan', earnings: 2100 },
    { month: 'Feb', earnings: 2300 },
    { month: 'Mar', earnings: 1900 },
    { month: 'Apr', earnings: 2700 },
    { month: 'May', earnings: 2400 },
    { month: 'Jun', earnings: 2600 },
    { month: 'Jul', earnings: 2800 }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <Users className="w-4 h-4" />;
      case 'bonus':
        return <TrendingUp className="w-4 h-4" />;
      case 'withdrawal':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'refund':
        return <ArrowUpRight className="w-4 h-4" />;
      default:
        return <HandCoins className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r hidden lg:block">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto lg:ml-0">
          <div className="p-6">
            <div className="min-h-[calc(100vh-8rem)] w-full bg-white rounded-xl shadow-sm">
              
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Earnings
                    </h1>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select 
                      value={selectedPeriod} 
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="last3Months">Last 3 Months</option>
                      <option value="thisYear">This Year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Earnings */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <HandCoins className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
                        <div className="text-2xl font-bold text-gray-900">Rs {stats.totalEarnings.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">+12.5%</span>
                      <span className="text-gray-500">from last month</span>
                    </div>
                  </div>

                  {/* This Month */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-buttonBlue-500/20 rounded-xl">
                        <Calendar className="w-6 h-6 text-buttonBlue-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">This Month</div>
                        <div className="text-2xl font-bold text-gray-900">Rs {stats.thisMonth.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">+16.7%</span>
                      <span className="text-gray-500">vs last month</span>
                    </div>
                  </div>

                  {/* Total Sessions */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-buttonGreen-500/20 rounded-xl">
                        <Users className="w-6 h-6 text-buttonGreen-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">35 this month</span>
                    </div>
                  </div>

                  {/* Average per Session */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-buttonOrange-500/20 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-buttonOrange-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Avg per Session</div>
                        <div className="text-2xl font-bold text-gray-900">Rs {stats.avgPerSession.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">+5.2%</span>
                      <span className="text-gray-500">improvement</span>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Monthly Earnings Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings</h3>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Last 7 months</span>
                      </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4">
                      {monthlyData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-primary/40 to-primary/30 rounded-t-lg mb-2 min-h-[20px] transition-all hover:from-primary/50 hover:to-primary/40"
                            style={{ height: `${(data.earnings / 3000) * 200}px` }}
                          ></div>
                          <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                          <span className="text-xs text-gray-400">Rs {data.earnings}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Payments */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                      <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                          Rs {stats.pendingAmount.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Awaiting payment processing
                        </p>
                        <div className="bg-yellow-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-sm text-yellow-700">
                            <Clock className="w-4 h-4" />
                            <span>Usually processed within 2-3 business days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                      <div className="flex items-center gap-3">
                        <select 
                          value={filterType} 
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="all">All Types</option>
                          <option value="session">Sessions</option>
                          <option value="bonus">Bonuses</option>
                          <option value="withdrawal">Withdrawals</option>
                          <option value="refund">Refunds</option>
                        </select>
                        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                          <Filter className="w-4 h-4" />
                          <span className="text-sm">Filter</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            transaction.type === 'session' ? 'bg-primary/10' :
                            transaction.type === 'bonus' ? 'bg-green-100' :
                            transaction.type === 'withdrawal' ? 'bg-red-100' :
                            'bg-gray-100'
                          }`}>
                            <div className={`${
                              transaction.type === 'session' ? 'text-primary' :
                              transaction.type === 'bonus' ? 'text-green-600' :
                              transaction.type === 'withdrawal' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {getTransactionIcon(transaction.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {transaction.client}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{transaction.sessionType}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{transaction.date}</span>
                              <span>{transaction.time}</span>
                              {transaction.duration && (
                                <span>{transaction.duration} mins</span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`text-lg font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}Rs {Math.abs(transaction.amount).toFixed(2)}
                            </div>
                          </div>

                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t border-gray-100 text-center">
                    <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                      View All Transactions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorEarnings;