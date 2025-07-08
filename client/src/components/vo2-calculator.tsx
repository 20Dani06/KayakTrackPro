import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calculator } from "lucide-react";
import { calculateVO2MaxFromPerformance } from "@/lib/kayak-calculations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const calculatorSchema = z.object({
  distance: z.number().min(0.1, "Distance must be at least 0.1 km"),
  time: z.number().min(0.1, "Time must be at least 0.1 minutes"),
  heartRate: z.number().min(50, "Heart rate must be at least 50 bpm"),
  weight: z.number().min(30, "Weight must be at least 30 kg"),
});

type CalculatorData = z.infer<typeof calculatorSchema>;

export default function VO2Calculator() {
  const [result, setResult] = useState<number | null>(null);
  
  const form = useForm<CalculatorData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      distance: 1.0,
      time: 4.0,
      heartRate: 185,
      weight: 75,
    },
  });

  const onSubmit = (data: CalculatorData) => {
    const vo2Max = calculateVO2MaxFromPerformance(data);
    setResult(vo2Max);
  };

  const getPerformanceLevel = (vo2Max: number) => {
    if (vo2Max >= 60) return "Elite";
    if (vo2Max >= 50) return "Excellent";
    if (vo2Max >= 40) return "Good";
    if (vo2Max >= 30) return "Fair";
    return "Poor";
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 text-ocean-blue mr-2" />
          VO₂ Max Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Enter your recent performance data to estimate your kayak-specific VO₂ max using paddling-optimized algorithms.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance (km)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="1.0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                      <FormLabel>Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="4.0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Heart Rate (bpm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="185"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="75"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300">
                  Calculate VO₂ Max
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-lg p-6 h-full">
              <h4 className="font-medium text-gray-900 mb-4">Estimated VO₂ Max</h4>
              
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-ocean-blue mb-2">
                  {result ? result.toFixed(1) : "54.2"}
                </div>
                <div className="text-sm text-gray-600 mb-4">ml/kg/min</div>
                
                <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                  <div className="font-medium text-gray-900 mb-1">Performance Level</div>
                  <div className="text-ocean-blue font-medium">
                    {result ? getPerformanceLevel(result) : "Excellent"}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                <strong>Note:</strong> This calculation is optimized for kayaking performance and factors in stroke efficiency, unlike generic fitness calculators.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
