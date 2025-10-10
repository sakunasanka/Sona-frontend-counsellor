import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { 
  HandCoins, 
  TrendingUp, 
  Calendar, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { getEarningsSummary, getMonthlyEarnings, EarningsSummary, MonthlyEarning } from '../../api/counsellorAPI';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CounsellorEarnings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | number>(new Date().getFullYear());
  const chartRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryData, monthlyData] = await Promise.all([
          getEarningsSummary(),
          getMonthlyEarnings()
        ]);

        setEarningsSummary(summaryData);
        setMonthlyEarnings(monthlyData);
      } catch (err) {
        console.error('Error fetching earnings data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  // Get available years from the data
  const getAvailableYears = () => {
    const currentDate = new Date();
    const years = new Set<number>();
    
    monthlyEarnings.forEach((_, index) => {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
      years.add(monthDate.getFullYear());
    });
    
    return ['last12months', ...Array.from(years).sort((a, b) => b - a)]; // Most recent first
  };

  // Filter monthly earnings by selected year
  const getFilteredMonthlyEarnings = () => {
    const currentDate = new Date();
    
    if (selectedYear === 'last12months') {
      return monthlyEarnings.slice(0, 12)
        .map((earning, index) => {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
          return {
            ...earning,
            year: monthDate.getFullYear(),
            monthIndex: monthDate.getMonth()
          };
        })
        .sort((a, b) => a.monthIndex - b.monthIndex); // Sort by month index (Jan to Dec)
    }
    
    return monthlyEarnings
      .map((earning, index) => {
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
        return {
          ...earning,
          year: monthDate.getFullYear(),
          monthIndex: monthDate.getMonth()
        };
      })
      .filter(earning => earning.year === selectedYear)
      .sort((a, b) => a.monthIndex - b.monthIndex); // Sort by month index (Jan to Dec)
  };

  // Calculate percentage changes from API data
  const calculateMonthlyGrowth = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length < 2) return 0;
    // Sort by month index to ensure chronological order
    const sortedData = filteredData.sort((a, b) => a.monthIndex - b.monthIndex);
    const currentMonth = sortedData[sortedData.length - 1]; // Most recent month in the year
    const previousMonth = sortedData[sortedData.length - 2]; // Previous month in the year

    if (!previousMonth || previousMonth.earnings === 0) return 0;
    const growth = ((currentMonth.earnings - previousMonth.earnings) / previousMonth.earnings) * 100;
    return isNaN(growth) || !isFinite(growth) ? 0 : growth;
  };  const getCurrentMonthSessions = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length === 0) return 0;
    // Get the most recent month in the selected year
    const sortedData = filteredData.sort((a, b) => a.monthIndex - b.monthIndex);
    const currentMonth = sortedData[sortedData.length - 1];
    return currentMonth.sessions;
  };

  const calculateAvgSessionImprovement = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length < 2) return 0;
    
    const sortedData = filteredData.sort((a, b) => a.monthIndex - b.monthIndex);
    const currentMonth = sortedData[sortedData.length - 1]; // Most recent month in the year
    const previousMonths = sortedData.slice(0, -1); // All previous months in the year
    
    if (previousMonths.length === 0 || currentMonth.sessions === 0) return 0;
    
    const previousAvgEarnings = previousMonths.reduce((sum, month) => sum + month.earnings, 0) / previousMonths.length;
    const previousAvgSessions = previousMonths.reduce((sum, month) => sum + month.sessions, 0) / previousMonths.length;
    const previousAvgPerSession = previousAvgSessions > 0 ? previousAvgEarnings / previousAvgSessions : 0;
    
    const currentAvgPerSession = currentMonth.earnings / currentMonth.sessions;
    
    if (previousAvgPerSession === 0) return 0;
    const improvement = ((currentAvgPerSession - previousAvgPerSession) / previousAvgPerSession) * 100;
    return isNaN(improvement) || !isFinite(improvement) ? 0 : improvement;
  };

  const getMaxEarnings = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length === 0) return 3000;
    return Math.max(...filteredData.map(month => month.earnings));
  };

  const getBestMonth = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length === 0) return null;
    return filteredData.reduce((best, current) => 
      current.earnings > best.earnings ? current : best
    );
  };

  const getAverageMonthlySessions = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length === 0) return 0;
    const totalSessions = filteredData.reduce((sum, month) => sum + month.sessions, 0);
    return Math.round(totalSessions / filteredData.length);
  };

  const getSessionConsistency = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length < 2) return 0;
    const sessions = filteredData.map(month => month.sessions);
    const avg = sessions.reduce((sum, s) => sum + s, 0) / sessions.length;
    const variance = sessions.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / sessions.length;
    const stdDev = Math.sqrt(variance);
    // Return consistency score (lower std dev = more consistent = higher score)
    return Math.max(0, 100 - (stdDev / avg) * 100);
  };

  const getMonthlyTrends = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length < 2) return [];
    const sortedData = filteredData.sort((a, b) => a.monthIndex - b.monthIndex);
    const trends = [];
    // Since data is sorted by month index, we can calculate trends month over month
    for (let i = 1; i < sortedData.length; i++) {
      const current = sortedData[i]; // Current month
      const previous = sortedData[i - 1]; // Previous month
      const earningsGrowth = previous.earnings > 0 ? ((current.earnings - previous.earnings) / previous.earnings) * 100 : 0;
      const sessionGrowth = previous.sessions > 0 ? ((current.sessions - previous.sessions) / previous.sessions) * 100 : 0;
      trends.push({
        month: current.month, // The month we're showing growth for
        year: current.year,
        earningsGrowth: isNaN(earningsGrowth) ? 0 : earningsGrowth,
        sessionGrowth: isNaN(sessionGrowth) ? 0 : sessionGrowth,
        earningsPerSession: current.sessions > 0 ? current.earnings / current.sessions : 0
      });
    }
    return trends;
  };

  const getPeakAnalysis = () => {
    const filteredData = getFilteredMonthlyEarnings();
    if (!filteredData || filteredData.length === 0) return null;
    const maxEarningsMonth = filteredData.reduce((max, month) => month.earnings > max.earnings ? month : max);
    const maxSessionsMonth = filteredData.reduce((max, month) => month.sessions > max.sessions ? month : max);
    return {
      highestEarningMonth: maxEarningsMonth,
      highestSessionMonth: maxSessionsMonth,
      avgEarningsPerMonth: filteredData.reduce((sum, month) => sum + month.earnings, 0) / filteredData.length,
      avgSessionsPerMonth: filteredData.reduce((sum, month) => sum + month.sessions, 0) / filteredData.length
    };
  };

  // Generate PDF Report
  const generateReport = async () => {
    if (!earningsSummary || !monthlyEarnings.length) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Earnings Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Summary Statistics
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Summary Statistics', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      const stats = [
        `Total Earnings: ${formatCurrency(earningsSummary.totalEarnings)}`,
        `This Month: ${formatCurrency(earningsSummary.thisMonth)}`,
        `Total Sessions: ${earningsSummary.totalSessions}`,
        `Average per Session: ${formatCurrency(earningsSummary.avgPerSession)}`,
        `Monthly Growth: ${formatPercentage(monthlyGrowth)}`,
        `Session Improvement: ${formatPercentage(avgSessionImprovement)}`
      ];

      stats.forEach(stat => {
        pdf.text(stat, 25, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Monthly Performance
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.text('Monthly Performance', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      const performance = [
        `Best Month: ${bestMonth ? `${bestMonth.month} (Rs ${bestMonth.earnings.toLocaleString()})` : 'N/A'}`,
        `Average Monthly Sessions: ${avgMonthlySessions}`,
        `Session Consistency: ${sessionConsistency.toFixed(1)}%`,
        `Active Months: ${monthlyEarnings.length}`
      ];

      performance.forEach(item => {
        pdf.text(item, 25, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Monthly Earnings Table
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      const periodTitle = selectedYear === 'last12months' ? 'Last 12 Months' : selectedYear.toString();
      pdf.text(`Monthly Earnings Breakdown (${periodTitle})`, 20, yPosition);
      yPosition += 15;

      // Table headers
      pdf.setFontSize(11);
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
      pdf.text('Month', 25, yPosition + 2);
      pdf.text('Earnings', 80, yPosition + 2);
      pdf.text('Sessions', 130, yPosition + 2);
      pdf.text('Avg/Session', 160, yPosition + 2);
      yPosition += 15;

      // Table data - Show data for selected year
      const filteredData = getFilteredMonthlyEarnings();
      const sortedFilteredData = filteredData.sort((a, b) => a.monthIndex - b.monthIndex);
      
      sortedFilteredData.forEach((month) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(month.month, 25, yPosition);
        pdf.text(formatCurrency(month.earnings), 80, yPosition);
        pdf.text(month.sessions.toString(), 130, yPosition);
        pdf.text(formatCurrency(month.earnings / month.sessions), 160, yPosition);
        yPosition += 10;
      });

      // Capture chart as image
      if (chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          
          // Estimate space needed for chart (title + some padding + image)
          const estimatedChartHeight = 60; // Title + padding
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const totalChartHeight = Math.min(imgHeight, pageHeight - 40) + estimatedChartHeight;
          
          // Check if we need a new page
          if (yPosition + totalChartHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(16);
          const chartTitle = selectedYear === 'last12months' ? 'Last 12 Months' : selectedYear.toString();
          pdf.text(`Earnings Chart (${chartTitle})`, 20, yPosition);
          yPosition += 15;
          
          if (imgHeight > pageHeight - yPosition - 20) {
            // Scale down if too tall
            const scale = (pageHeight - yPosition - 20) / imgHeight;
            pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth * scale, imgHeight * scale);
          } else {
            pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          }
        } catch (chartError) {
          console.warn('Could not capture chart for PDF:', chartError);
        }
      }

      // Save the PDF
      const fileName = `earnings-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getPercentageColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPercentageIcon = (value: number) => {
    return value >= 0 ? 
      <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" /> : 
      <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4 text-red-500" />
  };

  const monthlyGrowth = calculateMonthlyGrowth();
  const currentMonthSessions = getCurrentMonthSessions();
  const avgSessionImprovement = calculateAvgSessionImprovement();
  const maxEarnings = getMaxEarnings();
  const bestMonth = getBestMonth();
  const avgMonthlySessions = getAverageMonthlySessions();
  const sessionConsistency = getSessionConsistency();
  const monthlyTrends = getMonthlyTrends();
  const peakAnalysis = getPeakAnalysis();

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading earnings data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-4">Error loading earnings data</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!earningsSummary) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="p-4 lg:p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-600">No earnings data available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Let the Sidebar component handle its own positioning */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          <div className="p-4 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Your Earnings
                </h1>
              </div>
              <div className="flex flex-row gap-3">
                <button onClick={generateReport} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm sm:text-base">
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {/* Total Earnings */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 lg:p-3 bg-primary/20 rounded-lg lg:rounded-xl">
                    <HandCoins className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs lg:text-sm text-gray-600 mb-1">Total Earnings</div>
                    <div className="text-sm lg:text-2xl font-bold text-gray-900">{formatCurrency(earningsSummary.totalEarnings)}</div>
                  </div>
                </div>
                {/* <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                  {getPercentageIcon(monthlyGrowth)}
                  <span className={`font-medium ${getPercentageColor(monthlyGrowth)}`}>{formatPercentage(monthlyGrowth)}</span>
                  <span className="text-gray-500 hidden sm:inline">from last month</span>
                </div> */}
              </div>

              {/* This Month */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 lg:p-3 bg-buttonBlue-500/20 rounded-lg lg:rounded-xl">
                    <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-buttonBlue-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs lg:text-sm text-gray-600 mb-1">This Month</div>
                    <div className="text-sm lg:text-2xl font-bold text-gray-900">{formatCurrency(earningsSummary.thisMonth)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                  {getPercentageIcon(monthlyGrowth)}
                  <span className={`font-medium ${getPercentageColor(monthlyGrowth)}`}>{formatPercentage(monthlyGrowth)}</span>
                  <span className="text-gray-500 hidden sm:inline">vs last month</span>
                </div>
              </div>

              {/* Total Sessions */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 lg:p-3 bg-buttonGreen-500/20 rounded-lg lg:rounded-xl">
                    <Users className="w-4 h-4 lg:w-6 lg:h-6 text-buttonGreen-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs lg:text-sm text-gray-600 mb-1">Total Sessions</div>
                    <div className="text-sm lg:text-2xl font-bold text-gray-900">{earningsSummary.totalSessions}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                  <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                  <span className="text-green-600 font-medium">{currentMonthSessions} this month</span>
                </div>
              </div>

              {/* Average per Session */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 lg:p-3 bg-buttonOrange-500/20 rounded-lg lg:rounded-xl">
                    <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-buttonOrange-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs lg:text-sm text-gray-600 mb-1">Avg per Session</div>
                    <div className="text-sm lg:text-2xl font-bold text-gray-900">{formatCurrency(earningsSummary.avgPerSession)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                  {getPercentageIcon(avgSessionImprovement)}
                  <span className={`font-medium ${getPercentageColor(avgSessionImprovement)}`}>{formatPercentage(avgSessionImprovement)}</span>
                  <span className="text-gray-500 hidden sm:inline">improvement</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-6 mb-8">
              {/* Main Chart and Performance Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Earnings Chart - Takes 2/3 width */}
                <div ref={chartRef} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Monthly Earnings Overview
                    </h3>
                    <div className="flex items-center gap-3">
                      <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value === 'last12months' ? 'last12months' : parseInt(e.target.value))}
                        className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      >
                        {getAvailableYears().map(year => (
                          <option key={year} value={year}>
                            {year === 'last12months' ? 'Last 12 Months' : year}
                          </option>
                        ))}
                      </select>
                      {/* <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {selectedYear === 'last12months' ? 'Last 12 months' : selectedYear}
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div className="h-80 flex items-end justify-between gap-4 mb-6">
                    {(() => {
                      const filteredData = getFilteredMonthlyEarnings();
                      const sortedData = filteredData.sort((a, b) => a.monthIndex - b.monthIndex);
                      
                      if (sortedData.length === 0) {
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">
                                No earnings data for {selectedYear === 'last12months' ? 'the last 12 months' : selectedYear}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      
                      return sortedData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-primary/40 to-primary/30 rounded-t-lg mb-2 min-h-[20px] transition-all hover:from-primary/50 hover:to-primary/40 cursor-pointer"
                            style={{ height: `${(data.earnings / Math.max(maxEarnings, 1)) * 250}px` }}
                            title={`Rs ${data.earnings.toLocaleString()} from ${data.sessions} sessions`}
                          ></div>
                          <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                          <span className="text-xs text-gray-400">{formatCurrency(data.earnings)}</span>
                          <span className="text-xs text-blue-500">{data.sessions} sessions</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Monthly Performance - Takes 1/3 width */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-4">
                    {/* Best Month */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Best Month</p>
                          <p className="text-xs text-gray-500">
                            {bestMonth ? `${bestMonth.month} ${bestMonth.year || selectedYear}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(bestMonth ? bestMonth.earnings : 0)}</p>
                      </div>
                    </div>

                    {/* Average Monthly Sessions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Avg Monthly Sessions</p>
                          <p className="text-xs text-gray-500">Per month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{avgMonthlySessions}</p>
                      </div>
                    </div>

                    {/* Session Consistency */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Session Consistency</p>
                          <p className="text-xs text-gray-500">Regularity score</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{sessionConsistency.toFixed(0)}%</p>
                      </div>
                    </div>

                    {/* Active Months */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Active Months</p>
                          <p className="text-xs text-gray-500">
                            {selectedYear === 'last12months' ? 'Last 12 months' : `In ${selectedYear}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{getFilteredMonthlyEarnings().length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Analytics Below */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Session Trends */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Session Trends</h3>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="space-y-4">
                    {monthlyTrends.length > 0 ? (
                      monthlyTrends.slice(-3).map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {trend.month} {trend.year || selectedYear}
                            </p>
                            <p className="text-xs text-gray-500">vs previous month</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {getPercentageIcon(trend.sessionGrowth)}
                              <span className={`text-sm font-medium ${getPercentageColor(trend.sessionGrowth)}`}>
                                {formatPercentage(trend.sessionGrowth)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">sessions</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Not enough data for trends</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Earnings Analysis */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Earnings Analysis</h3>
                    <HandCoins className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-4">
                    {/* Average Earnings per Month */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <HandCoins className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Avg Monthly Earnings</p>
                          <p className="text-xs text-gray-500">Across all months</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(peakAnalysis ? peakAnalysis.avgEarningsPerMonth : 0)}
                        </p>
                      </div>
                    </div>

                    {/* Peak Session Month */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Users className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Peak Session Month</p>
                          <p className="text-xs text-gray-500">
                            {peakAnalysis?.highestSessionMonth ? 
                              `${peakAnalysis.highestSessionMonth.month} ${peakAnalysis.highestSessionMonth.year || selectedYear}` : 
                              'N/A'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {peakAnalysis?.highestSessionMonth?.sessions || 0} sessions
                        </p>
                      </div>
                    </div>

                    {/* Earnings per Session Trend */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Avg Rate per Session</p>
                          <p className="text-xs text-gray-500">Current month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(earningsSummary.avgPerSession)}
                        </p>
                      </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Monthly Growth</p>
                          <p className="text-xs text-gray-500">Latest trend</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {getPercentageIcon(monthlyGrowth)}
                          <span className={`text-sm font-medium ${getPercentageColor(monthlyGrowth)}`}>
                            {formatPercentage(monthlyGrowth)}
                          </span>
                        </div>
                      </div>
                    </div>
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