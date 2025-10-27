import AIAssistant from "./AIAssistant";

export default function Hero() {
  return (
    <section className="relative w-full border-b border-border/40">
      <div className="container grid lg:grid-cols-2 gap-12 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              <span className="text-primary-gradient">Chancellor Minus</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Full-stack developer with a passion for building intelligent applications. Explore my work and chat with my AI assistant to learn more.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
            <AIAssistant />
        </div>
      </div>
    </section>
  );
}
