"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Bell, Moon, Sun, TrendingUp, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { MobileSidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
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
    setMounted(true)
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

  const getFullName = () => {
    return `${formData.firstName} ${formData.lastName}`.trim() || "User"
  }

  const openProfileDialog = (tab: string) => {
    setActiveTab(tab)
    setProfileDialogOpen(true)
  }

  return (
    <>
      <header className="h-14 md:h-16 border-b border-border bg-card px-3 md:px-6 flex items-center justify-between gap-2">
        {/* Mobile Menu + Welcome Message */}
        <div className="flex items-center gap-2 flex-1">
          <MobileSidebar />
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">NIFTY 50</span>
              <span className="text-sm text-success">+1.2%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <span className="text-sm font-medium text-foreground">SENSEX</span>
              <span className="text-sm text-success">+0.8%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Market Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Market Open
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative text-muted-foreground hover:text-foreground"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="font-medium">RELIANCE reached target price</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="font-medium">Portfolio up 2.5% today</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="font-medium">Dividend received: TCS</span>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {loading ? "..." : getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{loading ? "Loading..." : getFullName()}</p>
                  <p className="text-xs text-muted-foreground">{loading ? "..." : formData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openProfileDialog("profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openProfileDialog("settings")}>Account Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openProfileDialog("billing")}>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription>Manage your account settings and preferences</DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4 mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback className="bg-accent text-accent-foreground text-xl">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Photo</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
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
                </>
              )}
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market open/close alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security</CardTitle>
                  <CardDescription>Manage your security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">Change Password</Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">Enable Two-Factor Auth</Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">Manage Devices</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trading Preferences</CardTitle>
                  <CardDescription>Configure your trading settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirm before placing orders</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show position in quantity</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="billing" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Plan</CardTitle>
                  <CardDescription>You are currently on the Pro plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">Rs. 999/month</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">Active</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">UPI</div>
                      <span className="text-sm">anshul@okicici</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">HDFC</div>
                      <span className="text-sm">**** **** **** 4521</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">Add Payment Method</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Jan 2024</span>
                      <span>Rs. 999</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Dec 2023</span>
                      <span>Rs. 999</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Nov 2023</span>
                      <span>Rs. 999</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
