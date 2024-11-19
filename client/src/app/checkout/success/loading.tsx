import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto dark:bg-slate-900">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
            <div className="border-t border-b py-4">
              <Skeleton className="h-4 w-40 mb-2" />
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}