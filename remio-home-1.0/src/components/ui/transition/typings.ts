import { TransitionsProps } from "@kasuie/utils";
import type { HTMLMotionProps, m, TargetAndTransition } from "framer-motion";

export interface BaseTransitionProps extends HTMLMotionProps<"div"> {
  duration?: number;

  timeout?: {
    exit?: number;
    enter?: number;
  };

  delay?: number;
  
  animate?: boolean
  
  transitionkey?: TransitionsProps;

  animation?: {
    enter?: TargetAndTransition["transition"];
    exit?: TargetAndTransition["transition"];
  };

  lcpOptimization?: boolean;
  as?: keyof typeof m;
}
