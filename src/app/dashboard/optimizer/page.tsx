"use client"

import { useState } from "react"
import { aiResumeOptimizationSuggestions, type ResumeOptimizationOutput } from "@/ai/flows/ai-resume-optimization-suggestions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, CheckCircle2, AlertTriangle, Briefcase, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function OptimizerPage() {
  const [resumeText, setResumeText] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ResumeOptimizationOutput | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({ title: "Error", description: "Please enter your resume text.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const output = await aiResumeOptimizationSuggestions({ resumeText })
      setResults(output)
    } catch (error) {
      toast({ title: "Analysis Failed", description: "We couldn't process your resume. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-rose-500"
  }

  const getReadinessLabel = (score: number) => {
    if (score >= 90) return "Ready for Applications"
    if (score >= 75) return "Nearly Ready"
    if (score >= 50) return "Needs Polishing"
    return "Significant Revision Needed"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-primary h-8 w-8" />
          Resume Optimizer
        </h1>
        <p className="text-muted-foreground">Receive AI-driven feedback and a Job Readiness Score to ensure your profile is application-ready.</p>
      </div>

      {!results ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Resume Content</CardTitle>
            <CardDescription>Paste your resume text below for a comprehensive analysis.</CardDescription>
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
              className="w-full h-12 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Readiness...
                </>
              ) : (
                "Analyze & Check Readiness"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setResults(null)}>Reset Optimizer</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 flex flex-col items-center justify-center py-8 bg-slate-50 border-2 border-primary/10">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Job Readiness</p>
              <div className={cn("text-6xl font-black mb-4", getScoreColor(results.readinessScore))}>
                {results.readinessScore}%
              </div>
              <div className="w-3/4 px-4">
                <Progress value={results.readinessScore} className="h-2" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                {getReadinessLabel(results.readinessScore)}
              </p>
            </Card>

            <Card className="md:col-span-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="text-primary h-5 w-5" />
                  Expert Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-slate-700">{results.overallFeedback}</p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              Required Improvements
            </h2>
            
            <div className="grid gap-6">
              {results.suggestions.map((suggestion, idx) => (
                <Card key={idx} className="overflow-hidden border-slate-200">
                  <div className="bg-slate-50 px-6 py-2 border-b flex justify-between items-center">
                    <Badge variant="secondary" className="bg-white border-slate-200 text-slate-600">
                      {suggestion.category}
                    </Badge>
                  </div>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-base font-medium leading-relaxed">{suggestion.description}</p>
                    </div>
                    
                    {(suggestion.beforeExample || suggestion.afterExample) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {suggestion.beforeExample && (
                          <div className="bg-rose-50/30 p-3 rounded-lg border border-rose-100">
                            <p className="text-xs font-bold uppercase text-rose-600 mb-1">Current</p>
                            <p className="text-sm italic text-slate-600">"{suggestion.beforeExample}"</p>
                          </div>
                        )}
                        {suggestion.afterExample && (
                          <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                            <p className="text-xs font-bold uppercase text-emerald-600 mb-1">Recommended</p>
                            <p className="text-sm font-medium text-slate-800">"{suggestion.afterExample}"</p>
                          </div>
                        )}
                      </div>
                    )}
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
