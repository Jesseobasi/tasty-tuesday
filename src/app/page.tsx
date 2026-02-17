import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121725] via-[#0d111f] to-[#0b0f1f]" />
        <div className="container-responsive relative grid items-center gap-10 pt-16 md:grid-cols-2">
          <div className="space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-3 py-1 text-xs uppercase tracking-[0.3em] text-neutral-300 border border-neutral-800">
              Cozy social cooking
            </div>
            <h1 className="text-4xl font-bold leading-tight text-offwhite md:text-5xl">
              Tasty Tuesday — intimate cooking nights you can actually book.
            </h1>
            <p className="text-lg text-neutral-300">
              Join our weekly filmed cooking sessions. Limited seats, warm vibes, honest food. Reserve your single spot, meet the crew, and taste along.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/events">
                <Button>Book now</Button>
              </Link>
              <Link href="#featured">
                <Button variant="secondary">Watch how it feels</Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(255,79,121,0.9)]" />
              Seats are very limited — one booking per guest.
            </div>
          </div>
          <Card className="overflow-hidden p-0 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.7)]">
            <div className="aspect-video w-full bg-gradient-to-br from-[#0f172a] to-[#0b0d14]">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Featured promo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="space-y-2 p-6">
              <h3 className="text-lg font-semibold text-offwhite">What a Tasty Tuesday feels like</h3>
              <p className="text-sm text-neutral-400">Behind-the-scenes from a recent episode. Come hungry, leave with new friends.</p>
            </div>
          </Card>
        </div>
      </section>

      <section id="featured" className="container-responsive grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="space-y-3 p-4">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#1f2937] to-[#0f172a] border border-neutral-800" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-offwhite">Seasonal table #{i}</h3>
              <p className="text-sm text-neutral-400">Comfort food, soft lights, and the clink of good company.</p>
            </div>
          </Card>
        ))}
      </section>

      <section className="container-responsive grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming events</h3>
          <p className="text-sm text-neutral-700">See dates, seats left, and book directly.</p>
          <Link href="/events">
            <Button>View events</Button>
          </Link>
        </Card>
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Already booked?</h3>
          <p className="text-sm text-neutral-700">Check your status, see reminders, or cancel if plans change.</p>
          <Link href="/dashboard">
            <Button variant="secondary">Go to my booking</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
