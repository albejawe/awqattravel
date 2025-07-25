import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Wand2, Upload, Link, Save, Eye } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  slug: string;
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

const AdminBlog = () => {
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        return;
      }

      // Check admin role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !roleData) {
        navigate("/admin/login");
        return;
      }

      setUser(user);
      await loadBlogs();
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const loadBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
      return;
    }

    setBlogs((data || []) as Blog[]);
  };

  const generateContent = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title first",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { 
          prompt: `Write a comprehensive travel blog post about: ${title}. Include practical tips, personal insights, and make it engaging for travelers.`,
          type: 'blog'
        }
      });

      if (error) throw error;

      setContent(data.content);
      
      // Generate excerpt from first paragraph
      const firstParagraph = data.content.split('\n\n')[0];
      setExcerpt(firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : ''));

      toast({
        title: "Content Generated",
        description: "AI-generated content has been added to your blog post",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFeaturedImage(data.publicUrl);

      toast({
        title: "Image Uploaded",
        description: "Featured image has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveBlog = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const generateSlug = (title: string) => {
        return title.toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };

      const blogData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        featured_image: featuredImage || null,
        status,
        author_id: user?.id,
        slug: editingBlog ? editingBlog.slug : generateSlug(title),
        ...(status === 'published' && { published_at: new Date().toISOString() })
      };

      let result;
      if (editingBlog) {
        result = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);
      } else {
        result = await supabase
          .from('blogs')
          .insert(blogData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Blog ${editingBlog ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      await loadBlogs();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingBlog ? 'update' : 'create'} blog`,
        variant: "destructive",
      });
    }
  };

  const editBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setExcerpt(blog.excerpt || '');
    setFeaturedImage(blog.featured_image || '');
    setStatus(blog.status);
    setIsCreating(true);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Blog deleted successfully",
    });
    await loadBlogs();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setFeaturedImage("");
    setStatus('draft');
    setIsCreating(false);
    setEditingBlog(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/admin")} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Blog Management</h1>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              Create New Blog
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {isCreating ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title..."
                  />
                  <Button 
                    onClick={generateContent}
                    disabled={generating || !title.trim()}
                    variant="outline"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {generating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the blog post..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="Image URL or upload below..."
                    />
                    <Button variant="outline" size="sm">
                      <Link className="w-4 h-4 mr-2" />
                      URL
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" disabled={uploading}>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  {featuredImage && (
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  rows={15}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveBlog}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingBlog ? 'Update Blog' : 'Save Blog'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {blogs.map((blog) => (
              <Card key={blog.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                      <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Status: {blog.status}</span>
                        <span>Updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {blog.featured_image && (
                      <img 
                        src={blog.featured_image} 
                        alt={blog.title}
                        className="w-24 h-16 object-cover rounded ml-4"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => editBlog(blog)} variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button 
                      onClick={() => deleteBlog(blog.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      Delete
                    </Button>
                    {blog.status === 'published' && (
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {blogs.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No blogs created yet. Create your first blog post!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBlog;