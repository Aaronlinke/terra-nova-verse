// Inline SVG sprite paths per crop × growth frame (0..4).
// Frame 0 = seed mound, 1 = sprout, 2 = young, 3 = mature, 4 = ready (juicy/big).
// Each sprite is rendered inside a 64x80 viewBox, anchored at bottom-center.

export type CropId = "carrot" | "tomato" | "wheat" | "corn" | "pumpkin" | "mystic";
export type Frame = 0 | 1 | 2 | 3 | 4;

interface SpritePiece {
  d: string; // path
  fill: string;
  stroke?: string;
}

interface CropSprite {
  // Per frame: list of svg paths
  frames: SpritePiece[][];
  // Optional accent color used for harvest glow
  glow: string;
}

// Helper: a small soil mound shared as the base of every plant
const mound = (): SpritePiece => ({
  d: "M16 74 Q32 64 48 74 Q48 78 32 78 Q16 78 16 74 Z",
  fill: "#5a3a1f",
});

const stemThin = (h: number, color = "#3d8b3d"): SpritePiece => ({
  d: `M32 74 L32 ${74 - h}`,
  fill: "none",
  stroke: color,
});

const leaf = (cx: number, cy: number, rx: number, ry: number, color: string): SpritePiece => ({
  d: `M${cx} ${cy} m-${rx},0 a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0 Z`,
  fill: color,
});

const circle = (cx: number, cy: number, r: number, color: string): SpritePiece => ({
  d: `M${cx} ${cy} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0 Z`,
  fill: color,
});

export const CROP_SPRITES: Record<CropId, CropSprite> = {
  carrot: {
    glow: "#ff8a3d",
    frames: [
      [mound()],
      [mound(), leaf(32, 70, 4, 3, "#5cb85c")],
      [mound(), leaf(28, 66, 5, 4, "#4caf50"), leaf(36, 66, 5, 4, "#4caf50")],
      [
        mound(),
        leaf(26, 60, 6, 10, "#388e3c"),
        leaf(38, 60, 6, 10, "#388e3c"),
        leaf(32, 56, 6, 10, "#43a047"),
      ],
      [
        mound(),
        leaf(24, 56, 7, 12, "#2e7d32"),
        leaf(40, 56, 7, 12, "#2e7d32"),
        leaf(32, 50, 8, 14, "#43a047"),
        // peeking carrot top
        { d: "M28 72 L32 76 L36 72 Z", fill: "#ff8a3d" },
      ],
    ],
  },
  tomato: {
    glow: "#ff5252",
    frames: [
      [mound()],
      [mound(), stemThin(8)],
      [mound(), stemThin(16), leaf(28, 62, 5, 3, "#4caf50"), leaf(36, 62, 5, 3, "#4caf50")],
      [
        mound(),
        stemThin(26),
        leaf(24, 56, 7, 4, "#388e3c"),
        leaf(40, 56, 7, 4, "#388e3c"),
        circle(32, 52, 5, "#7cb342"),
      ],
      [
        mound(),
        stemThin(30),
        leaf(22, 52, 8, 5, "#2e7d32"),
        leaf(42, 52, 8, 5, "#2e7d32"),
        circle(28, 48, 6, "#e53935"),
        circle(38, 50, 6, "#e53935"),
        circle(32, 42, 7, "#ef5350"),
      ],
    ],
  },
  wheat: {
    glow: "#f9d976",
    frames: [
      [mound()],
      [mound(), stemThin(10, "#a8c97b")],
      [mound(), stemThin(20, "#a8c97b"), stemThin(20, "#a8c97b")],
      [
        mound(),
        { d: "M28 74 L26 50", fill: "none", stroke: "#cdb777" },
        { d: "M32 74 L32 46", fill: "none", stroke: "#cdb777" },
        { d: "M36 74 L38 50", fill: "none", stroke: "#cdb777" },
      ],
      [
        mound(),
        { d: "M26 74 L24 44", fill: "none", stroke: "#d4a017" },
        { d: "M32 74 L32 40", fill: "none", stroke: "#d4a017" },
        { d: "M38 74 L40 44", fill: "none", stroke: "#d4a017" },
        // ears
        { d: "M22 44 q2 -4 4 0 q-2 4 -4 0 Z", fill: "#f9d976" },
        { d: "M30 40 q2 -5 4 0 q-2 5 -4 0 Z", fill: "#f9d976" },
        { d: "M38 44 q2 -4 4 0 q-2 4 -4 0 Z", fill: "#f9d976" },
      ],
    ],
  },
  corn: {
    glow: "#ffd54f",
    frames: [
      [mound()],
      [mound(), stemThin(10)],
      [mound(), stemThin(22), leaf(26, 60, 8, 4, "#388e3c")],
      [
        mound(),
        stemThin(34),
        leaf(22, 56, 10, 5, "#2e7d32"),
        leaf(42, 50, 10, 5, "#2e7d32"),
      ],
      [
        mound(),
        stemThin(40),
        leaf(20, 52, 12, 6, "#1b5e20"),
        leaf(44, 46, 12, 6, "#1b5e20"),
        // cob
        { d: "M30 38 Q32 28 34 38 L34 48 Q32 50 30 48 Z", fill: "#ffd54f", stroke: "#a17d10" },
        { d: "M30 38 L34 38 M30 42 L34 42 M30 46 L34 46", fill: "none", stroke: "#a17d10" },
      ],
    ],
  },
  pumpkin: {
    glow: "#ff9800",
    frames: [
      [mound()],
      [mound(), leaf(32, 70, 5, 3, "#4caf50")],
      [mound(), leaf(28, 66, 8, 5, "#43a047"), leaf(36, 66, 8, 5, "#43a047")],
      [
        mound(),
        leaf(24, 62, 10, 6, "#2e7d32"),
        leaf(40, 62, 10, 6, "#2e7d32"),
        circle(32, 58, 8, "#fb8c00"),
      ],
      [
        mound(),
        leaf(20, 60, 12, 7, "#1b5e20"),
        leaf(44, 60, 12, 7, "#1b5e20"),
        circle(32, 56, 14, "#f57c00"),
        { d: "M32 42 L32 36", fill: "none", stroke: "#5d4037" },
        // ridges
        { d: "M22 56 Q32 64 42 56", fill: "none", stroke: "#e65100" },
      ],
    ],
  },
  mystic: {
    glow: "#e040fb",
    frames: [
      [mound()],
      [mound(), stemThin(10, "#7e57c2")],
      [mound(), stemThin(22, "#7e57c2"), leaf(28, 60, 5, 3, "#9575cd")],
      [
        mound(),
        stemThin(32, "#7e57c2"),
        leaf(24, 54, 7, 4, "#9575cd"),
        leaf(40, 54, 7, 4, "#9575cd"),
        circle(32, 44, 6, "#ba68c8"),
      ],
      [
        mound(),
        stemThin(38, "#7e57c2"),
        leaf(22, 52, 8, 5, "#9575cd"),
        leaf(42, 52, 8, 5, "#9575cd"),
        // 6 petals
        circle(32, 40, 7, "#ba68c8"),
        circle(26, 36, 5, "#e040fb"),
        circle(38, 36, 5, "#e040fb"),
        circle(32, 32, 5, "#f06292"),
        circle(28, 44, 5, "#ce93d8"),
        circle(36, 44, 5, "#ce93d8"),
        circle(32, 40, 3, "#ffeb3b"),
      ],
    ],
  },
};

export const stageToFrame = (stage: string): Frame => {
  switch (stage) {
    case "seed": return 0;
    case "sprout": return 1;
    case "growing": return 2;
    case "mature": return 3;
    case "harvest": return 4;
    default: return 0;
  }
};
