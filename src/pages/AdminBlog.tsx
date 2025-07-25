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
        title: "خطأ",
        description: "فشل في تحميل المقالات",
        variant: "destructive",
      });
      return;
    }

    setBlogs((data || []) as Blog[]);
  };

  const generateContent = async () => {
    if (!title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال العنوان أولاً",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { 
          prompt: `اكتب مقالة سفر شاملة باللغة العربية عن: ${title}. يجب أن تتضمن نصائح عملية ورؤى شخصية وتكون جذابة للمسافرين.`,
          type: 'blog'
        }
      });

      if (error) throw error;

      setContent(data.content);
      
      // Generate excerpt from first paragraph
      const firstParagraph = data.content.split('\n\n')[0];
      setExcerpt(firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : ''));

      toast({
        title: "تم توليد المحتوى",
        description: "تم إضافة المحتوى المولد بالذكاء الاصطناعي إلى مقالتك",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في توليد المحتوى",
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
        title: "تم رفع الصورة",
        description: "تم رفع الصورة المميزة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveBlog = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "خطأ",
        description: "العنوان والمحتوى مطلوبان",
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
        title: "نجح الحفظ",
        description: `تم ${editingBlog ? 'تحديث' : 'إنشاء'} المقال بنجاح`,
      });

      resetForm();
      await loadBlogs();
    } catch (error) {
      toast({
        title: "خطأ",
        description: `فشل في ${editingBlog ? 'تحديث' : 'إنشاء'} المقال`,
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
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف المقال",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم الحذف",
      description: "تم حذف المقال بنجاح",
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
        <div>جاري التحميل...</div>
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
              العودة للوحة الإدارة
            </Button>
            <h1 className="text-2xl font-bold">إدارة المدونة</h1>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              إنشاء مقال جديد
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {isCreating ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingBlog ? 'تحرير المقال' : 'إنشاء مقال جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="أدخل عنوان المقال..."
                  />
                  <Button 
                    onClick={generateContent}
                    disabled={generating || !title.trim()}
                    variant="outline"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {generating ? 'جاري التوليد...' : 'توليد بالذكاء الاصطناعي'}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">المقدمة</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="وصف مختصر للمقال..."
                  rows={2}
                />
              </div>

              <div>
                <Label>الصورة المميزة</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="رابط الصورة أو ارفع أدناه..."
                    />
                    <Button variant="outline" size="sm">
                      <Link className="w-4 h-4 mr-2" />
                      رابط
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
                      {uploading ? 'جاري الرفع...' : 'رفع'}
                    </Button>
                  </div>
                  {featuredImage && (
                    <img 
                      src={featuredImage} 
                      alt="صورة مميزة" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب محتوى مقالك هنا..."
                  rows={15}
                />
              </div>

              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveBlog}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingBlog ? 'تحديث المقال' : 'حفظ المقال'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  إلغاء
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
                        <span>الحالة: {blog.status === 'published' ? 'منشور' : 'مسودة'}</span>
                        <span>آخر تحديث: {new Date(blog.updated_at).toLocaleDateString('ar-SA')}</span>
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
                      تحرير
                    </Button>
                    <Button 
                      onClick={() => deleteBlog(blog.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      حذف
                    </Button>
                    {blog.status === 'published' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        عرض
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {blogs.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">لم يتم إنشاء مقالات بعد. أنشئ مقالك الأول!</p>
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