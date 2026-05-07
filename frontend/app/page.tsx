import { Navbar } from "@/components/sentinel/navbar";
import { Hero } from "@/components/sentinel/hero";
import { ProblemSolution } from "@/components/sentinel/problem-solution";
import { Features } from "@/components/sentinel/features";
import { CodeBlock } from "@/components/sentinel/code-block";
import { Footer } from "@/components/sentinel/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Features />
      <CodeBlock />
      <Footer />
    </main>
  );
}
