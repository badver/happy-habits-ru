# Color Palettes

## How to Switch Color Palettes

Edit `/assets/css/colors.css` and uncomment ONE palette:

```css
/* ACTIVE PALETTE - Uncomment ONE of these: */
@import "palettes/blue.css";
/* @import "palettes/warm.css"; */
/* @import "palettes/green.css"; */
/* @import "palettes/purple.css"; */
/* @import "palettes/neutral.css"; */
```

## Available Palettes

### 🔵 Blue - Professional, Calming, Trustworthy
- Primary: Sky blue (#4a90e2)
- Best for: Traditional professional look, trust-building
- Mood: Calm, reliable, safe

### 🟤 Warm - Comforting, Approachable, Welcoming
- Primary: Warm beige/tan (#d4a574)
- Best for: Creating warmth and comfort
- Mood: Cozy, nurturing, approachable

### 🟢 Green - Natural, Healing, Balanced
- Primary: Natural green (#6ba368)
- Best for: Emphasizing growth and healing
- Mood: Balanced, natural, restorative

### 🟣 Purple - Mindfulness, Wisdom, Serenity
- Primary: Soft purple (#9b7eb5)
- Best for: Mindfulness and meditation focus
- Mood: Serene, wise, contemplative

### ⚫ Neutral - Clean, Professional, Minimal
- Primary: Slate gray (#5d6d7e)
- Best for: Modern minimalist aesthetic
- Mood: Clean, professional, focused

## Creating Your Own Palette

Copy any palette file and modify the color values:

```css
:root {
  --color-primary: #yourcolor;
  --color-primary-dark: #yourdarkercolor;
  --color-secondary: #yoursecondary;
  --color-secondary-dark: #yourdarkersecondary;
  --color-accent: #youraccent;
  --color-text: #yourtextcolor;
  --color-text-light: #yourlightertextcolor;
  --color-bg: #yourbackground;
  --color-bg-light: #yourlighterbackground;
  --color-border: #yourbordercolor;
  --color-error: #yourerrorcolor;
  --color-success: #yoursuccesscolor;
}
```
