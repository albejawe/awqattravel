import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  FileText, 
  Tag, 
  Hotel, 
  Plane, 
  ChevronRight,
  Import
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const [articlesOpen, setArticlesOpen] = useState(true);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const menuItems = [
    {
      title: "المقالات",
      icon: FileText,
      items: [
        { title: "جميع المقالات", url: "/admin/blog", icon: FileText },
        { title: "الفئات", url: "/admin/categories", icon: Tag },
        { title: "استيراد وتصدير", url: "/admin/blog/import-export", icon: Import },
      ]
    },
    {
      title: "الفنادق",
      icon: Hotel,
      url: "/admin/hotels"
    },
    {
      title: "الطيران",
      icon: Plane,
      url: "/admin/flights"
    }
  ];

  return (
    <Sidebar className={!open ? "w-14" : "w-60"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>لوحة الإدارة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible open={articlesOpen} onOpenChange={setArticlesOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {open && <span>{item.title}</span>}
                          </div>
                          {open && (
                            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${articlesOpen ? 'rotate-90' : ''}`} />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink 
                                  to={subItem.url} 
                                  className={getNavCls}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  {open && <span>{subItem.title}</span>}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url!} 
                        className={getNavCls}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}