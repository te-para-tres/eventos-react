import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { LocalMenuItem } from "@base/hooks/useLocalApp/useLocalApp";
import { useNavigate } from "@tanstack/react-router";
import { Card, Tooltip } from "antd";
import { ItemType, MenuItemType } from "antd/lib/menu/interface";
import { useEffect, useState } from "react";

export interface SidebarMenuProps {
  menu: ItemType<MenuItemType>[];
  activeKeys: string[];
  collapsed: boolean;
}

export function SidebarMenu({ menu, activeKeys, collapsed }: SidebarMenuProps) {
  const [menuItems, setMenuItems] = useState<any[]>(menu);
  const [currentParent, setCurrentParent] = useState<any>(null);
  const navigate = useNavigate();

  const handleBackClick = () => {
    setMenuItems(menu);
    setCurrentParent(null);
  };

  const selectParent = (item: any) => {
    setCurrentParent(item);
    setMenuItems(item?.children);
  };

  useEffect(() => {
    if (menu && activeKeys && activeKeys.length > 0) {
      let foundParent = null;
      const _menu: LocalMenuItem[] = menu as LocalMenuItem[];
      for (const item of _menu) {
        if (activeKeys.includes(item?.key) && item?.children) {
          foundParent = item;
          setMenuItems(item?.children);
          setCurrentParent(item);
          break;
        }
      }

      if (!foundParent) {
        setMenuItems(menu);
        setCurrentParent(null);
      }
    } else {
      setMenuItems(menu);
      setCurrentParent(null);
    }
  }, [activeKeys, menu]);

  return (
    <div
      className={
        collapsed
          ? "w-full grid grid-cols-1 p-1"
          : "w-full grid grid-cols-2 p-1"
      }
    >
      {menuItems.map((item: LocalMenuItem,i) => {
        const isSelected = activeKeys?.includes(item?.key);
        const isParent = !!item?.children;
        return (
          <Tooltip
            title={collapsed ? item?.label : ""}
            color="black"
            placement="right"
            key={i}
          >
            <Card
              key={item?.key}
              hoverable={collapsed ? false : true}
              onClick={() =>
                isParent ? selectParent(item) : navigate({ to: item?.key })
              }
              styles={{ body: { padding: 2 } }}
              className={`${
                isSelected
                  ? "col-span-1 bg-none border transition-all duration-300 h  border-[#810d48] bg-neutral-50"
                  : "col-span-1 bg-none border rounded-none border-transparent bg-neutral-50"
              }
                    m-2`}
            >
              <div className="w-full flex flex-col items-center">
                <div
                  className={`
                    ${isSelected ? "text-[#810d48]" : ""}
                    ${collapsed ? "text-4xl transition-all duration-300 hover:text-[#810d48] hover:font-bold" : "text-4xl"}`}
                >
                  {item?.icon}
                </div>
                {!collapsed && (
                  <div className="w-full ">
                    <p
                      className={`text-sm text-center wrap-break-word ${isSelected ? "text-[#810d48]" : ""}`}
                    >
                      {item?.label}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </Tooltip>
        );
      })}
      {currentParent && (
        <Card
          hoverable
          onClick={handleBackClick}
          styles={{ body: { padding: 2 } }}
          className={`${collapsed ? "col-span-1" : "col-span-2"}
            " bg-none border border-neutral-200 bg-neutral-50 rounded-none my-1`}
        >
          <div className="w-full flex flex-col items-center">
            <div className="text-lg">
              <ArrowLeftOutlined />
            </div>
          </div>
        </Card>
      )}
      <Card
        hoverable
        onClick={() => navigate({ to: "/perfil" })}
        styles={{ body: { padding: 2 } }}
        className={`${collapsed ? "col-span-1" : "col-span-2"}
            " bg-none bg-neutral-50 rounded-none my-1`}
      >
        <div className="w-full flex flex-col items-center">
          <div className="text-lg">
            <UserOutlined /> Perfil
          </div>
        </div>
      </Card>
    </div>
  );
}
