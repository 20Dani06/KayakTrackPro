import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type Event as RBCEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import type { Event as CalendarEvent } from "@shared/schema";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const { data: events } = useQuery<CalendarEvent[]>({ queryKey: ["/api/events"] });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    start: "",
    end: "",
    raceNumber: "",
    eventNumber: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formState) => {
      const res = await apiRequest("POST", "/api/events", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setFormState({ title: "", start: "", end: "", raceNumber: "", eventNumber: "" });
      setDialogOpen(false);
    },
  });

  const calendarEvents: RBCEvent[] = (events || []).map((e) => ({
    id: e.id,
    title: e.title,
    start: new Date(e.start),
    end: e.end ? new Date(e.end) : new Date(e.start),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Calendar
            <Button onClick={() => setDialogOpen(true)}>New Event</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <BigCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              defaultView={Views.MONTH}
              style={{ height: "100%" }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <div className="space-y-4">
            <Input
              placeholder="Event title"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={formState.start}
              onChange={(e) => setFormState({ ...formState, start: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={formState.end}
              onChange={(e) => setFormState({ ...formState, end: e.target.value })}
            />
            <Input
              placeholder="Race number"
              value={formState.raceNumber}
              onChange={(e) => setFormState({ ...formState, raceNumber: e.target.value })}
            />
            <Input
              placeholder="Event number"
              value={formState.eventNumber}
              onChange={(e) => setFormState({ ...formState, eventNumber: e.target.value })}
            />
            <Button onClick={() => createMutation.mutate(formState)} className="w-full">
              {createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
