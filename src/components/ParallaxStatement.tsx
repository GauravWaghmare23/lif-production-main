import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { SITE, section as getSection } from "../data/site";

export const ParallaxStatement = () => {
  // All copy comes from src/data/sections.json → "statement"
  const t = getSection('statement');
  const containerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = containerRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      const scrollDistance =
        section.offsetHeight - window.innerHeight;

      if (scrollDistance <= 0) {
        return;
      }

      const currentScroll = -rect.top;

      const value =
        currentScroll / scrollDistance;

      setProgress(
        Math.min(
          Math.max(value, 0),
          1
        )
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );
    };
  }, []);

  /*
  ==========================================================
  UTILITY
  ==========================================================
  */

  const clamp = (
    value: number,
    min = 0,
    max = 1
  ) => {
    return Math.min(
      Math.max(value, min),
      max
    );
  };

  const ease = (value: number) => {
    return 1 - Math.pow(1 - value, 3);
  };

  /*
  ==========================================================
  01 — DIRECTOR LED
  0.00 → 0.25
  ==========================================================
  */

  const directorIn = clamp(
    progress / 0.08
  );

  const directorOut = clamp(
    (progress - 0.16) / 0.09
  );

  const directorOpacity =
    ease(directorIn) *
    (1 - ease(directorOut));

  /*
  ==========================================================
  02 — STUDIO BUILT
  0.25 → 0.48
  ==========================================================
  */

  const studioIn = clamp(
    (progress - 0.23) / 0.08
  );

  const studioOut = clamp(
    (progress - 0.40) / 0.09
  );

  const studioOpacity =
    ease(studioIn) *
    (1 - ease(studioOut));

  /*
  ==========================================================
  03 — EDITORIAL COPY
  0.50 → 0.78
  ==========================================================
  */

  const paragraphIn = clamp(
    (progress - 0.48) / 0.10
  );

  const paragraphOut = clamp(
    (progress - 0.70) / 0.10
  );

  const paragraphOpacity =
    ease(paragraphIn) *
    (1 - ease(paragraphOut));

  /*
  ==========================================================
  04 — FINAL STATEMENT
  0.78 → 1.00
  ==========================================================
  */

  const finalIn = clamp(
    (progress - 0.76) / 0.12
  );

  const finalOpacity =
    ease(finalIn);

  /*
  ==========================================================
  MOVEMENT
  ==========================================================
  */

  const directorY =
    (1 - ease(directorIn)) * 80 -
    ease(directorOut) * 80;

  const studioY =
    (1 - ease(studioIn)) * 80 -
    ease(studioOut) * 80;

  const paragraphY =
    (1 - ease(paragraphIn)) * 50 -
    ease(paragraphOut) * 40;

  const finalY =
    (1 - ease(finalIn)) * 40;

  /*
  ==========================================================
  RETURN
  ==========================================================
  */

  return (
    <section
      id="about"
      ref={containerRef}
      className={clsx(
        "relative",
        "bg-black",
        "border-t",
        "border-white/10"
      )}
      style={{
        height: "190vh",
      }}
    >
      {/* ==================================================
          STICKY VIEWPORT
      =================================================== */}

      <div
        className={clsx(
          "sticky",
          "top-0",
          "h-screen",
          "w-full",
          "overflow-hidden",
          "bg-black"
        )}
      >

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <div
          className={clsx(
            "absolute",
            "top-0",
            "left-0",
            "right-0",
            "z-50",
            "flex",
            "items-center",
            "justify-between",
            "px-6",
            "py-6",
            "md:px-14",
            "md:py-8",
            "font-mono",
            "text-[9px]",
            "sm:text-[10px]",
            "md:text-xs",
            "uppercase",
            "tracking-[0.18em]",
            "text-white/50"
          )}
        >
          <div
            className={clsx(
              "flex",
              "items-center",
              "gap-2"
            )}
          >
            <span
              className={clsx(
                "h-1.5",
                "w-1.5",
                "rounded-full",
                "bg-[#0066FF]"
              )}
            />

            <span>
              {t.headerLeft}
            </span>
          </div>

          <span
            className={clsx(
              "hidden",
              "sm:block"
            )}
          >
            {t.headerRight}
          </span>
        </div>


        {/* =================================================
            MAIN STAGE
        ================================================= */}

        <div
          className={clsx(
            "absolute",
            "inset-0",
            "flex",
            "items-center",
            "justify-center",
            "px-6",
            "md:px-14"
          )}
        >
          <div
            className={clsx(
              "relative",
              "w-full",
              "max-w-[1440px]",
              "h-full"
            )}
          >

            {/* =================================================
                01 — DIRECTOR LED
            ================================================= */}

            <div
              className={clsx(
                "absolute",
                "inset-0",
                "flex",
                "items-center",
                "justify-center",
                "z-10",
                "pointer-events-none"
              )}
              style={{
                opacity: directorOpacity,
                transform: `
                  translateY(${directorY}px)
                  scale(${0.94 + directorOpacity * 0.06})
                `,
              }}
            >
              <h2
                className={clsx(
                  "font-sans",
                  "text-[15vw]",
                  "sm:text-[11vw]",
                  "md:text-[9.5rem]",
                  "font-medium",
                  "tracking-[-0.055em]",
                  "leading-none",
                  "text-white",
                  "whitespace-nowrap"
                )}
              >
                {t.lineOne}
              </h2>
            </div>


            {/* =================================================
                02 — STUDIO BUILT
            ================================================= */}

            <div
              className={clsx(
                "absolute",
                "inset-0",
                "flex",
                "items-center",
                "justify-center",
                "z-20",
                "pointer-events-none"
              )}
              style={{
                opacity: studioOpacity,
                transform: `
                  translateY(${studioY}px)
                  scale(${0.94 + studioOpacity * 0.06})
                `,
              }}
            >
              <h2
                className={clsx(
                  "font-sans",
                  "text-[15vw]",
                  "sm:text-[11vw]",
                  "md:text-[9.5rem]",
                  "font-medium",
                  "tracking-[-0.055em]",
                  "leading-none",
                  "text-white",
                  "whitespace-nowrap"
                )}
              >
                {t.lineTwo}
              </h2>
            </div>


            {/* =================================================
                03 — EDITORIAL STATEMENT
            ================================================= */}

            <div
              className={clsx(
                "absolute",
                "inset-0",
                "z-40",
                "flex",
                "items-center",
                "justify-center",
                "px-6",
                "pointer-events-none"
              )}
              style={{
                opacity: paragraphOpacity,
                transform: `
                  translateY(${paragraphY}px)
                `,
              }}
            >
              <div
                className={clsx(
                  "w-full",
                  "max-w-3xl",
                  "text-center"
                )}
              >
                <p
                  className={clsx(
                    "font-sans",
                    "text-base",
                    "sm:text-lg",
                    "md:text-xl",
                    "lg:text-2xl",
                    "font-light",
                    "leading-relaxed",
                    "text-white/65"
                  )}
                >
                  {t.paragraphIntro}

                  <br />
                  <br />

                  {t.paragraphBody[0]}

                  {" "}

                  <span
                    className={clsx(
                      "font-medium",
                      "text-white"
                    )}
                  >
                    {SITE.brand.name}
                  </span>

                  {" "}

                  {t.paragraphBody[1]}

                  <br />
                  <br />

                  <span className="text-white">
                    {t.paragraphClosing}
                  </span>
                </p>
              </div>
            </div>


            {/* =================================================
                04 — FINAL STATEMENT
            ================================================= */}

            <div
              className={clsx(
                "absolute",
                "inset-0",
                "z-50",
                "flex",
                "items-center",
                "justify-center",
                "pointer-events-none"
              )}
              style={{
                opacity: finalOpacity,
                transform: `
                  translateY(${finalY}px)
                `,
              }}
            >
              <div className="text-center">

                <span
                  className={clsx(
                    "block",
                    "mb-5",
                    "font-mono",
                    "text-[9px]",
                    "sm:text-[10px]",
                    "md:text-xs",
                    "uppercase",
                    "tracking-[0.4em]",
                    "text-[#0066FF]"
                  )}
                >
                  {t.finalEyebrow}
                </span>

                <h3
                  className={clsx(
                    "font-sans",
                    "text-4xl",
                    "sm:text-6xl",
                    "md:text-8xl",
                    "font-medium",
                    "tracking-[-0.04em]",
                    "text-white"
                  )}
                >
                  {t.finalTitle}
                </h3>

              </div>
            </div>

          </div>
        </div>


        {/* =================================================
            BOTTOM PROGRESS
        ================================================= */}

        <div
          className={clsx(
            "absolute",
            "bottom-0",
            "left-0",
            "right-0",
            "z-[60]",
            "flex",
            "items-center",
            "justify-between",
            "border-t",
            "border-white/10",
            "px-6",
            "py-4",
            "md:px-14",
            "font-mono",
            "text-[9px]",
            "sm:text-[10px]",
            "uppercase",
            "tracking-wider",
            "text-white/40"
          )}
        >
          <span>
            {t.progressLabel}
          </span>

          <span
            className={clsx(
              "font-bold",
              "text-[#0066FF]"
            )}
          >
            {Math.round(progress * 100)}%
          </span>
        </div>

      </div>
    </section>
  );
};

export default ParallaxStatement;