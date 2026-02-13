import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      <section className="container-responsive grid items-center gap-10 pt-16 md:grid-cols-2">
        <div className="space-y-6 animate-fadeIn">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Cozy social cooking</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Tasty Tuesday — intimate cooking nights you can actually book.</h1>
          <p className="text-lg text-neutral-700">
            Join our weekly filmed cooking sessions. Limited seats, warm vibes, honest food. Reserve your single spot, meet the crew, and
            taste along.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/events">
              <Button>Book now</Button>
            </Link>
            <Link href="#featured">
              <Button variant="secondary">Watch how it feels</Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Seats are very limited — one booking per guest.
          </div>
        </div>
        <Card className="overflow-hidden p-0 shadow-cozy">
          <div className="aspect-video w-full bg-neutral-900">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Featured promo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="space-y-2 p-6">
            <h3 className="text-lg font-semibold">What a Tasty Tuesday feels like</h3>
            <p className="text-sm text-neutral-600">Behind-the-scenes from a recent episode. Come hungry, leave with new friends.</p>
          </div>
        </Card>
      </section>

      <section id="featured" className="container-responsive grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="space-y-3">
            <div className="aspect-[4/3] w-full rounded-xl bg-neutral-200" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Seasonal table #{i}</h3>
              <p className="text-sm text-neutral-600">Comfort food, soft lights, and the clink of good company.</p>
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
