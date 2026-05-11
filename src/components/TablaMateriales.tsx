import { Material } from "@/models/Material.model";
import ActionsButton from "@base/components/buttons/ActionsButton";
import { Button, Card, Col, Divider, Form, Row, Segmented, Table, Tag, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { TextAreaInput } from "@base/components/form/TextAreaInput/TextAreaInput";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { NumberInput } from "@base/components/form/NumberInput/NumberInput";
import { useForm } from "antd/es/form/Form";
import { SelectorQuery } from "@base/components/form/SelectorQuery/SelectorQuery";

interface Props {
  setMateriales: React.Dispatch<React.SetStateAction<Material[]>>;
  materiales: Material[];
}

type ModoAgregado = "inventario" | "manual";

const TablaMateriales: React.FC<Props> = ({ setMateriales, materiales }) => {
  const [form] = useForm();
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [materialEditandoKey, setMaterialEditandoKey] = useState<string | null>(null);
  const [modo, setModo] = useState<ModoAgregado>("inventario");

  const columns = useMemo(() => {
    const _columns: ColumnType<Material>[] = [];
    _columns.push({
      key: "acciones",
      width: 10,
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ActionsButton
            onEliminar={() => {
              setMateriales((prev) => prev.filter((item) => item.id !== record.id));
              if (materialEditandoKey === record.id) {
                form.resetFields();
                setMaterialEditandoKey(null);
                setFormVisible(false);
              }
            }}
          />
        </div>
      ),
    });

    _columns.push({
      key: "nombre",
      title: "Material/Equipo",
      dataIndex: "nombre",
      render: (nombre: string, record: any) => (
        <span>
          {nombre}
          {record._desdeInventario && (
            <Tag color="blue" className="ml-2 text-xs">Inventario</Tag>
          )}
        </span>
      ),
    });

    _columns.push({ key: "cantidad", title: "Cantidad", dataIndex: "cantidad" });
    _columns.push({ key: "nota", title: "Notas", dataIndex: "nota" });

    return _columns;
  }, [form, materialEditandoKey, setMateriales]);

  /** Agrega material desde inventario (objeto completo del servidor) */
  const onAgregarDesdeInventario = useCallback(
    (materialData: Material) => {
      if (!materialData) return;
      const yaExiste = materiales.some((m) => m.id === materialData.id);
      if (yaExiste) return;
      setMateriales((prev) => [
        ...prev,
        { ...materialData, key: materialData.id ?? crypto.randomUUID(), _desdeInventario: true } as any,
      ]);
    },
    [materiales, setMateriales]
  );

  /** Agrega material creado manualmente */
  const onFinishManual = useCallback(() => {
    form.validateFields().then((values) => {
      setMateriales((prev) => [
        ...prev,
        { ...values, key: crypto.randomUUID(), _desdeInventario: false } as any,
      ]);
      form.resetFields();
      setFormVisible(false);
    }).catch(() => { });
  }, [setMateriales, form]);

  const handleToggleForm = () => {
    if (formVisible) {
      form.resetFields();
      setMaterialEditandoKey(null);
    }
    setFormVisible(!formVisible);
  };

  return (
    <Row className="w-full h-auto">
      {/* Header */}
      <Row justify="space-between" className="w-full h-auto">
        <Col span={12}>
          <Typography.Title level={4} className="flex items-center my-4 text-zinc-600">
            <Icon icon="lucide:archive" className="inline-block mr-2" /> Materiales y Equipo
          </Typography.Title>
        </Col>
        <Col span={12} className="flex items-center justify-end">
          <Button
            onClick={handleToggleForm}
            danger={formVisible}
            icon={<Icon icon={formVisible ? "lucide:x" : "lucide:plus"} />}
          >
            {formVisible ? "Cancelar" : "Agregar Material"}
          </Button>
        </Col>
      </Row>

      {/* Panel de agregar */}
      {formVisible && (
        <Card className="mb-4 w-full h-auto">
          {/* Selector de modo */}
          <Segmented
            className="mb-4"
            value={modo}
            onChange={(v) => {
              setModo(v as ModoAgregado);
              form.resetFields();
            }}
            options={[
              { label: <span><Icon icon="lucide:search" className="mr-1 inline-block" />Buscar en inventario</span>, value: "inventario" },
              { label: <span><Icon icon="lucide:pencil" className="mr-1 inline-block" />Agregar manualmente</span>, value: "manual" },
            ]}
          />

          <Divider className="my-3" />

          {/* Modo inventario */}
          {modo === "inventario" && (
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <Typography.Text className="text-zinc-400 text-sm block mb-2">
                  Busca un material existente del inventario y selecciónalo para agregarlo al evento.
                </Typography.Text>
              </Col>
              <Col span={24}>
                <SelectorQuery
                  queryProps={{
                    endpoint: Material.ENDPOINTS.DEFAULT,
                    enabled: true,
                    extraParams: { ordenar: "nombre-asc" },
                  }}
                  selectProps={{
                    placeholder: "Buscar material en inventario...",
                    style: { width: "100%" },
                  }}
                  blacklist={materiales}
                  onSelect={(data) => {
                    if (data) {
                      onAgregarDesdeInventario(data as Material);
                      setFormVisible(false);
                    }
                  }}
                />
              </Col>
            </Row>
          )}

          {/* Modo manual */}
          {modo === "manual" && (
            <Form
              component={false}
              form={form}
              onFinish={onFinishManual}
              layout="vertical"
              className="w-full h-auto"
            >
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item
                    label="Material/Equipo"
                    name="nombre"
                    rules={[AntdFormValidation.Requerido("El material es obligatorio")]}
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
                  <Form.Item label="Notas" name="nota">
                    <TextAreaInput placeholder="Ej. Necesario para el auditorio" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    icon={<Icon icon="lucide:check" />}
                    block
                    onClick={() => form.submit()}
                  >
                    Confirmar y Agregar
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Card>
      )}

      {/* Tabla */}
      <Col span={24}>
        <Table
          columns={columns}
          dataSource={materiales}
          rowKey={(r: any) => r.key ?? r.id}
          rowClassName="cursor-pointer"
          locale={{ emptyText: "Sin materiales agregados" }}
        />
      </Col>
    </Row>
  );
};

export default TablaMateriales;
