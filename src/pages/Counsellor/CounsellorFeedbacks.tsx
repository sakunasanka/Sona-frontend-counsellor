import React, { useState } from 'react';
import { Star, Heart, MessageCircle, Send, MoreHorizontal, ThumbsUp, Clock } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';

interface Feedback {
  id: number;
  name: string;
  status: string;
  timeAgo: string;
  rating: number;
  pic_src: string;
  content: string;
  reply?: {
    name: string;
    message: string;
  };
  likes?: number;
  isLiked?: boolean;
}

interface StarRatingProps {
  rating: number;
}

interface FeedbackCardProps {
  feedback: Feedback;
  onReply: (feedbackId: number, message: string) => void;
  onLike: (feedbackId: number) => void;
}

const CounsellorFeedbacks: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      name: "Samiru Nuwanaka",
      status: "Student",
      timeAgo: "2 hours ago",
      rating: 4,
      pic_src: "/assets/images/student-photo.png",
      content: `Today i visited my favourite ramen shop which is "Ichiraku Ramen" Like always i forgot to bought money 😅😅

Old man Teuchi just laughed and said, "You again?" Luckily, he let me eat on credit—again 😭. I got my usual miso pork with extra toppings, and man, it hit the spot! 😋

Sometimes, little comforts like this help me keep going. 🍜`,
      reply: {
        name: "Dr. Hiruni Chandradasa",
        message: "Thanks Samiru! It means a lot"
      },
      likes: 12,
      isLiked: false
    },
    {
      id: 2,
      name: "Nadun Piyadasa",
      status: "User",
      timeAgo: "3 hours ago",
      rating: 5,
      pic_src: "/assets/images/student-photo.png",
      content: `Today i visited my favourite ramen shop which is "Ichiraku Ramen" Like always i forgot to bought money 😅😅

Old man Teuchi just laughed and said, "You again?" Luckily, he let me eat on credit—again 😭. I got my usual miso pork with extra toppings, and man, it hit the spot! 😋`,
      likes: 8,
      isLiked: true
    },
    {
      id: 3,
      name: "Sandun Karunarathne",
      status: "User",
      timeAgo: "2 days ago",
      rating: 3,
      pic_src: "/assets/images/student-photo.png",
      content: `Today i visited my favourite ramen shop which is "Ichiraku Ramen" Like always i forgot to bought money 😅😅

Old man Teuchi just laughed and said, "You again?" Luckily, he let me eat on credit—again 😭. I got my usual miso pork with extra toppings, and man, it hit the spot! 😋`,
      likes: 3,
      isLiked: false
    },
    {
      id: 4,
      name: "Piyath Perera",
      status: "Student",
      timeAgo: "1 hour ago",
      rating: 5,
      pic_src: "/assets/images/student-photo.png",
      content: `Excellent counseling session! Dr. Hiruni really helped me work through my anxiety and gave me practical tools to manage stress. Highly recommend!`,
      likes: 15,
      isLiked: false
    },
    {
      id: 5,
      name: "Sameera Nanayakkara",
      status: "User",
      timeAgo: "5 hours ago",
      rating: 5,
      pic_src: "/assets/images/student-photo.png",
      content: `Amazing experience! The counselor was very understanding and provided great insights. Feel much better after our session.`,
      likes: 9,
      isLiked: true
    },
    {
      id: 6,
      name: "Kavindu Suranga",
      status: "Student", 
      timeAgo: "1 day ago",
      rating: 4,
      pic_src: "/assets/images/student-photo.png",
      content: `Good session overall. The counselor was professional and helpful. Would like to schedule follow-up sessions.`,
      likes: 6,
      isLiked: false
    }
  ]);

  const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-[#FFB1A7] text-[#FFB1A7]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onReply, onLike }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = () => {
      if (replyText.trim()) {
        onReply(feedback.id, replyText.trim());
        setReplyText('');
        setShowReplyInput(false);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleReplySubmit();
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        {/* Main feedback content */}
        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img src={feedback.pic_src} alt={feedback.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{feedback.name}</h3>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {feedback.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs md:text-sm">{feedback.timeAgo}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StarRating rating={feedback.rating} />
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-4">
            {feedback.content}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 py-2 border-b border-gray-100">
            <button 
              onClick={() => onLike(feedback.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-gray-50 ${
                feedback.isLiked ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${feedback.isLiked ? 'fill-current' : ''}`} />
              {feedback.likes || 0}
            </button>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>
          </div>
        </div>

        {/* Existing reply display */}
        {feedback.reply && (
          <div className="px-4 md:px-6 pb-4">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border-l-4 border-pink-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="/assets/images/profile-photo.png" 
                    alt={feedback.reply.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{feedback.reply.name}</span>
                    <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      Counsellor
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feedback.reply.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reply input */}
        {showReplyInput && (
          <div className="px-4 md:px-6 pb-4">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="/assets/images/profile-photo.png" 
                    alt="Your profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a thoughtful response..."
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Press Enter to send, Shift+Enter for new line
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowReplyInput(false);
                          setReplyText('');
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReplySubmit}
                        disabled={!replyText.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleReply = (feedbackId: number, message: string) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            reply: { 
              name: "Dr Sarina", 
              message 
            } 
          }
        : feedback
    ));
  };

  const handleLike = (feedbackId: number) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            isLiked: !feedback.isLiked,
            likes: (feedback.likes || 0) + (feedback.isLiked ? -1 : 1)
          }
        : feedback
    ));
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  // Calculate stats
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';
  const totalReviews = feedbacks.length;
  const pendingReplies = feedbacks.filter(feedback => !feedback.reply).length;

  // Filter feedbacks based on active filter
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (activeFilter === 'five-stars') return feedback.rating === 5;
    if (activeFilter === 'pending-reply') return !feedback.reply;
    if (activeFilter === 'recent') {
      // Consider recent as feedbacks from the last 24 hours
      const now = new Date();
      const feedbackTime = new Date();
      if (feedback.timeAgo.includes('hours')) {
        const hours = parseInt(feedback.timeAgo.match(/\d+/)?.[0] || '0');
        feedbackTime.setHours(now.getHours() - hours);
        return (now.getTime() - feedbackTime.getTime()) < 24 * 60 * 60 * 1000;
      }
      return false;
    }
    return true; // 'all' filter
  });

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
            
            {/* Main content */}
            <div className="flex-1 overflow-auto">
              <NavBar onMenuClick={toggleSidebar} />
              <div className="p-4 lg:p-6">
                {/* Page Title */}
                <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Feedbacks</h1>
                </div>

                {/* Stats Cards - Desktop Only */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                                <p className="text-gray-600 text-sm">Average Rating</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <ThumbsUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                                <p className="text-gray-600 text-sm">Total Reviews</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{pendingReplies}</p>
                                <p className="text-gray-600 text-sm">Pending Replies</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Filter Tabs - All Devices */}
                <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
                    <button 
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                            activeFilter === 'all' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        All Feedbacks
                    </button>
                    <button 
                        onClick={() => setActiveFilter('five-stars')}
                        className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                            activeFilter === 'five-stars' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        5 Stars
                    </button>
                    <button 
                        onClick={() => setActiveFilter('pending-reply')}
                        className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                            activeFilter === 'pending-reply' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Pending Reply
                    </button>
                    <button 
                        onClick={() => setActiveFilter('recent')}
                        className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                            activeFilter === 'recent' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Recent
                    </button>
                </div>

                {/* Feedback Cards */}
                <div className="space-y-4 lg:space-y-6">
                    {filteredFeedbacks.map((feedback) => (
                        <FeedbackCard 
                            key={feedback.id} 
                            feedback={feedback} 
                            onReply={handleReply}
                            onLike={handleLike}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredFeedbacks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <MessageCircle className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedbacks found</h3>
                        <p className="text-gray-600 mb-6">
                            {activeFilter === 'five-stars' && "No 5-star feedbacks yet."}
                            {activeFilter === 'pending-reply' && "No pending replies at the moment."}
                            {activeFilter === 'recent' && "No recent feedbacks found."}
                            {activeFilter === 'all' && "No feedbacks available yet."}
                        </p>
                    </div>
                )}

                {/* Load More Button */}
                {filteredFeedbacks.length > 0 && (
                    <div className="text-center mt-8">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                            Load More Feedbacks
                        </button>
                    </div>
                )}
              </div>  
            </div>
        </div>
    </div>
  )
}

export default CounsellorFeedbacks