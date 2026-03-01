import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { IUsuarioBase } from "@base/interfaces/models/usuario-base.interface";
import { ReactNode } from "react";

export interface UserNavOptionsProps {
  onClick?: () => void;
  menuItems?: MenuProps;
  tituloRender?: ReactNode;
  subtituloRender?: ReactNode;
  usuario?: IUsuarioBase;
}

export function UserNavOptions({
  onClick,
  menuItems,
  usuario,
  tituloRender = (
    <div className="text-sm text-white font-bold bold text-right">
      {usuario?.nombre ?? ""} {usuario?.apellidos ?? ""}
    </div>
  ),
  subtituloRender = (
    <div className="text-sm text-white text-left">{usuario?.correo}</div>
  ),
}: UserNavOptionsProps) {
  return (
    <div className="flex h-full">
      <div className="flex align-middle justify-center flex-col mr-2">
        {tituloRender}
        {subtituloRender}
      </div>
      <Dropdown menu={menuItems} trigger={["click"]}>
        <Button
          type="text"
          onClick={() => onClick && onClick()}
          style={{ height: "100%", paddingLeft: "8px", paddingRight: "8px" }}
        >
          <div className="flex align-middle justify-center">
            <Avatar icon={<UserOutlined />}></Avatar>
          </div>
        </Button>
      </Dropdown>
    </div>
  );
}

export default UserNavOptions;
