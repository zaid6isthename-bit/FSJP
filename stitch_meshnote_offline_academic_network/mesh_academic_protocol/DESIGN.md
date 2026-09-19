---
name: MESH Academic Protocol
colors:
  surface: '#101319'
  surface-dim: '#101319'
  surface-bright: '#36393f'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#191c21'
  surface-container: '#1d2025'
  surface-container-high: '#272a2f'
  surface-container-highest: '#32353a'
  on-surface: '#e1e2e9'
  on-surface-variant: '#c2c6d4'
  inverse-surface: '#e1e2e9'
  inverse-on-surface: '#2e3036'
  outline: '#8c919d'
  outline-variant: '#424752'
  surface-tint: '#a9c7ff'
  primary: '#a9c7ff'
  on-primary: '#003062'
  primary-container: '#66a3ff'
  on-primary-container: '#003871'
  inverse-primary: '#025db5'
  secondary: '#aec6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0163d6'
  on-secondary-container: '#e0e8ff'
  tertiary: '#55dea1'
  on-tertiary: '#003823'
  tertiary-container: '#20b87e'
  on-tertiary-container: '#00422a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468b'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#aec6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004396'
  tertiary-fixed: '#74fbbb'
  tertiary-fixed-dim: '#55dea1'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005235'
  background: '#101319'
  on-background: '#e1e2e9'
  surface-variant: '#32353a'
  canvas-deep: '#07090C'
  canvas-base: '#0B0D10'
  surface-elevated: '#151920'
  surface-hover: '#1A1F27'
  surface-active: '#202630'
  text-primary: '#F5F7FA'
  text-secondary: '#A9B0BA'
  text-tertiary: '#707985'
  text-disabled: '#4F5660'
  status-warning: '#FFCC66'
  status-error: '#FF6F7D'
  border-subtle: rgba(255, 255, 255, 0.08)
  border-strong: rgba(255, 255, 255, 0.14)
  glow-focus: rgba(102, 163, 255, 0.20)
  accent-soft: rgba(102, 163, 255, 0.14)
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-md-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-mono:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  margin-wide: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

### Design Philosophy
The design system operates at the intersection of developer-grade rigor and macOS-level executive refinement. Tailored for university students and academic researchers operating in bandwidth-constrained, offline-first peer-to-peer environments, the interface abstracts complex ad-hoc mesh networking mechanics (peer discovery, UDP broadcasts, distributed packet chunks) into an effortless, quiet utility.

The aesthetic fuses **Minimalism** with subtle **Glassmorphism** and dark tactile depth. The visual posture is calm, dependable, and unobtrusive—eliminating decorative clutter in favor of crisp typographic hierarchy, precise 1px hairline structural frames, and focused luminous feedback.

### Key Tenets
- **Hide Complexity, Reveal Intelligence:** Technical distributed networking parameters remain secondary to human connections (e.g., campus proximity, mutual classes, active course shares).
- **Subtle Luminescence:** Energy and vitality stem from controlled, luminous glows rather than broad daylight fills. The dark canvas acts as physical deep space where live peers and transfers exist as precise, glowing nodes.
- **Physical Restraint:** Elevation does not depend on muddy drop shadows. Depth is created through a stepped 6-tier charcoal surface progression, micro-translucencies, and surgical 8–14% white hairline borders.

## Colors

### Palette Construction
The color system operates on an absolute dark-mode default, prioritizing battery endurance and optical ergonomics for prolonged study sessions in low-light lecture halls.

- **Canvas & Surface Tier:** Surface progression establishes depth through subtle luminance shifts rather than chromatic tinting. The app canvas rests on `#07090C` (Canvas Deep) and `#0B0D10` (Canvas Base). Resting cards, list bodies, and panels sit at `#101318` (Surface). Modals, popovers, and elevated command surfaces occupy `#151920` (Surface Elevated). Interactive states transition through `#1A1F27` (Hover) to `#202630` (Active/Pressed).
- **MESH Electric Blue (Primary & Secondary):** `#66A3FF` acts as the primary focal beacon, signaling actionable buttons, active network routes, data streams, and verified peer links. Its deeper counterpart, `#3D82F6`, grounds hover and pressed interactions.
- **Academic Status Semantics:** 
  - Emerald (`#5EE6A8`) signals zero-packet-loss transfers, active online peers, and verified local cryptographic handshakes.
  - Amber (`#FFCC66`) flags dropped mesh connections, degraded peer signal, or battery throttles.
  - Coral (`#FF6F7D`) manages transmission failures, broken seeds, and destructive file actions.
- **Borders & Dividers:** Never use solid opaque light grays for line art. Dividers and container boundaries are strictly defined via hairline alphas: `rgba(255, 255, 255, 0.08)` for dormant boundaries, scaling to `rgba(255, 255, 255, 0.14)` on hover or focus.

## Typography

### Hierarchy and Rendering
The typography relies on an Apple-inspired native rendering stack using `Inter` as the primary base cross-platform typeface. 

- **Weight Discipline:** Screens must never combine more than three weights at any given time (Regular `400`, Medium `500`, and SemiBold `600`). Bold (`700`) is intentionally excluded to preserve an understated, technical elegance.
- **Negative Letter-Spacing:** Headings sized 18px and above employ progressive negative tracking (`-0.01em` down to `-0.04em`) to maintain optical density and counter horizontal drift.
- **Micro Labels & Badges:** Use `label-mono` or `label-md` with slight positive tracking (`0.02em`–`0.06em`) exclusively for concise system metadata (e.g., `P2P SYNCED`, `BLUETOOTH LE`, `LAN 100MB/S`). Limit uppercase text solely to these short status indicators.
- **Mobile Adaptations:** For viewport widths below 768px, display titles scale to 36px and primary page headers scale down to 26px to prevent accidental line-wrapping of technical entity names.

## Layout & Spacing

### Layout Structure
The interface implements a strict **8px structural grid** (0.5rem base increments) paired with a responsive fluid container model:

- **Desktop (1200px – 1440px+):** Fixed 248px utility sidebar, persistent 72px top action bar, and a centered content area clamped at `1440px`. The grid spans 12 fluid columns with 24px (`1.5rem`) gutters and 40px–56px margins.
- **Tablet (900px – 1199px):** Sidebar automatically collapses into a 72px icon rail. Gutters tighten to 16px (`1rem`), and page margins adjust to 24px (`1.5rem`).
- **Mobile (<900px):** Single-column vertical flow. The sidebar transitions into a drawer or bottom action bar. Horizontal canvas margins become 16px (`1rem`), with 12px gaps between interactive items.

### Spacing Application
- Use `space-xs` (4px) strictly for tight micro-alignments, badge icons, and dot status indicators.
- Use `space-sm` (8px) for related inline labels, input icons, and button groupings.
- Use `space-md` (12px) for structural internal element paddings (e.g., table cells, dense row listings).
- Use `space-lg` (16px) for standard card padding and inter-row separation in primary content streams.
- Use `space-xl` (24px) for expansive card paddings, section blocks, and empty-state placeholders.

## Elevation & Depth

### The Tonal Layering Model
Depth is communicated through surface lightness differences and subtle backdrops rather than intense physical drop shadows:

1. **Level 0 (Canvas):** `#07090C` to `#0B0D10` deep-black foundation. Completely flat.
2. **Level 1 (Resting Cards & Feeds):** `#101318` surface framed by a 1px border of `rgba(255, 255, 255, 0.08)`. Shadow: `0 10px 30px rgba(0, 0, 0, 0.22)`.
3. **Level 2 (Hovered Surfaces & Popovers):** `#151920` surface with `rgba(255, 255, 255, 0.14)` border. Shadow: `0 20px 60px rgba(0, 0, 0, 0.28)`.
4. **Level 3 (Command Palette & Critical Dialogs):** `#151920` surface floating over a backdrop blur (`backdrop-filter: blur(20px) saturate(180%)`). Border: `rgba(255, 255, 255, 0.14)`. Shadow: `0 30px 100px rgba(0, 0, 0, 0.42)`.

### Luminous Focus Halos
Interactive focus rings abandon standard heavy browser outlines. Focused inputs and selected mesh peers receive an outer glow spread: a 2px stroke at `#66A3FF` accompanied by an ambient bloom `0 0 0 4px rgba(102, 163, 255, 0.20)`.

## Shapes

### Corner Curvature Hierarchy
The system uses rounded geometry with smooth squircle-like transitions to preserve an Apple-native look and feel. 

- **Pill (`999px`):** Reserved for category filters, status indicators (`CONNECTED`, `IDLE`), peer count badges, and presence dots.
- **Extra Small (`10px`):** Form toggles, segment pills, micro-menus, and tooltips.
- **Medium (`12px`):** Primary inputs, text fields, standard buttons, and action bars.
- **Large (`16px`):** Standard note cards, peer transfer cards, and telemetry panels.
- **Extra Large (`20px` to `24px`):** Command palletes, modal dialogs, and hero dropzone surfaces.

### Border Strokes
All bounded surfaces use a uniform `1px` structural outline. Never exceed `1px` stroke width on containers; visual weight must be modified via border color alpha (`0.08` to `0.14`) rather than increased thickness.

## Components

### Buttons & Interactive Controls
- **Primary Action Button:** Solid `#66A3FF` fill with dark `#07090C` text (SemiBold, 13px/15px). Height: 44px (48px for hero triggers). Border-radius: 12px. Hover state shifts to `#3D82F6` with an optional 1px–2px subtle magnetic pull toward the cursor.
- **Secondary / Ghost Button:** Fill `#151920` with `rgba(255, 255, 255, 0.08)` border and `#F5F7FA` text. On hover, background shifts to `#1A1F27` with border brightening to `rgba(255, 255, 255, 0.14)`.
- **Destructive Button:** Background transparent with `#FF6F7D` border and text. On hover, fills with `rgba(255, 111, 125, 0.12)`.

### Text Inputs & Search Fields
- **Container:** Height 44px, radius 12px, fill `#101318`, border `rgba(255, 255, 255, 0.08)`.
- **Text & Placeholder:** Value text `#F5F7FA`, placeholder `#707985`.
- **Focus State:** Border transitions to `#66A3FF` with a subtle focus glow (`0 0 0 3px rgba(102, 163, 255, 0.20)`).

### Academic Cards & Nodes
- **Surface:** Radius 16px, background `#101318`, border 1px solid `rgba(255, 255, 255, 0.08)`. Padding: 20px–24px.
- **Interactive Peer Card:** Supports hover translation (`translateY(-2px)` over 180ms ease). Contains active student peer identity, course code pill, signal strength, and transfer progress bar.

### Chips & Badges
- **Status Chip:** Height 24px, pill shape (`radius-pill`), padding 4px 10px. Background is `rgba(255, 255, 255, 0.04)` with a `1px` hairline border matching the status tone.
- **Indicator Dots:** 6px × 6px circle with a subtle 2.4s breathing pulse for active mesh relays (`#5EE6A8`).

### Peer File Dropzone
- **Idle State:** Surface `#101318`, dashed border `1px dashed rgba(255, 255, 255, 0.14)`, radius 20px. Centered stroke icon and metadata.
- **Drag Hover State:** Border transforms to solid `#66A3FF`, background illuminates with `rgba(102, 163, 255, 0.06)`, and displays an animated upload beam.

### Checkboxes & Selection Controls
- **Box Dimensions:** 18px × 18px, radius 4px. Resting fill `#151920`, border `rgba(255, 255, 255, 0.14)`.
- **Selected State:** Fill `#66A3FF`, border `#66A3FF`, with a crisp `#07090C` check icon.