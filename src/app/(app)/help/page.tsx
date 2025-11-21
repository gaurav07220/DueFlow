
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Search, Mail, BookUser, CreditCard, HelpCircle } from "lucide-react";
import React from "react";

const faqCategories = [
    {
        category: "Getting Started",
        icon: BookUser,
        questions: [
            {
                question: "How do I import my contacts?",
                answer: "You can import contacts from a CSV or Excel file on the Contacts page. Click the 'Import' button and follow the on-screen instructions to map your file columns to our contact fields."
            },
            {
                question: "Which channels can I use for reminders?",
                answer: "DueFlow supports sending reminders via Email, SMS, and WhatsApp. You can choose the desired channel when scheduling a new reminder. Note that SMS and WhatsApp require third-party API configurations (e.g., Twilio)."
            },
        ]
    },
    {
        category: "Billing & Subscription",
        icon: CreditCard,
        questions: [
            {
                question: "How does the subscription plan work?",
                answer: "We offer tiered subscription plans. The Free plan has a limit on the number of reminders you can send per month. Upgrading to a Pro or Enterprise plan unlocks higher limits and additional features like advanced analytics and API access."
            },
            {
                question: "Can I cancel my subscription at any time?",
                answer: "Yes, you can manage your subscription from the 'Billing' section in your account settings. You can cancel or change your plan at any time. Your access will continue until the end of the current billing period."
            },
        ]
    },
    {
        category: "Troubleshooting",
        icon: HelpCircle,
        questions: [
            {
                question: "What happens if a reminder fails to send?",
                answer: "If a reminder fails, its status will be marked as 'Failed' in the Reminders and History pages. The details column in the History log will provide more information about the cause of the failure."
            },
        ]
    }
];


export default function HelpPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredFaqs = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);


  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-block bg-primary/10 p-4 rounded-full">
            <LifeBuoy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Help & Support
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find answers to common questions, or reach out to our support team for assistance.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Search for answers..."
                className="w-full pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {filteredFaqs.map((category, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <category.icon className="h-5 w-5 text-primary" />
                        {category.category}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, i) => (
                            <AccordionItem value={`item-${index}-${i}`} key={i} className={i === category.questions.length - 1 ? 'border-b-0' : ''}>
                                <AccordionTrigger className="font-semibold text-left text-base">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        ))}

        {searchTerm && filteredFaqs.length === 0 && (
             <div className="text-center py-12">
                <p className="text-lg font-medium">No results found for "{searchTerm}"</p>
                <p className="text-muted-foreground mt-2">Try searching for something else, or contact support.</p>
            </div>
        )}
      </div>

      <Card className="max-w-3xl mx-auto border-primary/50 bg-primary/5">
        <CardHeader className="text-center">
            <CardTitle className="font-headline">Can't find what you're looking for?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Our support team is here to help. Reach out to us for any questions or issues.</p>
            <Button>
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
