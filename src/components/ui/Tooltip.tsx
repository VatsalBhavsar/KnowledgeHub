'use client';

import { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right'; // 🆕 Placement support
}

export function Tooltip({ children, content, placement = 'top' }: TooltipProps) {
    return (
        <TooltipPrimitive.Provider delayDuration={150}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={placement}
                        align="center"
                        sideOffset={8} // little gap between trigger and tooltip
                        className={cn(
                            'z-50 overflow-hidden rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-white shadow-md',
                            'data-[state=open]:animate-fade-in' // 🆕 fade animation when opening
                        )}
                    >
                        {content}
                        <TooltipPrimitive.Arrow className="fill-zinc-800" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
