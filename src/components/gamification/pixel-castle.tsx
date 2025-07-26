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
  className,
}: {
  level: number;
  requiredLevel: number;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {level >= requiredLevel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Pixel = ({ className }: { className: string }) => (
  <div className={cn('absolute w-[8px] h-[8px]', className)} />
);

const CastleBlock = ({ className, children }: { className: string, children?: React.ReactNode }) => (
    <div className={cn('absolute', className)}>{children}</div>
);

export function PixelatedCastle({ level }: PixelatedCastleProps) {
  const scaledLevel = Math.min(level, 10);
  
  // Base colors inspired by the image
  const wall = 'bg-blue-300';
  const wallShade = 'bg-blue-400';
  const wallDark = 'bg-blue-500';
  const roof = 'bg-red-500';
  const roofShade = 'bg-red-600';
  const flag = 'bg-red-500';
  const flagPole = 'bg-gray-600';
  const treeTrunk = 'bg-yellow-800';
  const treeLeaves = 'bg-green-500';
  const treeLeavesShade = 'bg-green-600';
  const ground = 'bg-green-400';
  const groundShade = 'bg-green-500';
  const windowColor = 'bg-blue-800/70';

  return (
    <div className="relative w-[320px] h-[320px] mx-auto scale-125">
        <div className="absolute w-full h-full">

            {/* Level 1: Ground & Foundation */}
            <CastlePart level={scaledLevel} requiredLevel={1} className="w-full h-full">
                <CastleBlock className={`${ground} bottom-[40px] left-0 w-[320px] h-[8px]`} />
                <CastleBlock className={`${groundShade} bottom-[32px] left-0 w-[320px] h-[8px]`} />
                <CastleBlock className={`${wall} bottom-[48px] left-[40px] w-[240px] h-[48px]`} />
                <CastleBlock className={`${wallShade} bottom-[48px] left-[40px] w-[240px] h-[8px]`} />
            </CastlePart>

            {/* Level 2: Main Body */}
            <CastlePart level={scaledLevel} requiredLevel={2} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[96px] left-[72px] w-[176px] h-[56px]`} />
                <CastleBlock className={`${wallShade} bottom-[96px] left-[72px] w-[176px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[88px] left-[48px] w-[224px] h-[8px]`} />
                 {/* Main Gate */}
                <CastleBlock className={`${wallDark} bottom-[48px] left-[136px] w-[48px] h-[32px] rounded-t-lg`} />
            </CastlePart>

             {/* Level 3: Left Tower Base */}
             <CastlePart level={scaledLevel} requiredLevel={3} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[96px] left-[32px] w-[40px] h-[88px]`} />
                <CastleBlock className={`${wallShade} bottom-[96px] left-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[184px] left-[32px] w-[40px] h-[8px]`} />
             </CastlePart>

            {/* Level 4: Right Tower Base */}
            <CastlePart level={scaledLevel} requiredLevel={4} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[96px] right-[32px] w-[40px] h-[88px]`} />
                <CastleBlock className={`${wallShade} bottom-[96px] right-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[184px] right-[32px] w-[40px] h-[8px]`} />
            </CastlePart>

            {/* Level 5: Middle Tower Base */}
            <CastlePart level={scaledLevel} requiredLevel={5} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[152px] left-[104px] w-[112px] h-[40px]`} />
                <CastleBlock className={`${wallShade} bottom-[152px] left-[104px] w-[112px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[192px] left-[104px] w-[112px] h-[8px]`} />
                {/* Windows */}
                <CastleBlock className={`${windowColor} bottom-[168px] left-[120px] w-2 h-4`} />
                <CastleBlock className={`${windowColor} bottom-[168px] left-[144px] w-2 h-4`} />
                <CastleBlock className={`${windowColor} bottom-[168px] left-[168px] w-2 h-4`} />
            </CastlePart>

            {/* Level 6: Left Tower Roof & Flag */}
            <CastlePart level={scaledLevel} requiredLevel={6} className="w-full h-full">
                <CastleBlock className={`${roof} bottom-[192px] left-[24px] w-[56px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[200px] left-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[208px] left-[40px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flagPole} bottom-[192px] left-[48px] w-1 h-[32px]`} />
                <CastleBlock className={`${flag} bottom-[216px] left-[24px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flag} bottom-[208px] left-[32px] w-[16px] h-[8px]`} />
                {/* Window */}
                <CastleBlock className={`${windowColor} bottom-[112px] left-[48px] w-2 h-4`} />
            </CastlePart>

            {/* Level 7: Right Tower Roof & Flag */}
            <CastlePart level={scaledLevel} requiredLevel={7} className="w-full h-full">
                <CastleBlock className={`${roof} bottom-[192px] right-[24px] w-[56px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[200px] right-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[208px] right-[40px] w-[24px] h-[8px]`} />
                 <CastleBlock className={`${flagPole} bottom-[192px] right-[48px] w-1 h-[32px]`} />
                <CastleBlock className={`${flag} bottom-[216px] right-[24px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flag} bottom-[208px] right-[32px] w-[16px] h-[8px]`} />
                {/* Window */}
                <CastleBlock className={`${windowColor} bottom-[112px] right-[48px] w-2 h-4`} />
            </CastlePart>

            {/* Level 8: Central Large Tower */}
            <CastlePart level={scaledLevel} requiredLevel={8} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[200px] left-[128px] w-[64px] h-[40px]`} />
                <CastleBlock className={`${wallShade} bottom-[200px] left-[128px] w-[64px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[240px] left-[128px] w-[64px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[248px] left-[120px] w-[80px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[256px] left-[128px] w-[64px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[264px] left-[136px] w-[48px] h-[8px]`} />
                {/* Flag */}
                <CastleBlock className={`${flagPole} bottom-[248px] left-[158px] w-1 h-[40px]`} />
                <CastleBlock className={`${flag} bottom-[280px] left-[134px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flag} bottom-[272px] left-[142px] w-[16px] h-[8px]`} />
            </CastlePart>
            
            {/* Level 9: Tallest Spire */}
            <CastlePart level={scaledLevel} requiredLevel={9} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[200px] left-[88px] w-[32px] h-[72px]`} />
                <CastleBlock className={`${wallShade} bottom-[200px] left-[88px] w-[32px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[272px] left-[88px] w-[32px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[280px] left-[80px] w-[48px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[288px] left-[88px] w-[32px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[296px] left-[96px] w-[16px] h-[8px]`} />
                 {/* Flag */}
                <CastleBlock className={`${flagPole} bottom-[280px] left-[102px] w-1 h-[40px]`} />
                <CastleBlock className={`${flag} bottom-[312px] left-[78px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flag} bottom-[304px] left-[86px] w-[16px] h-[8px]`} />
            </CastlePart>
            
            {/* Level 10: Trees */}
            <CastlePart level={scaledLevel} requiredLevel={10} className="w-full h-full">
                {/* Left Tree */}
                <CastleBlock className={`${treeTrunk} bottom-[48px] left-[16px] w-[8px] h-[16px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[64px] left-[8px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[72px] left-[16px] w-[8px] h-[8px]`} />
                <CastleBlock className={`${treeLeavesShade} bottom-[64px] left-[8px] w-[8px] h-[8px]`} />

                {/* Right Tree */}
                <CastleBlock className={`${treeTrunk} bottom-[48px] right-[16px] w-[8px] h-[16px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[64px] right-[8px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[72px] right-[16px] w-[8px] h-[8px]`} />
                <CastleBlock className={`${treeLeavesShade} bottom-[64px] right-[24px] w-[8px] h-[8px]`} />
            </CastlePart>
        </div>
    </div>
  );
}
