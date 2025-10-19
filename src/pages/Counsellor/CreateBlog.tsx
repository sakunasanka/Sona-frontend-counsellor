import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Send, 
  Image, 
  Bold, 
  Italic, 
  Type,
  Quote, 
  Link, 
  List,
  X,
  Plus
} from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import FlashMessage from '../../components/ui/FlashMessage';
import { createPost, CreatePostData } from '../../api/counsellorAPI';
import { uploadBlogImage, validateImageFile } from '../../utils/cloudinaryUpload';

interface BlogFormData {
  content: string;
  tags: string[];
  image: string;
  isAnonymous: boolean;
}

const BlogCreator: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'write' | 'preview'>('write');
  const [newTag, setNewTag] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    content: '',
    tags: [],
    image: '',
    isAnonymous: false
  });



  const suggestedTags = [
    'growth', 'mindset', 'wellbeing', 'happiness', 'mindfulness', 
    'meditation', 'self-care', 'therapy', 'healing', 'motivation',
    'anxiety', 'depression', 'relationships', 'communication', 'boundaries'
  ];

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

  const handleFileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Import Cloudinary upload function
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadBlogImage(file);
      
      // Update form with Cloudinary URL
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Blog image upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
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

  const handlePublish = async () => {
    if (!formData.content.trim()) {
      setPublishError('Content is required');
      return;
    }

    try {
      setIsPublishing(true);
      setPublishError(null);

      // Prepare the post data according to the backend API structure
      const postData: CreatePostData = {
        content: formData.content.trim(),
        hashtags: formData.tags,
        backgroundColor: '#FFFFFF', // Default background color
        image: formData.image || undefined,
        isAnonymous: formData.isAnonymous
      };

      const response = await createPost(postData);
      
      console.log('Create post response:', response);
      
      if (response && response.success) {
        // Successfully created the post, navigate back to blogs
        console.log('Navigating to /blogs');
        
        // Use a small delay to ensure the navigation happens
        setTimeout(() => {
          navigate('/blogs', { 
            state: { message: 'Blog post created successfully!' }
          });
        }, 100);
      } else {
        console.error('Failed to create post:', response);
        setPublishError('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Check if it's a network error but the post might have been created
      // Since you mentioned the post is created in DB but navigation fails
      if (error instanceof Error && error.message.includes('Failed to create post')) {
        // Try navigating anyway since the post might have been created
        console.log('Post creation failed in response parsing, but might be created. Navigating...');
        setTimeout(() => {
          navigate('/blogs', { 
            state: { message: 'Blog post may have been created. Please check your posts.' }
          });
        }, 100);
      } else {
        setPublishError('An error occurred while creating the post. Please try again.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/blogs');
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
          <span className="text-gray-500 text-sm">Today • Just now</span>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {formData.tags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title removed - content speaks for itself */}
      </div>

      {formData.image && (
        <div className="px-6 mb-6">
          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
            <img 
              src={formData.image} 
              alt="Blog post image"
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
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-4 lg:pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleGoBack}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Create New Blog</h1>
                      <p className="text-gray-500 text-sm">Share your thoughts and insights</p>
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
                    {/* Title input removed - content-focused approach */}

                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image (Optional)
                      </label>
                      
                      {/* Upload Error */}
                      {uploadError && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{uploadError}</p>
                          <button
                            onClick={() => setUploadError(null)}
                            className="text-red-400 hover:text-red-600 text-xs ml-2"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      
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
                            disabled={uploading}
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <label 
                            htmlFor="blog-image-upload"
                            className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {uploading ? (
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                                <p className="text-gray-600">Uploading image...</p>
                              </div>
                            ) : (
                              <>
                                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">Upload an image file</p>
                                <p className="text-gray-500 text-sm mt-1">Drag & drop or click to browse</p>
                              </>
                            )}
                          </label>
                          <input
                            type="file"
                            id="blog-image-upload"
                            accept="image/*"
                            onChange={handleFileImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Use **bold**, *italic*, ## headings, {'>'} quotes, and - lists for formatting
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Panel */}
                  <div className="w-full lg:w-80 bg-gray-50 p-4 lg:p-6 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-200">
                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (Optional)
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

                    {/* Anonymous Posting Option */}
                    <div>
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Post Anonymously</div>
                          <div className="text-xs text-gray-500">Your name won't be shown to readers</div>
                        </div>
                      </label>
                    </div>

                    {/* Publish Button */}
                    <div className="pt-4">
                      {publishError && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{publishError}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={handlePublish}
                        className="w-full bg-primary hover:bg-primaryLight disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        disabled={!formData.content.trim() || isPublishing}
                      >
                        {isPublishing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Publish Blog
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {isPublishing ? 'Creating your post...' : 'Title and content are required to publish'}
                      </p>
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
                      <p className="text-gray-600 text-sm">This is how your blog will appear to readers</p>
                    </div>
                    
                    <PreviewContent />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flash Messages */}
      <FlashMessage
        type="error"
        message={publishError || ''}
        isVisible={!!publishError}
        onClose={() => setPublishError(null)}
      />
    </div>
  );
};

export default BlogCreator;