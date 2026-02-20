import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ============================================
// CONSTANTS
// ============================================
const COLORS = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primaryLight: "#60a5fa",
  accent: "#F5A623",
  white: "#ffffff",
  bg: "#f8fafc",
  dark: "#0f172a",
  gray: "#64748b",
  grayLight: "#e2e8f0",
  green: "#22c55e",
  purple: "#7c3aed",
  pink: "#ec4899",
  cyan: "#06b6d4",
  orange: "#f97316",
};

const FPS = 30;
const SECTION_FRAMES = {
  intro: 4 * FPS,        // 0-4s
  upload: 9 * FPS,        // 4-13s
  aiRetouch: 10 * FPS,    // 13-23s
  gallery: 9 * FPS,       // 23-32s
  selection: 10 * FPS,    // 32-42s
  tabloEditor: 12 * FPS,  // 42-54s
  marketplace: 12 * FPS,  // 54-66s
  printing: 8 * FPS,      // 66-74s
  stats: 8 * FPS,         // 74-82s
  outro: 8 * FPS,         // 82-90s
};

const FONT = "system-ui, -apple-system, sans-serif";

// ============================================
// REUSABLE COMPONENTS
// ============================================
const StepBadge: React.FC<{ text: string; color: string; frame: number; fps: number; delay?: number }> = ({
  text, color, frame, fps, delay = 3,
}) => {
  const scale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 80 } });
  return (
    <div style={{
      position: "absolute", top: 60, left: "50%",
      transform: `translateX(-50%) scale(${scale})`,
      background: color, color: COLORS.white,
      padding: "8px 24px", borderRadius: 20,
      fontSize: 16, fontWeight: 600, fontFamily: FONT,
    }}>
      {text}
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; subtitle?: string; frame: number; delay?: number }> = ({
  title, subtitle, frame, delay = 8,
}) => {
  const op = fadeIn(frame, delay);
  return (
    <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: op }}>
      <div style={{ fontSize: 46, fontWeight: 700, color: COLORS.dark, fontFamily: FONT }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: 21, color: COLORS.gray, marginTop: 10, fontFamily: FONT }}>{subtitle}</div>
      )}
    </div>
  );
};

const BrowserWindow: React.FC<{
  children: React.ReactNode;
  frame: number;
  fps: number;
  delay?: number;
  width?: number;
  height?: number;
  url?: string;
}> = ({ children, frame, fps, delay = 15, width = 900, height = 520, url = "app.tablostudio.hu" }) => {
  const scale = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return (
    <div style={{
      position: "absolute", top: 230, left: "50%",
      transform: `translateX(-50%) scale(${Math.min(scale, 1)})`,
      width, height, background: COLORS.white,
      borderRadius: 16, boxShadow: "0 25px 80px rgba(0,0,0,0.12)", overflow: "hidden",
    }}>
      <div style={{
        height: 40, background: COLORS.grayLight,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 8,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
        <div style={{
          marginLeft: 20, padding: "4px 50px", background: COLORS.white,
          borderRadius: 6, fontSize: 13, color: COLORS.gray, fontFamily: FONT,
        }}>
          {url}
        </div>
      </div>
      <div style={{ padding: 24, height: height - 40, overflow: "hidden" }}>{children}</div>
    </div>
  );
};

// ============================================
// HELPERS
// ============================================
const fadeIn = (frame: number, start: number, duration = 8) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, start: number, duration = 8) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

// ============================================
// SECTION 1: INTRO (0-4s, 120 frames)
// ============================================
const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = fadeIn(frame, 10);
  const titleY = interpolate(frame, [10, 20], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const subtitleOpacity = fadeIn(frame, 25);
  const badgeOpacity = fadeIn(frame, 45);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.intro - 10);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
      justifyContent: "center", alignItems: "center", opacity: sectionFadeOut,
    }}>
      <div style={{
        position: "absolute", top: -100, right: -100, width: 500, height: 500,
        borderRadius: "50%", background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{
        position: "absolute", bottom: -150, left: -100, width: 600, height: 600,
        borderRadius: "50%", background: "rgba(255,255,255,0.03)",
      }} />

      <div style={{
        transform: `scale(${logoScale})`,
        fontSize: 80, fontWeight: 800, color: COLORS.white,
        fontFamily: FONT, letterSpacing: -2,
      }}>
        TablóStúdió
      </div>

      <div style={{
        opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 20, fontFamily: FONT,
      }}>
        A teljes tablófotós munkafolyamat, egy helyen.
      </div>

      <div style={{
        opacity: subtitleOpacity, fontSize: 20,
        color: "rgba(255,255,255,0.6)", marginTop: 12, fontFamily: FONT,
      }}>
        Feltöltés → AI retusálás → Galéria → Választás → Szerkesztés → Nyomda
      </div>

      <div style={{
        opacity: badgeOpacity, marginTop: 40, padding: "12px 28px",
        background: "rgba(255,255,255,0.15)", borderRadius: 30,
        fontSize: 18, color: COLORS.white, fontFamily: FONT,
      }}>
        44+ iskola • 874+ tabló • 4367+ szülő
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 2: UPLOAD (4-13s, 270 frames)
// ============================================
const UploadSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.upload - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const progressWidth = interpolate(frame, [30, 120], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const photos = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => fadeIn(frame, 60 + i * 8));

  // Folder tree
  const folder1 = fadeIn(frame, 130);
  const folder2 = fadeIn(frame, 150);
  const folder3 = fadeIn(frame, 170);

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <StepBadge text="1. lépés — Képfeltöltés" color={COLORS.primary} frame={frame} fps={fps} />
      <SectionTitle
        title="Töltsd fel a képeket percek alatt"
        subtitle="Drag & drop, automatikus rendezés iskola és osztály szerint"
        frame={frame}
      />

      <BrowserWindow frame={frame} fps={fps}>
        {/* Progress bar */}
        <div style={{ width: "100%", height: 8, background: COLORS.grayLight, borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
          <div style={{
            width: `${progressWidth}%`, height: "100%",
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            borderRadius: 4,
          }} />
        </div>
        <div style={{ fontSize: 14, color: COLORS.gray, marginBottom: 16, fontFamily: FONT }}>
          {progressWidth < 100 ? `Feltöltés... ${Math.round(progressWidth)}%` : "248 kép sikeresen feltöltve!"}
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, flex: 1 }}>
            {photos.map((op, i) => (
              <div key={i} style={{
                opacity: op, aspectRatio: "3/4",
                background: `linear-gradient(135deg, ${
                  ["#dbeafe", "#fce7f3", "#dcfce7", "#fef3c7", "#e0e7ff", "#fce7f3", "#dcfce7", "#fef9c3"][i]
                }, ${
                  ["#93c5fd", "#f9a8d4", "#86efac", "#fcd34d", "#a5b4fc", "#f472b6", "#4ade80", "#fde047"][i]
                })`,
                borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.7)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {["👩", "👦", "👧", "👨", "👩‍🦰", "👱", "👶", "🧑"][i]}
                </div>
              </div>
            ))}
          </div>

          {/* Folder tree */}
          <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "Boronkay Gimn.", count: "124 kép", op: folder1 },
              { name: "  └ 12.A", count: "32 kép", op: folder2 },
              { name: "  └ 12.B", count: "28 kép", op: folder3 },
            ].map((f, i) => (
              <div key={i} style={{
                opacity: f.op, display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", background: i === 0 ? `${COLORS.primary}10` : COLORS.white,
                borderRadius: 8, border: `1px solid ${COLORS.grayLight}`,
              }}>
                <span style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: COLORS.dark, fontFamily: FONT }}>
                  {f.name}
                </span>
                <span style={{ fontSize: 11, color: COLORS.gray, fontFamily: FONT }}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </BrowserWindow>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 3: AI RETOUCH (13-23s, 300 frames)
// ============================================
const AIRetouchSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.aiRetouch - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const scanLine = interpolate(frame, [40, 160], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const beforeAfterSlide = interpolate(frame, [80, 140], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const stat1 = fadeIn(frame, 160);
  const stat2 = fadeIn(frame, 180);
  const stat3 = fadeIn(frame, 200);
  const batchDone = frame > 220;
  const batchProgress = interpolate(frame, [140, 220], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white, opacity }}>
      <StepBadge text="2. lépés — AI Retusálás" color={COLORS.purple} frame={frame} fps={fps} />
      <SectionTitle
        title="AI automatikus retusálás"
        subtitle="Portré javítás, háttéreltávolítás, vágás — pillanatok alatt"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 240, left: "50%",
        transform: "translateX(-50%)", display: "flex", gap: 40,
      }}>
        {/* Before/After card */}
        <div style={{
          width: 500, height: 400, borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)", overflow: "hidden", position: "relative",
        }}>
          {/* "Before" side */}
          <div style={{
            position: "absolute", width: "100%", height: "100%",
            background: "linear-gradient(135deg, #fecaca, #fee2e2)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 120, height: 160, borderRadius: 12, background: "#fca5a5", marginBottom: 16 }} />
            <div style={{ fontSize: 14, color: "#dc2626", fontFamily: FONT, fontWeight: 600 }}>Eredeti</div>
            <div style={{ fontSize: 12, color: COLORS.gray, fontFamily: FONT }}>Egyenetlen háttér, gyenge vágás</div>
          </div>

          {/* "After" side sliding in */}
          <div style={{
            position: "absolute", width: "100%", height: "100%",
            background: "linear-gradient(135deg, #dcfce7, #d1fae5)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            clipPath: `inset(0 ${100 - beforeAfterSlide}% 0 0)`,
          }}>
            <div style={{ width: 120, height: 160, borderRadius: 12, background: "#86efac", marginBottom: 16 }} />
            <div style={{ fontSize: 14, color: COLORS.green, fontFamily: FONT, fontWeight: 600 }}>AI Retusált</div>
            <div style={{ fontSize: 12, color: COLORS.gray, fontFamily: FONT }}>Tökéletes háttér, pontos vágás</div>
          </div>

          {/* Scan line */}
          {scanLine < 100 && (
            <div style={{
              position: "absolute", left: `${scanLine}%`, top: 0,
              width: 3, height: "100%",
              background: `linear-gradient(180deg, ${COLORS.purple}, ${COLORS.pink})`,
              boxShadow: `0 0 20px ${COLORS.purple}80`,
            }} />
          )}

          {/* AI badge */}
          <div style={{
            position: "absolute", top: 16, right: 16,
            background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
            color: COLORS.white, padding: "6px 14px", borderRadius: 20,
            fontSize: 13, fontWeight: 600, fontFamily: FONT,
          }}>
            AI
          </div>
        </div>

        {/* Stats panel */}
        <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 16, paddingTop: 20 }}>
          {[
            { icon: "🎯", label: "Arcfelismerés", desc: "Automatikus diákazonosítás", op: stat1 },
            { icon: "✂️", label: "Intelligens vágás", desc: "Szabályos portré keret", op: stat2 },
            { icon: "🎨", label: "Háttér csere", desc: "Egységes háttér minden képen", op: stat3 },
          ].map((item, i) => (
            <div key={i} style={{
              opacity: item.op, display: "flex", gap: 14, alignItems: "center",
              background: COLORS.bg, borderRadius: 12, padding: "14px 18px",
            }}>
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.dark, fontFamily: FONT }}>{item.label}</div>
                <div style={{ fontSize: 12, color: COLORS.gray, fontFamily: FONT }}>{item.desc}</div>
              </div>
            </div>
          ))}

          {/* Batch progress */}
          <div style={{
            background: batchDone ? `${COLORS.green}15` : COLORS.bg,
            border: `1px solid ${batchDone ? COLORS.green + "40" : COLORS.grayLight}`,
            borderRadius: 12, padding: "14px 18px",
            opacity: fadeIn(frame, 140),
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: 8,
              fontSize: 14, fontFamily: FONT,
            }}>
              <span style={{ color: COLORS.dark, fontWeight: 600 }}>
                {batchDone ? "Kész!" : "Batch feldolgozás..."}
              </span>
              <span style={{ color: batchDone ? COLORS.green : COLORS.gray }}>
                {Math.round(batchProgress)}%
              </span>
            </div>
            <div style={{ width: "100%", height: 6, background: COLORS.grayLight, borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${batchProgress}%`, height: "100%", borderRadius: 3,
                background: batchDone ? COLORS.green : `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})`,
              }} />
            </div>
            <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 6, fontFamily: FONT }}>
              248 kép — {batchDone ? "mind feldolgozva" : `${Math.round(batchProgress * 2.48)} / 248 kész`}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 4: GALLERY SHARING (23-32s, 270 frames)
// ============================================
const GallerySection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.gallery - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const qrScale = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const share1 = fadeIn(frame, 50);
  const share2 = fadeIn(frame, 70);
  const share3 = fadeIn(frame, 90);

  const viewCount = Math.min(
    Math.round(interpolate(frame, [100, 200], [0, 47], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    })),
    47
  );

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <StepBadge text="3. lépés — Galéria megosztás" color={COLORS.cyan} frame={frame} fps={fps} />
      <SectionTitle
        title="QR kóddal megosztás pillanatok alatt"
        subtitle="Egyedi link minden diáknak — a szülők otthonról választanak"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 260, left: "50%",
        transform: `translateX(-50%) scale(${Math.min(qrScale, 1)})`,
        display: "flex", gap: 60, alignItems: "flex-start",
      }}>
        {/* QR Card */}
        <div style={{
          width: 280, background: COLORS.white, borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)", padding: 30, textAlign: "center",
        }}>
          <div style={{
            width: 180, height: 180, margin: "0 auto 20px",
            background: COLORS.dark, borderRadius: 12,
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: "repeat(7, 1fr)", gap: 3, padding: 12,
          }}>
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} style={{
                background: [0,1,2,6,7,8,12,14,20,35,36,42,43,44,48].includes(i)
                  ? COLORS.white : (i % 3 === 0 ? COLORS.white : "transparent"),
                borderRadius: 2,
              }} />
            ))}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.dark, fontFamily: FONT }}>Kiss Petra</div>
          <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 4, fontFamily: FONT }}>12.A osztály</div>
        </div>

        {/* Share methods + counter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 20 }}>
          {[
            { icon: "📧", label: "Email küldés", desc: "Automatikus értesítés", op: share1 },
            { icon: "📱", label: "SMS küldés", desc: "Közvetlen link a telefonra", op: share2 },
            { icon: "🔗", label: "Link másolás", desc: "Bármilyen platformra", op: share3 },
          ].map((item, i) => (
            <div key={i} style={{
              opacity: item.op, display: "flex", alignItems: "center", gap: 14,
              background: COLORS.white, borderRadius: 12, padding: "14px 20px", width: 300,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 26 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.dark, fontFamily: FONT }}>{item.label}</div>
                <div style={{ fontSize: 12, color: COLORS.gray, fontFamily: FONT }}>{item.desc}</div>
              </div>
            </div>
          ))}

          <div style={{
            opacity: fadeIn(frame, 120),
            background: `linear-gradient(135deg, ${COLORS.green}15, ${COLORS.green}08)`,
            border: `1px solid ${COLORS.green}30`, borderRadius: 12,
            padding: "14px 20px", width: 300,
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.green, fontFamily: FONT }}>{viewCount} szülő</div>
            <div style={{ fontSize: 12, color: COLORS.gray, fontFamily: FONT }}>már megnyitotta a galériát</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 5: SELECTION + PAYMENT (32-42s, 300 frames)
// ============================================
const SelectionSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.selection - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const phoneScale = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const selected1 = frame > 60;
  const selected2 = frame > 90;
  const checkmark1 = fadeIn(frame, 60);
  const checkmark2 = fadeIn(frame, 90);
  const paymentOpacity = fadeIn(frame, 140);
  const paymentDone = frame > 230;

  return (
    <AbsoluteFill style={{ background: COLORS.white, opacity }}>
      <StepBadge text="4. lépés — Szülői választás" color={COLORS.accent} frame={frame} fps={fps} />
      <SectionTitle
        title="A szülők otthonról választanak és fizetnek"
        subtitle="Mobiltelefonon, egyszerűen — Stripe biztonságos fizetéssel"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 230, left: "50%",
        transform: `translateX(-50%) scale(${Math.min(phoneScale, 1)})`,
        display: "flex", gap: 50, alignItems: "flex-start",
      }}>
        {/* Phone */}
        <div style={{
          width: 300, height: 540, background: COLORS.dark, borderRadius: 36,
          padding: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
        }}>
          <div style={{
            width: "100%", height: "100%", background: COLORS.white,
            borderRadius: 28, overflow: "hidden", padding: 14,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, marginBottom: 10, fontFamily: FONT }}>
              Válassz képet — Kiss Petra
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Portré #1", selected: selected1, checkOp: checkmark1, color: "#dbeafe" },
                { label: "Portré #2", selected: selected2, checkOp: checkmark2, color: "#dcfce7" },
                { label: "Csoportkép", selected: false, checkOp: 0, color: "#fce7f3" },
                { label: "Egyéni tablókép", selected: false, checkOp: 0, color: "#fef3c7" },
              ].map((photo, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 10,
                  border: `2px solid ${photo.selected ? COLORS.primary : COLORS.grayLight}`,
                  background: photo.selected ? `${COLORS.primary}08` : COLORS.white,
                }}>
                  <div style={{ width: 50, height: 64, borderRadius: 6, background: photo.color }} />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: COLORS.dark, fontFamily: FONT }}>
                    {photo.label}
                  </div>
                  {photo.selected && (
                    <div style={{
                      opacity: photo.checkOp as number, width: 22, height: 22, borderRadius: "50%",
                      background: COLORS.primary, display: "flex", alignItems: "center",
                      justifyContent: "center", color: COLORS.white, fontSize: 12,
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Payment */}
            <div style={{ opacity: paymentOpacity, marginTop: 14 }}>
              <div style={{ background: COLORS.bg, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: FONT }}>
                  <span style={{ color: COLORS.gray }}>Összesen:</span>
                  <span style={{ fontWeight: 700, color: COLORS.dark }}>4.990 Ft</span>
                </div>
                <div style={{
                  marginTop: 8, height: 36, borderRadius: 8,
                  background: paymentDone ? COLORS.green
                    : `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: COLORS.white, fontWeight: 600, fontSize: 13, fontFamily: FONT,
                }}>
                  {paymentDone ? "✓ Fizetés sikeres!" : "Fizetés bankkártyával"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side features */}
        <div style={{ paddingTop: 40, width: 380 }}>
          {[
            { icon: "🔒", title: "Stripe fizetés", desc: "Biztonságos online fizetés bankkártyával", delay: 40 },
            { icon: "📱", title: "Mobilbarát", desc: "Bármilyen eszközről használható", delay: 80 },
            { icon: "⚡", title: "Azonnali visszaigazolás", desc: "Nincs várakozás, nincs papírmunka", delay: 120 },
            { icon: "🧾", title: "Automatikus számla", desc: "e-Számla a szülőnek, kimutatás a fotósnak", delay: 160 },
          ].map((item, i) => (
            <div key={i} style={{
              opacity: fadeIn(frame, item.delay),
              display: "flex", gap: 14, marginBottom: 16,
              background: COLORS.bg, borderRadius: 12, padding: "14px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, color: COLORS.dark, fontFamily: FONT }}>{item.title}</div>
                <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 2, fontFamily: FONT }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 6: TABLÓ EDITOR (42-54s, 360 frames)
// ============================================
const TabloEditorSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.tabloEditor - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const editorScale = spring({ frame: frame - 18, fps, config: { damping: 14 } });

  // Drag animations
  const photo1Place = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const photo2Place = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const photo3Place = interpolate(frame, [140, 165], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Template switch
  const templateSwitch = frame > 200;
  const templateFade = fadeIn(frame, 200);

  // Toolbar items appearing
  const tool1 = fadeIn(frame, 30);
  const tool2 = fadeIn(frame, 50);
  const tool3 = fadeIn(frame, 70);
  const tool4 = fadeIn(frame, 90);

  // Save indicator
  const saveOpacity = fadeIn(frame, 270);
  const savedDone = frame > 300;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <StepBadge text="5. lépés — Tablószerkesztő" color={COLORS.pink} frame={frame} fps={fps} />
      <SectionTitle
        title="Drag & drop tablószerkesztő"
        subtitle="50+ sablon, teljes testreszabás — online és desktop verzió"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 230, left: "50%",
        transform: `translateX(-50%) scale(${Math.min(editorScale, 1)})`,
        width: 1050, height: 580, display: "flex",
        boxShadow: "0 25px 80px rgba(0,0,0,0.12)", borderRadius: 16, overflow: "hidden",
      }}>
        {/* Left sidebar - tools */}
        <div style={{
          width: 70, background: COLORS.dark, display: "flex", flexDirection: "column",
          alignItems: "center", paddingTop: 16, gap: 12,
        }}>
          {[
            { icon: "🖱️", op: tool1 },
            { icon: "🔤", op: tool2 },
            { icon: "🖼️", op: tool3 },
            { icon: "📐", op: tool4 },
          ].map((t, i) => (
            <div key={i} style={{
              opacity: t.op, width: 44, height: 44, borderRadius: 10,
              background: i === 0 ? `${COLORS.primary}40` : "rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {t.icon}
            </div>
          ))}
        </div>

        {/* Canvas area */}
        <div style={{ flex: 1, background: "#f1f5f9", position: "relative", padding: 20 }}>
          {/* Template canvas */}
          <div style={{
            width: "100%", height: "100%",
            background: templateSwitch
              ? "linear-gradient(135deg, #1e3a5f 0%, #0f2137 100%)"
              : "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
            borderRadius: 8, position: "relative", overflow: "hidden",
            transition: "background 0.5s",
          }}>
            {/* School title */}
            <div style={{
              position: "absolute", top: 20, width: "100%", textAlign: "center",
              fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT,
              opacity: templateSwitch ? templateFade : 1,
            }}>
              {templateSwitch ? "Boronkay György Műszaki SZC" : "12.A Osztály Tablója"}
            </div>

            {/* Year */}
            <div style={{
              position: "absolute", top: 48, width: "100%", textAlign: "center",
              fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: FONT,
            }}>
              2025/2026
            </div>

            {/* Photo slots - 2 rows of 4 */}
            <div style={{
              position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
              width: 600, padding: "0 20px",
            }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const placed = i === 0 ? photo1Place : i === 1 ? photo2Place : i === 2 ? photo3Place : 0;
                const isPlaced = placed > 0.5;
                return (
                  <div key={i} style={{
                    aspectRatio: "3/4", borderRadius: 8,
                    background: isPlaced
                      ? `linear-gradient(135deg, ${["#dbeafe", "#dcfce7", "#fce7f3"][i % 3]}, ${["#93c5fd", "#86efac", "#f9a8d4"][i % 3]})`
                      : "rgba(255,255,255,0.1)",
                    border: isPlaced ? "none" : "2px dashed rgba(255,255,255,0.3)",
                    transform: `scale(${isPlaced ? 1 : 0.95})`,
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                    paddingBottom: 6, overflow: "hidden",
                  }}>
                    {isPlaced && (
                      <div style={{
                        fontSize: 10, color: COLORS.white, background: "rgba(0,0,0,0.4)",
                        padding: "2px 8px", borderRadius: 4, fontFamily: FONT,
                      }}>
                        {["Kiss P.", "Nagy J.", "Tóth A."][i % 3]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Teacher row at bottom */}
            <div style={{
              position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 16, opacity: fadeIn(frame, 180),
            }}>
              {["Osztályfőnök", "Igazgató"].map((label, i) => (
                <div key={i} style={{
                  width: 80, textAlign: "center",
                }}>
                  <div style={{
                    width: 60, height: 80, borderRadius: 8, margin: "0 auto",
                    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
                  }} />
                  <div style={{
                    fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 4, fontFamily: FONT,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save indicator */}
          <div style={{
            position: "absolute", bottom: 30, right: 30, opacity: saveOpacity,
            background: savedDone ? COLORS.green : COLORS.primary,
            color: COLORS.white, padding: "8px 18px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, fontFamily: FONT,
          }}>
            {savedDone ? "✓ Mentve" : "Mentés..."}
          </div>
        </div>

        {/* Right sidebar - templates */}
        <div style={{
          width: 180, background: COLORS.white, borderLeft: `1px solid ${COLORS.grayLight}`,
          padding: 12, display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, fontFamily: FONT, marginBottom: 4 }}>
            Sablonok
          </div>
          {[
            { name: "Klasszikus", color: "#7c3aed", active: !templateSwitch },
            { name: "Modern", color: "#1e3a5f", active: templateSwitch },
            { name: "Minimalista", color: "#059669", active: false },
            { name: "Elegáns", color: "#b45309", active: false },
          ].map((tmpl, i) => (
            <div key={i} style={{
              padding: "8px 10px", borderRadius: 8,
              background: tmpl.active ? `${tmpl.color}15` : COLORS.bg,
              border: `2px solid ${tmpl.active ? tmpl.color : "transparent"}`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 32, height: 40, borderRadius: 4,
                background: `linear-gradient(135deg, ${tmpl.color}, ${tmpl.color}cc)`,
              }} />
              <div style={{ fontSize: 12, fontWeight: tmpl.active ? 600 : 400, color: COLORS.dark, fontFamily: FONT }}>
                {tmpl.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 7: MARKETPLACE (54-66s, 360 frames)
// ============================================
const MarketplaceSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.marketplace - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const cardScale = spring({ frame: frame - 18, fps, config: { damping: 14 } });

  // Module toggles
  const toggles = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    on: frame > 60 + i * 25,
    opacity: fadeIn(frame, 50 + i * 25),
  }));

  // Price counter
  const basePrice = 2990;
  const modulePrices = [1290, 1490, 1490, 1990, 990, 1490, 790, 1290];
  const activeModules = toggles.filter((t) => t.on).length;
  const totalPrice = basePrice + modulePrices.slice(0, activeModules).reduce((a, b) => a + b, 0);

  const priceDisplay = interpolate(frame, [60, 260], [basePrice, totalPrice], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white, opacity }}>
      <StepBadge text="Marketplace — Építsd fel a saját csomagod" color={COLORS.orange} frame={frame} fps={fps} />
      <SectionTitle
        title="Moduláris árazás, testreszabható csomag"
        subtitle="Válaszd ki, amire szükséged van — fizess csak azért, amit használsz"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 240, left: "50%",
        transform: `translateX(-50%) scale(${Math.min(cardScale, 1)})`,
        display: "flex", gap: 40, alignItems: "flex-start",
      }}>
        {/* Module grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, width: 560,
        }}>
          {[
            { icon: "🖼️", name: "Online képválasztás", price: "1.290", color: "#dbeafe" },
            { icon: "🎨", name: "Sablon szerkesztő", price: "1.490", color: "#fce7f3" },
            { icon: "💳", name: "Online fizetés", price: "1.490", color: "#dcfce7" },
            { icon: "🛒", name: "Webshop", price: "1.990", color: "#fef3c7" },
            { icon: "📅", name: "Foglalási naptár", price: "990", color: "#e0e7ff" },
            { icon: "🤖", name: "AI retusálás", price: "1.490", color: "#f3e8ff" },
            { icon: "💬", name: "SMS értesítések", price: "790", color: "#fce7f3" },
            { icon: "🖨️", name: "Nyomda integráció", price: "1.290", color: "#dcfce7" },
          ].map((mod, i) => (
            <div key={i} style={{
              opacity: toggles[i].opacity,
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 12,
              background: toggles[i].on ? mod.color : COLORS.bg,
              border: `2px solid ${toggles[i].on ? COLORS.primary + "40" : COLORS.grayLight}`,
            }}>
              <div style={{ fontSize: 24 }}>{mod.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: FONT }}>{mod.name}</div>
                <div style={{ fontSize: 11, color: COLORS.gray, fontFamily: FONT }}>{mod.price} Ft/hó</div>
              </div>
              {/* Toggle */}
              <div style={{
                width: 40, height: 22, borderRadius: 11,
                background: toggles[i].on
                  ? `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`
                  : COLORS.grayLight,
                position: "relative",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: COLORS.white,
                  position: "absolute", top: 2,
                  left: toggles[i].on ? 20 : 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Price summary card */}
        <div style={{
          width: 320, background: COLORS.bg, borderRadius: 20, padding: 28,
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          border: `1px solid ${COLORS.grayLight}`,
        }}>
          <div style={{ fontSize: 14, color: COLORS.gray, fontFamily: FONT, marginBottom: 4 }}>
            Alap platform
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.dark, fontFamily: FONT, marginBottom: 16 }}>
            2.990 Ft/hó
          </div>

          <div style={{
            width: "100%", height: 1, background: COLORS.grayLight, marginBottom: 16,
          }} />

          <div style={{ fontSize: 14, color: COLORS.gray, fontFamily: FONT, marginBottom: 4 }}>
            + {activeModules} modul kiválasztva
          </div>

          <div style={{
            fontSize: 42, fontWeight: 800, fontFamily: FONT,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.purple})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}>
            {Math.round(priceDisplay).toLocaleString("hu-HU")} Ft
          </div>
          <div style={{ fontSize: 14, color: COLORS.gray, fontFamily: FONT }}>/hó</div>

          <div style={{
            marginTop: 20, height: 44, borderRadius: 12,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: COLORS.white, fontWeight: 600, fontSize: 15, fontFamily: FONT,
          }}>
            Próbáld ki 14 napig ingyen →
          </div>

          {/* OR packages */}
          <div style={{
            marginTop: 16, fontSize: 12, color: COLORS.gray, fontFamily: FONT, textAlign: "center",
            opacity: fadeIn(frame, 200),
          }}>
            Vagy válassz kész csomagot:
          </div>
          <div style={{
            display: "flex", gap: 8, marginTop: 8, opacity: fadeIn(frame, 220),
          }}>
            {[
              { name: "Kezdő", price: "6.990" },
              { name: "Profi", price: "14.990" },
              { name: "Stúdió", price: "24.990" },
            ].map((pkg, i) => (
              <div key={i} style={{
                flex: 1, padding: "6px 0", borderRadius: 8,
                border: `1px solid ${i === 1 ? COLORS.primary : COLORS.grayLight}`,
                background: i === 1 ? `${COLORS.primary}08` : COLORS.white,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.dark, fontFamily: FONT }}>{pkg.name}</div>
                <div style={{ fontSize: 10, color: COLORS.gray, fontFamily: FONT }}>{pkg.price} Ft</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 8: PRINTING (66-74s, 240 frames)
// ============================================
const PrintingSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.printing - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const exportScale = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const progressBar = interpolate(frame, [40, 140], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const done = frame > 160;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <StepBadge text="6. lépés — Nyomda export" color={COLORS.green} frame={frame} fps={fps} />
      <SectionTitle
        title="Egy kattintás és kész a nyomdai anyag"
        subtitle="Automatikus fájl előkészítés, ZIP export, Excel kimutatás"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 250, left: "50%",
        transform: `translateX(-50%) scale(${Math.min(exportScale, 1)})`,
        width: 750, background: COLORS.white, borderRadius: 20, padding: 36,
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.dark, fontFamily: FONT }}>
              {done ? "Export kész!" : "Nyomda export..."}
            </div>
            <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 4, fontFamily: FONT }}>
              12.A osztály — 32 diák — 96 fénykép
            </div>
          </div>
          <div style={{
            width: 50, height: 50, borderRadius: "50%",
            background: done ? COLORS.green : COLORS.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: COLORS.white, fontSize: 24,
          }}>
            {done ? "✓" : "📦"}
          </div>
        </div>

        <div style={{ width: "100%", height: 10, background: COLORS.grayLight, borderRadius: 5, overflow: "hidden" }}>
          <div style={{
            width: `${progressBar}%`, height: "100%", borderRadius: 5,
            background: done ? COLORS.green : `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
          }} />
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "tablokep_12A.zip", size: "245 MB", delay: 70, icon: "📁" },
            { name: "retusalas_export.zip", size: "180 MB", delay: 90, icon: "🖼️" },
            { name: "rendeles_lista.xlsx", size: "48 KB", delay: 110, icon: "📊" },
          ].map((file, i) => (
            <div key={i} style={{
              opacity: fadeIn(frame, file.delay),
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: COLORS.bg, borderRadius: 8, padding: "10px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 20 }}>{file.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark, fontFamily: FONT }}>{file.name}</span>
              </div>
              <span style={{ fontSize: 12, color: COLORS.gray, fontFamily: FONT }}>{file.size}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 9: STATISTICS (74-82s, 240 frames)
// ============================================
const StatsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const sectionFadeOut = fadeOut(frame, SECTION_FRAMES.stats - 10);
  const opacity = Math.min(sectionFadeIn, sectionFadeOut);

  const cardScale = spring({ frame: frame - 15, fps, config: { damping: 14 } });

  const stat = (target: number, startFrame: number) =>
    Math.round(interpolate(frame, [startFrame, startFrame + 60], [0, target], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));

  return (
    <AbsoluteFill style={{ background: COLORS.white, opacity }}>
      <StepBadge text="Valós idejű statisztikák" color={COLORS.primary} frame={frame} fps={fps} />
      <SectionTitle
        title="Minden adat egy helyen, valós időben"
        subtitle="Dashboard, kimutatások, bevétel tracker — Excel export"
        frame={frame}
      />

      <div style={{
        position: "absolute", top: 240, left: "50%",
        transform: `translateX(-50%) scale(${Math.min(cardScale, 1)})`,
        display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", width: 900,
      }}>
        {/* Stat cards */}
        {[
          { label: "Összes megtekintés", value: stat(1247, 40), icon: "👁️", color: COLORS.primary, suffix: "" },
          { label: "Képválasztás", value: stat(89, 60), icon: "✅", color: COLORS.green, suffix: "%" },
          { label: "Bevétel", value: stat(487, 80), icon: "💰", color: COLORS.accent, suffix: " E Ft" },
          { label: "Aktív projektek", value: stat(12, 100), icon: "📋", color: COLORS.purple, suffix: "" },
        ].map((s, i) => (
          <div key={i} style={{
            width: 200, background: COLORS.bg, borderRadius: 16, padding: 24,
            opacity: fadeIn(frame, 40 + i * 20),
            border: `1px solid ${COLORS.grayLight}`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{
              fontSize: 36, fontWeight: 800, color: s.color, fontFamily: FONT,
            }}>
              {s.value.toLocaleString("hu-HU")}{s.suffix}
            </div>
            <div style={{ fontSize: 13, color: COLORS.gray, fontFamily: FONT, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart mock */}
      <div style={{
        position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 140, opacity: fadeIn(frame, 130),
        display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "center",
      }}>
        {[30, 45, 60, 40, 75, 55, 90, 65, 80, 70, 95, 85].map((h, i) => {
          const barHeight = interpolate(frame, [130 + i * 4, 160 + i * 4], [0, h], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{
              width: 48, height: `${barHeight}%`, borderRadius: "6px 6px 0 0",
              background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SECTION 10: OUTRO (82-90s, 240 frames)
// ============================================
const OutroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sectionFadeIn = fadeIn(frame, 0);
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const ctaOpacity = fadeIn(frame, 30);
  const ctaScale = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const featuresOpacity = fadeIn(frame, 60);
  const badgesOpacity = fadeIn(frame, 100);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
      justifyContent: "center", alignItems: "center", opacity: sectionFadeIn,
    }}>
      <div style={{
        position: "absolute", top: -100, right: -100, width: 500, height: 500,
        borderRadius: "50%", background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{
        position: "absolute", bottom: -150, left: -100, width: 600, height: 600,
        borderRadius: "50%", background: "rgba(255,255,255,0.03)",
      }} />

      <div style={{
        transform: `scale(${logoScale})`, fontSize: 72, fontWeight: 800,
        color: COLORS.white, fontFamily: FONT, letterSpacing: -2,
      }}>
        TablóStúdió
      </div>

      {/* Feature chips */}
      <div style={{
        opacity: featuresOpacity, display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center",
      }}>
        {["AI Retusálás", "Tablószerkesztő", "Online Fizetés", "Webshop", "Marketplace"].map((f, i) => (
          <div key={i} style={{
            padding: "8px 18px", background: "rgba(255,255,255,0.12)", borderRadius: 20,
            fontSize: 14, color: COLORS.white, fontFamily: FONT,
          }}>
            {f}
          </div>
        ))}
      </div>

      <div style={{
        opacity: ctaOpacity, transform: `scale(${Math.min(ctaScale, 1)})`,
        marginTop: 36, background: COLORS.accent, color: COLORS.white,
        padding: "18px 48px", borderRadius: 16, fontSize: 26, fontWeight: 700, fontFamily: FONT,
        boxShadow: `0 12px 40px ${COLORS.accent}60`,
      }}>
        Próbáld ki 14 napig ingyen →
      </div>

      <div style={{
        opacity: badgesOpacity, marginTop: 24, fontSize: 18,
        color: "rgba(255,255,255,0.7)", fontFamily: FONT, textAlign: "center",
      }}>
        tablostudio.hu • Bankkártya nélkül • Bármikor lemondható
      </div>

      <div style={{
        opacity: badgesOpacity, marginTop: 12, fontSize: 14,
        color: "rgba(255,255,255,0.4)", fontFamily: FONT,
      }}>
        Kezdő: 6.990 Ft/hó • Profi: 14.990 Ft/hó • Stúdió: 24.990 Ft/hó
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const DemoVideo: React.FC = () => {
  let offset = 0;

  const sections = [
    { Component: IntroSection, duration: SECTION_FRAMES.intro },
    { Component: UploadSection, duration: SECTION_FRAMES.upload },
    { Component: AIRetouchSection, duration: SECTION_FRAMES.aiRetouch },
    { Component: GallerySection, duration: SECTION_FRAMES.gallery },
    { Component: SelectionSection, duration: SECTION_FRAMES.selection },
    { Component: TabloEditorSection, duration: SECTION_FRAMES.tabloEditor },
    { Component: MarketplaceSection, duration: SECTION_FRAMES.marketplace },
    { Component: PrintingSection, duration: SECTION_FRAMES.printing },
    { Component: StatsSection, duration: SECTION_FRAMES.stats },
    { Component: OutroSection, duration: SECTION_FRAMES.outro },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {sections.map(({ Component, duration }, i) => {
        const from = offset;
        offset += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
