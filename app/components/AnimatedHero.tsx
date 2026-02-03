'use client';

export default function AnimatedHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-500 to-blue-700 text-white">
      <div className="mx-auto max-w-5xl px-4 py-14 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Buiten Drogen Calculator</h1>
        <p className="mt-4 text-lg opacity-90">
          Bereken hoe lang je was nodig heeft om buiten te drogen op basis van het actuele weer.
        </p>
      </div>
    </section>
  );
}
