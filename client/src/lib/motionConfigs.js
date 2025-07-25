
export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}
export const buttonMotion = {
  whileHover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  whileTap: {
    scale: 0.95,
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}
export const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export const fadeRight = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
}
