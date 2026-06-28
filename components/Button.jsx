/**
 * Re-export shim for backward compatibility.
 *
 * The canonical Button implementation now lives in /components/ui/Button.jsx
 * as part of the Week 3 component library. This file is kept so existing
 * imports like `import Button from "@/components/Button"` continue to work
 * without any changes across the app (Navbar, Hero, Login, Footer, etc).
 *
 * New code should import from "@/components/ui" instead:
 *   import { Button } from "@/components/ui";
 */
export { default } from "./ui/Button";
