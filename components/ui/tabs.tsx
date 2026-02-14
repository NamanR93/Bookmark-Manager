import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";


export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [activeValue, setActiveValue] = useState(propTabs[0].value);

  const active = propTabs.find(
    (tab) => tab.value === activeValue
  )!;

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start relative max-w-full w-full",
          containerClassName
        )}
      >
        {propTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveValue(tab.value)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
          >
            {activeValue === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>

      <FadeInDiv
        active={active}
        className={cn("mt-6", contentClassName)}
      />
    </>
  );
};


export const FadeInDiv = ({
  className,
  active,
}: {
  className?: string;
  active: Tab;
}) => {
  return (
    <motion.div
      key={active.value}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full mt-6", className)}
    >
      {active.content}
    </motion.div>
  );
};
