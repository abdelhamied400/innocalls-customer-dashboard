import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import TagsTable from "./table";

const CallSettings = () => {
  return (
    <div className="page h-full" id="call-settings">
      <Accordion type="multiple" className="flex flex-col h-full gap-2">
        <AccordionItem value="call-summary" className="border rounded-lg">
          <AccordionTrigger className="p-4">Call Summary</AccordionTrigger>
          <AccordionContent className="p-2 flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            <div className="flex items-center gap-2">
              <Switch />{" "}
              <p>Enable this option to view a summary after every call.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch />{" "}
              <p>
                Enable this option to view a summary after just connected calls.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="manage-tags"
          className="border rounded-lg data-[state=open]:flex-1 flex flex-col"
        >
          <AccordionTrigger className="p-4">Manage Tags</AccordionTrigger>
          <AccordionContent className="px-4 py-2 flex flex-col gap-2 h-[calc(100vh-380px)] overflow-y-auto">
            <TagsTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CallSettings;
