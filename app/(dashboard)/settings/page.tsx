"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, CreditCard, Globe, Upload } from "lucide-react"

export default function SettingsPage() {
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
              <AvatarFallback className="bg-accent text-accent-foreground text-xl md:text-2xl">AK</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="gap-2 bg-transparent text-sm">
              <Upload className="w-4 h-4" />
              Change Photo
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Anshul" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Kumar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="anshul.kumar@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
            </div>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            Save Changes
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
