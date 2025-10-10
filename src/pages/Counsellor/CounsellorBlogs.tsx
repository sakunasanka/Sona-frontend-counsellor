import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Eye, MoreHorizontal, Calendar, Edit, Trash2, FileText, PenTool, Search, Filter, ChevronDown, Users, Tag } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import FlashMessage from '../../components/ui/FlashMessage';
import { getPosts, getMyPosts, getPostLikeStatus, toggleLikePost, incrementPostView, deletePost } from '../../api/counsellorAPI';
import { useProfile } from '../../contexts/ProfileContext';

interface Blog {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timeAgo: string;
  content: string;
  hashtags: string[];
  image?: string | null;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  backgroundColor: string;
  liked: boolean;
  status?: 'edited' | 'pending' | 'approved' | 'rejected';
  isAnonymous: boolean;
}

interface BlogCardProps {
  blog: Blog;
  onLike: (blogId: string) => void;
  onEdit: (blogId: string) => void;
  onDelete: (blogId: string) => void;
  onShare: (blogId: string) => void;
  showStatus?: boolean;
  isOwnPost?: boolean;
}

const CounsellorBlogs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();
  // Track posts we've already incremented views for in this session
  const viewedPostsRef = React.useRef<Set<string>>(new Set());
  
  // Helper to check if a post belongs to current user
  const isOwnPost = (blog: Blog) => {
    if (!profile) return false;
    // Compare author name with current user's name
    const currentUserName = `${profile.firstName} ${profile.lastName}`.trim();
    const authorName = blog.author.name;
    return currentUserName === authorName;
  };
  
  // Helper to format large counts like 1.6K, 2.3M
  const formatCount = (num: number) => {
    if (num < 1000) return num.toString();
    const units = ['K', 'M', 'B', 'T'];
    let unitIndex = -1;
    let n = num;
    while (n >= 1000 && unitIndex < units.length - 1) {
      n /= 1000;
      unitIndex++;
    }
    return `${n.toFixed(1).replace(/\.0$/, '')}${units[unitIndex]}`;
  };
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Handle flash messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setFlashMessage({
        message: location.state.message,
        type: location.state.type || 'success'
      });
      // Clear the state to prevent showing message on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Auto-hide flash message after 5 seconds
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  // Fetch posts from API and enrich with like status
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let response;
        
        if (activeFilter === 'my-posts') {
          response = await getMyPosts();
        } else {
          response = await getPosts();
        }
        // Enrich each post with current user's like status and accurate likes count
        const posts = response.data.posts as Blog[];
        const enriched = await Promise.all(posts.map(async (p) => {
          try {
            const status = await getPostLikeStatus(p.id);
            return {
              ...p,
              liked: status.liked,
              stats: { ...p.stats, likes: status.likes, views: status.views }
            } as Blog;
          } catch (e) {
            // If status fetch fails, fall back to the original values
            return p;
          }
        }));
        setBlogs(enriched);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeFilter]);

  // Reset filters when switching tabs
  useEffect(() => {
    if (activeFilter === 'all') {
      setStatusFilter('all');
    }
  }, [activeFilter]);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike, onEdit, onDelete, onShare, showStatus = false, isOwnPost = false }) => {
    const [showFullContent, setShowFullContent] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const hasIncrementedRef = React.useRef<boolean>(false);
    const timerRef = React.useRef<number | null>(null);

    // Increment view after 2s of visibility (once per session per post) - skip for own posts
    useEffect(() => {
      const el = cardRef.current;
      if (!el) return;
      if (hasIncrementedRef.current) return;
      if (viewedPostsRef.current.has(blog.id)) return;
      if (isOwnPost) return; // Don't increment views for own posts

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
          if (isVisible && !hasIncrementedRef.current && !viewedPostsRef.current.has(blog.id)) {
            if (timerRef.current == null) {
              timerRef.current = window.setTimeout(async () => {
                try {
                  const res = await incrementPostView(blog.id);
                  hasIncrementedRef.current = true;
                  viewedPostsRef.current.add(blog.id);
                  // Update views if backend returns it
                  if (typeof res.views === 'number') {
                    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, stats: { ...b.stats, views: res.views! } } : b));
                  } else {
                    // Otherwise, increment locally once
                    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, stats: { ...b.stats, views: b.stats.views + 1 } } : b));
                  }
                } finally {
                  // Clean up timer and stop observing after first increment
                  if (timerRef.current != null) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                  }
                  observer.disconnect();
                }
              }, 2000);
            }
          } else {
            // Not visible enough, clear pending timer
            if (timerRef.current != null) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }
        },
        { threshold: [0.5] }
      );

      observer.observe(el);
      return () => {
        if (timerRef.current != null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        observer.disconnect();
      };
    }, [blog.id, isOwnPost]);

    return (
  <div ref={cardRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 lg:mb-6 overflow-hidden">
        {/* Blog Header */}
        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            {!blog.isAnonymous && (
              <img 
                src={blog.author.avatar} 
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/profile-photo.png';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {blog.isAnonymous ? 'Anonymous' : blog.author.name}
                </h3>
                {!blog.isAnonymous && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {blog.author.role}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
                <Calendar className="w-3 h-3" />
                <span>{blog.timeAgo}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Only show edit/delete buttons for own posts */}
              {isOwnPost && (
                <>
                  <button
                    onClick={() => onEdit(blog.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {/* More Actions Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                
                {showMoreMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMoreMenu(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">

                      <button
                        onClick={() => {
                          onDelete(blog.id);
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      </div>
                    </>
                  )}
                </div>
              </>
              )}
            </div>
          </div>

          {/* Hashtags and Status */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {blog.hashtags.map((hashtag, index) => (
              <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                {hashtag}
              </span>
            ))}
            
            {/* Status Badge - Only show in My Posts tab */}
            {showStatus && blog.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                blog.status === 'approved' 
                  ? 'bg-green-100 text-green-600' 
                  : blog.status === 'rejected' 
                  ? 'bg-red-100 text-red-600'
                  : blog.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600' // edited
              }`}>
                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
              </span>
            )}
          </div>

          {/* Blog Image */}
          {blog.image && (
            <div className="mb-4">
              <img 
                src={blog.image} 
                alt="Blog content" 
                className="w-full h-auto max-h-96 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {showFullContent ? (
              blog.content
            ) : (
              blog.content.length > 200 
                ? blog.content.slice(0, 200) + '...'
                : blog.content
            )}
          </div>
          
          {blog.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
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
                className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
                  blog.liked ? 'text-primary' : 'text-gray-600'
                } hover:bg-gray-50`}
              >
                <Heart className={`w-4 h-4 ${blog.liked ? 'fill-current' : ''}`} />
                              {formatCount(blog.stats.likes)}
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
              <span>{formatCount(blog.stats.views)} views</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLike = async (blogId: string) => {
    // Optimistic update
    let previousState: Blog | undefined;
    setBlogs(prev => prev.map(blog => {
      if (blog.id !== blogId) return blog;
      previousState = blog;
      const willLike = !blog.liked;
      return {
        ...blog,
        liked: willLike,
        stats: {
          ...blog.stats,
          likes: blog.stats.likes + (willLike ? 1 : -1)
        }
      };
    }));

    try {
      // Use toggle endpoint; then sync both liked and likes from server if provided
      const res = await toggleLikePost(blogId);
      setBlogs(prev => prev.map(b => {
        if (b.id !== blogId) return b;
        return {
          ...b,
          liked: typeof res.liked === 'boolean' ? res.liked : b.liked,
          stats: {
            ...b.stats,
            likes: typeof res.likes === 'number' ? res.likes : b.stats.likes,
            views: typeof res.views === 'number' ? res.views : b.stats.views
          }
        };
      }));
    } catch (err) {
      console.error('Like/unlike failed, reverting:', err);
      // Revert on error
      setBlogs(prev => prev.map(blog => previousState && blog.id === blogId ? previousState! : blog));
    }
  };

  const handleEdit = (blogId: string) => {
    const post = blogs.find(b => b.id === blogId) || null;
    if (post) {
      try {
        sessionStorage.setItem(`edit_post_${blogId}`, JSON.stringify(post));
      } catch {}
    }
    navigate(`/counsellor/edit-blog/${blogId}`, { state: { post } });
  };

  const handleDelete = (blogId: string) => {
    setDeletePostId(blogId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletePostId) return;

    try {
      setIsDeleting(true);
      await deletePost(deletePostId);
      
      // Remove the post from the local state
      setBlogs(prev => prev.filter(blog => blog.id !== deletePostId));
      
      setFlashMessage({
        message: 'Post deleted successfully!',
        type: 'success'
      });
      
      setShowDeleteModal(false);
      setDeletePostId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setFlashMessage({
        message: 'Failed to delete post. Please try again.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePostId(null);
  };

  const handleShare = (blogId: string) => {
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

  // Filter blogs based on search query and status
  const filteredBlogs = blogs.filter(blog => {
    // Search filter (by author name or content)
    const authorName = blog.isAnonymous ? 'Anonymous' : blog.author.name;
    const matchesSearch = searchQuery === '' || 
      authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter based on active tab
    let matchesStatus = true;
    
    if (activeFilter === 'all') {
      // All Posts tab: only show approved posts
      matchesStatus = blog.status === 'approved' || !blog.status; // Show posts without status as well (backward compatibility)
    } else if (activeFilter === 'my-posts') {
      // My Posts tab: show all statuses, but apply status filter if selected
      matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Calculate different counts based on active tab
  const approvedPosts = blogs.filter(blog => blog.status === 'approved' || !blog.status);
  const allMyPosts = blogs;
  
  // Use appropriate posts array for calculations based on active tab
  const postsForStats = activeFilter === 'all' ? approvedPosts : allMyPosts;
  const totalViews = postsForStats.reduce((sum, blog) => sum + blog.stats.views, 0);
  const totalLikes = postsForStats.reduce((sum, blog) => sum + blog.stats.likes, 0);

  // Additional metrics for All Posts tab
  const uniqueAuthorsCount = new Set((activeFilter === 'all' ? postsForStats : []).map(b => b.author.name)).size;
  const topHashtags = (() => {
    if (activeFilter !== 'all') return [] as string[];
    const freq: Record<string, number> = {};
    for (const b of postsForStats) {
      for (const tag of (b.hashtags || [])) {
        const key = tag.trim();
        if (!key) continue;
        freq[key] = (freq[key] || 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);
  })();

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
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Posts - shown on both tabs */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{postsForStats.length}</p>
                    <p className="text-gray-600 text-sm">Total Posts</p>
                  </div>
                </div>
              </div>

              {activeFilter === 'my-posts' ? (
                <>
                  {/* Total Views - only for My Posts */}
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
                  {/* Total Likes - only for My Posts */}
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
                </>
              ) : (
                <>
                  {/* Unique Authors - All Posts */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{uniqueAuthorsCount}</p>
                        <p className="text-gray-600 text-sm">Unique Authors</p>
                      </div>
                    </div>
                  </div>
                  {/* Top Hashtags - All Posts */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Tag className="w-6 h-6 text-purple-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600 mb-1">Top Hashtags</p>
                        {topHashtags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {topHashtags.map((t) => (
                              <span key={t} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">{t}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No hashtags yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Filter Tabs - All Devices */}
            <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
              <button 
                onClick={() => {
                  setActiveFilter('all');
                  setStatusFilter('all');
                }}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Posts
              </button>
              <button 
                onClick={() => setActiveFilter('my-posts')}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'my-posts' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Posts
              </button>
            </div>

            {/* Search Bar and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by author name or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>

              {/* Status Filter Dropdown - Only for My Posts */}
              {activeFilter === 'my-posts' && (
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors min-w-[140px]"
                  >
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {statusFilter === 'all' ? 'All Status' : 
                       statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {showStatusDropdown && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => {
                            setStatusFilter('all');
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            statusFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          All Status
                        </button>
                        <button
                          onClick={() => {
                            setStatusFilter('edited');
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            statusFilter === 'edited' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          Edited
                        </button>
                        <button
                          onClick={() => {
                            setStatusFilter('pending');
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            statusFilter === 'pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => {
                            setStatusFilter('approved');
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            statusFilter === 'approved' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          Approved
                        </button>
                        <button
                          onClick={() => {
                            setStatusFilter('rejected');
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            statusFilter === 'rejected' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          Rejected
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your posts...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <FileText className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load posts</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Blog Cards */}
            {!loading && !error && (
              <div className="space-y-4 lg:space-y-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard 
                    key={blog.id} 
                    blog={blog} 
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    showStatus={activeFilter === 'my-posts'}
                    isOwnPost={isOwnPost(blog)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery || (activeFilter === 'my-posts' && statusFilter !== 'all') 
                    ? 'No posts match your search criteria' 
                    : 'No posts found'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || (activeFilter === 'my-posts' && statusFilter !== 'all')
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start sharing your thoughts and insights with your audience.'
                  }
                </p>
                {(!searchQuery && !(activeFilter === 'my-posts' && statusFilter !== 'all')) && (
                  <button 
                    onClick={handleCreateNewBlog}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
                  >
                    <PenTool className="w-5 h-5" />
                    Write your first post
                  </button>
                )}
                
                {(searchQuery || (activeFilter === 'my-posts' && statusFilter !== 'all')) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
                <p className="text-gray-600">Are you sure you want to delete this post?</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The post will be permanently removed from your blog.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flash Message */}
      <FlashMessage
        type={flashMessage?.type || 'success'}
        message={flashMessage?.message || ''}
        isVisible={!!flashMessage}
        onClose={() => setFlashMessage(null)}
      />
    </div>
  );
};

export default CounsellorBlogs;