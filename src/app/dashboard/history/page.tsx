
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Search, Filter, ExternalLink, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HistoryPage() {
  const historyItems = [
    { id: 1, type: "Job Match", title: "Senior React Dev @ Google", date: "Oct 24, 2023", score: "88%", color: "bg-emerald-100 text-emerald-700" },
    { id: 2, type: "ATS Scan", title: "General Product Manager Resume", date: "Oct 21, 2023", score: "72", color: "bg-amber-100 text-amber-700" },
    { id: 3, type: "Optimization", title: "Full Stack Resume Draft v2", date: "Oct 15, 2023", score: "Completed", color: "bg-blue-100 text-blue-700" },
    { id: 4, type: "Job Match", title: "Frontend Engineer @ Vercel", date: "Sep 28, 2023", score: "64%", color: "bg-rose-100 text-rose-700" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <History className="h-8 w-8" />
          Analysis History
        </h1>
        <p className="text-muted-foreground">Access your previous resume scans and job matching reports.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search previous reports..." />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">Result</th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-medium">{item.type}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-sm font-bold ${item.color}`}>
                        {item.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" title="View Details">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
