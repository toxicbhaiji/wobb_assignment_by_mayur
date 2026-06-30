import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { SelectedProfiles } from "./SelectedProfiles";

export function ListDrawer() {
  const isOpen = useProfileStore((state) => state.isListOpen);
  const closeList = useProfileStore((state) => state.closeList);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            aria-hidden
            onClick={closeList}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <div
        className={
          isOpen
            ? "fixed top-0 right-0 z-50 h-full w-full max-w-sm p-3 md:static md:z-auto md:h-auto md:w-auto md:max-w-none md:p-0 md:translate-x-0 md:sticky md:top-6"
            : "fixed top-0 right-0 z-50 h-full w-full max-w-sm p-3 translate-x-full md:translate-x-0 md:static md:z-auto md:h-auto md:w-auto md:max-w-none md:p-0 md:sticky md:top-6"
        }
        style={
          isOpen
            ? undefined
            : { transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }
        }
        role="dialog"
        aria-modal="true"
        aria-label="Your shortlisted creators"
      >
        <SelectedProfiles onClose={closeList} />
      </div>
    </>
  );
}
