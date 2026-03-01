import { EdForm } from "@base/components/form/Form";
import { AntdFormValidation } from "@base/constants/antd-form-validation";
import { Button, Col, Collapse, Divider, Form, Row, Tree } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IFormularioBaseProps } from "@base/interfaces/forms/FormularioBase.interface";
import { TextInput } from "@base/components/form/TextInput/TextInput";
import { SelectInput } from "@base/components/form/SelectInput/SelectInput";

import { Usuario as ModelClass } from "@/models/Usuario.model";
import SeccionCambiarContrasena from "@/components/SeccionCambiarContrasena/SeccionCambiarContrasena";
import { useEffect, useState } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { IRequestParams } from "@base/interfaces/requests/request-params.interface";
import { Modulo } from "@/models/Modulo.model";
import useHttp from "@base/hooks/useHttp/useHttp";
import { Permiso } from "@/models/Permisos.model";

export default function Formulario({
  mostrarSubmit = true,
  submitLabel = "Guardar",
  isLoading = false,
  isEditando = false,
  isGuardando = false,
  formProps,
  modelo,
}: IFormularioBaseProps<ModelClass>) {
  const [form] = useForm();
  const http = useHttp();

  const [permisos, setPermisos] = React.useState<Permiso[]>(
    Permiso.fromJsonList(modelo?.moduloPermisos || [])
  );

  const [moduloParams] = React.useState<IRequestParams>({
    expand: `${Modulo.EXPAND.DEFAULT}`,
    limite: -1,
  });

  const modulosQuery = useQuery({
    queryKey: [Modulo.ENDPOINTS.DEFAULT, moduloParams],
    queryFn: () => {
      return http.get({
        endpoint: Modulo.ENDPOINTS.DEFAULT,
        params: moduloParams,
      });
    },
  });

  const modulos = React.useMemo(() => {
    return Modulo.fromJsonList(modulosQuery.data?.result ?? []);
  }, [modulosQuery.data]);

  const permisos_tree = React.useMemo(() => {
    const _permisos_tree = modulos?.map((_modulo) => {
      return _modulo.toTreeData();
    });

    return _permisos_tree || [];
  }, [modulos]);

  useEffect(() => {
    if (modelo?.moduloPermisos) {
      setPermisos(Permiso.fromJsonList(modelo.moduloPermisos ?? []));
    }
  }, [modelo]);

  return (
    <EdForm
      {...formProps}
      onFinish={(v) => {
        v.moduloPermisos = permisos;
        formProps?.onFinish?.(v);
      }}
      form={form}
      isLoading={isLoading}
    >
      <Row gutter={[24, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            label="Nombre(s)"
            name="nombre"
            rules={[
              AntdFormValidation.Requerido("El nombre es obligatorio"),
              AntdFormValidation.LongitudMaxima(128),
            ]}
          >
            <TextInput placeholder="Nombre" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Apellidos"
            name="apellidos"
            rules={[
              AntdFormValidation.Requerido("Los apellidos son obligatorios"),
              AntdFormValidation.LongitudMaxima(128),
            ]}
          >
            <TextInput placeholder="Apellidos" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Estatus"
            name="estatus"
            rules={[AntdFormValidation.Requerido("El estatus es obligatorio")]}
          >
            <SelectInput
              className="w-full"
              options={ModelClass.ESTATUS_LIST}
              placeholder="Estatus"
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Correo electrónico"
            name="correo"
            rules={[
              AntdFormValidation.Requerido("El correo es obligatorio"),
              AntdFormValidation.Correo(),
            ]}
          >
            <TextInput placeholder="Correo electrónico" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[
              AntdFormValidation.Requerido("El teléfono es obligatorio"),
              AntdFormValidation.Telefono(),
            ]}
          >
            <TextInput placeholder="Teléfono" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Rol"
            name="rol"
            rules={[AntdFormValidation.Requerido("El rol es obligatorio")]}
          >
            <SelectInput
              className="w-full"
              options={ModelClass.ROLES_LIST}
              placeholder="Rol"
            />
          </Form.Item>
        </Col>
        <Divider style={{ margin: 0 }} />
        {!isEditando && <SeccionCambiarContrasena />}
        {isEditando && (
          <>
            <Col span={24}>
              <Collapse>
                <Collapse.Panel
                  key={"2"}
                  header={<strong>Cambiar Contraseña</strong>}
                >
                  <Row gutter={12}>
                    <SeccionCambiarContrasena required={false} />
                  </Row>
                </Collapse.Panel>
              </Collapse>
            </Col>
          </>
        )}
        <Col span={24}>
          <Row gutter={12}>
            <Col span={24} md={12}>
              <div className="font-semibold text-lg py-2">
                Permisos del Sistema
              </div>
              <Tree
                checkable
                checkedKeys={
                  permisos.map((permiso) => `${Permiso.name}-${permiso.id}`) ??
                  []
                }
                onCheck={(checked) => {
                  checked = checked as string[];
                  const permisos = modulos?.flatMap((modulo: Modulo) =>
                    modulo.permisos.filter((permiso) =>
                      checked.includes(`${Permiso.name}-${permiso.id}`)
                    )
                  );
                  setPermisos(permisos ?? []);
                }}
                treeData={permisos_tree}
              />
            </Col>
          </Row>
        </Col>

        {mostrarSubmit && (
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isGuardando}
              disabled={isGuardando}
            >
              {submitLabel}
            </Button>
          </Col>
        )}
      </Row>
    </EdForm>
  );
}
