import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Eye, MoreHorizontal, Calendar, Clock, Edit, Trash2, FileText, CheckCircle, PenTool } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';

interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  timeAgo: string;
  image: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  isLiked: boolean;
  isPublished: boolean;
}

interface BlogCardProps {
  blog: Blog;
  onLike: (blogId: number) => void;
  onEdit: (blogId: number) => void;
  onDelete: (blogId: number) => void;
  onShare: (blogId: number) => void;
}

const CounsellorBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: "Don't go through life, Grow through life!",
      content: `Growth doesn't come from comfort. It comes from challenge, from failure, from moments that stretch us beyond what we thought we could handle. Instead of asking "Why is this happening to me?" ask "What is this teaching me?"

Life isn't meant to be easy—it's meant to be meaningful. Every setback is a setup for a comeback. Every challenge is an opportunity to discover strength you didn't know you had.

The difference between surviving and thriving isn't what happens to you—it's how you choose to respond. So don't just go through life checking boxes and meeting deadlines. Grow through every experience, learn from every mistake, and become the person you're meant to be.`,
      excerpt: "We often move through life on autopilot — ticking boxes, meeting deadlines, going through the motions. But life isn't meant to just be lived, it's meant to be grown through.",
      publishedAt: "Thursday, 20th of June, 2025",
      timeAgo: "2 days ago",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop",
      category: "Personal Growth",
      tags: ["growth", "mindset", "life-lessons"],
      likes: 24,
      views: 156,
      isLiked: false,
      isPublished: true
    },
    {
      id: 2,
      title: "Happiness Depends on you!",
      content: `We often wait for happiness — a better job, the perfect partner, a bigger bank balance. But the truth is, happiness isn't something you find. It's something you create.

Life won't always go your way. People may disappoint you. Plans may fall apart. But in every situation, you still have one powerful tool: your response.

You can choose to focus on what's missing or appreciate what you have. You can choose to dwell on past mistakes or learn from them. You can choose to worry about tomorrow or make the most of today.

Happiness is not a destination—it's a decision. And that decision is always in your hands.`,
      excerpt: "We often wait for happiness — a better job, the perfect partner, a bigger bank balance. But the truth is, happiness isn't something you find. It's something you create.",
      publishedAt: "Monday, 10th of May, 2025",
      timeAgo: "1 week ago",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      category: "Mental Health",
      tags: ["happiness", "mindset", "wellbeing"],
      likes: 31,
      views: 203,
      isLiked: true,
      isPublished: true
    },
    {
      id: 3,
      title: "The Power of Mindful Living",
      content: `In our fast-paced world, we often forget to pause and truly experience the present moment. Mindfulness isn't just a buzzword—it's a way of life that can transform how we experience everything.

When we practice mindfulness, we learn to observe our thoughts without judgment, to feel our emotions without being overwhelmed by them, and to appreciate the simple beauty that surrounds us every day.

Start small: Take three deep breaths before getting out of bed. Notice the taste of your morning coffee. Feel your feet on the ground as you walk. These tiny moments of awareness can shift your entire day.

Mindfulness isn't about emptying your mind—it's about filling your life with intention and presence.`,
      excerpt: "In our fast-paced world, we often forget to pause and truly experience the present moment. Mindfulness isn't just a buzzword—it's a way of life.",
      publishedAt: "Friday, 15th of April, 2025",
      timeAgo: "3 days ago",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      category: "Mindfulness",
      tags: ["mindfulness", "meditation", "presence"],
      likes: 18,
      views: 89,
      isLiked: false,
      isPublished: false
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike, onEdit, onDelete, onShare }) => {
    const [showFullContent, setShowFullContent] = useState(false);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 lg:mb-6 overflow-hidden">
        {/* Blog Header */}
        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {!blog.isPublished && (
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
                <Calendar className="w-3 h-3" />
                <span>{blog.publishedAt}</span>
                <span>•</span>
                <span>{blog.timeAgo}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(blog.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            {blog.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Blog Title */}
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {blog.title}
          </h2>

          {/* Blog Excerpt */}
          <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Blog Image */}
        {blog.image && (
          <div className="px-4 md:px-6 mb-4">
            <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="px-4 md:px-6 mb-4">
          <div className={`text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line ${
            showFullContent ? '' : 'line-clamp-3'
          }`}>
            {blog.content}
          </div>
          {blog.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 transition-colors"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 md:px-6 pb-4">
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onLike(blog.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-gray-50 ${
                  blog.isLiked ? 'text-primary' : 'text-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${blog.isLiked ? 'fill-current' : ''}`} />
                {blog.likes}
              </button>
              <button 
                onClick={() => onShare(blog.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLike = (blogId: number) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { 
            ...blog, 
            isLiked: !blog.isLiked,
            likes: blog.likes + (blog.isLiked ? -1 : 1)
          }
        : blog
    ));
  };

  const handleEdit = (blogId: number) => {
    console.log('Edit blog:', blogId);
  };

  const handleDelete = (blogId: number) => {
    console.log('Delete blog:', blogId);
  };

  const handleShare = (blogId: number) => {
    console.log('Share blog:', blogId);
  };

  const handleCreateNewBlog = () => {
    navigate('/counsellor/create-blog');
  };

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  const filteredBlogs = blogs.filter(blog => {
    if (activeFilter === 'published') return blog.isPublished;
    if (activeFilter === 'drafts') return !blog.isPublished;
    return true;
  });

  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  const publishedCount = blogs.filter(blog => blog.isPublished).length;

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
          {/* Page Header */}
          <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Blogs</h1>
            <button 
              onClick={handleCreateNewBlog}
              className="bg-primary from-pink-500 to-purple-500 hover:bg-primaryLight text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
            >
              <PenTool className="w-4 lg:w-5 h-4 lg:h-5" />
              <span className="hidden sm:inline">New Blog</span>
            </button>
          </div>

          {/* Stats Cards - Desktop Only */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                  <p className="text-gray-600 text-sm">Total Posts</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100/30 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
                  <p className="text-gray-600 text-sm">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/30 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
                  <p className="text-gray-600 text-sm">Total Likes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-400/80 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                  <p className="text-gray-600 text-sm">Published</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs - All Devices */}
          <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Posts
            </button>
            <button 
              onClick={() => setActiveFilter('published')}
              className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'published' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published
            </button>
            <button 
              onClick={() => setActiveFilter('drafts')}
              className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'drafts' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Blog Cards */}
          <div className="space-y-4 lg:space-y-6">
            {filteredBlogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === 'drafts' 
                  ? "You don't have any draft posts yet." 
                  : "Start sharing your thoughts and insights with your audience."
                }
              </p>
              <button 
                onClick={handleCreateNewBlog}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
              >
                <PenTool className="w-5 h-5" />
                Write your first post
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredBlogs.length > 0 && (
            <div className="text-center mt-8">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellorBlogs;