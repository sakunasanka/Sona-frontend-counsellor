import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bold, Eye, Image, Italic, Link, List, Quote, Send, Type, X } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';
import FlashMessage from '../../components/ui/FlashMessage';
import { getPost, updatePost, UpdatePostData } from '../../api/counsellorAPI';

type ViewMode = 'edit' | 'preview';

interface FormState {
	content: string;
	hashtags: string[];
	image: string;
	isAnonymous: boolean;
	backgroundColor?: string;
}

const EditBlog: React.FC = () => {
		const { blogId } = useParams<{ blogId: string }>();
		const location = useLocation() as { state?: { post?: any } };
	const navigate = useNavigate();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [mode, setMode] = useState<ViewMode>('edit');
	const [form, setForm] = useState<FormState>({
		content: '',
		hashtags: [],
		image: '',
		isAnonymous: false,
		backgroundColor: '#FFFFFF',
	});
	const [newTag, setNewTag] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);

		// Fetch or hydrate post
		useEffect(() => {
			const run = async () => {
				if (!blogId) {
					setError('Missing post id');
					setLoading(false);
					return;
				}
				try {
					setLoading(true);
					// Prefer post passed via navigation state (from list)
							let fromState = location.state?.post;
							if (!fromState && blogId) {
								try {
									const cached = sessionStorage.getItem(`edit_post_${blogId}`);
									if (cached) fromState = JSON.parse(cached);
								} catch {}
							}
					if (fromState) {
						setForm({
							content: fromState.content || '',
							hashtags: Array.isArray(fromState.hashtags) ? fromState.hashtags : [],
							image: fromState.image || '',
							isAnonymous: Boolean(fromState.isAnonymous),
							backgroundColor: fromState.backgroundColor || '#FFFFFF',
						});
						setError(null);
								// Clear cache after hydrate
								try { sessionStorage.removeItem(`edit_post_${blogId}`); } catch {}
					} else {
						// Fallback to API fetch
						const post = await getPost(blogId);
						setForm({
							content: post.content || '',
							hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
							image: post.image || '',
							isAnonymous: Boolean(post.isAnonymous),
							backgroundColor: post.backgroundColor || '#FFFFFF',
						});
						setError(null);
					}
				} catch (e: any) {
					console.error('Failed to load the post', e);
					if (e?.response?.status === 404) {
						setError('This post was not found or may have been removed.');
					} else {
						setError('Failed to load the post');
					}
				} finally {
					setLoading(false);
				}
			};
			run();
		}, [blogId]);

	const handleInput = (key: keyof FormState, value: any) => {
		setForm(prev => ({ ...prev, [key]: value }));
	};

	const addTag = () => {
		const t = newTag.trim();
		if (!t) return;
		if (form.hashtags.includes(t)) return;
		setForm(prev => ({ ...prev, hashtags: [...prev.hashtags, t] }));
		setNewTag('');
	};

	const removeTag = (tag: string) => {
		setForm(prev => ({ ...prev, hashtags: prev.hashtags.filter(t => t !== tag) }));
	};

	const insertFormatting = (format: 'bold' | 'italic' | 'heading' | 'quote' | 'list' | 'link') => {
		const textarea = contentRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = textarea.value.substring(start, end);

		let replacement = '';
		switch (format) {
			case 'bold':
				replacement = `**${selected || 'bold text'}**`;
				break;
			case 'italic':
				replacement = `*${selected || 'italic text'}*`;
				break;
			case 'heading':
				replacement = `## ${selected || 'Heading'}`;
				break;
			case 'quote':
				replacement = `> ${selected || 'Quote'}`;
				break;
			case 'list':
				replacement = `- ${selected || 'List item'}`;
				break;
			case 'link':
				replacement = `[${selected || 'Link text'}](url)`;
				break;
		}

		const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
		handleInput('content', newContent);

		requestAnimationFrame(() => {
			textarea.focus();
			const pos = start + replacement.length;
			textarea.setSelectionRange(pos, pos);
		});
	};

	const handleFileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const { uploadBlogImage, validateImageFile } = await import('../../utils/cloudinaryUpload');
		const validation = validateImageFile(file);
		if (!validation.valid) {
			setUploadError(validation.error || 'Invalid file');
			return;
		}
		setUploading(true);
		setUploadError(null);
		try {
			const url = await uploadBlogImage(file);
			handleInput('image', url);
		} catch (err) {
			console.error('Image upload failed', err);
			setUploadError(err instanceof Error ? err.message : 'Upload failed');
		} finally {
			setUploading(false);
		}
	};

	const saveChanges = async () => {
		if (!blogId) return;
		if (!form.content.trim()) {
			setError('Content is required');
			return;
		}
		try {
			setSaving(true);
			setError(null);
			const payload: UpdatePostData = {
				content: form.content.trim(),
				hashtags: form.hashtags,
				backgroundColor: form.backgroundColor || '#FFFFFF',
				image: form.image || undefined,
				isAnonymous: form.isAnonymous,
			};
			const resp = await updatePost(blogId, payload);
			if (resp && resp.success) {
				navigate('/blogs', { state: { message: 'Post updated and sent for review.' } });
			} else {
				setError('Failed to update post');
			}
		} catch (err) {
			console.error('Update post error', err);
			setError('An error occurred while updating the post');
		} finally {
			setSaving(false);
		}
	};

	const goBack = () => navigate('/blogs');
	const toggleSidebar = () => setSidebarOpen(s => !s);

	const suggestedTags = ['growth','mindset','wellbeing','happiness','mindfulness','therapy','healing','motivation','anxiety','depression'];

		if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

		if (error && !form.content && !loading) {
			return (
				<div className="flex h-screen items-center justify-center p-6">
					<div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-6 text-center">
						<div className="text-red-500 mb-2">⚠️</div>
						<h2 className="text-lg font-semibold mb-2">Unable to load post</h2>
						<p className="text-gray-600 mb-4">{error}</p>
						<button onClick={() => navigate('/blogs')} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primaryLight transition-colors">
							Back to Blogs
						</button>
					</div>
				</div>
			);
		}

	return (
		<div className="flex flex-col h-screen">
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden lg:block">
					<Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
				</div>
				<div className="lg:hidden">
					<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				</div>
				<div className="flex-1 overflow-auto">
					<NavBar onMenuClick={toggleSidebar} />
					<div className="p-4 lg:p-6">
						<div className="bg-white border-b border-gray-200 px-4 lg:pb-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
										<ArrowLeft className="w-5 h-5 text-gray-600" />
									</button>
									<div>
										<h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Blog</h1>
										<p className="text-gray-500 text-sm">Update your post and save changes</p>
									</div>
								</div>
								<div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
									<button
										onClick={() => setMode('edit')}
										className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
									>
										Edit
									</button>
									<button
										onClick={() => setMode('preview')}
										className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
									>
										Preview
									</button>
								</div>
							</div>
						</div>

						{/* Editor */}
						{mode === 'edit' && (
							<div className="flex-1 flex flex-col lg:flex-row">
								{/* Main */}
								<div className="flex-1 px-4 lg:px-6 py-6 space-y-6">
									{/* Featured Image */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Featured Image (Optional)</label>
										{uploadError && (
											<div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
												<p className="text-red-600 text-sm">{uploadError}</p>
												<button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-600 text-xs ml-2">×</button>
											</div>
										)}
										{form.image ? (
											<div className="relative">
												<img src={form.image} alt="Featured" className="w-full h-48 object-cover rounded-xl" />
												<button
													onClick={() => handleInput('image', '')}
													className="absolute top-2 right-2 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-colors"
													disabled={uploading}
												>
													<X className="w-4 h-4 text-gray-600" />
												</button>
											</div>
										) : (
											<div>
												<label htmlFor="blog-image-upload" className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
												<input id="blog-image-upload" type="file" accept="image/*" onChange={handleFileImageUpload} className="hidden" disabled={uploading} />
											</div>
										)}
									</div>

									{/* Content */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<label className="block text-sm font-medium text-gray-700">Content</label>
											<div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
												<button onClick={() => insertFormatting('bold')} className="p-1.5 hover:bg-white rounded transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
												<button onClick={() => insertFormatting('italic')} className="p-1.5 hover:bg-white rounded transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
												<button onClick={() => insertFormatting('heading')} className="p-1.5 hover:bg-white rounded transition-colors" title="Heading"><Type className="w-4 h-4" /></button>
												<button onClick={() => insertFormatting('quote')} className="p-1.5 hover:bg-white rounded transition-colors" title="Quote"><Quote className="w-4 h-4" /></button>
												<button onClick={() => insertFormatting('list')} className="p-1.5 hover:bg-white rounded transition-colors" title="List"><List className="w-4 h-4" /></button>
												<button onClick={() => insertFormatting('link')} className="p-1.5 hover:bg-white rounded transition-colors" title="Link"><Link className="w-4 h-4" /></button>
											</div>
										</div>
										<textarea
											ref={contentRef}
											value={form.content}
											onChange={(e) => handleInput('content', e.target.value)}
											placeholder="Update your blog content..."
											rows={12}
											className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
										/>
										<p className="text-xs text-gray-500 mt-2">Tip: Use **bold**, *italic*, ## headings, {'>'} quotes, and - lists for formatting</p>
									</div>
								</div>

								{/* Sidebar */}
								<div className="w-full lg:w-80 bg-gray-50 p-4 lg:p-6 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-200">
									{/* Tags */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Tags (Optional)</label>
										{form.hashtags.length > 0 && (
											<div className="flex flex-wrap gap-2 mb-3">
												{form.hashtags.map(tag => (
													<span key={tag} className="bg-primary text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
														{tag}
														<button onClick={() => removeTag(tag)} className="hover:bg-primaryLight rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
													</span>
												))}
											</div>
										)}
										<div className="flex gap-2 mb-3">
											<input
												type="text"
												value={newTag}
												onChange={(e) => setNewTag(e.target.value)}
												onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
												placeholder="Add a tag..."
												className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
											/>
											<button onClick={addTag} className="bg-primary hover:bg-primaryLight text-white px-3 py-2 rounded-lg transition-colors">
												<Send className="w-4 h-4" />
											</button>
										</div>
										<div>
											<p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
											<div className="flex flex-wrap gap-1">
												{suggestedTags.filter(t => !form.hashtags.includes(t)).slice(0, 8).map(tag => (
													<button key={tag} onClick={() => setForm(prev => ({ ...prev, hashtags: [...prev.hashtags, tag] }))} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs transition-colors">
														{tag}
													</button>
												))}
											</div>
										</div>
									</div>

									{/* Anonymous Toggle */}
									{/* <div>
										<label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
											<input
												type="checkbox"
												checked={form.isAnonymous}
												onChange={(e) => handleInput('isAnonymous', e.target.checked)}
												className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
											/>
											<div>
												<div className="text-sm font-medium text-gray-700">Post Anonymously</div>
												<div className="text-xs text-gray-500">Your name won't be shown to readers</div>
											</div>
										</label>
									</div> */}

									{/* Save Button */}
									<div className="pt-2">
										{error && (
											<div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
												<p className="text-red-600 text-sm">{error}</p>
											</div>
										)}
										<button
											onClick={saveChanges}
											disabled={saving || !form.content.trim()}
											className="w-full bg-primary hover:bg-primaryLight disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
										>
											{saving ? (
												<>
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
													Saving...
												</>
											) : (
												<>
													<Send className="w-4 h-4" />
													Save Changes
												</>
											)}
										</button>
										<p className="text-xs text-gray-500 mt-2 text-center">
											{saving ? 'Updating your post...' : 'Edits may be subject to admin review'}
										</p>
									</div>
								</div>
							</div>
						)}

						{mode === 'preview' && (
							<div className="flex-1 p-4 lg:p-6">
								<div className="max-w-4xl mx-auto">
									<div className="mb-6 text-center">
										<div className="flex items-center justify-center gap-2 text-primary mb-2">
											<Eye className="w-5 h-5" />
											<span className="font-medium">Preview Mode</span>
										</div>
										<p className="text-gray-600 text-sm">This is how your blog will appear to readers</p>
									</div>
									<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
										<div className="p-6">
											{form.hashtags.length > 0 && (
												<div className="flex flex-wrap items-center gap-2 mb-4">
													{form.hashtags.map(tag => (
														<span key={tag} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
													))}
												</div>
											)}
										</div>
										{form.image && (
											<div className="px-6 mb-6">
												<div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
													<img src={form.image} alt="Blog post image" className="w-full h-full object-cover" />
												</div>
											</div>
										)}
										<div className="px-6 pb-6">
											<div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
												{form.content || 'Your content will appear here'}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Flash for top-level errors */}
			<FlashMessage type="error" message={error || ''} isVisible={!!error} onClose={() => setError(null)} />
		</div>
	);
};

export default EditBlog;

