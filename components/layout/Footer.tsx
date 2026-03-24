import { LubinLogoMark, FacebookIcon, XIcon, LinkedinIcon } from "@/components/icons";

const QUICK_LINKS = ["Find a Coach", "Services", "About Us", "Contact"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "FAQ"];

const SOCIAL = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: XIcon,        label: "X"        },
  { Icon: LinkedinIcon, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[#002B66]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center mb-2">
              <LubinLogoMark fill="white" height={18} />
            </div>
            <p className="text-[12px] text-[#95979C] leading-relaxed">
              Support your journey to better health with professional care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3 tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((label) => (
                <li key={label}>
                  <button className="text-[12px] text-[#95979C] hover:text-white transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3 tracking-wide">Legal</h4>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((label) => (
                <li key={label}>
                  <button className="text-[12px] text-[#95979C] hover:text-white transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3 tracking-wide">Connect With Us</h4>
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-7 h-7 rounded-full bg-[#FDFDFD]/10 flex items-center justify-center text-white hover:bg-[#FDFDFD]/20 transition-colors"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#86888D]">© 2025 Lubin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
