import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Input, InputProps } from '@/components/ui/input';

interface NativeInputProps extends Omit<InputProps, 'onChange'> {
  label?: string;
  error?: string;
  enableHaptics?: boolean;
  onChange?: (value: string) => void;
}

const NativeInput: React.FC<NativeInputProps> = ({
  label,
  error,
  enableHaptics = true,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = async () => {
    if (enableHaptics && Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    unfocused: {
      scale: 1,
      boxShadow: '0 0 0 0px rgba(239, 68, 68, 0)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <motion.div
        variants={inputVariants}
        whileFocus="focused"
        initial="unfocused"
        className="relative"
      >
        <Input
          ref={inputRef}
          {...props}
          onChange={handleChange}
          onFocus={handleFocus}
          className={`
            w-full h-14 px-4 text-base
            bg-white border-2 border-gray-200 rounded-xl
            focus:border-red-500 focus:ring-0 focus:ring-offset-0
            transition-all duration-200
            ${error ? 'border-red-500 bg-red-50' : ''}
            ${props.className || ''}
          `}
        />
      </motion.div>
      
      {error && (
        <motion.p
          className="text-sm text-red-500 px-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default NativeInput;