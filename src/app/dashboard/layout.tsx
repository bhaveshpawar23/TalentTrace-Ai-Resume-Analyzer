
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/layout/Footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen min-w-0 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white sticky top-0 z-10 w-full">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 min-w-0">
             <h1 className="text-sm font-bold text-primary tracking-tight">TalentTrace <span className="text-muted-foreground font-medium">AI Intelligence Hub</span></h1>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto w-full">
          <div className="max-w-full">
            {children}
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
