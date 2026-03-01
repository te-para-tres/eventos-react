// import { useForm } from "antd/lib/form/Form";
// import { Form } from "../Form";
// import {
//   FormRendererItem,
//   IFormRendererItem,
//   FormRendererItemType,
// } from "../FormRenderer/FormRendererItem";
// import { FormBuilderRendererItem } from "./FormBuilderRendererItem";
// import { Layout, Menu, Button, Tabs, Space, Modal, message } from "antd";
// import { useState } from "react";
// import {
//   PlusOutlined,
//   EyeOutlined,
//   SaveOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// const { Sider, Content } = Layout;

// export interface FormBuilderProps {
//   isLoading?: boolean;
//   initialItems?: IFormRendererItem[];
//   onChange?: (items: IFormRendererItem[]) => void;
//   onSave?: (items: IFormRendererItem[]) => void;
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

// const isValidChild = (
//   parentType: FormRendererItemType,
//   childType: FormRendererItemType
// ): boolean => {
//   if (parentType === "row") {
//     return childType === "col";
//   }
//   if (parentType === "col") {
//     return true;
//   }
//   if (parentType === "form-item") {
//     return true;
//   }
//   return false;
// };

// export const FormBuilder = ({
//   isLoading,
//   initialItems = [],
//   onChange,
//   onSave,
// }: FormBuilderProps) => {
//   const [form] = useForm();
//   const [items, setItems] = useState<IFormRendererItem[]>(initialItems);
//   const [activeTab, setActiveTab] = useState("builder");
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false);
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const findItemById = (
//     items: IFormRendererItem[],
//     id: string
//   ): {
//     item: IFormRendererItem;
//     parent: IFormRendererItem | null;
//     path: number[];
//   } | null => {
//     for (let i = 0; i < items.length; i++) {
//       if (items[i].id === id) {
//         return { item: items[i], parent: null, path: [i] };
//       }
//       if (items[i].children) {
//         const result = findItemById(items[i].children!, id);
//         if (result) {
//           return {
//             ...result,
//             parent: items[i],
//             path: [i, ...result.path],
//           };
//         }
//       }
//     }
//     return null;
//   };

//   const handleAddItem = (type: FormRendererItemType) => {
//     if (selectedItemId) {
//       const result = findItemById(items, selectedItemId);
//       if (result) {
//         const { item: parentItem, path } = result;

//         if (!canContainChildren(parentItem.type)) {
//           message.error(
//             `No se pueden agregar elementos dentro de ${parentItem.type}`
//           );
//           return;
//         }

//         if (!isValidChild(parentItem.type, type)) {
//           message.error(
//             `No se puede agregar ${type} dentro de ${parentItem.type}`
//           );
//           return;
//         }

//         setItems((prev) => {
//           const newItems = [...prev];
//           let current = newItems;
//           for (let i = 0; i < path.length - 1; i++) {
//             current = current[path[i]].children!;
//           }

//           const newItem: IFormRendererItem = {
//             id: `${type}-${Date.now()}`,
//             type,
//             props: {},
//             children: canContainChildren(type) ? [] : undefined,
//           };

//           current[path[path.length - 1]].children = [
//             ...(current[path[path.length - 1]].children || []),
//             newItem,
//           ];

//           onChange?.(newItems);
//           return newItems;
//         });
//       }
//     } else {
//       const newItem: IFormRendererItem = {
//         id: `${type}-${Date.now()}`,
//         type,
//         props: {},
//         children: canContainChildren(type) ? [] : undefined,
//       };

//       setItems((prev) => {
//         const newItems = [...prev, newItem];
//         onChange?.(newItems);
//         return newItems;
//       });
//     }
//   };

//   const handleUpdateItem = (index: number, updatedProps: any) => {
//     setItems((prev) => {
//       const newItems = [...prev];
//       newItems[index] = {
//         ...newItems[index],
//         props: {
//           ...newItems[index].props,
//           ...updatedProps,
//         },
//       };
//       onChange?.(newItems);
//       return newItems;
//     });
//   };

//   const handleDeleteItem = (index: number) => {
//     setItems((prev) => {
//       const newItems = prev.filter((_, i) => i !== index);
//       onChange?.(newItems);
//       return newItems;
//     });
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (over && active.id !== over.id) {
//       setItems((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over.id);

//         const newItems = arrayMove(items, oldIndex, newIndex);
//         onChange?.(newItems);
//         return newItems;
//       });
//     }
//   };

//   const handleSave = () => {
//     onSave?.(items);
//   };

//   const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const loadedItems = JSON.parse(e.target?.result as string);
//           setItems(loadedItems);
//           onChange?.(loadedItems);
//         } catch (error) {
//           message.error("Error al cargar el archivo");
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   const handleAddChild = (parentId: string, type: FormRendererItemType) => {
//     const result = findItemById(items, parentId);
//     if (result) {
//       const { item: parentItem, path } = result;

//       if (!canContainChildren(parentItem.type)) {
//         message.error(
//           `No se pueden agregar elementos dentro de ${parentItem.type}`
//         );
//         return;
//       }

//       if (!isValidChild(parentItem.type, type)) {
//         message.error(
//           `No se puede agregar ${type} dentro de ${parentItem.type}`
//         );
//         return;
//       }

//       setItems((prev) => {
//         const newItems = [...prev];
//         let current = newItems;
//         for (let i = 0; i < path.length - 1; i++) {
//           current = current[path[i]].children!;
//         }

//         const newItem: IFormRendererItem = {
//           id: `${type}-${Date.now()}`,
//           type,
//           props: {},
//           children: canContainChildren(type) ? [] : undefined,
//         };

//         current[path[path.length - 1]].children = [
//           ...(current[path[path.length - 1]].children || []),
//           newItem,
//         ];

//         onChange?.(newItems);
//         return newItems;
//       });
//     }
//   };

//   const renderBuilder = () => (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//     >
//       <SortableContext
//         items={items.map((item) => item.id || "")}
//         strategy={verticalListSortingStrategy}
//       >
//         <Form form={form} isLoading={isLoading}>
//           {items.map((item, index) => (
//             <FormBuilderRendererItem
//               key={`${item.type}-${index}`}
//               {...item}
//               isFormLoading={isLoading}
//               onUpdate={(props) => handleUpdateItem(index, props)}
//               onDelete={() => handleDeleteItem(index)}
//               onSelect={() => setSelectedItemId(item.id || null)}
//               isSelected={item.id === selectedItemId}
//               onAddChild={(type) => handleAddChild(item.id!, type)}
//             />
//           ))}
//         </Form>
//       </SortableContext>
//     </DndContext>
//   );

//   const renderPreview = () => (
//     <Form form={form} isLoading={isLoading}>
//       {items.map((item, index) => (
//         <FormRendererItem
//           key={`${item.type}-${index}`}
//           {...item}
//           isFormLoading={isLoading}
//         />
//       ))}
//     </Form>
//   );

//   return (
//     <Layout className="h-full">
//       <Sider width={250} theme="light" className="border-r">
//         <div className="p-4">
//           <h3 className="text-lg font-medium mb-4">Componentes</h3>
//           <div className="space-y-2">
//             {AVAILABLE_COMPONENTS.map((component) => (
//               <Button
//                 key={component.type}
//                 icon={<PlusOutlined />}
//                 onClick={() => handleAddItem(component.type)}
//                 className="w-full text-left"
//               >
//                 {component.label}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </Sider>
//       <Content className="p-4">
//         <div className="mb-4">
//           <Space>
//             <Button
//               icon={<EyeOutlined />}
//               onClick={() => setIsPreviewVisible(true)}
//             >
//               Vista Previa
//             </Button>
//             <Button icon={<SaveOutlined />} onClick={handleSave}>
//               Guardar
//             </Button>
//             <Button icon={<UploadOutlined />}>
//               <label className="cursor-pointer">
//                 Cargar
//                 <input
//                   type="file"
//                   accept=".json"
//                   className="hidden"
//                   onChange={handleLoad}
//                 />
//               </label>
//             </Button>
//           </Space>
//         </div>
//         {renderBuilder()}
//         <Modal
//           title="Vista Previa"
//           open={isPreviewVisible}
//           onCancel={() => setIsPreviewVisible(false)}
//           width={800}
//           footer={null}
//         >
//           {renderPreview()}
//         </Modal>
//       </Content>
//     </Layout>
//   );
// };
