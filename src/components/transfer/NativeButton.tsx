import React from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Button, ButtonProps } from '@/components/ui/button';

interface NativeButtonProps extends ButtonProps {
  hapticStyle?: ImpactStyle;
  enableSpring?: boolean;
  children: React.ReactNode;
}

const NativeButton: React.FC<NativeButtonProps> = ({
  hapticStyle = ImpactStyle.Light,
  enableSpring = true,
  onClick,
  disabled,
  children,
  ...props
}) => {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Haptic feedback for native platforms
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: hapticStyle });
    }

    onClick?.(e);
  };

  const buttonVariants = {
    tap: { 
      scale: 0.96,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }
    },
    hover: { 
      scale: 1.02,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }
    },
  };

  return (
    <motion.div
      variants={enableSpring ? buttonVariants : undefined}
      whileTap={enableSpring && !disabled ? 'tap' : undefined}
      whileHover={enableSpring && !disabled ? 'hover' : undefined}
      className="w-full"
    >
      <Button
        {...props}
        onClick={handleClick}
        disabled={disabled}
        className={`w-full transition-all duration-200 ${props.className || ''}`}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default NativeButton;