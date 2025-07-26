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

const CastleBlock = ({ className, children }: { className: string, children?: React.ReactNode }) => (
    <div className={cn('absolute', className)}>{children}</div>
);

export function PixelatedCastle({ level }: PixelatedCastleProps) {
  const scaledLevel = Math.min(level, 10);
  
  const wall = 'bg-blue-300';
  const wallShade = 'bg-blue-400';
  const wallDark = 'bg-blue-500';
  const roof = 'bg-red-500';
  const roofShade = 'bg-red-600';
  const flag = 'bg-yellow-400';
  const flagPole = 'bg-gray-600';
  const treeTrunk = 'bg-yellow-800';
  const treeLeaves = 'bg-green-500';
  const treeLeavesShade = 'bg-green-600';
  const ground = 'bg-green-400';
  const groundShade = 'bg-green-500';
  const windowColor = 'bg-yellow-300';
  const door = 'bg-yellow-800';


  return (
    <div className="relative w-[320px] h-[320px] mx-auto scale-110">
        <div className="absolute w-full h-full">

            {/* Level 1: Ground & Foundation */}
            <CastlePart level={scaledLevel} requiredLevel={1} className="w-full h-full">
                <CastleBlock className={`${ground} bottom-[24px] left-0 w-[320px] h-[8px]`} />
                <CastleBlock className={`${groundShade} bottom-[16px] left-0 w-[320px] h-[8px]`} />
                <CastleBlock className={`${wall} bottom-[32px] left-[40px] w-[240px] h-[48px]`} />
                <CastleBlock className={`${wallShade} bottom-[32px] left-[40px] w-[240px] h-[8px]`} />
                 {/* Main Gate */}
                <CastleBlock className={`${door} bottom-[32px] left-[144px] w-[32px] h-[32px]`} />
                <CastleBlock className={`${wallDark} bottom-[64px] left-[144px] w-[32px] h-[8px] rounded-t-lg`} />
            </CastlePart>

            {/* Level 2: Main Body & Central Tower Base */}
            <CastlePart level={scaledLevel} requiredLevel={2} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[80px] left-[72px] w-[176px] h-[56px]`} />
                <CastleBlock className={`${wallShade} bottom-[80px] left-[72px] w-[176px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[136px] left-[72px] w-[176px] h-[8px]`} />
                {/* Window */}
                 <CastleBlock className={`${windowColor} bottom-[104px] left-[152px] w-[16px] h-[16px]`} />
            </CastlePart>

             {/* Level 3: Left Main Tower */}
             <CastlePart level={scaledLevel} requiredLevel={3} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[80px] left-[32px] w-[40px] h-[104px]`} />
                <CastleBlock className={`${wallShade} bottom-[80px] left-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[184px] left-[32px] w-[40px] h-[8px]`} />
                 {/* Window */}
                <CastleBlock className={`${windowColor} bottom-[120px] left-[48px] w-[8px] h-[16px]`} />
            </CastlePart>

            {/* Level 4: Right Main Tower */}
            <CastlePart level={scaledLevel} requiredLevel={4} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[80px] right-[32px] w-[40px] h-[104px]`} />
                <CastleBlock className={`${wallShade} bottom-[80px] right-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[184px] right-[32px] w-[40px] h-[8px]`} />
                {/* Window */}
                <CastleBlock className={`${windowColor} bottom-[120px] right-[48px] w-[8px] h-[16px]`} />
            </CastlePart>

            {/* Level 5: Central Main Tower Roof */}
            <CastlePart level={scaledLevel} requiredLevel={5} className="w-full h-full">
                <CastleBlock className={`${roof} bottom-[144px] left-[104px] w-[112px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[152px] left-[112px] w-[96px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[160px] left-[120px] w-[80px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[168px] left-[128px] w-[64px] h-[8px]`} />
            </CastlePart>

            {/* Level 6: Left Tower Roof & Flag */}
            <CastlePart level={scaledLevel} requiredLevel={6} className="w-full h-full">
                <CastleBlock className={`${roof} bottom-[192px] left-[24px] w-[56px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[200px] left-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[208px] left-[40px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flagPole} bottom-[216px] left-[48px] w-[8px] h-[24px]`} />
                <CastleBlock className={`${flag} bottom-[232px] left-[56px] w-[16px] h-[8px]`} />
            </CastlePart>

            {/* Level 7: Right Tower Roof & Flag */}
            <CastlePart level={scaledLevel} requiredLevel={7} className="w-full h-full">
                <CastleBlock className={`${roof} bottom-[192px] right-[24px] w-[56px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[200px] right-[32px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[208px] right-[40px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${flagPole} bottom-[216px] right-[48px] w-[8px] h-[24px]`} />
                <CastleBlock className={`${flag} bottom-[232px] right-[24px] w-[16px] h-[8px]`} />
            </CastlePart>

            {/* Level 8: Central Large Spire */}
            <CastlePart level={scaledLevel} requiredLevel={8} className="w-full h-full">
                <CastleBlock className={`${wall} bottom-[176px] left-[136px] w-[48px] h-[56px]`} />
                <CastleBlock className={`${wallShade} bottom-[176px] left-[136px] w-[48px] h-[8px]`} />
                <CastleBlock className={`${wallDark} bottom-[232px] left-[136px] w-[48px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[240px] left-[128px] w-[64px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[248px] left-[136px] w-[48px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[256px] left-[144px] w-[32px] h-[8px]`} />
                 {/* Flag */}
                <CastleBlock className={`${flagPole} bottom-[264px] left-[156px] w-[8px] h-[32px]`} />
                <CastleBlock className={`${flag} bottom-[288px] left-[164px] w-[24px] h-[8px]`} />
            </CastlePart>
            
            {/* Level 9: Side Spires */}
            <CastlePart level={scaledLevel} requiredLevel={9} className="w-full h-full">
                {/* Left Spire */}
                <CastleBlock className={`${wall} bottom-[144px] left-[80px] w-[24px] h-[40px]`} />
                <CastleBlock className={`${wallDark} bottom-[184px] left-[80px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[192px] left-[72px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[200px] left-[80px] w-[24px] h-[8px]`} />
                 {/* Right Spire */}
                <CastleBlock className={`${wall} bottom-[144px] right-[80px] w-[24px] h-[40px]`} />
                <CastleBlock className={`${wallDark} bottom-[184px] right-[80px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${roof} bottom-[192px] right-[72px] w-[40px] h-[8px]`} />
                <CastleBlock className={`${roofShade} bottom-[200px] right-[80px] w-[24px] h-[8px]`} />
            </CastlePart>
            
            {/* Level 10: Trees & Environment */}
            <CastlePart level={scaledLevel} requiredLevel={10} className="w-full h-full">
                {/* Left Tree */}
                <CastleBlock className={`${treeTrunk} bottom-[32px] left-[8px] w-[8px] h-[16px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[48px] left-[0px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[56px] left-[8px] w-[8px] h-[8px]`} />
                <CastleBlock className={`${treeLeavesShade} bottom-[48px] left-[0px] w-[8px] h-[8px]`} />

                {/* Right Tree */}
                <CastleBlock className={`${treeTrunk} bottom-[32px] right-[8px] w-[8px] h-[16px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[48px] right-[0px] w-[24px] h-[8px]`} />
                <CastleBlock className={`${treeLeaves} bottom-[56px] right-[8px] w-[8px] h-[8px]`} />
                <CastleBlock className={`${treeLeavesShade} bottom-[48px] right-[16px] w-[8px] h-[8px]`} />
            </CastlePart>
        </div>
    </div>
  );
}
