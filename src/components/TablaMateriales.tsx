import { Material } from "@/models/Material.model";
import ActionsButton from "@base/components/buttons/ActionsButton";
import { Button, Card, Col, Form, Row, Table, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { NumberInput } from "@base/components/form/NumberInput/NumberInput";
import { useForm } from "antd/es/form/Form";

type MaterialFila = Material & { key: string };

const TablaMateriales: React.FC = () => {
  const [form] = useForm();
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [materiales, setMateriales] = useState<MaterialFila[]>([]);
  const [materialEditandoKey, setMaterialEditandoKey] = useState<string | null>(null);

  const columns = useMemo(() => {
    const _columns: ColumnType<MaterialFila>[] = [];
    _columns.push({
      key: "acciones",
      width: 10,
      render: (_, record) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionsButton
              onEliminar={() => {
                setMateriales((prev) =>
                  prev.filter((item) => item.key !== record.key),
                );
                if (materialEditandoKey === record.key) {
                  form.resetFields();
                  setMaterialEditandoKey(null);
                  setFormVisible(false);
                }
              }}
            />
          </div>
        );
      },
    });

    _columns.push({
      key: "nombre",
      title: "Material/Equipo",
      dataIndex: "nombre",
    });

    _columns.push({
      key: "cantidad",
      title: "Cantidad",
      dataIndex: "cantidad",
    });

    _columns.push({
      key: "nota",
      title: "Notas",
      dataIndex: "nota",
    });
    
    return _columns;
  }, [form, materialEditandoKey])

  const onEditar = useCallback((record: MaterialFila) => {
    form.setFieldsValue(record);
    setMaterialEditandoKey(record.key);
    setFormVisible(true);
  }, [form]);

  const onFinish = useCallback((values: Material) => {
    try {
      if (materialEditandoKey) {
        setMateriales((prev) =>
          prev.map((item) =>
            item.key === materialEditandoKey ? { ...item, ...values } : item,
          ),
        );
      } else {
        setMateriales((prev) => [
          ...prev,
          { ...values, key: crypto.randomUUID() },
        ]);
      }
      form.resetFields();
      setFormVisible(false);
      setMaterialEditandoKey(null);
    } catch (error) {
      return error;
    }
  }, [form, materialEditandoKey]);


  return (
    <Row className="w-full h-auto">
      <Row justify={"space-between"} className="w-full h-auto">
        <Col span={12}>
          <Typography.Title level={4} className="flex items-center my-4 text-zinc-600">
            <Icon icon="lucide:archive" className="inline-block mr-2" /> Materiales y Equipo
          </Typography.Title>
        </Col>
        <Col span={12} className="flex items-center justify-end">
          <Button
            onClick={() => {
              if (formVisible) {
                form.resetFields();
                setMaterialEditandoKey(null);
              }
              setFormVisible(!formVisible);
            }}
            danger={formVisible}
            icon={<Icon icon={formVisible ? "lucide:x" : "lucide:plus"} />}
          >
            {formVisible ? "Cancelar" : "Nuevo Material"}
          </Button>
        </Col>
      </Row>

      {
        formVisible && (
          <Card className="mb-4 w-full h-auto">
            <Form
              component={false}
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="w-full h-auto"
            >
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item
                    label="Material/Equipo"
                    name="nombre"
                    rules={[
                      AntdFormValidation.Requerido("El material es obligatorio")
                    ]}
                  >
                    <TextInput placeholder="Ej. Sillas" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Cantidad"
                    name="cantidad"
                    rules={[AntdFormValidation.Requerido("La cantidad es obligatoria")]}
                  >
                    <NumberInput type="number" placeholder="Ej. 10" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Notas"
                    name="nota"
                  >
                    <TextAreaInput placeholder="Ej. Necesario para el auditorio" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={() => form.submit()}
                    icon={<Icon icon="lucide:check" />}
                    block
                  >
                    {materialEditandoKey ? "Guardar cambios" : "Confirmar y Agregar"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        )
      }

      <Col span={24}>
        <Table
          columns={columns}
          dataSource={materiales}
          rowKey="key"
          onRow={(record) => ({
            onClick: () => onEditar(record),
          })}
          rowClassName="cursor-pointer"
        />
      </Col>
    </Row >
  )
};

export default TablaMateriales;
