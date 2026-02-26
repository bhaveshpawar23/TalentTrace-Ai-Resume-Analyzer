
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, BarChart3, Target, ArrowRight, History, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUser, useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { useMemo } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const { db } = useFirestore()

  const recentHistoryQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, "users", user.uid, "history"),
      orderBy("timestamp", "desc"),
      limit(3)
    )
  }, [db, user])

  const { data: recentHistory, loading: historyLoading } = useCollection(recentHistoryQuery)

  const stats = [
    { label: "Total Analyses", value: recentHistory?.length || "0", icon: History },
    { label: "Recent Score", value: recentHistory?.[0]?.score || "N/A", icon: BarChart3 },
    { label: "App Status", value: "Ready", icon: Target },
  ]

  if (userLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Welcome to TalentTrace, {user?.displayName || 'Friend'}</h1>
        <p className="text-muted-foreground mt-1">Ready to take the next step in your career journey? Start your analysis below.</p>
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

      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
          <Target className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Guest Mode Active</p>
            <p className="text-xs text-amber-700">You can use all tools, but your history will not be saved permanently. Sign up in the future to keep your progress!</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {historyLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading activity...</div>
              ) : recentHistory?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground italic">No recent scans. Start your first analysis above!</div>
              ) : recentHistory?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp ? format(new Date(item.timestamp), 'MMM d, yyyy h:mm a') : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{item.score}</p>
                    <Badge variant="secondary" className="text-[10px] uppercase">{item.type}</Badge>
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
