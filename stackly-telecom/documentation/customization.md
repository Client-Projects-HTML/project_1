# Customization Guide

## Theme Colors
The template relies on CSS variables for theming. You can find these in `assets/css/style.css`:

```css
:root {
    --primary-color: #0d6efd;
    --telecom-blue: #0056b3;
    /* ... */
}
```

## Dark Mode
Dark mode logic is handled in `assets/js/main.js` and styles are in `assets/css/dark.css`.

## RTL Support
Add `dir="rtl"` to the `html` tag to enable RTL mode. Styles are in `assets/css/rtl.css`.
