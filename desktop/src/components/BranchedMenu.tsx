import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';

export interface BranchedMenuItem {
  value: string;
  label: string;
  icon?: any;
  badge?: string;
}

export interface BranchedMenuGroup {
  label: string;
  children: BranchedMenuItem[];
}

export interface BranchedMenuProps {
  items: BranchedMenuGroup[];
  defaultOpen?: number[];
  defaultActive?: string;
  onSelect?: (value: string, item: BranchedMenuItem) => void;
  color?: string;
  accentColor?: string;
  lineColor?: string;
  width?: number | string;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
  className?: string;
}

export const BranchedMenu: React.FC<BranchedMenuProps> = ({
  items,
  defaultOpen = [0],
  defaultActive = '',
  onSelect,
  color = '#f5f5f5',
  accentColor = '#f5f5f5',
  lineColor = '#3f3f46',
  width = 240,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
  className = '',
}) => {
  const [openGroups, setOpenGroups] = useState<number[]>(defaultOpen);
  const [activeItem, setActiveItem] = useState<string>(defaultActive);

  const toggleGroup = (idx: number) => {
    setOpenGroups((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleItemClick = (item: BranchedMenuItem) => {
    setActiveItem(item.value);
    onSelect?.(item.value, item);
  };

  const renderIcon = (icon: any, isSelected: boolean) => {
    if (!icon) return null;
    if (typeof icon === 'function' || React.isValidElement(icon)) {
      const IconComponent = icon as React.ElementType;
      return <IconComponent className="w-4 h-4 shrink-0" />;
    }
    // Hugeicons data structure
    return (
      <HugeiconsIcon
        icon={icon}
        size={16}
        color={isSelected ? accentColor : '#9ca3af'}
        className="shrink-0"
      />
    );
  };

  return (
    <div
      className={`select-none font-sans text-left ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        color,
        fontSize: `${fontSize}px`,
      }}
    >
      {items.map((group, groupIdx) => {
        const isOpen = openGroups.includes(groupIdx);
        const childrenCount = group.children.length;
        const totalHeight = childrenCount * rowHeight;
        const hasActiveChild = group.children.some((c) => c.value === activeItem);

        return (
          <div key={group.label} className="mb-4 last:mb-0">
            {/* Group Header */}
            <div
              onClick={() => toggleGroup(groupIdx)}
              className="flex items-center space-x-2.5 py-1.5 cursor-pointer group transition-colors"
            >
              <div
                className="w-[2px] h-4 rounded-full transition-colors"
                style={{
                  backgroundColor: hasActiveChild ? accentColor : 'transparent',
                }}
              />
              <span
                className="font-semibold tracking-tight transition-colors text-[14px]"
                style={{
                  color: hasActiveChild ? accentColor : color,
                }}
              >
                {group.label}
              </span>
            </div>

            {/* Branch Tree Container */}
            {isOpen && childrenCount > 0 && (
              <div
                className="relative overflow-hidden transition-all"
                style={{
                  transitionDuration: `${foldDuration}ms`,
                }}
              >
                {/* SVG Branch Curved Lines */}
                <svg
                  className="absolute left-0 top-0 pointer-events-none"
                  width={indent + 10}
                  height={totalHeight}
                  style={{
                    overflow: 'visible',
                  }}
                >
                  {/* Continuous Trunk Line connecting the top to the lowest branch */}
                  {childrenCount > 1 && (
                    <line
                      x1={trunk}
                      y1={0}
                      x2={trunk}
                      y2={(childrenCount - 1) * rowHeight + rowHeight / 2 - radius}
                      stroke={lineColor}
                      strokeWidth={lineWidth}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Individual Curved Branch Arms for each item */}
                  {group.children.map((child, childIdx) => {
                    const isSelected = child.value === activeItem;
                    const centerY = childIdx * rowHeight + rowHeight / 2;
                    const r = Math.min(radius, centerY);

                    // Path: starts going down vertical trunk, then smoothly curves into horizontal arm
                    const pathD = `M ${trunk} ${Math.max(
                      0,
                      centerY - r
                    )} Q ${trunk} ${centerY} ${trunk + r} ${centerY} L ${indent} ${centerY}`;

                    return (
                      <path
                        key={child.value}
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? accentColor : lineColor}
                        strokeWidth={isSelected ? lineWidth + 0.5 : lineWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transition: `stroke ${drawDuration}ms ease, stroke-width ${drawDuration}ms ease`,
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Branch Item Rows */}
                <div className="relative">
                  {group.children.map((child) => {
                    const isSelected = child.value === activeItem;

                    return (
                      <div
                        key={child.value}
                        onClick={() => handleItemClick(child)}
                        style={{
                          height: `${rowHeight}px`,
                          paddingLeft: `${indent + 8}px`,
                        }}
                        className="flex items-center space-x-2.5 cursor-pointer rounded-md transition-colors group/item"
                      >
                        <div
                          className="transition-colors"
                          style={{
                            color: isSelected ? accentColor : '#9ca3af',
                          }}
                        >
                          {renderIcon(child.icon, isSelected)}
                        </div>

                        <span
                          className="truncate transition-colors"
                          style={{
                            color: isSelected ? accentColor : '#a1a1aa',
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          {child.label}
                        </span>

                        {child.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {child.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BranchedMenu;
