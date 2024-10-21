export const routeVariants = {
  initial: {
    y: "100vh",
  },
  final: {
    y: "0vh",
    transition: {
      type: "spring",
      mass: 0.4,
    },
  },
};

export const childVariants = {
  initial: {
    opacity: 0,
    y: "50px",
  },
  final: {
    opacity: 1,
    y: "0px",
    transition: {
      duration: 0.5,
      delay: 0.5,
    },
  },
};

export const childVariantsRight = {
  initial: {
    opacity: 0,
    x: "200px",
  },
  final: {
    opacity: 1,
    x: "0",
    transition: {
      duration: 0.5,
      delay: 0.8,
    },
  },
};

export const childVariantsLeft = {
  initial: {
    opacity: 0,
    x: "-200px",
  },
  final: {
    opacity: 1,
    x: "0",
    transition: {
      duration: 0.5,
      delay: 0.8,
    },
  },
};

export const modalVariants = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 1,
    transition: {
      duration: 0.1,
      delay: 0,
    },
  },
};

export const childVariantsStepper = {
  initial: {
    opacity: 0,
    x: "500px",
  },
  final: {
    opacity: 1,
    x: "0px",
    transition: {
      duration: 0.5,
      delay: 0.5,
    },
  },
};

export const modalHeightVariants = {
  initial: {
    height: 0,
    opacity: 0,
  },
  final: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

export const sellerHeader = {
  initial: {
    opacity: 0,
    y: "-50px",
  },
  final: {
    opacity: 1,
    y: "0px",
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};
export const boxVariant = {
  visible: { opacity: 1, scale: 1.1 },
  hidden: { opacity: 0, scale: 0 },
};
