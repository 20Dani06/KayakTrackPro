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

interface RaceResult {
  id: number;
  name: string;
  wind: string;
  location: string;
  distance: number;
  time: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  wind: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  distance: z.number().min(0.1, "Distance must be positive"),
  time: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof formSchema>;

export default function RaceResults() {
  const [results, setResults] = useState<RaceResult[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      wind: "",
      location: "",
      distance: 200,
      time: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("raceResults");
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("raceResults", JSON.stringify(results));
  }, [results]);

  const onSubmit = (data: FormData) => {
    const newResult: RaceResult = {
      id: Date.now(),
      ...data,
    };
    setResults([...results, newResult]);
    form.reset();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">Race Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race Name</FormLabel>
                    <FormControl>
                      <Input placeholder="National Championship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind Strength</FormLabel>
                    <FormControl>
                      <Input placeholder="3 m/s tailwind" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Track</FormLabel>
                    <FormControl>
                      <Input placeholder="Lake Course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="50"
                        placeholder="500"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="1:50.2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="bg-white text-black border border-gray-300 hover:bg-gray-100"
            >
              Add Result
            </Button>
          </form>
        </Form>

        {results.length > 0 && (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Race</TableHead>
                  <TableHead>Wind</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Distance (m)</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.wind}</TableCell>
                    <TableCell>{result.location}</TableCell>
                    <TableCell className="text-right">
                      {result.distance}
                    </TableCell>
                    <TableCell className="text-right">{result.time}</TableCell>
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
