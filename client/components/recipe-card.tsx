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
import { BookmarkIcon, CheckIcon } from "lucide-react";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: () => void;
  saved?: boolean;
}

export default function RecipeCard({
  recipe,
  onSave,
  saved = false,
}: RecipeCardProps) {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => router.push(`/search/${recipe._id}`)} // Navigate to recipe details
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
        {/* {!saved && onSave && (
          // <Button
          //   onClick={(e) => {
          //     e.stopPropagation(); // Prevents navigation when clicking save
          //     onSave();
          //   }}
          //   variant="outline"
          //   className="w-full"
          // >
          //   <BookmarkIcon className="h-4 w-4 mr-2" />
          //   Save Recipe
          // </Button>
        )} */}
        {saved && (
          <Button variant="outline" className="w-full" disabled>
            <CheckIcon className="h-4 w-4 mr-2" />
            Saved
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
