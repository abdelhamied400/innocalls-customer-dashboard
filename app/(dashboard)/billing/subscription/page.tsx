import PlanCard from "@/components/PlanCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

const Subscription = () => {
  return (
    <div className="page h-full overflow-auto" id="subscriptions">
      <div className="border rounded-xl p-4">
        <div className="head flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="title flex items-center gap-2">
            <h3>Subscription Details</h3>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="actions">
            <Button variant="outline">Manage Subscription</Button>
            <Button variant="link">Show Company documents</Button>
          </div>
        </div>
        <div className="details">
          <Table>
            <TableBody>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[200px]">Plan Name</TableHead>
                <TableCell>Basic plan</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[200px]">Paid</TableHead>
                <TableCell>Monthly</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[200px]">Number of users</TableHead>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[200px]">Auto renewal</TableHead>
                <TableCell>Renews on 1 Sep 2025</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[200px]">Next Payment</TableHead>
                <TableCell>$70</TableCell>
              </TableRow>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[200px]">Payment method</TableHead>
                <TableCell>Visa ending in 1234</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              ADD-ONS
            </h4>
            <Table>
              <TableBody>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="w-[200px]">Number of DIDS</TableHead>
                  <TableCell>
                    <span>3</span>
                    <Button
                      variant="link"
                      className="underline px-2 text-foreground font-light"
                    >
                      (2 Egyptian numbers / 1 KSA number)
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="w-[200px]">
                    Number of Channels
                  </TableHead>
                  <TableCell>10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="plans grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <PlanCard
          features={[
            "Soft phone for desktop Free Standard IVR(Interactive Voice Response)",
            "Inbound Roaming AgentFree Standard DID (Subject to Local Regulations)",
          ]}
          subtitle="Smart, Reliable Voice Services"
          title="Cloud Business Phone System"
          price="0$"
          per="month"
        />
        <PlanCard
          features={[
            "Free Admin User Licenses",
            "Mobile App Support for Android & iOS",
            "10+ CRM Integrations with API & Webhooks",
            "Unlimited Call Recording",
            "Unlimited Call Recording",
            "Advanced Analytics with a Real-Time Dashboard",
            "Sales Tools like Auto-Dialer & Call Queue Management",
            "Support Tools including Smart Call Routing & Recording",
            "WhatsApp Conversations (processing fees apply)",
            "24/7 Customer Support",
          ]}
          subtitle="Includes everything from the Cloud Business Phone System, plus:"
          title="Cloud Contact Center"
          price="30$"
          per="month"
        />
        <PlanCard
          features={[
            "Choice of Private or Public Cloud Deployment",
            "Support for Bring Your Own SIP Trunk (BYoSIP)",
            "Customizable Data Storage Policies",
            "Tailored System Integrations",
            "24/7 Dedicated Support",
            "Advanced IVR Capabilities",
          ]}
          subtitle="Includes everything from the Cloud Contact Center, plus:"
          title="Customize Your Package"
          per="month"
          renderPricing="Tailored Solutions to Fit All Your Business Requirements"
          renderActions={
            <Button className="w-full py-4 rounded-full">Contact Sales</Button>
          }
        />
      </div>
    </div>
  );
};

export default Subscription;
