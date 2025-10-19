import React, { useRef } from 'react';
import { 
  FileDown, 
  Calendar, 
  Clock, 
  Star,
  Brain, 
  BarChart3,
  Users,
  Activity,
  Target,
  Award,
  AlertTriangle,
  Shield,
  X,
  Printer
} from 'lucide-react';
import { PieChart, BarChart, DonutChart, ColumnChart } from '../../../components/charts';

interface ClientReportProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: {
    name?: string;
    nickname?: string;
    anonymous: boolean;
    status?: string;
    joinDate?: string;
    concerns?: string[];
    sessionCount?: number;
    totalEarnings?: number;
  };
  reportData: {
    startDate: string;
    endDate: string;
    sessions: any[];
    moodAnalysis?: any;
    phq9Analysis?: any;
  };
}

const ClientReport: React.FC<ClientReportProps> = ({
  isOpen,
  onClose,
  clientData,
  reportData
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const clientName = clientData.anonymous 
    ? (clientData.nickname || 'Anonymous Client')
    : (clientData.name || 'Client');

  // Calculate statistics
  const { sessions, moodAnalysis, phq9Analysis } = reportData;
  const completedSessions = sessions.filter(s => s.status === 'completed' || s.status === 'scheduled').length;
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 50), 0);
  const ratingsOnly = sessions.filter(s => s.rating && s.rating > 0);
  const avgRating = ratingsOnly.length > 0 ? 
    (ratingsOnly.reduce((sum, s) => sum + s.rating, 0) / ratingsOnly.length) : 0;

  // Prepare chart data
  const sessionStatusData = [
    { name: 'Completed', value: sessions.filter(s => s.status === 'completed').length, color: '#10B981' },
    { name: 'Scheduled', value: sessions.filter(s => s.status === 'scheduled').length, color: '#3B82F6' },
    { name: 'Cancelled', value: sessions.filter(s => s.status === 'cancelled').length, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const ratingDistribution = [
    { rating: '5 Stars', count: sessions.filter(s => s.rating === 5).length },
    { rating: '4 Stars', count: sessions.filter(s => s.rating === 4).length },
    { rating: '3 Stars', count: sessions.filter(s => s.rating === 3).length },
    { rating: '2 Stars', count: sessions.filter(s => s.rating === 2).length },
    { rating: '1 Star', count: sessions.filter(s => s.rating === 1).length },
  ].filter(item => item.count > 0);

  const moodDistributionData = moodAnalysis ? Object.entries(moodAnalysis.moodDistribution).map(([mood, count]) => ({
    name: mood.replace('very_', 'Very ').replace('_', ' ').split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: count as number,
    color: {
      'Very Sad': '#FEE2E2',
      'Sad': '#FED7AA', 
      'Neutral': '#FEF3C7',
      'Happy': '#D1FAE5',
      'Very Happy': '#DCFCE7'
    }[mood.replace('very_', 'Very ').replace('_', ' ').split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' ')] || '#F3F4F6'
  })) : [];

  const phq9SeverityData = phq9Analysis ? Object.entries(phq9Analysis.severityDistribution).map(([severity, count]) => ({
    name: severity,
    value: count as number,
    color: {
      'Minimal': '#D1FAE5',
      'Mild': '#FEF3C7',
      'Moderate': '#FED7AA',
      'Moderately Severe': '#FECACA', 
      'Severe': '#FEE2E2'
    }[severity] || '#F3F4F6'
  })) : [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate downloadable report
    const element = reportRef.current;
    if (element) {
      const printContent = element.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
          ${printContent}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Client Progress Report</h2>
              <p className="text-gray-600">
                {clientName} • {new Date(reportData.startDate).toLocaleDateString()} - {new Date(reportData.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="p-8">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-900">{sessions.length}</p>
                  <p className="text-blue-700 text-sm">{completedSessions} completed</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-green-900">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-green-200 p-3 rounded-lg">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-1">Total Hours</p>
                  <p className="text-3xl font-bold text-purple-900">{Math.round(totalDuration / 60)}</p>
                  <p className="text-purple-700 text-sm">{totalDuration} minutes</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium mb-1">Mood Entries</p>
                  <p className="text-3xl font-bold text-amber-900">{moodAnalysis?.totalEntries || 0}</p>
                  <p className="text-amber-700 text-sm">Avg: {moodAnalysis?.averageMoodScore || 0}/5</p>
                </div>
                <div className="bg-amber-200 p-3 rounded-lg">
                  <Brain className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-indigo-600" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Client Name</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Client Since</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{clientData.joinDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  clientData.status === 'active' ? 'bg-green-100 text-green-800' :
                  clientData.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {clientData.status || 'Active'}
                </span>
              </div>
              {clientData.concerns && clientData.concerns.length > 0 && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm font-medium text-gray-500">Primary Concerns</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {clientData.concerns.map((concern, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Session Status Chart */}
            {sessionStatusData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
                  Session Status Distribution
                </h3>
                <div className="h-64">
                  <PieChart 
                    data={sessionStatusData}
                    showLegend={true}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {sessionStatusData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-600">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Ratings Chart */}
            {ratingDistribution.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Session Ratings Distribution
                </h3>
                <div className="h-64">
                  <BarChart 
                    data={ratingDistribution.map(item => ({ name: item.rating, value: item.count }))}
                    color="#F59E0B"
                  />
                </div>
              </div>
            )}

            {/* Mood Distribution Chart */}
            {moodDistributionData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-600" />
                  Mood Distribution
                </h3>
                <div className="h-64">
                  <DonutChart 
                    data={moodDistributionData}
                    showLegend={true}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Average Mood Score: <span className="font-semibold">{moodAnalysis?.averageMoodScore || 0}/5</span>
                  </p>
                </div>
              </div>
            )}

            {/* PHQ-9 Severity Chart */}
            {phq9SeverityData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-red-600" />
                  PHQ-9 Severity Distribution
                </h3>
                <div className="h-64">
                  <ColumnChart 
                    data={phq9SeverityData.map(item => ({ name: item.name, value: item.value }))}
                    color="#EF4444"
                  />
                </div>
                {phq9Analysis?.hasRiskIndicators && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-800 font-medium">Risk Indicators Detected</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This client has shown indicators requiring clinical attention.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sessions Detail Table */}
          {sessions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
                Session Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Topics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          {session.date || new Date(session.createdAt || session.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{session.duration || 50} min</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {session.status || 'completed'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {session.rating ? (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({session.rating}/5)</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">No rating</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {session.concerns ? (
                            Array.isArray(session.concerns) ? session.concerns.join(', ') : session.concerns
                          ) : session.type || 'General Session'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Treatment Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-indigo-600" />
              Treatment Summary
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                This comprehensive report covers the period from <strong>{new Date(reportData.startDate).toLocaleDateString()}</strong> to <strong>{new Date(reportData.endDate).toLocaleDateString()}</strong>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600">{completedSessions}</div>
                  <div className="text-sm text-gray-600">Sessions Completed</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{Math.round(totalDuration / 60)}</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{moodAnalysis?.totalEntries || 0}</div>
                  <div className="text-sm text-gray-600">Mood Entries</div>
                </div>
              </div>

              <p className="text-gray-700">
                During this period, the client demonstrated consistent engagement with the therapeutic process and showed commitment to addressing their therapeutic goals. The client participated actively in treatment planning and implementation.
              </p>
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <Shield className="w-6 h-6 text-gray-600 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">Confidentiality Notice</h4>
            </div>
            <p className="text-gray-700 text-sm mb-2">
              This report contains confidential information and is intended solely for professional use in the context of therapeutic care.
            </p>
            <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
              <p>Generated by: <strong>Sona Counselling System</strong></p>
              <p>Generated on: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientReport;