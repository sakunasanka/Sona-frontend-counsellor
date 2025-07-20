import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Send, 
  Image, 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Link, 
  Type,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';

interface BlogFormData {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  publishDate: string;
  publishTime: string;
  isScheduled: boolean;
}

interface EditBlogProps {
  blogData?: BlogFormData;
}

const EditBlog: React.FC<EditBlogProps> = ({ blogData }) => {
  const navigate = useNavigate();
  const { blogId } = useParams<{ blogId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'write' | 'preview'>('write');
  const [newTag, setNewTag] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    image: '',
    publishDate: '',
    publishTime: '',
    isScheduled: false
  });

  const categories = [
    'Personal Growth',
    'Mental Health',
    'Mindfulness',
    'Relationships',
    'Stress Management',
    'Self-Care',
    'Life Coaching',
    'Wellness',
    'Therapy Insights',
    'Success Stories'
  ];

  const suggestedTags = [
    'growth', 'mindset', 'wellbeing', 'happiness', 'mindfulness', 
    'meditation', 'self-care', 'therapy', 'healing', 'motivation',
    'anxiety', 'depression', 'relationships', 'communication', 'boundaries'
  ];

  // Mock function to fetch blog data - replace with actual API call
  const fetchBlogData = async (id: string): Promise<BlogFormData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock blog data - replace with actual API response
    return {
      id: id,
      title: 'Managing Stress in Daily Life',
      excerpt: 'Learn effective techniques to manage stress and maintain mental wellness in your everyday routine.',
      content: `# Managing Stress in Daily Life

Stress is an inevitable part of modern life, but it doesn't have to control us. Here are some practical strategies to help you manage stress effectively:

## Understanding Stress

Stress is your body's natural response to challenges and demands. While some stress can be motivating, chronic stress can negatively impact your physical and mental health.

## Effective Stress Management Techniques

### 1. Deep Breathing Exercises
- Practice diaphragmatic breathing
- Try the 4-7-8 breathing technique
- Use breathing apps for guided sessions

### 2. Mindfulness and Meditation
- Start with just 5 minutes daily
- Use mindfulness apps
- Practice being present in the moment

### 3. Physical Activity
- Regular exercise reduces stress hormones
- Even a 10-minute walk can help
- Find activities you enjoy

### 4. Time Management
- Prioritize important tasks
- Break large projects into smaller steps
- Learn to say no to unnecessary commitments

## Building Resilience

Remember that building stress resilience is a journey, not a destination. Be patient with yourself as you develop these new habits.`,
      category: 'Stress Management',
      tags: ['stress', 'mindfulness', 'wellness', 'self-care'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      publishDate: '2024-12-15',
      publishTime: '10:00',
      isScheduled: false
    };
  };

  // Load blog data when component mounts or blogId changes
  useEffect(() => {
    const loadBlogData = async () => {
      setIsLoading(true);
      try {
        let data: BlogFormData;
        
        if (blogData) {
          // Use provided blog data
          data = blogData;
        } else if (blogId) {
          // Fetch blog data by ID
          data = await fetchBlogData(blogId);
        } else {
          // Redirect if no blog data or ID provided
          navigate('/counsellor-blogs');
          return;
        }
        
        setFormData(data);
      } catch (error) {
        console.error('Error loading blog data:', error);
        // Handle error - maybe show notification
        navigate('/counsellor-blogs');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogData();
  }, [blogId, blogData, navigate]);

  const handleInputChange = (field: keyof BlogFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleImageUpload = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        image: imageUrl.trim()
      }));
      setImageUrl('');
      setShowImageUpload(false);
    }
  };

  const insertFormatting = (format: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    
    switch (format) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `## ${selectedText || 'Heading'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Quote'}`;
        break;
      case 'list':
        replacement = `- ${selectedText || 'List item'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link text'}](url)`;
        break;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      replacement + 
      textarea.value.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    // Add save changes logic here
    // After successful save, redirect back to blogs list
    navigate('/counsellor-blogs');
  };

  const handleUpdateAndPublish = () => {
    console.log('Updating and publishing blog:', formData);
    // Add update and publish logic here
    navigate('/counsellor-blogs');
  };

  const handleScheduleUpdate = () => {
    console.log('Scheduling blog update:', formData);
    // Add schedule update logic here
    navigate('/counsellor-blogs');
  };

  const handleGoBack = () => {
    navigate('/counsellor-blogs');
  };

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  const PreviewContent = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Preview Header */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-sm">Updated • Just now</span>
        </div>
        
        {formData.category && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
              {formData.category}
            </span>
            {formData.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {formData.title || 'Your Blog Title'}
        </h1>

        {formData.excerpt && (
          <p className="text-gray-600 mb-4 text-base leading-relaxed">
            {formData.excerpt}
          </p>
        )}
      </div>

      {formData.image && (
        <div className="px-6 mb-6">
          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
            <img 
              src={formData.image} 
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="px-6 pb-6">
        <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
          {formData.content || 'Start writing your blog content...'}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          
          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          </div>
          
          {/* Loading content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
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
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleGoBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Blog</h1>
                    <p className="text-gray-500 text-sm">Update your blog content and settings</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setActiveView('write')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeView === 'write' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Write
                    </button>
                    <button 
                      onClick={() => setActiveView('preview')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeView === 'preview' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1">
              {/* Editor Panel */}
              {activeView === 'write' && (
                <div className="flex-1 flex flex-col lg:flex-row">
                  {/* Main Editor */}
                  <div className="flex-1 px-4 lg:px-6 py-6 space-y-6">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter your blog title..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg font-medium"
                      />
                    </div>

                    {/* Excerpt Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="Write a brief description of your blog..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>
                      {formData.image ? (
                        <div className="relative">
                          <img 
                            src={formData.image} 
                            alt="Featured" 
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute top-2 right-2 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          {showImageUpload ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  value={imageUrl}
                                  onChange={(e) => setImageUrl(e.target.value)}
                                  placeholder="Enter image URL..."
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                <button
                                  onClick={handleImageUpload}
                                  className="bg-primary hover:bg-primaryLight text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => setShowImageUpload(false)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowImageUpload(true)}
                              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
                            >
                              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">Click to add a featured image</p>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Content
                        </label>
                        
                        {/* Formatting Toolbar */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          <button
                            onClick={() => insertFormatting('bold')}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="Bold"
                          >
                            <Bold className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => insertFormatting('italic')}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="Italic"
                          >
                            <Italic className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => insertFormatting('heading')}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="Heading"
                          >
                            <Type className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => insertFormatting('quote')}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="Quote"
                          >
                            <Quote className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => insertFormatting('list')}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="List"
                          >
                            <List className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => insertFormatting('link')}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="Link"
                          >
                            <Link className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <textarea
                        ref={contentRef}
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Start writing your blog content..."
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Use **bold**, *italic*, ## headings, {'>'} quotes, and - lists for formatting
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Panel */}
                  <div className="w-full lg:w-80 bg-gray-50 p-4 lg:p-6 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-200">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      
                      {/* Current Tags */}
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-primary text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-primaryLight rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Add New Tag */}
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add a tag..."
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                        />
                        <button
                          onClick={handleAddTag}
                          className="bg-primary hover:bg-primaryLight text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Suggested Tags */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {suggestedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 8).map(tag => (
                            <button
                              key={tag}
                              onClick={() => handleSuggestedTag(tag)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Publishing Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Publishing Options
                      </label>
                      
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="publishOption"
                            checked={!formData.isScheduled}
                            onChange={() => handleInputChange('isScheduled', false)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Update immediately</span>
                        </label>
                        
                        <label className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="publishOption"
                            checked={formData.isScheduled}
                            onChange={() => handleInputChange('isScheduled', true)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Schedule update</span>
                        </label>
                      </div>
                      
                      {formData.isScheduled && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="date"
                            value={formData.publishDate}
                            onChange={(e) => handleInputChange('publishDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          />
                          <input
                            type="time"
                            value={formData.publishTime}
                            onChange={(e) => handleInputChange('publishTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Update Buttons */}
                    <div className="space-y-2">
                      {formData.isScheduled ? (
                        <button
                          onClick={handleScheduleUpdate}
                          className="w-full bg-primary hover:bg-primaryLight text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule Update
                        </button>
                      ) : (
                        <button
                          onClick={handleUpdateAndPublish}
                          className="w-full bg-primary hover:bg-primaryLight text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Update & Publish
                        </button>
                      )}
                      
                      <button
                        onClick={handleSaveChanges}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Panel */}
              {activeView === 'preview' && (
                <div className="flex-1 p-4 lg:p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-primary mb-2">
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">Preview Mode</span>
                      </div>
                      <p className="text-gray-600 text-sm">This is how your updated blog will appear to readers</p>
                    </div>
                    
                    <PreviewContent />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
