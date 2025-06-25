import React, { useState } from 'react';
import { Star } from 'lucide-react';
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
}

interface StarRatingProps {
  rating: number;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

const CounsellorFeedbacks: React.FC = () => {
    const feedbacks: Feedback[] = [
    {
      id: 1,
      name: "Uzumaki Naruto",
      status: "Student",
      timeAgo: "2 hours ago",
      rating: 4,
      pic_src: "/assets/images/student-photo.png",
      content: `Today i visited my favourite ramen shop which is "Ichiraku Ramen" Like always i forgot to bought money 😅😅

Old man Teuchi just laughed and said, "You again?" Luckily, he let me eat on credit—again 😭. I got my usual miso pork with extra toppings, and man, it hit the spot! 😋

Sometimes, little comforts like this help me keep going. 🍜`,
      reply: {
        name: "Dr Sarina",
        message: "Thanks Naruto! It means a lot"
      }
    },
    {
      id: 2,
      name: "Naveen Osura",
      status: "User",
      timeAgo: "3 hours ago",
      rating: 5,
      pic_src: "/assets/images/student-photo.png",
      content: `Today i visited my favourite ramen shop which is "Ichiraku Ramen" Like always i forgot to bought money 😅😅

Old man Teuchi just laughed and said, "You again?" Luckily, he let me eat on credit—again 😭. I got my usual miso pork with extra toppings, and man, it hit the spot! 😋`
    },
    {
      id: 3,
      name: "Sandun Karunarathne",
      status: "User",
      timeAgo: "2 days ago",
      rating: 3,
      pic_src: "/assets/images/student-photo.png",
      content: `Today i visited my favourite ramen shop which is "Ichiraku Ramen" Like always i forgot to bought money 😅😅

Old man Teuchi just laughed and said, "You again?" Luckily, he let me eat on credit—again 😭. I got my usual miso pork with extra toppings, and man, it hit the spot! 😋`
    }
  ];

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

  const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          <img src={feedback.pic_src} alt={feedback.name} className="w-full h-full object-cover rounded-full" />
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
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
            Reply
          </button>
        </div>
      </div>
      
      <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-4">
        {feedback.content}
      </div>

      {feedback.reply && (
        <div className="bg-pink-50 rounded-xl p-3 md:p-4 border-l-4 border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/assets/images/profile-photo.png" 
                alt={feedback.reply.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-gray-900 text-sm">{feedback.reply.name}</span>
            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-xs font-medium">
              You
            </span>
          </div>
          <p className="text-gray-700 text-sm">{feedback.reply.message}</p>
        </div>
      )}
    </div>
  );

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
    const toggleSidebar = (): void => {
      setSidebarOpen(!sidebarOpen);
    };
  
    const closeSidebar = (): void => {
      setSidebarOpen(false);
    };
  
  return (
    <div className="flex flex-col h-screen">
        <NavBar onMenuClick={toggleSidebar} />
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Let the Sidebar component handle its own positioning */}
            <div className="hidden lg:block w-80 flex-shrink-0">
                <Sidebar isOpen={true} onClose={closeSidebar}/>
            </div>
            
            {/* Mobile Sidebar - Handled entirely by Sidebar component */}
            <div className="lg:hidden">
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
            </div>
            
            {/* Main content */}
            <div className="flex-1 overflow-auto p-4 lg:p-6">
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
                                <p className="text-2xl font-bold text-gray-900">4.8</p>
                                <p className="text-gray-600 text-sm">Average Rating</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <span className="text-green-600 font-bold text-lg">📝</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">127</p>
                                <p className="text-gray-600 text-sm">Total Reviews</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-lg">⏱️</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-gray-600 text-sm">Pending Replies</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs - Desktop Only */}
                <div className="hidden lg:flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-sm">
                        All Feedbacks
                    </button>
                    <button className="text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:text-gray-900 transition-colors">
                        5 Stars
                    </button>
                    <button className="text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:text-gray-900 transition-colors">
                        Pending Reply
                    </button>
                    <button className="text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:text-gray-900 transition-colors">
                        Recent
                    </button>
                </div>

                {/* Feedback Cards */}
                <div className="space-y-4 lg:space-y-6">
                    {feedbacks.map((feedback) => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-8">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                        Load More Feedbacks
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CounsellorFeedbacks