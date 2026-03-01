import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { IUsuarioBase } from "@base/interfaces/models/usuario-base.interface";
import { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate()
  return (
    <div className="flex h-full p-3">
      <Button
        type="text"
        onClick={() => navigate({ to: "/perfil" })}
        style={{ height: "100%", paddingLeft: "8px", paddingRight: "8px" }}
        className="hover:bg-stone-100"
      >
      <div className="flex align-middle justify-center flex-col mr-2">
        {tituloRender}
        {subtituloRender}
      </div>
        <div className="flex align-middle justify-center">
          <Avatar icon={<UserOutlined className="text-zinc-700" />}></Avatar>
        </div>
      </Button>
    </div>
  );
}

export default UserNavOptions;
