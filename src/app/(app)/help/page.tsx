import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "How do I import my contacts?",
        answer: "You can import contacts from a CSV or Excel file on the Contacts page. Click the 'Import' button and follow the on-screen instructions to map your file columns to our contact fields."
    },
    {
        question: "Which channels can I use for reminders?",
        answer: "FollowPilot supports sending reminders via Email, SMS, and WhatsApp. You can choose the desired channel when scheduling a new reminder. Note that SMS and WhatsApp require third-party API configurations (e.g., Twilio)."
    },
    {
        question: "How does the subscription plan work?",
        answer: "We offer tiered subscription plans. The Free plan has a limit on the number of reminders you can send per month. Upgrading to a Pro or Enterprise plan unlocks higher limits and additional features like advanced analytics and API access."
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can manage your subscription from the 'Billing' section in your account settings. You can cancel or change your plan at any time. Your access will continue until the end of the current billing period."
    },
    {
        question: "What happens if a reminder fails to send?",
        answer: "If a reminder fails, its status will be marked as 'Failed' in the Reminders and History pages. The details column in the History log will provide more information about the cause of the failure."
    }
];

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-0 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Help & Support
        </h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions about FollowPilot.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="font-semibold text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
