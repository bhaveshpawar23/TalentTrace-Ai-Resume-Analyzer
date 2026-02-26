
"use client"

import {
  FileText,
  BarChart3,
  Target,
  LayoutDashboard,
  Settings,
  History,
  Rocket,
  User,
  LogOut
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"

const mainNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resume Optimizer",
    url: "/dashboard/optimizer",
    icon: Rocket,
  },
  {
    title: "ATS Compatibility",
    url: "/dashboard/ats-score",
    icon: BarChart3,
  },
  {
    title: "Job Match Tool",
    url: "/dashboard/job-match",
    icon: Target,
  },
]

const accountNav = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Analysis History",
    url: "/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { auth } = useAuth()
  const { user } = useUser()

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/login");
    }
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
            <FileText className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary group-data-[collapsible=icon]:hidden">
            TalentTrace
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[120px]">{user?.displayName || "User"}</span>
            <span className="text-xs text-muted-foreground">Premium Member</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
