
"use client"

import { useState } from "react"
import { aiResumeOptimizationSuggestions, type ResumeOptimizationOutput } from "@/ai/flows/ai-resume-optimization-suggestions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-primary h-8 w-8" />
          Resume Optimizer
        </h1>
        <p className="text-muted-foreground">Paste your resume content below to receive specific, actionable suggestions for improvement.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Resume Content</CardTitle>
          <CardDescription>We recommend pasting the plain text content of your resume for best results.</CardDescription>
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
                Analyzing with AI...
              </>
            ) : (
              "Analyze & Optimize"
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                Overall Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-slate-700">{results.overallFeedback}</p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold pt-4 border-t">Actionable Suggestions</h2>
          
          <div className="grid gap-6">
            {results.suggestions.map((suggestion, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="bg-accent/10 px-6 py-2 border-b">
                  <Badge variant="secondary" className="bg-white border-accent text-accent">
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
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Before</p>
                          <p className="text-sm italic text-slate-600">"{suggestion.beforeExample}"</p>
                        </div>
                      )}
                      {suggestion.afterExample && (
                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                          <p className="text-xs font-bold uppercase text-primary mb-1">AI Improved</p>
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
      )}
    </div>
  )
}
