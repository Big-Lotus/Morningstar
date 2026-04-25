import { HomeClient } from "@/components/HomeClient";
import { articles, categories } from "@/lib/data";

export default function HomePage() {
  return <HomeClient articles={articles} categories={categories} />;
}
