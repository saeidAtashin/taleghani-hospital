import { AnimatePresence } from "framer-motion";

export default function LocationProvider({ children }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
