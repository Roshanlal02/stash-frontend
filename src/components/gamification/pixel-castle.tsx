'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type PixelatedCastleProps = {
  level: number;
};

const CastlePart = ({
  level,
  requiredLevel,
  children,
}: {
  level: number;
  requiredLevel: number;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {level >= requiredLevel && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CastleBlock = ({ className }: { className: string }) => (
  <div className={cn('bg-gray-700 border-b-4 border-gray-900', className)} />
);

const TowerBlock = ({ className }: { className: string }) => (
    <div className={cn('bg-gray-600 border-b-4 border-gray-800', className)} />
);

const RoofBlock = ({ className }: { className: string }) => (
    <div className={cn('bg-primary border-b-4 border-blue-800', className)} />
);

const WindowBlock = ({ className }: { className: string }) => (
    <div className={cn('bg-yellow-300', className)} />
)


export function PixelatedCastle({ level }: PixelatedCastleProps) {
  const
   scaledLevel = Math.min(level, 10);
  return (
    <div className="relative w-[320px] h-[320px] mx-auto scale-110 md:scale-125">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-green-600 border-t-8 border-green-800 rounded-t-sm" />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[280px] h-[280px]">
        {/* === Level 1: Foundation === */}
        <CastlePart level={scaledLevel} requiredLevel={1}>
          <CastleBlock className="absolute bottom-0 left-[20px] w-[240px] h-[40px] rounded-t-sm" />
        </CastlePart>

        {/* === Level 2: Main Keep Base === */}
        <CastlePart level={scaledLevel} requiredLevel={2}>
          <CastleBlock className="absolute bottom-[40px] left-[60px] w-[160px] h-[60px]" />
        </CastlePart>

        {/* === Level 3: Left Tower Base === */}
        <CastlePart level={scaledLevel} requiredLevel={3}>
            <TowerBlock className="absolute bottom-[40px] left-0 w-[60px] h-[80px] rounded-t-sm" />
        </CastlePart>

        {/* === Level 4: Right Tower Base === */}
        <CastlePart level={scaledLevel} requiredLevel={4}>
            <TowerBlock className="absolute bottom-[40px] right-0 w-[60px] h-[80px] rounded-t-sm" />
        </CastlePart>

        {/* === Level 5: Main Keep Upper & Roof === */}
        <CastlePart level={scaledLevel} requiredLevel={5}>
            <CastleBlock className="absolute bottom-[100px] left-[80px] w-[120px] h-[60px]" />
            <RoofBlock className="absolute bottom-[160px] left-[70px] w-[140px] h-[20px] rounded-t-md" />
            <WindowBlock className="absolute bottom-[120px] left-[140px] -translate-x-1/2 w-[20px] h-[20px] rounded-sm" />
        </CastlePart>

        {/* === Level 6: Left Tower Upper & Roof === */}
        <CastlePart level={scaledLevel} requiredLevel={6}>
            <TowerBlock className="absolute bottom-[120px] left-[10px] w-[40px] h-[50px]" />
            <RoofBlock className="absolute bottom-[170px] left-0 w-[60px] h-[15px] rounded-t-md" />
            <WindowBlock className="absolute bottom-[130px] left-[30px] -translate-x-1/2 w-[15px] h-[15px] rounded-sm" />
        </CastlePart>

        {/* === Level 7: Right Tower Upper & Roof === */}
        <CastlePart level={scaledLevel} requiredLevel={7}>
            <TowerBlock className="absolute bottom-[120px] right-[10px] w-[40px] h-[50px]" />
            <RoofBlock className="absolute bottom-[170px] right-0 w-[60px] h-[15px] rounded-t-md" />
            <WindowBlock className="absolute bottom-[130px] right-[30px] -translate-x-1/2 w-[15px] h-[15px] rounded-sm" />
        </CastlePart>

        {/* === Level 8: Main Tower === */}
        <CastlePart level={scaledLevel} requiredLevel={8}>
            <TowerBlock className="absolute bottom-[180px] left-1/2 -translate-x-1/2 w-[60px] h-[60px]" />
            <RoofBlock className="absolute bottom-[240px] left-1/2 -translate-x-1/2 w-[80px] h-[15px] rounded-t-full" />
        </CastlePart>

        {/* === Level 9: Flags === */}
        <CastlePart level={scaledLevel} requiredLevel={9}>
            {/* Main Flag */}
            <div className="absolute bottom-[255px] left-1/2 -translate-x-1/2 w-[4px] h-[40px] bg-yellow-600" />
            <div className="absolute bottom-[280px] left-1/2 w-[30px] h-[15px] bg-accent" />
            {/* Side Flags */}
            <div className="absolute bottom-[185px] left-[25px] w-[2px] h-[20px] bg-yellow-600" />
            <div className="absolute bottom-[195px] left-[27px] w-[20px] h-[10px] bg-red-500" />
            <div className="absolute bottom-[185px] right-[25px] w-[2px] h-[20px] bg-yellow-600" />
            <div className="absolute bottom-[195px] right-[47px] w-[20px] h-[10px] bg-red-500" />
        </CastlePart>
        
        {/* === Level 10: Details & Gate === */}
        <CastlePart level={scaledLevel} requiredLevel={10}>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50px] h-[50px] bg-gray-900/50 rounded-t-full" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[40px] bg-yellow-800 rounded-t-full border-t-4 border-yellow-600" />
             <div className="absolute bottom-[245px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-yellow-300 rounded-full" />
        </CastlePart>
      </div>
    </div>
  );
}
