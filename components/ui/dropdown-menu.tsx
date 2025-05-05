import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Check, ChevronRight, Circle } from 'lucide-react-native';

// Tipos para os componentes
type DropdownMenuProps = {
  children: React.ReactNode;
};

type DropdownMenuTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

type DropdownMenuContentProps = {
  children: React.ReactNode;
  sideOffset?: number;
  className?: string;
};

type DropdownMenuItemProps = {
  children: React.ReactNode;
  inset?: boolean;
  onSelect?: () => void;
  className?: string;
};

type DropdownMenuCheckboxItemProps = {
  children: React.ReactNode;
  checked?: boolean;
  onSelect?: () => void;
  className?: string;
};

type DropdownMenuRadioItemProps = {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
};

type DropdownMenuLabelProps = {
  children: React.ReactNode;
  inset?: boolean;
  className?: string;
};

type DropdownMenuSeparatorProps = {
  className?: string;
};

type DropdownMenuShortcutProps = {
  children: React.ReactNode;
  className?: string;
};

type DropdownMenuGroupProps = {
  children: React.ReactNode;
};

type DropdownMenuSubProps = {
  children: React.ReactNode;
};

type DropdownMenuSubTriggerProps = {
  children: React.ReactNode;
  inset?: boolean;
  className?: string;
};

type DropdownMenuSubContentProps = {
  children: React.ReactNode;
  className?: string;
};

type DropdownMenuRadioGroupProps = {
  children: React.ReactNode;
};

// Componentes principais
const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <Menu>{children}</Menu>;
};

const DropdownMenuTrigger = ({ children, className }: DropdownMenuTriggerProps) => {
  return (
    <MenuTrigger>
      <View className={className}>{children}</View>
    </MenuTrigger>
  );
};

const DropdownMenuContent = forwardRef<any, DropdownMenuContentProps>(
  ({ children, sideOffset = 4, className }, ref) => {
    return (
      <MenuOptions
        optionsContainerStyle={{
          zIndex: 50,
          minWidth: 128, // Replace '8rem' with a numeric value in pixels (e.g., 128px)
          overflow: 'hidden',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          backgroundColor: '#ffffff',
          padding: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          ...(className ? { customClassName: className } : {}),
        }}
      >
        {children}
      </MenuOptions>
    );
  }
);

const DropdownMenuItem = forwardRef<any, DropdownMenuItemProps>(
  ({ children, inset, onSelect, className }, ref) => {
    return (
      <MenuOption onSelect={onSelect}>
        <View
          className={cn(
            'relative flex flex-row items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100',
            inset ? 'pl-8' : undefined, // Use ternary operator here
            className
          )}
        >
          {children}
        </View>
      </MenuOption>
    );
  }
);

const DropdownMenuCheckboxItem = forwardRef<any, DropdownMenuCheckboxItemProps>(
  ({ children, checked, onSelect, className }, ref) => {
    return (
      <MenuOption onSelect={onSelect}>
        <View
          className={cn(
            'relative flex flex-row items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100',
            className
          )}
        >
          <View className="absolute left-2 flex h-4 w-4 items-center justify-center">
            {checked && <Check size={16} className="text-foreground" />}
          </View>
          {children}
        </View>
      </MenuOption>
    );
  }
);

const DropdownMenuRadioItem = forwardRef<any, DropdownMenuRadioItemProps>(
  ({ children, onSelect, className }, ref) => {
    return (
      <MenuOption onSelect={onSelect}>
        <View
          className={cn(
            'relative flex flex-row items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100',
            className
          )}
        >
          <View className="absolute left-2 flex h-4 w-4 items-center justify-center">
            <Circle size={8} className="text-foreground" />
          </View>
          {children}
        </View>
      </MenuOption>
    );
  }
);

const DropdownMenuLabel = forwardRef<any, DropdownMenuLabelProps>(
  ({ children, inset, className }, ref) => {
    return (
      <View
        className={cn(
          'px-2 py-1.5 text-sm font-semibold text-foreground',
          inset ? 'pl-8' : undefined, // Use ternary operator here
          className
        )}
      >
        <Text className="text-sm font-semibold">{children}</Text>
      </View>
    );
  }
);

const DropdownMenuSeparator = forwardRef<any, DropdownMenuSeparatorProps>(
  ({ className }, ref) => {
    return (
      <View className={cn('-mx-1 my-1 h-px bg-gray-200', className)} />
    );
  }
);

const DropdownMenuShortcut = forwardRef<any, DropdownMenuShortcutProps>(
  ({ children, className }, ref) => {
    return (
      <Text
        className={cn('ml-auto text-xs tracking-widest text-gray-500', className)}
      >
        {children}
      </Text>
    );
  }
);

const DropdownMenuGroup = ({ children }: DropdownMenuGroupProps) => {
  return <View className="my-1">{children}</View>;
};

const DropdownMenuSub = ({ children }: DropdownMenuSubProps) => {
  return <View>{children}</View>;
};

const DropdownMenuSubTrigger = forwardRef<any, DropdownMenuSubTriggerProps>(
  ({ children, inset, className }, ref) => {
    return (
      <View
        className={cn(
          'flex flex-row items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100',
          inset ? 'pl-8' : undefined, // Use ternary operator here
          className
        )}
      >
        <Text className="flex-1">{children}</Text>
        <ChevronRight size={16} className="ml-auto text-gray-500" />
      </View>
    );
  }
);

const DropdownMenuSubContent = forwardRef<any, DropdownMenuSubContentProps>(
  ({ children, className }, ref) => {
    return (
      <View
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-lg',
          className
        )}
      >
        {children}
      </View>
    );
  }
);

const DropdownMenuRadioGroup = ({ children }: DropdownMenuRadioGroupProps) => {
  return <View className="my-1">{children}</View>;
};

// Nomes de exibição
DropdownMenuContent.displayName = 'DropdownMenuContent';
DropdownMenuItem.displayName = 'DropdownMenuItem';
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';
DropdownMenuLabel.displayName = 'DropdownMenuLabel';
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

// Função cn para combinação de classes (simplificada)
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};