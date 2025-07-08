import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Edit, Trash2, BookOpenText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { DiaryEntry } from "@shared/schema";

export default function Diary() {
  const queryClient = useQueryClient();
  const { data: entries } = useQuery<DiaryEntry[]>({ queryKey: ["/api/diary"] });

  const [formState, setFormState] = useState<{ id?: number; date: string; content: string }>({
    date: new Date().toISOString().slice(0, 16),
    content: "",
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { id?: number; date: string; content: string }) => {
      if (data.id) {
        const res = await apiRequest("PUT", `/api/diary/${data.id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/diary", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      setFormState({ date: new Date().toISOString().slice(0, 16), content: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/diary/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <BookOpenText className="w-6 h-6 mr-2" /> Diary
        </h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="w-5 h-5 text-ocean-blue mr-2" />
            {formState.id ? "Edit Entry" : "New Entry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="datetime-local"
              value={formState.date}
              onChange={(e) => setFormState({ ...formState, date: e.target.value })}
            />
            <Textarea
              className="h-32"
              value={formState.content}
              onChange={(e) => setFormState({ ...formState, content: e.target.value })}
              placeholder="Write about today's training..."
            />
            <div className="flex space-x-4">
              <Button
                onClick={() => saveMutation.mutate(formState)}
                className="bg-white text-black hover:bg-gray-100 border border-gray-300 flex-1"
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
              {formState.id && (
                <Button
                  variant="outline"
                  onClick={() => setFormState({ date: new Date().toISOString().slice(0, 16), content: "" })}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {(entries || []).map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{format(new Date(entry.date), "MMM dd, yyyy HH:mm")}</span>
                <div className="space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setFormState({
                        id: entry.id,
                        date: new Date(entry.date as any).toISOString().slice(0, 16),
                        content: entry.content,
                      })
                    }
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(entry.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
