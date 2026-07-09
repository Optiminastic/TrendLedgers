import Link from "next/link";
import { navLinks } from "../lib/data";
import {
  FacebookIcon,
  XIcon,
  TwitterIcon,
  MailIcon,
} from "./icons";

const socials = [
  { label: "Facebook", Icon: FacebookIcon },
  { label: "X", Icon: XIcon },
  { label: "Twitter", Icon: TwitterIcon },
  { label: "Newsletter", Icon: MailIcon },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-rule bg-[#111] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center">
        <Link href="#" className="font-display text-3xl font-black tracking-tight">
          Trend Ledgers
        </Link>
        <p className="max-w-xl font-serif text-sm leading-relaxed text-white/70">
          The latest market news, trending stories and the popular topics shaping
          business, lifestyle and sport — curated daily.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/80">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="hover:text-subscribe">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {socials.map(({ label, Icon }) => (
            <Link
              key={label}
              href="#"
              aria-label={label}
              className="text-white/70 hover:text-subscribe"
            >
              <Icon width={18} height={18} />
            </Link>
          ))}
        </div>

        <p className="text-xs text-white/50">
          © {2025} Trend Ledgers. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
