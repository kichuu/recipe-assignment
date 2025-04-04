"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

interface SavedRecipeCardProps {
  recipe: Recipe;
  onUnsave: () => void;
}

export default function SavedRecipeCard({
  recipe,
  onUnsave,
}: SavedRecipeCardProps) {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => router.push(`/search/${recipe._id}`)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={recipe.imageUrl || "/placeholder.svg?height=200&width=400"}
          alt={recipe.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold mb-1">Ingredients:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 line-clamp-3">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
              {recipe.ingredients.length > 3 && (
                <li>...and {recipe.ingredients.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card navigation
            onUnsave();
          }}
          variant="destructive"
          className="w-full"
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          Unsave
        </Button>
      </CardFooter>
    </Card>
  );
}
