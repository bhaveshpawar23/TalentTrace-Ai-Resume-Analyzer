
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, BarChart3, Target, ArrowRight, History } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    { label: "Total Analyses", value: "12", icon: History },
    { label: "Avg ATS Score", value: "74", icon: BarChart3 },
    { label: "Match Success", value: "82%", icon: Target },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Welcome Back, John</h1>
        <p className="text-muted-foreground mt-1">Ready to take the next step in your career journey?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-l-4 border-l-primary shadow-lg overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Resume Optimizer
            </CardTitle>
            <CardDescription>
              Identify weaknesses and get AI-generated improvements to make your resume stand out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/optimizer">
              <Button className="w-full group">
                Start Optimizing
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Job Description Match
            </CardTitle>
            <CardDescription>
              Compare your resume with a specific job description to find missing skills and qualifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/job-match">
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
                Match Your Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">ATS Scan: Software Engineer Resume</p>
                      <p className="text-xs text-muted-foreground">Last processed 2 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">72/100</p>
                    <p className="text-xs text-muted-foreground">Good Match</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
