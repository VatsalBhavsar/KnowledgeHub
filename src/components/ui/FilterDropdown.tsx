'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
}

export function FilterDropdown({ value, onChange, options, placeholder = 'Select' }: FilterDropdownProps) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                className={cn(
                    'inline-flex items-center justify-between rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors',
                    'min-w-[140px]'
                )}
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="ml-2">
                    <ChevronDown className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    position="popper" // ✅ Important: disables centering behavior
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className={cn(
                        'z-[100]',
                        'overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl',
                        'animate-fade-in transition-transform data-[state=open]:scale-100 data-[state=closed]:scale-95 transform origin-top-left',
                        'min-w-[140px]'
                    )}
                >
                    <Select.Viewport className="p-1">
                        {options.map((option) => (
                            <Select.Item
                                key={option}
                                value={option}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md select-none',
                                    'text-zinc-700 dark:text-zinc-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors'
                                )}
                            >
                                <Select.ItemText>{option}</Select.ItemText>
                                <Select.ItemIndicator className="ml-auto">
                                    <Check className="h-4 w-4 text-blue-500" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
