import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Dropdown } from "antd";
import { MenuItemType } from "antd/lib/menu/interface";
import React from "react";

export interface ActionsButtonProps {
  menuItems?: MenuItemType[];
  onEditar?: () => void;
  onEliminar?: () => void;
  onPdf?: () => void;
  onExcel?: () => void;
}

export default function ActionsButton({
  menuItems,
  onEditar,
  onEliminar,
  onPdf,
  onExcel,
}: ActionsButtonProps) {
  const items = React.useMemo<MenuItemType[]>(() => {
    const _items: MenuItemType[] = [];

    if (onEditar) {
      _items.push({
        key: "editar",
        label: "Editar",
        icon: <Icon icon={"ant-design:edit-outlined"} style={{ height: '2em' }} />,
        onClick: () => {
          onEditar();
        },
      });
    }

    if (menuItems) {
      _items.push(...menuItems.map(item => ({
        ...item,
        style: { ...(item.style || {}), lineHeight: '1.75em' },
      })));
    }

    if (onPdf) {
      _items.push({
        key: "pdf",
        label: "Imprimir Pdf",
        icon: (
          <Icon
            icon={"ant-design:file-pdf-outlined"}
            style={{ height: '2em' }}
            className="text-[#e61b23]"
          />
        ),
        onClick: () => {
          onPdf();
        },
      });
    }

    if (onExcel) {
      _items.push({
        key: "excel",
        label: "Imprimir Excel",
        icon: (
          <Icon
            icon={"ant-design:file-excel-outlined"}
            style={{ height: '2em' }}
            className="text-[#1d6d43]"
          />
        ),
        onClick: () => {
          onExcel();
        },
      });
    }

    if (onEliminar) {
      _items.push({
        key: "eliminar",
        label: "Eliminar",
        icon: <Icon icon={"ant-design:delete-outlined"} style={{ height: '2em' }} />,
        danger: true,
        onClick: () => {
          onEliminar();
        },
      });
    }

    return _items;
  }, [onEditar, onEliminar, onPdf, onExcel, menuItems]);

  return (
    <Dropdown menu={{ items }} >
      <Button
        icon={<Icon icon={"ant-design:more-outlined"} />}
        size="small"
      ></Button>
    </Dropdown>
  );
}
