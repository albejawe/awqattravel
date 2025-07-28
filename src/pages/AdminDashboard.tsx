import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>جاري التحميل...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <header className="bg-card border-b p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  مرحباً، {user?.email}
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  تسجيل خروج
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">مرحباً بك في لوحة الإدارة</h2>
                <p className="text-muted-foreground mt-2">
                  استخدم القائمة الجانبية للوصول إلى جميع أدوات الإدارة
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">إدارة المحتوى</h3>
                  <p className="text-muted-foreground">
                    إنشاء وتحرير المقالات والفئات مع أدوات الذكاء الاصطناعي
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">البحث عن الفنادق</h3>
                  <p className="text-muted-foreground">
                    بحث ذكي عن الفنادق بأفضل الأسعار من جميع المواقع العالمية
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">البحث عن الطيران</h3>
                  <p className="text-muted-foreground">
                    مقارنة أسعار الطيران وجدولة الرحلات بأحدث التقنيات
                  </p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;