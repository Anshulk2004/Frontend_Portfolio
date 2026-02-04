"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, CreditCard, Globe, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  panNumber: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    panNumber: "",
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/api/user")
      const data = response.data
      setUserData(data)
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        panNumber: data.panNumber || "",
      })
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await axios.post("http://localhost:8080/api/user", {
        id: userData?.id,
        email: formData.email,
        password: userData?.password || "",
        firstName: formData.firstName,
        lastName: formData.lastName,
        panNumber: formData.panNumber,
        phoneNumber: formData.phoneNumber,
        createdAt: userData?.createdAt,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })

      // Refresh user data
      await fetchUserData()
    } catch (error) {
      console.error("Failed to update user data:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = () => {
    if (!formData.firstName && !formData.lastName) return "U"
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <Avatar className="w-16 h-16 md:w-20 md:h-20">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-accent text-accent-foreground text-xl md:text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="gap-2 bg-transparent text-sm">
              <Upload className="w-4 h-4" />
              Change Photo
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
          </div>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg">Billing</CardTitle>
          </div>
          <CardDescription>Manage your subscription and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Pro Plan</p>
                <p className="text-sm text-muted-foreground">Rs. 2,499/month - Renews Jan 15, 2025</p>
              </div>
              <Button variant="outline" className="bg-transparent">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg">Language & Region</CardTitle>
          </div>
          <CardDescription>Set your language and regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Input defaultValue="English (India)" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input defaultValue="INR (Rs.)" readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
