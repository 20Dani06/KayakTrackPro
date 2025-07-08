import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrainingEntry {
  id: number;
  trackLength: number;
  trackTime: string;
  windStrength: number;
  maxHeartRate: number;
  maxSpeed: number;
  state: string;
  note?: string;
}

const states = [
  "edzetlen",
  "nagyon fáradt",
  "fáradt",
  "semleges",
  "edzett",
];

const formSchema = z.object({
  trackLength: z.number().min(1, "Required"),
  trackTime: z.string().min(1, "Required"),
  windStrength: z.number().min(0, "Required"),
  maxHeartRate: z.number().min(0, "Required"),
  maxSpeed: z.number().min(0, "Required"),
  state: z.string().min(1, "Required"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function TrainingEntries() {
  const [entries, setEntries] = useState<TrainingEntry[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackLength: 1000,
      trackTime: "",
      windStrength: 0,
      maxHeartRate: 0,
      maxSpeed: 0,
      state: "semleges",
      note: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("trainingEntries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("trainingEntries", JSON.stringify(entries));
  }, [entries]);

  const onSubmit = (data: FormData) => {
    const entry: TrainingEntry = {
      id: Date.now(),
      ...data,
    };
    setEntries([...entries, entry]);
    form.reset({
      trackLength: 1000,
      trackTime: "",
      windStrength: 0,
      maxHeartRate: 0,
      maxSpeed: 0,
      state: "semleges",
      note: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edzés</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trackLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pálya hossza (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trackTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pálya ideje</FormLabel>
                    <FormControl>
                      <Input placeholder="1:45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="windStrength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Szél erősség (km/h)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxHeartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max pulzus (bpm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max sebesség (km/h)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Állapot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Megjegyzés / Érzés</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-white text-black border border-gray-300 hover:bg-gray-100">
              Hozzáadás
            </Button>
          </form>
        </Form>
        {entries.length > 0 && (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pálya (m)</TableHead>
                  <TableHead>Idő</TableHead>
                  <TableHead>Szél</TableHead>
                  <TableHead>Max HR</TableHead>
                  <TableHead>Max Seb.</TableHead>
                  <TableHead>Állapot</TableHead>
                  <TableHead>Megjegyzés</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.trackLength}</TableCell>
                    <TableCell>{e.trackTime}</TableCell>
                    <TableCell>{e.windStrength}</TableCell>
                    <TableCell>{e.maxHeartRate}</TableCell>
                    <TableCell>{e.maxSpeed}</TableCell>
                    <TableCell>{e.state}</TableCell>
                    <TableCell>{e.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

