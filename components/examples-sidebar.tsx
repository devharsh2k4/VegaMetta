"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const examples = [
  {
    title: "Factorial",
    description: "Recursive factorial calculation",
    code: `! define factorial
(= (factorial $n)
   (if (== $n 0)
       1
       (* $n (factorial (- $n 1)))))`,
  },
  {
    title: "Fibonacci",
    description: "Fibonacci sequence calculation",
    code: `! define fibonacci
(= (fibonacci $n)
   (if (<= $n 1)
       $n
       (+ (fibonacci (- $n 1))
          (fibonacci (- $n 2)))))`,
  },
  {
    title: "List Operations",
    description: "Basic list manipulation",
    code: `! define reverse
(= (reverse $list)
   (if (empty? $list)
       ()
       (append (reverse (rest $list))
              (list (first $list)))))`,
  },
];

interface ExamplesSidebarProps {
  onSelectExample: (code: string) => void;
}

export function ExamplesSidebar({ onSelectExample }: ExamplesSidebarProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Examples</CardTitle>
        <CardDescription>
          Click on an example to load it into the editor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {examples.map((example, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => onSelectExample(example.code)}
                  >
                    Load Example
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}