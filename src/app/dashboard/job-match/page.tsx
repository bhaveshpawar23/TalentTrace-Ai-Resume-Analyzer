
"use client"

import { useState } from "react"
import { matchResumeToJobDescription, type AiJobDescriptionMatcherOutput } from "@/ai/flows/ai-job-description-matcher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Target, CheckCircle2, XCircle, BrainCircuit, FileText, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function JobMatchPage() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AiJobDescriptionMatcherOutput | null>(null)
  const { toast } = useToast()

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      toast({ title: "Error", description: "Please provide both resume and job description text.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const output = await matchResumeToJobDescription({ resumeText, jobDescriptionText })
      setResults(output)
    } catch (error) {
      toast({ title: "Matching Failed", description: "Something went wrong during the analysis.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="text-primary h-8 w-8" />
          Job Description Match Tool
        </h1>
        <p className="text-muted-foreground">Tailor your profile. Calculate how well you fit a specific role and identify your skill gaps.</p>
      </div>

      {!results ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm border-t-4 border-t-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Your Resume
              </CardTitle>
              <CardDescription>Paste the text content of your resume.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste resume content here..." 
                className="min-h-[400px] resize-none"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Target Job Description
              </CardTitle>
              <CardDescription>Paste the target job description text.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste job posting text here..." 
                className="min-h-[400px] resize-none"
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Button 
              onClick={handleMatch} 
              disabled={loading} 
              className="w-full h-14 text-xl font-bold shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Calculating Match %...
                </>
              ) : (
                "Calculate Match Percentage"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center">
             <Button variant="outline" onClick={() => setResults(null)}>Reset Analysis</Button>
             <Button onClick={() => window.print()} className="bg-accent hover:bg-accent/90">Download Report (PDF)</Button>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-primary p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold">Match Results</h2>
                <p className="text-white/80">Our AI analyzed your skills against the job requirements.</p>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-center">
                  <div className="text-5xl font-black">{results.matchScore}%</div>
                  <div className="text-xs uppercase font-bold tracking-widest text-white/70">Match Score</div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                   <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                   <h3 className="font-bold text-lg">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.matchedSkills.map((skill, i) => (
                    <Badge key={i} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 py-1.5 px-3">
                      {skill}
                    </Badge>
                  ))}
                  {results.matchedSkills.length === 0 && <p className="text-muted-foreground italic">No matching skills identified.</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                   <XCircle className="h-5 w-5 text-rose-500" />
                   <h3 className="font-bold text-lg">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.missingSkills.map((skill, i) => (
                    <Badge key={i} className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 py-1.5 px-3">
                      {skill}
                    </Badge>
                  ))}
                   {results.missingSkills.length === 0 && <p className="text-muted-foreground italic">You've got all the required skills!</p>}
                </div>
              </div>
            </CardContent>

            <div className="bg-slate-50 p-6 border-t">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">AI Career Tip</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Based on the {results.missingSkills.length} missing skills identified, we recommend adding specific projects to your resume that demonstrate experience with <strong>{results.missingSkills[0] || "industry standard tools"}</strong>. This could increase your match score by up to 15%.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
