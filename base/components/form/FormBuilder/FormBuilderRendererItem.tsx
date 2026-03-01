// import { Button, Col, Form, Row, Card, Dropdown } from "antd";
// import { TextFormItem, TextFormItemProps } from "../TextInput/TextFormItem";
// import {
//   FormRendererItemType,
//   IFormRendererItem,
// } from "../FormRenderer/FormRendererItem";
// import { TextInputUpdater } from "../TextInput/TextInputUpdater";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { DragOutlined, PlusOutlined } from "@ant-design/icons";
// import type { MenuProps } from "antd";

// interface IFormBuilderRendererItem extends IFormRendererItem {
//   onUpdate?: (props: any) => void;
//   onDelete?: () => void;
//   onAddChild?: (type: FormRendererItemType) => void;
//   onSelect?: () => void;
//   isSelected?: boolean;
// }

// const AVAILABLE_COMPONENTS: { type: FormRendererItemType; label: string }[] = [
//   { type: "row", label: "Fila" },
//   { type: "col", label: "Columna" },
//   { type: "form-item", label: "Form Item" },
//   { type: "input-text", label: "Input Texto" },
//   { type: "boton-submit", label: "Botón Submit" },
// ];

// const canContainChildren = (type: FormRendererItemType): boolean => {
//   return type === "row" || type === "col" || type === "form-item";
// };

// const getValidChildren = (
//   parentType: FormRendererItemType
// ): FormRendererItemType[] => {
//   if (parentType === "row") {
//     return ["col"];
//   }
//   if (parentType === "col") {
//     return ["row", "form-item", "input-text", "boton-submit"];
//   }
//   if (parentType === "form-item") {
//     return ["input-text", "boton-submit"];
//   }
//   return [];
// };

// export const FormBuilderRendererItem = ({
//   type,
//   props,
//   isFormLoading,
//   children,
//   onUpdate,
//   onDelete,
//   onAddChild,
//   onSelect,
//   isSelected,
//   id,
// }: IFormBuilderRendererItem) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: id || type });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const validChildren = getValidChildren(type);
//   const menuItems: MenuProps["items"] = AVAILABLE_COMPONENTS.filter((comp) =>
//     validChildren.includes(comp.type)
//   ).map((comp) => ({
//     key: comp.type,
//     label: comp.label,
//     onClick: () => onAddChild?.(comp.type),
//   }));

//   const renderUpdater = () => {
//     switch (type) {
//       case "input-text":
//         return onUpdate ? (
//           <TextInputUpdater
//             initialValues={props as TextFormItemProps}
//             onChange={(values) => onUpdate(values)}
//           />
//         ) : null;
//       // Aquí se pueden agregar más updaters para otros tipos de componentes
//       default:
//         return null;
//     }
//   };

//   const renderContent = () => {
//     switch (type) {
//       case "row":
//         return (
//           <Row {...props} className="border border-dashed border-gray-300 p-2">
//             {children?.map((child, index) => (
//               <FormBuilderRendererItem key={index} {...child} />
//             ))}
//             {canContainChildren(type) && (
//               <div className="w-full flex justify-center mt-2">
//                 <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
//                   <Button type="dashed" icon={<PlusOutlined />}>
//                     Agregar Columna
//                   </Button>
//                 </Dropdown>
//               </div>
//             )}
//           </Row>
//         );
//       case "col":
//         return (
//           <Col {...props} className="border border-dashed border-gray-300 p-2">
//             {children?.map((child, index) => (
//               <FormBuilderRendererItem key={index} {...child} />
//             ))}
//             {canContainChildren(type) && (
//               <div className="w-full flex justify-center mt-2">
//                 <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
//                   <Button type="dashed" icon={<PlusOutlined />}>
//                     Agregar Elemento
//                   </Button>
//                 </Dropdown>
//               </div>
//             )}
//           </Col>
//         );
//       case "form-item":
//         return (
//           <Form.Item
//             {...props}
//             className="border border-dashed border-gray-300 p-2"
//           >
//             {children?.map((child, index) => (
//               <FormBuilderRendererItem key={index} {...child} />
//             ))}
//             {canContainChildren(type) && (
//               <div className="w-full flex justify-center mt-2">
//                 <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
//                   <Button type="dashed" icon={<PlusOutlined />}>
//                     Agregar Elemento
//                   </Button>
//                 </Dropdown>
//               </div>
//             )}
//           </Form.Item>
//         );
//       case "input-text":
//         return <TextFormItem {...props} />;
//       case "boton-submit":
//         return (
//           <Button
//             type="primary"
//             htmlType="submit"
//             {...props}
//             loading={isFormLoading || props.loading}
//           />
//         );
//     }
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       <Card
//         className={`mb-2 ${isSelected ? "border-blue-500 border-2" : ""}`}
//         size="small"
//         title={
//           <div className="flex items-center gap-2">
//             <div {...attributes} {...listeners} className="cursor-move">
//               <DragOutlined />
//             </div>
//             <span onClick={onSelect} className="cursor-pointer">
//               {type}
//             </span>
//           </div>
//         }
//         extra={
//           <div className="flex gap-2">
//             {onDelete && (
//               <Button danger size="small" onClick={onDelete}>
//                 Eliminar
//               </Button>
//             )}
//           </div>
//         }
//       >
//         {renderContent()}
//         {renderUpdater()}
//       </Card>
//     </div>
//   );
// };
