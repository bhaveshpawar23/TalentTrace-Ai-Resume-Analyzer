
"use client"

import { useUser, useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Search, Filter, ExternalLink, Trash2, Loader2, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function HistoryPage() {
  const { user } = useUser()
  const { db } = useFirestore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const historyQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, "users", user.uid, "history"),
      orderBy("timestamp", "desc")
    )
  }, [db, user])

  const { data: historyItems, loading } = useCollection(historyQuery)

  const filteredItems = historyItems?.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!db || !user) return
    try {
      await deleteDoc(doc(db, "users", user.uid, "history", id))
      toast({ title: "Deleted", description: "History record removed successfully." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const getBadgeStyle = (type: string) => {
    switch(type) {
      case 'ats': return 'bg-blue-100 text-blue-700'
      case 'match': return 'bg-emerald-100 text-emerald-700'
      case 'optimizer': return 'bg-amber-100 text-amber-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

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
          <Input 
            className="pl-10" 
            placeholder="Search previous reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="mt-2 text-muted-foreground">Loading history...</p>
                    </td>
                  </tr>
                ) : filteredItems?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      <Info className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      No reports found.
                    </td>
                  </tr>
                ) : filteredItems?.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("font-medium uppercase", getBadgeStyle(item.type))}>
                        {item.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.timestamp ? format(new Date(item.timestamp), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-primary">
                        {item.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" title="View Details">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => handleDelete(item.id)}
                      >
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
