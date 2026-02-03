"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ExternalLink,
} from "lucide-react"

const faqs = [
  {
    question: "How do I add a new stock to my portfolio?",
    answer: "Navigate to the Stocks page, find the stock you want to add, and click the star icon to add it to your watchlist. From there, you can record purchases in the Investments section.",
  },
  {
    question: "How are my returns calculated?",
    answer: "Returns are calculated based on your purchase price and the current market price of your holdings. We use real-time data to ensure accuracy.",
  },
  {
    question: "Can I connect multiple bank accounts?",
    answer: "Yes! You can connect multiple bank accounts and wallets in the Investments page. Click 'Add Wallet' to link a new account.",
  },
  {
    question: "How do I set price alerts?",
    answer: "Go to the Stocks page, click on any stock, and set your target price. You'll receive notifications when the stock reaches your specified price.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use bank-level encryption and never store your login credentials. Your data is protected with industry-leading security measures.",
  },
  {
    question: "How do I export my portfolio data?",
    answer: "You can export your data in CSV or PDF format from the Settings page under 'Data Export'. This includes all your transactions and holdings.",
  },
]

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of PortfolioX",
    icon: BookOpen,
    link: "#",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials",
    icon: Video,
    link: "#",
  },
  {
    title: "API Documentation",
    description: "For developers and integrations",
    icon: FileText,
    link: "#",
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Help Center</h1>
        <p className="text-sm md:text-base text-muted-foreground">Find answers and get support</p>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 md:pt-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-9 md:pl-10 h-10 md:h-12 text-sm md:text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer">
            <CardContent className="pt-4 md:pt-6 pb-4">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <resource.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 text-sm md:text-base">{resource.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Still need help?</CardTitle>
          <CardDescription>Our support team is here to assist you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <MessageCircle className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-medium text-foreground mb-1">Live Chat</p>
              <p className="text-sm text-muted-foreground mb-3">Chat with our team</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Start Chat
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Mail className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-medium text-foreground mb-1">Email Us</p>
              <p className="text-sm text-muted-foreground mb-3">support@portfoliox.com</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Send Email
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Phone className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-medium text-foreground mb-1">Call Us</p>
              <p className="text-sm text-muted-foreground mb-3">+1 (800) 123-4567</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Call Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
