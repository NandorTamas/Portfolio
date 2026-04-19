"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ─── Breakpoint Hook ──────────────────────────────────────────────────────────

function useBreakpoint() {
  // Start at 1200 (desktop) so SSR and initial hydration always match.
  // After mount, update to the real viewport width.
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update(); // apply real width immediately after hydration
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1100,
    isDesktop: width >= 1100,
    width,
  };
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Smooth Scroll Utility ────────────────────────────────────────────────────

function smoothScroll(targetId: string, duration: number) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const start = window.scrollY;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const distance = targetTop - start;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Simple ease-out-cubic for smooth deceleration
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, start + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}

// ─── Case Study Data ──────────────────────────────────────────────────────────

interface CaseStudyData {
  id: string;
  category: string;
  title: string;
  year: string;
  role: string;
  comingSoon?: boolean;
}

const CASE_STUDIES: CaseStudyData[] = [
  {
    id: "olive-ink",
    category: "Olive → INK: Adopting a New System",
    title: "Turning a 7-Year Problem into an 18 Month Success",
    year: "2026",
    role: "Product Design Director",
  },
  {
    id: "reimagining-contracts",
    category: "AI to UI • When AI Becomes the Interface",
    title: "Reimagining Contracts as a Generative Experience",
    year: "2025",
    role: "Product Design Director",
    comingSoon: true,
  },
  {
    id: "agent-driven-future",
    category: "From System to Platform",
    title: "Designing for an Agent-Driven Future",
    year: "2026",
    role: "Product Design Director",
    comingSoon: true,
  },
  {
    id: "measuring-delight",
    category: "Quantifying the Feel of an Interface",
    title: "Measuring Delight Through Motion",
    year: "2026",
    role: "Product Design Director",
    comingSoon: true,
  },
];

// ─── Reusable Components ──────────────────────────────────────────────────────

function ComingSoonChip() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full ml-4"
      style={{
        background: "#75068c",
        height: "17px",
        padding: "0 10px",
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.5px",
        color: "#f7ceff",
        textTransform: "uppercase",
        verticalAlign: "middle",
        lineHeight: "17px",
      }}
    >
      Coming Soon
    </span>
  );
}

// ─── Nav Icon ─────────────────────────────────────────────────────────────────

function NavIcon({
  src,
  label,
  href,
  target,
  download,
}: {
  src: string;
  label: string;
  href: string;
  target?: string;
  download?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { isMobile } = useBreakpoint();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // For hash links on mobile, use custom scroll; on desktop use native smooth scroll
    if (isMobile && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      smoothScroll(targetId, 600); // 600ms for mobile
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        download={download || undefined}
        aria-label={label}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: hovered ? "#75068C" : "#ffffff",
            maskImage: `url('${src}')`,
            WebkitMaskImage: `url('${src}')`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            transition: "background 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
            transform: hovered ? "scale(1.18)" : "scale(1)",
          }}
        />
      </a>

      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 12px)",
          left: "50%",
          transform: `translateX(-50%)`,
          background: "#110019",
          border: "1px solid rgba(117,6,140,0.55)",
          borderRadius: "6px",
          padding: "5px 11px",
          whiteSpace: "nowrap",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.6px",
          color: "#ee99ff",
          textTransform: "uppercase",
          pointerEvents: "none",
          zIndex: 100,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.18s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: "6px solid rgba(117,6,140,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottom: "5px solid #110019",
          }}
        />
        {label}
      </div>
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  const { isMobile } = useBreakpoint();

  return (
    <header
      className="w-full flex items-start justify-between"
      style={{
        paddingTop: isMobile ? "28px" : "60px",
        paddingLeft: "clamp(16px, 5vw, 277px)",
        paddingRight: "clamp(16px, 5vw, 277px)",
      }}
    >
      {/* Eames Quote — hidden on smallest screens to avoid crowding */}
      {!isMobile && (
        <div style={{ maxWidth: "640px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#ee99ff",
              lineHeight: 1.5,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            &ldquo;The role of the designer is that of a good, thoughtful host
            anticipating the needs of his guests.&rdquo;
          </p>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#ee99ff",
              lineHeight: 1.5,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            – Charles Eames
          </p>
        </div>
      )}

      {/* Social Icons */}
      <nav
        className="flex items-center gap-5"
        aria-label="Social links"
        style={{ margin: isMobile ? "0 auto" : undefined }}
      >
        <NavIcon src="/assets/case-studies-icon.svg" label="Case Studies" href="#case-studies" />
        <NavIcon src="/assets/resume-icon.svg" label="Résumé" href="/assets/Tamas-Resume-2026.pdf" download />
        <NavIcon src="/assets/email-icon.svg" label="Email" href="mailto:nandor@stungmedia.com" />
        <NavIcon src="/assets/linkedin-icon.svg" label="LinkedIn" href="https://www.linkedin.com/in/nandortamas/" target="_blank" />
      </nav>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const isSmall = !isDesktop; // mobile or tablet

  return (
    <section
      className="relative w-full"
      style={{
        marginTop: isMobile ? "32px" : isTablet ? "48px" : "84px",
        // Desktop: paddingBottom creates room for the absolutely-positioned photo
        paddingBottom: isDesktop ? "408px" : "0",
      }}
      aria-label="Introduction"
    >
      <div
        className="relative mx-auto"
        style={{ maxWidth: "1540px", padding: "0 16px" }}
      >
        {/* Glass card — single wrapper with rgba bg (no opacity trick needed for responsive) */}
        <div
          className="rounded-[40px]"
          style={{
            background: "rgba(247,206,255,0.075)",
            boxShadow: "0px 4px 50px 3px rgba(117,6,140,0.5)",
            // Desktop: fixed height with horizontal layout
            // Mobile/Tablet: auto height with vertical stacking
            height: isDesktop ? "602px" : "auto",
            display: "flex",
            flexDirection: isSmall ? "column" : "row",
            alignItems: isSmall ? "flex-start" : "center",
            justifyContent: isSmall ? "flex-start" : "space-between",
            padding: isMobile
              ? "40px 28px 48px"
              : isTablet
              ? "52px 56px 60px"
              : "0 103px",
            gap: isSmall ? "40px" : "0",
          }}
        >
          {/* Left / Top: Name + Headline */}
          <div
            style={{
              maxWidth: isDesktop ? "707px" : "100%",
              width: isDesktop ? undefined : "100%",
              textAlign: isMobile ? "center" : undefined,
            }}
          >
            <p
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
                lineHeight: "normal",
              }}
            >
              NANDOR TAMAS
            </p>
            <p
              style={{
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 500,
                color: "#ee99ff",
                letterSpacing: "0.7px",
                textTransform: "uppercase",
                margin: "16px 0 0",
                lineHeight: "normal",
              }}
            >
              Director of Design • AI, Platform, Systems, and Brand Experience
            </p>

            {/* Decorative line */}
            <div
              style={{
                width: "156px",
                height: "1px",
                background: "#75068C",
                marginTop: "40px",
                margin: isMobile ? "40px auto 0" : "40px 0 0",
              }}
            />

            {/* Headline */}
            <p
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 200,
                fontSize: isMobile ? "32px" : isTablet ? "42px" : "50px",
                color: "#ffffff",
                lineHeight: "normal",
                margin: "32px 0 0",
              }}
            >
              {"For me, design is "}
              <span style={{ fontWeight: 400 }}>removing the gap</span>
              {" between how it looks and how it works."}
            </p>
          </div>

          {/* Right / Bottom: Venn Diagram + tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isSmall ? "20px" : "32px",
              flexShrink: 0,
              width: isSmall ? "100%" : "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/ven-diagram.svg"
              alt="Venn diagram: Product, Nandor, Marketing — where product and marketing stop competing and start working"
              style={{
                display: "block",
                width: isMobile ? "486px" : isTablet ? "420px" : "486px",
                height: "auto",
              }}
            />
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#ee99ff",
                letterSpacing: "0.7px",
                textTransform: "uppercase",
                textAlign: "center",
                maxWidth: "440px",
                lineHeight: "normal",
                margin: 0,
              }}
            >
              Where product and marketing
              <br />
              stop competing and start working.
            </p>
          </div>
        </div>
      </div>

      {/* Photo — absolutely positioned on desktop (overlaps sections below),
          in-flow and centered on mobile/tablet */}
      {isDesktop ? (
        <div
          className="absolute"
          style={{
            left: "50%",
            transform: "translateX(-231px)",
            top: "492px",
            width: "462px",
            height: "462px",
            zIndex: 20,
          }}
        >
          <Image
            src="/assets/nandor-photo-3.png"
            alt="Nandor Tamas"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: isMobile ? "32px" : "48px",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: isMobile ? "475px" : "360px",
              height: isMobile ? "475px" : "360px",
              flexShrink: 0,
            }}
          >
            <Image
              src="/assets/nandor-photo-3.png"
              alt="Nandor Tamas"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Location ─────────────────────────────────────────────────────────────────

function LocationSection({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const iconRef = useRef<HTMLImageElement>(null);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    const el = iconRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setDropped(true); observer.disconnect(); } },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="flex flex-col items-center"
      style={{ marginTop: isMobile ? "48px" : isTablet ? "64px" : "0" }}
      aria-label="Location"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={iconRef}
        src="/assets/geo-icon.svg"
        alt="Location"
        width={39}
        height={48}
        className={dropped ? "geo-pin-drop" : ""}
        style={{ opacity: dropped ? undefined : 0 }}
      />
      <p
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#ee99ff",
          letterSpacing: "0.7px",
          textTransform: "uppercase",
          textAlign: "center",
          margin: "16px 0 0",
        }}
      >
        Chicago, IL • Remote
      </p>
    </section>
  );
}

// ─── About Intro ──────────────────────────────────────────────────────────────

function AboutIntroSection({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  return (
    <section
      className="mx-auto text-center"
      style={{
        maxWidth: "1374px",
        marginTop: isMobile ? "40px" : isTablet ? "56px" : "32px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
      aria-label="About"
    >
      <p
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 200,
          fontSize: "clamp(22px, 2.6vw, 50px)",
          color: "#f7ceff",
          lineHeight: "normal",
          margin: 0,
        }}
      >
        I work at the intersection of product, brand, and business, bringing a
        marketing foundation to how experiences are shaped and scaled. I use
        data &amp; research to inform instinct and turn the tension between
        product and marketing into design that performs.
      </p>
    </section>
  );
}

// ─── Corporate Design Level ───────────────────────────────────────────────────

function CorporateDesignSection({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const paragraphs = [
    `I shape UX and UI at a systems level, translating brand into product in a way that feels seamless, not applied. My background spans visual design, creative marketing, systems thinking, and strategy, allowing me to connect craft with real business outcomes.`,
    `I pair instinct with data to guide design decisions that not only feel right but perform, scale, and drive measurable impact. I lean into the tension across product, engineering, and marketing to unlock better ideas, stronger alignment, and more meaningful experiences.`,
    `My work is increasingly focused on the evolving role of AI in design. I explore how generative systems, adaptive interfaces, and agent-driven experiences are reshaping how products are imagined and built. I believe the future of design is not just about creating interfaces, but about defining the systems, behaviors, and guardrails that allow AI to operate with intention, consistency, and brand integrity.`,
    `Known for my infectious spirit and collaborative approach, I lead and inspire teams of designers, engineers, and artists, partnering across product, engineering, and marketing to drive adoption, increase velocity, and deliver impactful design work that scales. I build environments where creativity and systems thinking coexist, where experimentation is encouraged, and where design plays a central role in shaping the future of intelligent products.`,
  ];

  return (
    <section
      className="mx-auto"
      style={{
        maxWidth: "1374px",
        marginTop: isMobile ? "72px" : isTablet ? "100px" : "216px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#ee99ff",
          letterSpacing: "0.7px",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        The Corporate Design Level
      </p>

      <div
        style={{
          marginTop: "32px",
          width: "156px",
          height: "1px",
          background: "#75068C",
        }}
      />

      <div style={{ marginTop: "32px" }}>
        {paragraphs.map((text, i) => (
          <p
            key={i}
            style={{
              fontSize: isMobile ? "18px" : "24px",
              fontWeight: 400,
              color: "#f7ceff",
              lineHeight: "1.5",
              letterSpacing: "0.48px",
              margin: i < paragraphs.length - 1 ? "0 0 24px" : 0,
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}

// ─── Nandor Meaning ───────────────────────────────────────────────────────────

function NandorMeaningSection({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  return (
    <section
      className="mx-auto text-center"
      style={{
        maxWidth: "1374px",
        marginTop: isMobile ? "72px" : isTablet ? "100px" : "206px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <p
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 200,
          fontSize: "clamp(22px, 2.6vw, 50px)",
          color: "#f7ceff",
          lineHeight: "normal",
          margin: 0,
        }}
      >
        People always ask, &ldquo;What does Nandor mean?&rdquo; The name itself
        means &ldquo;Ready for Journey&rdquo; in Hungarian. I&rsquo;d like to
        think of me as just that &mdash; always ready for journey.
      </p>
    </section>
  );
}

// ─── Case Study Item ──────────────────────────────────────────────────────────

interface CaseStudyItemProps {
  category: string;
  title: string;
  year: string;
  role: string;
  comingSoon?: boolean;
  noBorder?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
}

function CaseStudyItem({
  category,
  title,
  year,
  role,
  comingSoon = false,
  noBorder = false,
  onClick,
  isMobile = false,
}: CaseStudyItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="py-8" style={{ letterSpacing: "0.48px", display: "flex", flexDirection: "column" }}>
        <p
          style={{
            fontSize: isMobile ? "16px" : "24px",
            fontWeight: 300,
            color: "#f7ceff",
            lineHeight: "1.75",
            margin: 0,
          }}
        >
          {category}
          {!isMobile && comingSoon && <ComingSoonChip />}
        </p>
        <p
          style={{
            fontSize: isMobile ? "16px" : "24px",
            fontWeight: 600,
            color: hovered ? "#75068C" : "#ffffff",
            lineHeight: "1.75",
            margin: 0,
            transition: "color 0.2s ease",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: isMobile ? "14px" : "24px",
            fontWeight: 400,
            color: "#f7ceff",
            lineHeight: "1.75",
            margin: 0,
          }}
        >
          {year} • {role}
        </p>
        {isMobile && comingSoon && (
          <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-start" }}>
            <span
              className="inline-flex items-center justify-center rounded-full"
              style={{
                background: "#75068c",
                height: "17px",
                padding: "0 10px",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.5px",
                color: "#f7ceff",
                textTransform: "uppercase",
                lineHeight: "17px",
              }}
            >
              Coming Soon
            </span>
          </div>
        )}
      </div>
      {!noBorder && (
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(247,206,255,0.5) 0%, rgba(247,206,255,0.1) 100%)",
          }}
        />
      )}
    </div>
  );
}

// ─── Case Study Panel ─────────────────────────────────────────────────────────

const CASE_STUDY_PASSWORDS: Record<string, string> = {
  "olive-ink":             "2026",
  "reimagining-contracts": "1976",
  "agent-driven-future":   "1976",
  "measuring-delight":     "1976",
};

function CaseStudyPanel({
  study,
  onClose,
}: {
  study: CaseStudyData | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [panelScrolled, setPanelScrolled] = useState(false);
  const [backTopHovered, setBackTopHovered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  // ── Password state ──
  const [unlocked, setUnlocked] = useState(false);
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [pwError, setPwError] = useState(false);
  const [animClass, setAnimClass] = useState<"pw-shake" | "">(""); // no fly-in; wrapper handles opacity
  const [boxReady, setBoxReady] = useState(false);     // true after panel slide-in completes
  const [boxFading, setBoxFading] = useState(false);   // true while card is fading out on close
  const [unlockFading, setUnlockFading] = useState(false); // true during slow reveal after correct pw
  const digitRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  // Reset password state whenever a new study opens, then fade card in after panel slides in
  useEffect(() => {
    setUnlocked(false);
    setDigits(["", "", "", ""]);
    setPwError(false);
    setAnimClass("");
    setBoxReady(false);
    setBoxFading(false);
    setUnlockFading(false);
    // Panel slide-in is 0.52s — show the card after it finishes
    const t = setTimeout(() => setBoxReady(true), 560);
    return () => clearTimeout(t);
  }, [study?.id]);

  // Auto-focus first digit box once card is visible
  useEffect(() => {
    if (boxReady && !unlocked) {
      const t = setTimeout(() => digitRefs.current[0]?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [boxReady, unlocked]);

  // Close: just slide the panel away — keep blur in place, don't reveal anything
  function handleOverlayClose() {
    onClose();
  }

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setPwError(false);
    if (cleaned && index < 3) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      digitRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleSubmit();
  }

  function handleSubmit() {
    const entered = digits.join("");
    const correctPassword = study?.id ? CASE_STUDY_PASSWORDS[study.id] : undefined;
    if (correctPassword && entered === correctPassword) {
      setPwError(false);
      setUnlockFading(true);
      // Slow fade — reveal the page after the overlay fades out
      setTimeout(() => setUnlocked(true), 900);
    } else {
      setPwError(true);
      setAnimClass("pw-shake");
      setDigits(["", "", "", ""]);
      setTimeout(() => {
        setAnimClass("");
        digitRefs.current[0]?.focus();
      }, 520);
    }
  }

  // Panel scroll-to-top button visibility
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onScroll = () => setPanelScrolled(el.scrollTop > 320);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [rendered]);

  useEffect(() => {
    if (study) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 520);
      return () => clearTimeout(t);
    }
  }, [study]);

  useEffect(() => {
    if (rendered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [rendered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!rendered) return null;

  const sidePad = isMobile ? "24px" : isTablet ? "48px" : "clamp(48px, 8vw, 160px)";

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={study?.title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)",
        background: "linear-gradient(170deg, #610174 0%, #110022 40%, #0d0018 100%)",
        overflowY: unlocked ? "auto" : "hidden",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Panel scroll-to-top button — rendered via portal outside the transformed
          panel so position:fixed is relative to the viewport, not the panel */}
      {isDesktop && unlocked && typeof document !== "undefined" && createPortal(
        <button
          onClick={() => panelRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={() => setBackTopHovered(true)}
          onMouseLeave={() => setBackTopHovered(false)}
          aria-label="Scroll to top"
          style={{
            position: "fixed",
            bottom: "36px",
            right: "36px",
            zIndex: 650,
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: backTopHovered ? "#ee99ff" : "rgba(10,0,20,0.88)",
            border: `1.5px solid ${backTopHovered ? "#ee99ff" : "rgba(238,153,255,0.7)"}`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: panelScrolled ? 1 : 0,
            pointerEvents: panelScrolled ? "auto" : "none",
            transform: panelScrolled
              ? backTopHovered ? "translateY(-3px) scale(1.08)" : "translateY(0) scale(1)"
              : "translateY(12px) scale(0.92)",
            transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", transition: "transform 0.2s ease", transform: backTopHovered ? "translateY(-1px)" : "translateY(0)" }}>
            <path d="M8 12V4M8 4L4 8M8 4L12 8"
              stroke={backTopHovered ? "#0e0018" : "#ffffff"}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>,
        document.body
      )}

      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: `${isMobile ? "18px" : "18px"} ${sidePad}`,
          background: "rgba(97,1,116,0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <button
          onClick={onClose}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = "#ffffff";
            el.querySelectorAll("path").forEach((p) => p.setAttribute("stroke", "#ffffff"));
            el.querySelectorAll("span").forEach((s) => (s as HTMLElement).style.color = "#ffffff");
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = "#ee99ff";
            el.querySelectorAll("path").forEach((p) => p.setAttribute("stroke", "#ee99ff"));
            el.querySelectorAll("span").forEach((s) => (s as HTMLElement).style.color = "#ee99ff");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 0",
            color: "#ee99ff",
            transition: "color 0.18s ease",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L6 10L12 16" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.18s ease" }}/>
          </svg>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.7px",
              textTransform: "uppercase",
              color: "#ee99ff",
              transition: "color 0.18s ease",
            }}
          >
            Back
          </span>
        </button>
      </div>

      {/* ── Password overlay ── */}
      {!unlocked && (
        <>
          {/* Blurred backdrop — present immediately so panel slides in blurred */}
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(9,0,20,0.1)",
            opacity: unlockFading || boxFading ? 0 : 1,
            transition: unlockFading ? "opacity 0.85s ease" : "opacity 0.3s ease",
          }} />

          {/* Password box — fades in after panel slide-in, fades out on close */}
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            opacity: boxReady && !boxFading && !unlockFading ? 1 : 0,
            transition: unlockFading ? "opacity 0.6s ease" : "opacity 0.35s ease",
            pointerEvents: boxReady && !boxFading && !unlockFading ? "auto" : "none",
          }}>
            <div
              className={animClass}
              style={{
                position: "relative",
                width: "min(400px, 100%)",
                padding: isMobile ? "40px 28px" : "52px 48px",
                background: "rgba(97,1,116,0.22)",
                border: "1px solid rgba(117,6,140,0.5)",
                borderRadius: "20px",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                textAlign: "center",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleOverlayClose}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#ee99ff")}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ee99ff",
                  padding: "6px",
                  lineHeight: 0,
                  transition: "color 0.18s ease",
                }}
                aria-label="Cancel and go back"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Lock icon — centered */}
              <div style={{ display: "flex", justifyContent: "center", margin: "0 0 20px" }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="12" width="18" height="13" rx="3" stroke="#ee99ff" strokeWidth="1.5"/>
                  <path d="M9 12V9a5 5 0 0 1 10 0v3" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="14" cy="18.5" r="1.5" fill="#ee99ff"/>
                </svg>
              </div>

              {/* Heading */}
              <p style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#ee99ff",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                margin: "0 0 10px",
              }}>
                Password Required
              </p>
              <p style={{
                fontSize: "15px",
                color: "#f7ceff",
                opacity: 0.55,
                margin: "0 0 36px",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400,
                lineHeight: 1.5,
              }}>
                Enter the 4-digit code to view this case study.
              </p>

              {/* Inputs + button container — aligned width */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0 auto", width: "fit-content" }}>
                {/* 4-digit inputs */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { digitRefs.current[i] = el; }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className="pw-digit-input"
                      style={{
                        width: isMobile ? "52px" : "60px",
                        height: isMobile ? "60px" : "68px",
                        textAlign: "center",
                        fontSize: "28px",
                        fontWeight: 200,
                        color: "#ffffff",
                        background: "rgba(97,1,116,0.28)",
                        border: `1px solid ${pwError ? "rgba(255,110,110,0.7)" : "rgba(238,153,255,0.3)"}`,
                        borderRadius: "12px",
                        outline: "none",
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                  ))}
                </div>

                {/* Error message */}
                <div style={{ height: "22px" }}>
                  {pwError && (
                    <p style={{
                      fontSize: "13px",
                      color: "rgba(255,120,120,0.9)",
                      margin: 0,
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontWeight: 400,
                    }}>
                      Wrong password, try again.
                    </p>
                  )}
                </div>

                {/* Enter button — same width as inputs */}
                <button
                  onClick={handleSubmit}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(117,6,140,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(238,153,255,0.6)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(117,6,140,0.25)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(238,153,255,0.35)";
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "rgba(117,6,140,0.25)",
                  border: "1px solid rgba(238,153,255,0.35)",
                  borderRadius: "10px",
                  color: "#ee99ff",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  transition: "background 0.18s ease, border-color 0.18s ease",
                }}
              >
                Enter
              </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Content */}
      <div
        style={{
          padding: `16px ${sidePad} 120px`,
          maxWidth: "1400px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#ee99ff",
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            margin: "0 0 24px",
          }}
        >
          {study?.category}
        </p>

        <h1
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 200,
            fontSize: isMobile ? "28px" : "clamp(32px, 4vw, 64px)",
            color: "#ffffff",
            lineHeight: 1.1,
            margin: "0 0 28px",
            maxWidth: "860px",
          }}
        >
          {study?.title}
        </h1>

        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#ee99ff",
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            margin: "0 0 48px",
          }}
        >
          {study?.year} &bull; {study?.role}
        </p>

        <div style={{ width: "156px", height: "1px", background: "#75068c", marginBottom: "64px" }} />

        {study?.id === "olive-ink" ? (
          <OliveInkContent isMobile={isMobile} isTablet={isTablet} />
        ) : (
          <>
            <PlaceholderSection label="Overview">
              <PlaceholderText lines={4} widths={["100%", "92%", "96%", "60%"]} />
            </PlaceholderSection>

            <PlaceholderImageBlock label="Hero image / key visual" aspectRatio="16/7" />

            <PlaceholderSection label="The Challenge">
              <PlaceholderText lines={3} widths={["100%", "88%", "72%"]} />
            </PlaceholderSection>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "24px",
                margin: "48px 0",
              }}
            >
              <PlaceholderCallout label="Context" lines={3} />
              <PlaceholderCallout label="Constraints" lines={3} />
            </div>

            <PlaceholderSection label="My Approach">
              <PlaceholderText lines={5} widths={["100%", "95%", "100%", "89%", "55%"]} />
            </PlaceholderSection>

            <PlaceholderImageBlock label="Process / explorations" aspectRatio="16/9" />

            <PlaceholderSection label="Outcome & Impact">
              <PlaceholderText lines={3} widths={["100%", "94%", "68%"]} />
            </PlaceholderSection>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
                gap: "24px",
                margin: "48px 0",
              }}
            >
              {["Metric A", "Metric B", "Metric C"].map((label) => (
                <PlaceholderStat key={label} label={label} />
              ))}
            </div>

            <PlaceholderSection label="What I Learned">
              <PlaceholderText lines={4} widths={["100%", "91%", "97%", "50%"]} />
            </PlaceholderSection>
          </>
        )}
      </div>
    </div>
  );
}

// ── Placeholder sub-components ────────────────────────────────────────────────

function PlaceholderSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "64px" }}>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#ee99ff",
          letterSpacing: "0.7px",
          textTransform: "uppercase",
          margin: "0 0 24px",
          opacity: 0.7,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function PlaceholderText({ lines, widths }: { lines: number; widths: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "18px",
            borderRadius: "4px",
            background: "rgba(247,206,255,0.12)",
            width: widths[i] ?? "100%",
          }}
        />
      ))}
    </div>
  );
}

function PlaceholderImageBlock({ label, aspectRatio }: { label: string; aspectRatio: string }) {
  return (
    <div
      style={{
        margin: "0 0 64px",
        borderRadius: "16px",
        aspectRatio,
        background: "rgba(247,206,255,0.06)",
        border: "1px dashed rgba(247,206,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#ee99ff",
          letterSpacing: "0.7px",
          textTransform: "uppercase",
          opacity: 0.4,
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function PlaceholderCallout({ label, lines }: { label: string; lines: number }) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "12px",
        background: "rgba(247,206,255,0.06)",
        border: "1px solid rgba(247,206,255,0.1)",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "#ee99ff",
          letterSpacing: "0.7px",
          textTransform: "uppercase",
          margin: "0 0 16px",
          opacity: 0.7,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "14px",
              borderRadius: "3px",
              background: "rgba(247,206,255,0.12)",
              width: i === lines - 1 ? "65%" : "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PlaceholderStat({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "28px 24px",
        borderRadius: "12px",
        background: "rgba(117,6,140,0.2)",
        border: "1px solid rgba(117,6,140,0.35)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          height: "36px",
          width: "70%",
          borderRadius: "6px",
          background: "rgba(247,206,255,0.15)",
        }}
      />
      <p
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "#ee99ff",
          letterSpacing: "0.7px",
          textTransform: "uppercase",
          margin: 0,
          opacity: 0.6,
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ─── Olive → INK Case Study Content ──────────────────────────────────────────

function OliveInkContent({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const body: React.CSSProperties = {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontWeight: 400,
    fontSize: isMobile ? "18px" : "24px",
    color: "#f7ceff",
    lineHeight: "1.5",
    letterSpacing: "0.48px",
    margin: "0 0 24px",
  };
  const eyebrow: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#ee99ff",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
    margin: "0 0 20px",
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontWeight: 200,
    fontSize: isMobile ? "26px" : "clamp(28px, 3vw, 42px)",
    color: "#ffffff",
    lineHeight: 1.15,
    margin: "0 0 28px",
  };
  const subhead: React.CSSProperties = {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontWeight: 400,
    fontSize: isMobile ? "18px" : "22px",
    color: "#ffffff",
    margin: "48px 0 16px",
  };
  const hr = (
    <div style={{ width: "156px", height: "1px", background: "#75068c", margin: "56px 0" }} />
  );

  function BulletList({ items }: { items: string[] }) {
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 24px" }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: "14px", marginBottom: "2px", alignItems: "flex-start" }}>
            <span style={{ color: "#ee99ff", fontSize: "18px", lineHeight: "1.3", flexShrink: 0 }}>•</span>
            <span style={{ ...body, margin: 0, fontSize: "18px", lineHeight: "1.3" }}>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {/* ── Opening ── */}
      <p style={body}>
        Docusign&apos;s product surfaces once relied heavily on Olive, a legacy design system no longer actively supported, while Ink was the newer, on‑brand, accessible system. Instead of a clean cutover, both lived side by side in production—creating inconsistency, accessibility risk, and a long tail of technical debt.
      </p>
      <p style={body}>
        By early FY26, projections suggested it could take up to 7 years to fully converge on Ink if adoption continued at the prior, organic rate. After a focused, cross‑functional push, that long horizon was compressed to roughly 1–1.5 years of execution.
      </p>

      {/* Hero metric graphic */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "2px",
          margin: "48px 0",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(117,6,140,0.4)",
        }}
      >
        {[
          {
            label: "Ink Adoption",
            from: "23%",
            to: "~98%",
            sub: "At program close",
          },
          {
            label: "Projected Timeline",
            from: "12 yrs",
            to: "~1.5 yrs",
            sub: "Mandate to completion",
          },
          {
            label: "1DS Olive Removal",
            from: "~35%",
            to: "94.5%",
            sub: "By Dec 2025 · Enabled @ds/ui v8",
          },
        ].map(({ label, from, to, sub }) => (
          <div
            key={label}
            style={{
              padding: isMobile ? "32px 24px" : "40px 32px",
              background: "rgba(117,6,140,0.18)",
            }}
          >
            <p style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#ee99ff",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "0 0 20px",
            }}>{label}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {from && (
                <p style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 200,
                  fontSize: isMobile ? "24px" : "32px",
                  color: "rgba(247,206,255,0.3)",
                  margin: 0,
                  lineHeight: 1,
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(247,206,255,0.2)",
                }}>{from}</p>
              )}
              <p style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 200,
                fontSize: isMobile ? "48px" : "64px",
                color: "#ffffff",
                margin: 0,
                lineHeight: 1,
              }}>{to}</p>
            </div>

            <p style={{
              fontSize: "13px",
              color: "#f7ceff",
              opacity: 0.55,
              margin: "12px 0 0",
              lineHeight: 1.4,
            }}>{sub}</p>
          </div>
        ))}
      </div>

      {hr}

      {/* ── From Olive to Ink ── */}
      <p style={eyebrow}>From Olive to Ink</p>
      <p style={body}>
        Olive represented years of product history: legacy styling, older patterns, and one‑off customizations. Ink is Docusign&apos;s unified design system: aligned to the 2024 brand, built for accessibility, and actively supported by design and engineering.
      </p>
      <p style={body}>
        The migration story is the shift from a legacy, fragmented visual language to a single, modern system that underpins the product portfolio.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/IMAGE2-Olive2Ink.svg"
        alt="Olive to Ink migration diagram"
        style={{ width: "100%", borderRadius: "16px", margin: "0 0 64px", display: "block" }}
      />

      {hr}

      {/* ── The Challenge ── */}
      <p style={eyebrow}>The Challenge</p>
      <h2 style={sectionTitle}>Two visual languages, one customer</h2>
      <p style={body}>For customers, the problem wasn&apos;t theoretical.</p>
      <p style={body}>
        Some high‑traffic flows mixed Olive‑based components and Ink components in a single experience: parts of a page used new visual styles, while others relied on older patterns. The result:
      </p>
      <BulletList items={[
        "Inconsistent look and feel from entry to completion.",
        "Accessibility gaps, where newer guidelines lived in Ink but not in legacy constructs.",
        "Slow, uneven adoption, with only ~23% of key surfaces effectively aligned to Ink (after 5 years from introduction), and an implied, combined 12‑year horizon to finish the job if nothing changed.",
      ]} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/IMAGE3-Olive2Ink-2.png"
        alt="eSign Send Home with Visual Analyzer showing mixed Olive and Ink components"
        style={{ width: "100%", height: "auto", margin: "0 0 64px", display: "block" }}
      />

      {hr}

      {/* ── The Turning Point ── */}
      <p style={eyebrow}>The Turning Point</p>
      <h2 style={sectionTitle}>A clear mandate from the top</h2>
      <p style={body}>
        Internally, Olive → Ink had been understood as &ldquo;a good thing to do,&rdquo; but it competed with feature work and rarely won. That changed when the problem was reframed.
      </p>
      <p style={body}>
        I quantified and surfaced the risk: 23% adoption, ~12‑year trajectory, and a growing disconnect between brand, accessibility standards, and what customers actually saw. I then partnered with Experience Design&apos;s (XD) Sr Director of Design, where they took a concrete recommendation to the Chief Product Officer:
      </p>

      <blockquote
        style={{
          margin: "8px 0 40px",
          padding: "32px 40px",
          background: "rgba(117,6,140,0.15)",
          borderLeft: "3px solid #75068c",
          borderRadius: "0 12px 12px 0",
        }}
      >
        <p style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? "18px" : "22px",
          color: "#ffffff",
          lineHeight: 1.65,
          margin: 0,
          fontStyle: "italic",
        }}>
          &ldquo;Treat Ink adoption as a company‑level initiative, with a clear deadline, not an optional refactor.&rdquo;
        </p>
      </blockquote>

      <p style={body}>
        In late 2024, our CPO issued an enterprise‑wide mandate via email: move all supported product surfaces from Olive to Ink by October 2025. The work shifted from &ldquo;best‑effort clean‑up&rdquo; to a time‑boxed, executive‑backed program.
      </p>

      {/* Mandate Timeline */}
      {isMobile ? (
        /* Mobile: vertical timeline */
        <div style={{
          padding: "36px 28px",
          borderRadius: "16px",
          background: "rgba(117,6,140,0.15)",
          border: "1px solid rgba(117,6,140,0.35)",
          margin: "0 0 64px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}>
          {[
            { date: "Sept 2023", label: "Initial Olive EOL communication" },
            { date: "Late 2024", label: "CPO Ink mandate — Ink by Oct 2025" },
            { date: "H1 2025",   label: "Program & tooling rollout (Visual Analyzer, audits)" },
            { date: "Oct 2025",  label: "100% Ink target for supported surfaces" },
          ].map(({ date, label }, i, arr) => (
            <div key={date} style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
              {/* Dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px", flexShrink: 0 }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ee99ff", border: "2px solid rgba(117,6,140,0.8)", flexShrink: 0, marginTop: "4px" }} />
                {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, background: "rgba(117,6,140,0.5)", margin: "6px 0" }} />}
              </div>
              {/* Text */}
              <div style={{ paddingBottom: i < arr.length - 1 ? "28px" : "0" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.7px", textTransform: "uppercase", margin: "0 0 4px" }}>{date}</p>
                <p style={{ fontSize: "15px", color: "#f7ceff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, lineHeight: 1.4, margin: 0 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop: horizontal timeline */
        <div style={{
          padding: "40px 40px 48px",
          borderRadius: "16px",
          background: "rgba(117,6,140,0.15)",
          border: "1px solid rgba(117,6,140,0.35)",
          margin: "0 0 64px",
        }}>
          {/* Title */}
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.6px", textTransform: "uppercase", margin: "0 0 40px" }}>
            Mandate Timeline &bull; Sept 2023 – Oct 2025
          </p>

          {/* Timeline track */}
          <div style={{ position: "relative", height: "200px" }}>

            {/* Horizontal line */}
            <div style={{
              position: "absolute",
              left: 0, right: 0,
              top: "100px",
              height: "2px",
              background: "linear-gradient(90deg, rgba(117,6,140,0.6) 0%, rgba(238,153,255,0.8) 100%)",
            }} />

            {/* Tick marks between data points */}
            {[14, 28, 42, 65, 83, 91].map(pct => (
              <div key={pct} style={{
                position: "absolute",
                left: `${pct}%`,
                top: "95px",
                width: "1px",
                height: "10px",
                background: "rgba(238,153,255,0.3)",
                transform: "translateX(-50%)",
              }} />
            ))}

            {/* Data points */}
            {[
              { pct: 0,   date: "Sept 2023", label: "Initial Olive EOL\ncommunication",                     above: false, align: "left"   as const },
              { pct: 56,  date: "Late 2024", label: "CPO Ink mandate\n(Ink by Oct 2025)",                   above: true,  align: "center" as const },
              { pct: 74,  date: "H1 2025",   label: "Program & tooling rollout\n(Visual Analyzer, audits)", above: false, align: "center" as const },
              { pct: 100, date: "Oct 2025",  label: "100% Ink target\nfor supported surfaces",              above: true,  align: "right"  as const },
            ].map(({ pct, date, label, above, align }) => {
              const isFirst = align === "left";
              const isLast  = align === "right";
              const labelStyle: React.CSSProperties = {
                position: "absolute",
                width: "160px",
                textAlign: align,
                ...(isFirst ? { left: 0 } : isLast ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" }),
              };
              return (
                <div
                  key={date}
                  style={{
                    position: "absolute",
                    left:      isLast ? "auto" : isFirst ? "0" : `${pct}%`,
                    right:     isLast ? "0" : "auto",
                    top:       "100px",
                    transform: isFirst || isLast ? "translateY(-50%)" : "translate(-50%, -50%)",
                    width:     "12px",
                    height:    "12px",
                  }}
                >
                  {/* Label above */}
                  {above && (
                    <div style={{ ...labelStyle, bottom: "calc(100% + 14px)" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.7px", textTransform: "uppercase", margin: "0 0 4px", whiteSpace: "nowrap" }}>{date}</p>
                      <p style={{ fontSize: "13px", color: "#f7ceff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, lineHeight: 1.4, margin: 0, whiteSpace: "pre-line" }}>{label}</p>
                    </div>
                  )}

                  {/* Dot — exactly on the line */}
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ee99ff", border: "2px solid rgba(117,6,140,0.9)", position: "relative", zIndex: 1 }} />

                  {/* Label below */}
                  {!above && (
                    <div style={{ ...labelStyle, top: "calc(100% + 14px)" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.7px", textTransform: "uppercase", margin: "0 0 4px", whiteSpace: "nowrap" }}>{date}</p>
                      <p style={{ fontSize: "13px", color: "#f7ceff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, lineHeight: 1.4, margin: 0, whiteSpace: "pre-line" }}>{label}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hr}

      {/* ── From Mandate to Movement ── */}
      <p style={eyebrow}>From Mandate to Movement</p>
      <h2 style={sectionTitle}>Program design &amp; execution</h2>
      <p style={body}>
        A mandate alone doesn&apos;t move pixels. It needed a program that enabled dozens of teams to act in a coordinated way.
      </p>

      <h3 style={subhead}>A single hub and clear ownership</h3>
      <p style={body}>
        The Olive Removal program was formalized with a central project hub and a clear DRI model across:
      </p>
      <BulletList items={[
        "Design (Ink/UUX) – guidance on patterns, redesigns, and system usage.",
        "Frontend Systems (FES) – migration tooling, code changes, and platform support.",
        "Product & Engineering teams – implementing migrations in their surfaces and flows.",
        "Program Management – coordination, bi‑weekly \u201cOlive to Ink Standing\u201d meetings, escalations, and status reporting.",
      ]} />
      <p style={body}>
        Escalation paths and an exception process were defined so teams with sunset products or hard constraints could be handled deliberately, not ad hoc.
      </p>

      <h3 style={subhead}>Playbooks, not just principles</h3>
      <p style={body}>
        To avoid every team inventing its own strategy, the Ink and FES teams co‑authored an Olive to Ink Integration playbook. It broke migration into concrete use cases:
      </p>
      <BulletList items={[
        "Olive component with direct Ink equivalent → theme swap and parity check.",
        "Olive‑only component → redesign with recommended Ink patterns.",
        "Olive‑specific props/values → case‑by‑case guidance and enhancements.",
        "Custom components and 1DS widgets → move styling to Ink tokens, aligning with accessibility and brand.",
      ]} />
      <p style={body}>
        Instead of &ldquo;please migrate,&rdquo; teams had clear patterns and examples for how to do it.
      </p>

      <h3 style={subhead}>Tooling that de‑risked change</h3>
      <p style={body}>
        Migration was paired with tooling so teams could see issues before they became incidents:
      </p>
      <BulletList items={[
        "Visual Analyzer – overlays on live pages that label each component as Ink, Olive, or Olive‑specific.",
        "FES audit tool – repository‑level scans to find Olive usage and report it back to teams.",
      ]} />
      <p style={body}>
        These tools made the migration visible and testable, rather than a risky, invisible refactor.
      </p>

      {/* Phase stepper */}
      {isMobile ? (
        /* Mobile: vertical */
        <div style={{ padding: "36px 28px", borderRadius: "16px", background: "rgba(117,6,140,0.15)", border: "1px solid rgba(117,6,140,0.35)", margin: "0 0 64px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.6px", textTransform: "uppercase", margin: "0 0 32px" }}>Migration Journey &bull; 4 Phases</p>
          {[
            { n: "01", label: "Discover",    desc: "Identify surfaces, map Olive usage, and size the work." },
            { n: "02", label: "Design",      desc: "Update flows and screens, applying Ink components and tokens." },
            { n: "03", label: "Develop",     desc: "Implement changes, using tooling to catch issues early." },
            { n: "04", label: "QA & Release",desc: "Validate parity, accessibility, and quality before shipping." },
          ].map(({ n, label, desc }, i, arr) => (
            <div key={n} style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "44px", flexShrink: 0 }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(117,6,140,0.35)", border: "1px solid rgba(238,153,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.5px" }}>{n}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: "1px", flex: 1, background: "rgba(117,6,140,0.5)", margin: "6px 0" }} />}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? "24px" : "0", paddingTop: "10px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", margin: "0 0 4px" }}>{label}</p>
                <p style={{ fontSize: "13px", color: "#f7ceff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, lineHeight: 1.4, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop: horizontal stepper */
        <div style={{ padding: "40px 40px 48px", borderRadius: "16px", background: "rgba(117,6,140,0.15)", border: "1px solid rgba(117,6,140,0.35)", margin: "0 0 64px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.6px", textTransform: "uppercase", margin: "0 0 40px" }}>
            Migration Journey &bull; 4 Phases
          </p>

          <div style={{ position: "relative", height: "140px" }}>
            {/* Connecting line — 3 segments so it touches each circle edge */}
            {/* Seg 1: right of 01 → left of 02 (33% − 22px) */}
            <div style={{ position: "absolute", left: "44px", right: "calc(67% + 22px)", top: "22px", height: "2px", background: "linear-gradient(90deg, rgba(117,6,140,0.6) 0%, rgba(180,60,210,0.75) 100%)" }} />
            {/* Seg 2: right of 02 → left of 03 */}
            <div style={{ position: "absolute", left: "calc(33% + 22px)", right: "calc(33% + 22px)", top: "22px", height: "2px", background: "linear-gradient(90deg, rgba(180,60,210,0.75) 0%, rgba(210,100,240,0.8) 100%)" }} />
            {/* Seg 3: right of 03 (67% + 22px) → left of 04 */}
            <div style={{ position: "absolute", left: "calc(67% + 22px)", right: "44px", top: "22px", height: "2px", background: "linear-gradient(90deg, rgba(210,100,240,0.8) 0%, rgba(238,153,255,0.8) 100%)" }} />

            {/* Tick marks between steps */}
            {[16, 33, 50, 67, 84].map(pct => (
              <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: "17px", width: "1px", height: "10px", background: "rgba(238,153,255,0.3)", transform: "translateX(-50%)" }} />
            ))}

            {[
              { pct: 0,   n: "01", label: "Discover",     desc: "Identify surfaces,\nmap Olive usage,\nand size the work.",          align: "left"   as const },
              { pct: 33,  n: "02", label: "Design",       desc: "Revise flows and screens,\napplying Ink components\nand tokens.",   align: "center" as const },
              { pct: 67,  n: "03", label: "Develop",      desc: "Implement changes,\nusing tooling to\ncatch issues early.",         align: "center" as const },
              { pct: 100, n: "04", label: "QA & Release", desc: "Validate parity,\naccessibility, and\nquality before shipping.",   align: "right"  as const },
            ].map(({ pct, n, label, desc, align }) => {
              const isFirst = align === "left";
              const isLast  = align === "right";
              return (
                <div key={n} style={{
                  position: "absolute",
                  left:      isLast ? "auto" : isFirst ? "0" : `${pct}%`,
                  right:     isLast ? "0" : "auto",
                  top:       "0",
                  transform: isFirst || isLast ? "none" : "translateX(-50%)",
                  width:     "44px",
                }}>
                  {/* Circle */}
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(117,6,140,0.35)", border: "1px solid rgba(238,153,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.5px" }}>{n}</span>
                  </div>
                  {/* Label */}
                  <div style={{
                    position: "absolute",
                    top: "56px",
                    width: "160px",
                    textAlign: align,
                    ...(isFirst ? { left: 0 } : isLast ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" }),
                  }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", margin: "0 0 4px", letterSpacing: "0.3px" }}>{label}</p>
                    <p style={{ fontSize: "12px", color: "#f7ceff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, lineHeight: 1.4, margin: 0, whiteSpace: "pre-line", opacity: 0.7 }}>{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hr}

      {/* ── The Impact ── */}
      <p style={eyebrow}>The Impact</p>
      <h2 style={sectionTitle}>Compression from 7 years to about 1.5</h2>
      <p style={body}>
        Once the mandate and program were in place, adoption curves changed significantly. Within roughly a year and a bit:
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: "24px",
          margin: "32px 0 48px",
        }}
      >
        {[
          { stat: "81%", label: "Overall migration completion", sub: "21 packages left to migrate" },
          { stat: "94.5%", label: "1DS Olive removal", sub: "Enabling @ds/ui v8 launch" },
          { stat: "~1.5 yrs", label: "Actual execution timeline", sub: "Compressed from a 7‑year projection" },
        ].map(({ stat, label, sub }) => (
          <div
            key={stat}
            style={{
              padding: "28px 24px",
              borderRadius: "12px",
              background: "rgba(117,6,140,0.2)",
              border: "1px solid rgba(117,6,140,0.35)",
            }}
          >
            <p style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 200,
              fontSize: "48px",
              color: "#ffffff",
              margin: "0 0 10px",
              lineHeight: 1,
            }}>{stat}</p>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.6px", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
            <p style={{ fontSize: "13px", color: "#f7ceff", opacity: 0.55, margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      <p style={body}>Beyond the numbers, the program:</p>
      <BulletList items={[
        "Raised the baseline for accessibility, by moving teams onto Ink components designed with current WCAG guidance.",
        "Improved cross‑product consistency, so customers see a more coherent experience as they move between flows.",
        "De‑risked future change, turning \u201cbig bang\u201d design‑system upgrades into planned, testable releases.",
      ]} />

      {hr}

      {/* ── Leadership in Action ── */}
      <p style={eyebrow}>Leadership in Action</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: "24px",
          margin: "8px 0 64px",
        }}
      >
        {[
          {
            role: "Catalyst",
            icon: (
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3L9 17H16L13 29L23 15H16L19 3Z" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            items: [
              "Surfaced the Olive → Ink gap as a strategic risk, not merely a design preference.",
              "Quantified the problem (23% adoption, ~12‑year trajectory) and tied it to brand, accessibility, and technical‑debt concerns.",
            ],
          },
          {
            role: "Integrator",
            icon: (
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="3" stroke="#ee99ff" strokeWidth="1.5"/>
                <circle cx="7" cy="9" r="2.5" stroke="#ee99ff" strokeWidth="1.5"/>
                <circle cx="25" cy="9" r="2.5" stroke="#ee99ff" strokeWidth="1.5"/>
                <circle cx="16" cy="27" r="2.5" stroke="#ee99ff" strokeWidth="1.5"/>
                <line x1="9.8" y1="11" x2="14" y2="14" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22.2" y1="11" x2="18" y2="14" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="19" x2="16" y2="24.5" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
            items: [
              "Partnered with Design leadership to secure a CPO‑level mandate with an October 2025 target.",
              "Co‑designed the program structure—governance, playbooks, phases—and served as a design‑side DRI for FES, Product, and Brand.",
            ],
          },
          {
            role: "Accelerator",
            icon: (
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3C16 3 9 10 9 18V21L12 22.5V20C12 17.8 13.8 16 16 16C18.2 16 20 17.8 20 20V22.5L23 21V18C23 10 16 3 16 3Z" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.5L10 29L16 26L22 29L20 22.5" stroke="#ee99ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="11" r="2" stroke="#ee99ff" strokeWidth="1.5"/>
              </svg>
            ),
            items: [
              "Ensured teams had the playbooks, tools, and governance needed to move fast.",
              "Helped shift Olive → Ink from slow background work to a time‑boxed, near‑complete migration that supports future product and brand evolution.",
            ],
          },
        ].map(({ role, icon, items }) => (
          <div
            key={role}
            style={{
              padding: "28px 24px",
              borderRadius: "12px",
              background: "rgba(247,206,255,0.06)",
              border: "1px solid rgba(247,206,255,0.1)",
            }}
          >
            <div style={{ marginBottom: "16px" }}>{icon}</div>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#ee99ff", letterSpacing: "0.7px", textTransform: "uppercase", margin: "0 0 20px" }}>{role}</p>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "flex-start" }}>
                <span style={{ color: "#ee99ff", fontSize: "18px", lineHeight: "1.3", flexShrink: 0 }}>•</span>
                <p style={{ fontSize: "18px", color: "#f7ceff", lineHeight: "1.3", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Quote Card ── */}
      <div
        style={{
          padding: isMobile ? "32px 24px" : "48px 56px",
          borderRadius: "16px",
          background: "rgba(117,6,140,0.15)",
          border: "1px solid rgba(117,6,140,0.4)",
          marginBottom: "64px",
        }}
      >
        <p style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 200,
          fontSize: isMobile ? "20px" : "clamp(22px, 2.5vw, 32px)",
          color: "#ffffff",
          lineHeight: 1.55,
          margin: "0 0 28px",
          fontStyle: "italic",
        }}>
          &ldquo;We turned a 7‑year migration risk into a 1.5‑year execution plan by treating Ink adoption as a product in its own right, not a background refactor.&rdquo;
        </p>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#ee99ff", letterSpacing: "0.7px", textTransform: "uppercase", margin: 0 }}>
          — Nandor Tamas
        </p>
      </div>
    </>
  );
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

function CaseStudiesSection({
  onOpen,
  isMobile,
  isTablet,
}: {
  onOpen: (study: CaseStudyData) => void;
  isMobile: boolean;
  isTablet: boolean;
}) {
  return (
    <section
      id="case-studies"
      className="mx-auto"
      style={{
        maxWidth: "1374px",
        marginTop: isMobile ? "72px" : isTablet ? "100px" : "219px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
      aria-label="Case Studies"
    >
      <div className="flex items-center" style={{ gap: "12px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/case-studies-icon.svg" alt="" width={32} height={32} />
        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#ee99ff",
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Case Studies
        </p>
      </div>

      <div style={{ marginTop: "48px" }}>
        {CASE_STUDIES.map((study, i) => (
          <CaseStudyItem
            key={study.id}
            category={study.category}
            title={study.title}
            year={study.year}
            role={study.role}
            comingSoon={study.comingSoon}
            noBorder={i === CASE_STUDIES.length - 1}
            onClick={() => onOpen(study)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Take This With You ───────────────────────────────────────────────────────

function TakeThisWithYouSection({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  return (
    <section
      className="mx-auto"
      style={{
        maxWidth: "1374px",
        marginTop: isMobile ? "72px" : isTablet ? "100px" : "216px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
      aria-label="Take This With You"
    >
      <p
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 200,
          fontSize: "clamp(22px, 2.6vw, 50px)",
          color: "#f7ceff",
          lineHeight: "1.354",
          textAlign: "center",
          margin: isMobile ? "0 0 64px" : "0 0 200px",
        }}
      >
        Take This With You
      </p>

      {[
        <>
          I&rsquo;ve always been drawn to the space between product and marketing.
          I couldn&rsquo;t get enough of it. The way something makes you feel and
          the way you use it, the psychology behind both. That intersection has
          always been the most compelling place to work, and the one I&rsquo;ve
          built my career in. That space holds tension, but it also holds the
          opportunity to create something stronger than either side could on its
          own. <span style={{ fontWeight: 600 }}>This is where I work.</span>
        </>,
        <>
          After 26 years as a designer, a creative director, and a design leader,
          I still believe our job is to push past what we know. What we&rsquo;ve
          been trained to see isn&rsquo;t the only way forward.
        </>,
        <>
          At my core, I&rsquo;m driven by craft. By making. By iterating until
          something feels not just right, but undeniable. Because functionality is
          the baseline. I design for what lingers, what resonates, and for what
          endures.
        </>,
      ].map((content, i, arr) => (
        <p
          key={i}
          style={{
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: 400,
            color: "#f7ceff",
            lineHeight: "1.5",
            letterSpacing: "0.48px",
            margin: i < arr.length - 1 ? "0 0 24px" : 0,
          }}
        >
          {content}
        </p>
      ))}
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  return (
    <footer
      className="mx-auto"
      style={{
        maxWidth: "1374px",
        marginTop: isMobile ? "80px" : isTablet ? "120px" : "300px",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          width: "160px",
          height: "1px",
          background: "rgba(247,206,255,0.6)",
          marginBottom: "53px",
        }}
      />
      <p
        style={{
          fontSize: "16px",
          fontWeight: 400,
          color: "#f7ceff",
          lineHeight: "1.354",
          letterSpacing: "0.32px",
          margin: 0,
        }}
      >
        &copy; 2026 Nandor Tamas &bull; Designed in Figma and coded with Claude CoWork.
      </p>
    </footer>
  );
}

// ─── Scroll To Top Button ─────────────────────────────────────────────────────

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    if (!isDesktop) return;
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "36px",
        right: "36px",
        zIndex: 200,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: `1px solid ${hovered ? "rgba(117,6,140,0.9)" : "rgba(117,6,140,0.45)"}`,
        background: hovered ? "rgba(117,6,140,0.18)" : "rgba(17,0,25,0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible
          ? hovered ? "translateY(-3px) scale(1.08)" : "translateY(0) scale(1)"
          : "translateY(12px) scale(0.92)",
        transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, border-color 0.2s ease",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", transition: "transform 0.2s ease", transform: hovered ? "translateY(-1px)" : "translateY(0)" }}
      >
        <path
          d="M8 12V4M8 4L4 8M8 4L12 8"
          stroke={hovered ? "#f7ceff" : "#ee99ff"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────

function Reveal({ children }: { children: ReactNode }) {
  const { ref, inView } = useScrollReveal<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: inView
          ? "opacity 0.65s ease, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)"
          : "none",
      }}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeStudy, setActiveStudy] = useState<CaseStudyData | null>(null);
  const panelOpen = activeStudy !== null;
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <>
      {/* Main page — scales back when panel is open */}
      <div
        className="page-gradient overflow-x-hidden"
        style={{
          transform: panelOpen ? "scale(0.96)" : "scale(1)",
          transformOrigin: "center top",
          filter: panelOpen ? "brightness(0.55)" : "brightness(1)",
          transition: "transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), filter 0.52s ease",
          willChange: "transform, filter",
        }}
      >
        <Topbar />
        <main>
          <HeroSection />
          <Reveal><LocationSection isMobile={isMobile} isTablet={isTablet} /></Reveal>
          <Reveal><AboutIntroSection isMobile={isMobile} isTablet={isTablet} /></Reveal>
          <Reveal><CorporateDesignSection isMobile={isMobile} isTablet={isTablet} /></Reveal>
          <Reveal><NandorMeaningSection isMobile={isMobile} isTablet={isTablet} /></Reveal>
          <Reveal><CaseStudiesSection onOpen={setActiveStudy} isMobile={isMobile} isTablet={isTablet} /></Reveal>
          <Reveal><TakeThisWithYouSection isMobile={isMobile} isTablet={isTablet} /></Reveal>
        </main>
        <Footer isMobile={isMobile} isTablet={isTablet} />
      </div>

      {/* Scroll-to-top — must live outside the transformed wrapper so
          position:fixed works correctly (transform creates a new stacking context) */}
      <ScrollToTopButton />

      {/* Slide-in case study panel */}
      <CaseStudyPanel
        study={activeStudy}
        onClose={() => setActiveStudy(null)}
      />
    </>
  );
}
