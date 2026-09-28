import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">
          Esta página está em construção. Em breve você poderá gerenciar {title.toLowerCase()} aqui.
        </p>
        <Button variant="outline">Voltar</Button>
      </Card>
    </div>
  );
}
