import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RaceResults from "@/components/race-results";
import TrainingEntries from "@/components/training-entries";

export default function TimeEntryDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100" onClick={() => setOpen(true)}>
        Idő bevitele
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Idő bevitele</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="race" className="mt-4">
            <TabsList>
              <TabsTrigger value="race">Verseny</TabsTrigger>
              <TabsTrigger value="training">Edzés</TabsTrigger>
            </TabsList>
            <TabsContent value="race">
              <RaceResults />
            </TabsContent>
            <TabsContent value="training">
              <TrainingEntries />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
