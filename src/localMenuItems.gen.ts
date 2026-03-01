import { LocalMenuItem } from "@base/hooks/useLocalApp/useLocalApp";

//TODO: REEMPLAZAR POR EL MENU GENERADO POR EL BACKEND
const local_menu_items: LocalMenuItem[] = [
  {
    key: "/",
    label: "Inicio",
    icon: "ant-design:home-outlined",
    visible: true,
  },
  {
    key: "/asistencia",
    label: "Asistencia",
    icon: "lucide:user-round-check",
    visible: true,
  },
  {
    key: "/catalogos",
    label: "Catálogos",
    icon: "lucide:list-plus",
    visible: true,
  },
  {
    key: "/eventos",
    label: "Eventos",
    icon: "lucide:calendar-days",
    visible: true,
  },
  {
    key: "/administracion",
    label: "Administración",
    icon: "lucide:shield-user",
    visible: true,
    children: [
      {
        key: "/administracion/usuarios",
        label: "Usuarios",
        icon: "mdi:account-multiple",
        visible: true,
      },
      {
        key: "/administracion/modulos",
        label: "Módulos",
        icon: "lucide:square-kanban",
        visible: true,
      },
      {
        key: "/administracion/permisos",
        label: "Permisos",
        icon: "lucide:shield-ellipsis",
        visible: true,
      },
    ],
  },
];

export default local_menu_items;
