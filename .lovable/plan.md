# Premium 2D-Farm – Stardew/HayDay-Look, Mobile-Wow

Ziel: Aus dem aktuellen Karten-Grid wird eine lebendige, isometrische Farm-Szene. Kein Three.js, alles SVG/Canvas + CSS-Transforms. Läuft im Browser, sieht aus wie ein echtes Spiel.

## Wie es aussehen wird

```text
        ╱╲ ╱╲ ╱╲              ☀️/🌧️/🌙  Wetter+Tageszeit oben rechts
       ╱  ╳  ╳  ╲             Münzen/Level/XP-Bar oben links
      ╱  ╱╲╱╲╱╲  ╲             
     ╱  ╱🌾╳🥕╳🌱╲ ╲            Isometrische Tiles (~64×32 px)
    ╱  ╱🌽╳🍅╳  ╳  ╲           Pflanzen wachsen sichtbar in 5 Frames
   ╱══╳══╳══╳══╳══╲            Vogelscheuche/Brunnen/Gnom als Sprites
   ╲══╳══╳══╳══╳══╱            Regen/Funken/Schädlinge als Partikel
       🌳    🐄                Begleiter-Tier läuft umher
```

## Was neu ist

### 1. Isometrische Farm-Szene (`<FarmScene/>`)
- 4×3 Grid → isometrisch projiziert (CSS `transform: rotateX(60deg) rotateZ(-45deg)` auf einem Tile-Layer; Sprites bleiben aufrecht via Counter-Transform)
- Jedes Tile = SVG-Komponente mit eigenem Hover-Lift, Schatten, Klick-Bounce
- Pinch/Pan auf Mobile (einfacher Touch-Listener, kein Lib)

### 2. Animierte Pflanzen-Sprites
- Inline-SVG pro Pflanze, **5 Wachstumsframes** statt Emoji:
  - Samen → kleiner Spross → Halbwuchs → reif → erntebereit (leicht wackelnd)
- CSS `@keyframes sway` für Wind, `pulse-glow` für erntebereit
- Withered = grauer Filter + welk-Frame
- Schädling = animiertes Käfer-SVG das auf der Pflanze krabbelt

### 3. Wetter & Tageszeit als Vollbild-Layer
- **Sonne**: warmes Overlay (`bg-gradient-to-b from-amber-200/20`) + bewegte Sonne-SVG
- **Regen**: Canvas mit ~80 fallenden Linien, Pfützen-SVGs auf Tiles
- **Sturm**: Regen + Blitz-Flash-Animation alle paar Sekunden
- **Nacht**: dunkelblauer Overlay + Glühwürmchen-Partikel + Mond
- **Morgen/Abend**: warmer Gradient (orange/pink)
- Sanfte 2 s Crossfades zwischen Phasen

### 4. Decor wird sichtbar platziert
- Gekaufter Decor (Vogelscheuche, Brunnen, Gnom, Windmühle, Regenbogen, Schrein) erscheint als animiertes SVG **neben/zwischen** den Tiles
- Drag-to-place: Spieler zieht Decor auf freie Position rund ums Feld
- Position pro Decor in `farm.decorPlacements: Record<DecorId, {x,y}>` (neuer Slice-Eintrag)
- Aktive Boni werden als kleines Symbol über dem Decor angezeigt (z.B. Windmühle = +Wachstum)

### 5. Begleiter-Tier (Companion-Pet)
- Kleines Hund/Katze-SVG läuft per `requestAnimationFrame` einen Zufallspfad über die Farm
- Klick → +Mood, +1 XP, kurze Herzchen-Partikel
- Mood < 40 → traurig, sitzt rum; Mood > 80 → springt

### 6. Ernte-Feedback (das "Juicy"-Gefühl)
- Klick auf erntereifes Tile → Pflanze hüpft hoch, Konfetti-Partikel, Münz-Coins fliegen zur Coin-Anzeige (CSS-Transition entlang Bezier-Kurve), Sound-Hook (vorbereitet, optional)
- Floating-Damage-Style Text: "+12 🪙 +15 XP"

### 7. Mini-Tiefe direkt mitgenommen
- **Combo-Counter**: 3 perfekte Ernten in Folge (health > 80) → 1.5× Coin-Multiplier für nächste Ernte, sichtbarer Streak-Badge oben
- **Daily-Login-Widget** auf Nexus-Dashboard (nutzt schon vorhandenes `daily.ts`)
- Klick-Sound-Hooks vorbereitet (kein Asset-Pack jetzt, aber `playSound()`-Stub)

## Was unverändert bleibt

- Komplette Game-Logik (Wachstum-Tick, Wetter-Cycle, Quests, Inventar, Markt, Achievements)
- State-Slices, gameStore, Routing
- Auth & Cloud-Sync (das ist der nächste Schritt nach diesem)

## Dateien

**Neu**
- `src/components/farm/FarmScene.tsx` – isometrischer Container + Pan/Zoom
- `src/components/farm/IsoTile.tsx` – ein Tile inkl. Pflanze, Schädling, Pfütze
- `src/components/farm/PlantSprite.tsx` – SVG mit 5 Wachstumsframes pro Pflanzen-ID
- `src/components/farm/WeatherLayer.tsx` – Regen-Canvas, Blitze, Glühwürmchen
- `src/components/farm/DayNightOverlay.tsx` – Farb-Gradient + Sonne/Mond
- `src/components/farm/DecorSprite.tsx` – animierte Decor-SVGs + Drag-to-place
- `src/components/farm/Companion.tsx` – wandernder Begleiter
- `src/components/farm/HarvestBurst.tsx` – Konfetti/Coin-Flug-Effekt
- `src/components/farm/ComboBadge.tsx` – Streak-Anzeige
- `src/components/nexus/DailyLoginCard.tsx` – Daily-Bonus-Widget
- `src/lib/farm/sprites.ts` – SVG-Pfad-Daten pro Pflanze × Frame
- `src/lib/farm/iso.ts` – Grid↔Screen-Koordinaten-Helfer

**Geändert**
- `src/pages/Farm.tsx` – Grid-JSX raus, `<FarmScene/>` rein. Logik unverändert.
- `src/pages/Nexus.tsx` – `<DailyLoginCard/>` einfügen
- `src/lib/state/types.ts` – `decorPlacements` + `comboStreak` zu `FarmState` hinzufügen
- `src/index.css` – neue Keyframes (sway, glow, rain, lightning, firefly, coin-fly)

## Technisch (für Entwickler)

- **Performance**: Wetter-Partikel via einem einzigen `<canvas>` (kein DOM-Spam). Pflanzen-Sprites sind statische SVGs mit CSS-Animationen → GPU-beschleunigt. Alle Sprites unter ~5 KB inline → kein Asset-Loading.
- **Iso-Math**: `screenX = (gridX - gridY) * TILE_W/2`, `screenY = (gridX + gridY) * TILE_H/2`. Z-Index = `gridX + gridY` für korrekte Überlappung.
- **Drag-to-place**: Pointer-Events, Snap zum nächsten freien Iso-Punkt, persistiert in State.
- **Mobile**: viewport ist 407×715 → Scene rendert standardmäßig zentriert mit `transform: scale(0.85)`, Pinch-Zoom 0.6–1.4. Buttons (Markt, Achievements, Pflanzen-Auswahl) bleiben fixed-bottom als Bottom-Sheet (Drawer).
- **Kein neues npm-Package nötig** – alles mit React + Tailwind + Canvas. Bundle-Increase ~15 KB.

## Bewusst NICHT in diesem Schritt

- Echte Tiere mit eigenem Loop (Kuh/Huhn/Biene) – kommt nach Auth
- Crafting-Kette (Mehl→Brot)
- Multiplayer/Nachbar-Besuche
- Sound-Assets (nur Hooks vorbereitet)
- Auth + Cloud-Sync (Schritt 2 deiner Roadmap, danach dran)

Bereit zum Bauen wenn du grünes Licht gibst.