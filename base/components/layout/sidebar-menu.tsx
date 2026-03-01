import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { LocalMenuItem } from "@base/hooks/useLocalApp/useLocalApp";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip } from "antd";
import { ItemType, MenuItemType } from "antd/lib/menu/interface";
import { useEffect, useState } from "react";

export interface SidebarMenuProps {
  menu: ItemType<MenuItemType>[];
  activeKeys: string[];
  collapsed: boolean;
}

export function SidebarMenu({ menu, activeKeys, collapsed }: SidebarMenuProps) {
  const navigate = useNavigate();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    const _menu = menu as LocalMenuItem[];
    const toExpand: string[] = [];
    for (const item of _menu) {
      if (item?.children && item.children.some((c: any) => activeKeys.includes(c.key))) {
        toExpand.push(item.key);
      }
    }
    setExpandedKeys(toExpand);
  }, [activeKeys, menu]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  

  const renderItem = (item: LocalMenuItem, depth = 0) => {
    const isSelected = activeKeys?.includes(item.key);
    const isParent = !!item.children && item.children.length > 0;
    const isExpanded = expandedKeys.includes(item.key);

    return (
      <div key={item.key}>
        <Tooltip title={collapsed ? item.label : ""} color="black" placement="right">
          <div
            className={`flex items-center gap-3 py-2 cursor-pointer transition-all duration-200 border-l-2
              ${depth > 0 ? "pl-10" : "pl-3"}
              ${isSelected
                ? "text-[#810d48] border-[#810d48] bg-pink-50 font-medium"
                : "border-transparent hover:bg-neutral-100 hover:text-[#810d48]"
              }
            `}
            onClick={() => {
              if (isParent) {
                toggleExpand(item.key);
              } else {
                navigate({ to: item.key as string });
              }
            }}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {isParent && (
                  <span className="text-xs pr-3">
                    {isExpanded ? <DownOutlined /> : <RightOutlined />}
                  </span>
                )}
              </>
            )}
          </div>
        </Tooltip>
        {isParent && isExpanded && !collapsed && (
          <div>
            {(item.children as LocalMenuItem[]).map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {(menu as LocalMenuItem[]).map((item) => renderItem(item))}
    </div>
  );
}
