---
name: Academic Peer Mesh
colors:
  surface: '#f9f9ff'
  surface-dim: '#d9d9e1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fa'
  surface-container: '#ededf5'
  surface-container-high: '#e8e7ef'
  surface-container-highest: '#e2e2e9'
  on-surface: '#1a1b21'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3036'
  inverse-on-surface: '#f0f0f7'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#595f69'
  on-secondary: '#ffffff'
  secondary-container: '#dae0ed'
  on-secondary-container: '#5d636e'
  tertiary: '#4f5661'
  on-tertiary: '#ffffff'
  tertiary-container: '#676e7a'
  on-tertiary-container: '#ebf1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dde3ef'
  secondary-fixed-dim: '#c1c7d3'
  on-secondary-fixed: '#161c25'
  on-secondary-fixed-variant: '#414751'
  tertiary-fixed: '#dce3f1'
  tertiary-fixed-dim: '#c0c7d5'
  on-tertiary-fixed: '#151c26'
  on-tertiary-fixed-variant: '#404752'
  background: '#f9f9ff'
  on-background: '#1a1b21'
  surface-variant: '#e2e2e9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  title-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.0625rem
    fontWeight: '400'
    lineHeight: 1.65rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.95rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system defines an offline peer-to-peer knowledge environment designed for high-density academic collaboration, asynchronous research exchange, and field note synchronization. The brand identity bridges academic precision with the quiet utility of professional research tools.

The interface prioritizes cognitive clarity and deep focus:
- **Calm, High-Legibility Academic Surface**: Surfaces replicate the comfort of high-grade technical paper and calibrated laboratory monitors. Chrome fades into the periphery, prioritizing textual typography, structural trees, and graph topographies.
- **Audience & Context**: Built for researchers, graduate scholars, field scientists, and decentralized study groups operating in bandwidth-constrained, offline-first, or local mesh environments.
- **Design Movement**: Apple-inspired reductionism unified with functional technical minimalism. The system combines strict structural alignment, restrained translucent layers, hairline dividers, and fluid micro-states that confirm local peer connections without noisy visual disruption.

## Colors
The palette is calibrated for long reading sessions and continuous operational use in daylight or studio environments.

### Palette Architecture
- **Primary Accent (`#2563EB`)**: A vibrant electric blue used selectively for key interactive states, selected mesh node highlights, focus rings, and primary action triggers.
- **Accent Soft (`rgba(37, 99, 235, 0.08)`)**: Low-saturation tint for hover states, selected item backgrounds, active sidebar rows, and active filter chips.
- **Canvas Base (`#F5F6F8`)**: Light warm gray serving as the structural backdrop behind crisp white modular work areas.
- **Surface Level 1 (`#FFFFFF`)**: Pure white base for primary document canvases, cards, flyout modals, and inspector panels.
- **Surface Level 2 (`#F0F2F5`)**: Soft slate tint for embedded toolbars, table headers, inactive segments, and nested blockquotes.

### Typography & Border Contrasts
- **Ink Primary (`#111318`)**: Deep charcoal black providing contrast ratios exceeding WCAG AAA for editorial content.
- **Text Secondary (`#626873`)**: Balanced neutral for metadata, node paths, timestamps, and secondary labels.
- **Text Tertiary (`#8E95A2`)**: Soft slate for disabled inputs, keyboard shortcut keys, and non-actionable schema hints.
- **Subtle Hairlines**: `rgba(0, 0, 0, 0.08)` for passive cell division and content boundaries; `rgba(0, 0, 0, 0.12)` for card perimeters, floating popovers, and interactive input borders.

### System & Peer Status Tones
- **Peer Connected / Success (`#10B981` / `#059669`)**: Live sync, verified consensus, and healthy peer availability.
- **Mesh Synced / Relay Notice (`#D97706`)**: Packet queueing, offline ledger reconciliation, or intermittent local discovery.
- **Collision / Error (`#EF4444`)**: Unresolved node conflicts, failed cryptographic attestations, or dropped local links.

## Typography
Typographic hierarchy is based on structural clarity and high-density legibility. Inter provides optical clarity across data tables, nested outline indices, and inline mathematical annotations.

- **Stack Hierarchy**: Fallbacks utilize `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. Monospaced nodes default to native monospace stacks for cryptographic hash references and node IDs.
- **Rhythm & Proportions**: Body text is tuned for sustained academic reading (`body-lg` at 17px/26.4px height; `body-md` at 15px/24px height). This prevents eye fatigue during extensive reading of markdown notes and literature digests.
- **Micro-Labels**: `label-sm` utilizes an uppercase transformation with `+0.04em` tracking for node protocols, status indicators, and ledger table headers.

## Layout & Spacing
Layouts use an 8pt base grid with a 4pt sub-grid for alignment in toolbars, badge icons, and tree navigators.

### Grid Architecture
- **Desktop (1200px and up)**: 3-column architecture consisting of a collapsible peer navigation rail (240px–280px fixed width), a flexible workspace canvas (fluid min 640px, max 880px for optimal line lengths), and a contextual inspector/topology drawer (320px fixed width). Gutters are set to `1.5rem` (`24px`).
- **Tablet (768px – 1199px)**: Inspector collapses into a sheet overlay; the peer rail shifts to an icon dock or off-canvas drawer. Gutters scale to `1.25rem` (`20px`).
- **Mobile (< 768px)**: Fluid single-column view with bottom-anchored action bars, `1rem` (`16px`) outer margins, and full-bleed list dividers.

### Structural Spacing Rules
- Form field stacks and inline metadata chips maintain `space-sm` (`8px`) separation.
- Component-level internal padding follows strict tiers: compact lists use `space-sm` (`8px`) vertically and `space-md` (`16px`) horizontally; modular document cards use `space-lg` (`24px`) all around.

## Elevation & Depth
Depth relies on deliberate tonal layering combined with low-opacity ambient shadows, avoiding aggressive elevation planes.

### Layer Hierarchy
1. **Canvas Base (`#F5F6F8`)**: The root substrate on which all views are organized.
2. **Structural Content Surfaces (`#FFFFFF`)**: Distinct modular panels separated via hairlines (`rgba(0, 0, 0, 0.08)`) with `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02)`.
3. **Floating Overlays & Context Menus**: Raised cards and popover sheets use a diffused shadow: `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)` with a hairline ring (`border: 1px solid rgba(0, 0, 0, 0.08)`).
4. **Modals & Command Palettes**: Centered modal overlays cast an elevated shadow: `box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)` over an ultra-light backdrop blur (`backdrop-filter: blur(8px); background: rgba(245, 246, 248, 0.8)`).

### Edges & Outlines
Surfaces do not float unanchored; every white surface features an explicit hairline outline (`rgba(0, 0, 0, 0.08)`) to maintain distinct separation against `#F5F6F8` regardless of monitor calibration or viewing angles.

## Shapes
Geometry uses rounded corners to evoke the feel of modern desktop interfaces and clean industrial design.

- **Primary Radius (`0.5rem` / `8px`)**: Applied to buttons, inputs, segmented controls, list selections, and inline tags.
- **Card & Container Radius (`1rem` / `16px`)**: Applied to document cards, topology visualizer frames, inspector panels, and modal shells.
- **Inner Corner Rule**: Nested elements scale their radii inward (`R_inner = R_outer - padding`) so that an inner selection inside a `16px` padded container retains an `8px` corner, preventing awkward visual gaps.
- **Full Radius (Pill)**: Reserved for live status indicators, peer availability pips, and standalone node category tags.

## Components

### Buttons
- **Primary**: Solid background `#2563EB`, text `#FFFFFF`, border `transparent`, `border-radius: 8px`. Hover: `#1D4ED8`. Active: `#1E40AF`. Focus: 2px ring `#2563EB` offset by 2px white space.
- **Secondary / Ghost**: Background `#F0F2F5` or `transparent`, text `#111318`, border `1px solid rgba(0,0,0,0.08)`, `border-radius: 8px`. Hover: Background `#E4E7EB`.
- **Destructive**: Background `transparent`, text `#EF4444`, border `1px solid rgba(239,68,68,0.2)`. Hover: Background `rgba(239,68,68,0.06)`.

### Input Fields & Search Bars
- Background `#FFFFFF`, height `36px` (compact) or `42px` (standard), border `1px solid rgba(0, 0, 0, 0.12)`, `border-radius: 8px`.
- Text `#111318`, placeholder text `#8E95A2`.
- Focus state: Border color `#2563EB`, box shadow `0 0 0 3px rgba(37, 99, 235, 0.12)`. No abrupt layout shifts.

### Cards & Document Containers
- Background `#FFFFFF`, `border: 1px solid rgba(0, 0, 0, 0.08)`, `border-radius: 16px`, `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05)`.
- Internal padding: `space-lg` (`24px`).
- Header actions utilize a subtle top-right icon cluster with `#626873` icons that darken to `#111318` on hover.

### Chips & Filter Tags
- Height `26px`, padding `0 10px`, `border-radius: 9999px` (pill).
- Inactive: Background `#F0F2F5`, text `#626873`, border `1px solid transparent`.
- Active: Background `rgba(37, 99, 235, 0.08)`, text `#2563EB`, border `1px solid rgba(37, 99, 235, 0.2)`.

### Lists & Peer Rows
- Inset rows with `border-radius: 8px`, vertical padding `8px`, horizontal padding `12px`.
- Inactive row hover: Background `rgba(0, 0, 0, 0.03)`.
- Selected row: Background `rgba(37, 99, 235, 0.08)`, text `#2563EB` with bolded weight (`600`).
- Dividers between uncontained list items: `1px solid rgba(0, 0, 0, 0.06)`.

### Checkboxes & Radios
- Box size: `16px × 16px`, `border-radius: 4px` (checkbox) or `9999px` (radio).
- Unchecked: `border: 1.5px solid rgba(0, 0, 0, 0.2)`, background `#FFFFFF`.
- Checked: `border: 1.5px solid #2563EB`, background `#2563EB` with a white checkmark icon.

### Peer Indicator Badges (Domain-Specific)
- Direct mesh connection badge: Pill container, height `20px`, padding `0 8px`, font size `11px`, font weight `600`.
- Includes a live ping dot (`6px × 6px` circle): Green (`#10B981`) for low latency local hops, Amber (`#D97706`) for relay-routed sync, Gray (`#8E95A2`) for dormant cached peers.