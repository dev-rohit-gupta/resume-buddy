# CSS Build Setup (Monorepo)

This project uses npm packages for Bootstrap and Tailwind instead of CDNs for better performance and bundle size optimization.

## Setup Instructions

### 1. Install Dependencies (Root Level)
```bash
# From project root
npm install
```

### 2. Build CSS & JS Files

**Option A: From root (recommended)**
```bash
# Build all CSS files across monorepo
npm run build:css

# Or build everything including TypeScript
npm run build
```

**Option B: From apps/server**
```bash
cd apps/server
npm run build:css
npm run copy:bootstrap-js
```

### 3. Development with Auto-rebuild

**Terminal 1 - Watch CSS (from root)**
```bash
npm run dev:css
```

**Terminal 2 - Run dev server (from root)**
```bash
npm run dev
```

**OR run both together (from apps/server)**
```bash
npm run watch:css  # Terminal 1
npm run dev        # Terminal 2
```

## What Changed?

### Before (CDN-based):
- Bootstrap: ~200KB (full framework)
- Tailwind: Not included properly
- Total: Network-dependent, full libraries

### After (npm-based):
- Bootstrap: ~50KB (only modal, dropdown, buttons)
- Tailwind: ~5-15KB (only used utilities, purged)
- Total: ~55-65KB, optimized & bundled

## File Structure

```
apps/server/
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── src/static/css/
│   ├── bootstrap.custom.scss   # Bootstrap source (only needed components)
│   ├── bootstrap.output.css    # Generated Bootstrap (ignored in git)
│   ├── tailwind.input.css      # Tailwind source
│   ├── tailwind.output.css     # Generated Tailwind (ignored in git)
│   └── ...existing css files
└── src/static/js/
    ├── bootstrap.bundle.min.js # Copied Bootstrap JS (ignored in git)
    └── ...existing js files
```

## Benefits

1. **Smaller Bundle Size**: Only include components you use
2. **Better Performance**: Local files, no CDN dependency
3. **Offline Development**: No internet required
4. **Version Control**: Lock specific versions
5. **Tree Shaking**: Remove unused code automatically

## Customization

### Add More Bootstrap Components
Edit `src/static/css/bootstrap.custom.scss`:
```scss
@import 'bootstrap/scss/cards';  // Add card styles
@import 'bootstrap/scss/navbar'; // Add navbar styles
```

### Configure Tailwind
Edit `tailwind.config.js` for custom theme or plugins.
