
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Briefcase, Info, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const { db } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    professionalTitle: "",
    bio: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      if (user && db) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            displayName: data.displayName || user.displayName || "",
            email: data.email || user.email || "",
            professionalTitle: data.professionalTitle || "",
            bio: data.bio || ""
          });
        }
      }
    }
    fetchProfile();
  }, [user, db]);

  const handleUpdate = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...profile,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-primary h-8 w-8" />
          Your Profile
        </h1>
        <p className="text-muted-foreground">Manage your personal information and professional details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 flex flex-col items-center py-10 space-y-4">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200`} />
            <AvatarFallback className="bg-primary text-white text-2xl font-bold">
              {profile.displayName.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-bold text-xl">{profile.displayName}</h3>
            <p className="text-sm text-muted-foreground">{profile.professionalTitle || "No Title Set"}</p>
          </div>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Update your professional presence on TalentTrace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Full Name
                </Label>
                <Input 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Address
                </Label>
                <Input value={profile.email} disabled className="bg-slate-50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Professional Title
              </Label>
              <Input 
                placeholder="e.g. Senior Frontend Developer" 
                value={profile.professionalTitle}
                onChange={(e) => setProfile({...profile, professionalTitle: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Info className="h-4 w-4" /> Professional Bio
              </Label>
              <Textarea 
                className="min-h-[120px] resize-none" 
                placeholder="Tell us a bit about your experience..."
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            </div>

            <Button onClick={handleUpdate} disabled={loading} className="w-full h-11">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
