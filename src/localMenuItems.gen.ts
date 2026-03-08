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
    key: "/eventos",
    label: "Eventos",
    icon: "lucide:calendar-days",
    visible: true,
  },
  {
    key: "/unidad-academica",
    label: "Unidades Academicas",
    icon: "lucide:building",
    visible: true,
  },
  {
    key: "/carrera",
    label: "Carreras",
    icon: "lucide:book-open-text",
    visible: true,
  },
  {
    key: "/material",
    label: "Materiales",
    icon: "lucide:toolbox",
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
