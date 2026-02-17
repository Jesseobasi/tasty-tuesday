import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-[#0b0d14] py-10">
      <div className="container-responsive flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-neutral-400">© {new Date().getFullYear()} Tasty Tuesday. Cozy cooking, real connections.</div>
        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <Link href="/events">Events</Link>
          <Link href="/dashboard">My Booking</Link>
          <Link href="mailto:hello@tastytuesday.com">Contact</Link>
        </div>
      </div>
    </footer>
  );
};
