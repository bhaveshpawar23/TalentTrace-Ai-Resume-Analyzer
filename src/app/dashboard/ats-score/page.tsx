
"use client"

import { useState } from "react"
import { atsCompatibilityScoreGenerator, type AtsCompatibilityScoreGeneratorOutput } from "@/ai/flows/ats-compatibility-score-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Loader2, BarChart3, CheckCircle2, ShieldCheck, FileCheck, LayoutGrid, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function AtsScorePage() {
  const [resumeText, setResumeText] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AtsCompatibilityScoreGeneratorOutput | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({ title: "Error", description: "Please enter your resume text.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const output = await atsCompatibilityScoreGenerator({ resumeText })
      setResults(output)
    } catch (error) {
      toast({ title: "Analysis Failed", description: "We couldn't generate your ATS score. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-rose-500"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50"
    if (score >= 60) return "bg-amber-50"
    return "bg-rose-50"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-primary h-8 w-8" />
          ATS Compatibility Scanner
        </h1>
        <p className="text-muted-foreground">Understand how Applicant Tracking Systems see your resume. Optimize for parsing algorithms.</p>
      </div>

      {!results ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Check Your Score</CardTitle>
            <CardDescription>Paste your resume text to receive a detailed compatibility report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Paste your resume text here..." 
              className="min-h-[300px] resize-none"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading} 
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating ATS Report...
                </>
              ) : (
                "Scan My Resume"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setResults(null)}>New Scan</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={cn("md:col-span-1 flex flex-col items-center justify-center py-10", getScoreBg(results.atsScore))}>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Score</p>
              <div className={cn("text-7xl font-black mb-4", getScoreColor(results.atsScore))}>
                {results.atsScore}
              </div>
              <Progress value={results.atsScore} className="w-3/4 h-2 bg-slate-200" />
              <p className="mt-4 font-medium text-slate-600">
                {results.atsScore >= 80 ? "Highly Compatible" : results.atsScore >= 60 ? "Moderate Potential" : "Optimization Required"}
              </p>
            </Card>

            <div className="md:col-span-2 grid grid-cols-1 gap-4">
               {[
                 { title: "Keyword Optimization", text: results.keywordOptimizationFeedback, icon: Target },
                 { title: "Formatting & Readability", text: results.formattingFeedback, icon: LayoutGrid },
                 { title: "Achievements Analysis", text: results.achievementsFeedback, icon: CheckCircle2 },
                 { title: "Section Completeness", text: results.sectionCompletenessFeedback, icon: FileCheck }
               ].map((item, i) => (
                 <Card key={i}>
                    <CardHeader className="py-4 flex flex-row items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100">
                        <item.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
                    </CardContent>
                 </Card>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
