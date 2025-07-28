import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BlogImportExport from "@/components/BlogImportExport";

const AdminBlogImportExportPage = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold">استيراد وتصدير المقالات</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <BlogImportExport onImportComplete={() => {}} />
      </main>
    </div>
  );
};

export default AdminBlogImportExportPage;