import VITE_ENV from "@/config/constants/vite-env";
import BuscadorAutomatico from "@base/components/form/BuscadorAutomatico";
import { DefaultContainer } from "@base/components/layout/containers/DefaultContainer";
import useHttp from "@base/hooks/useHttp/useHttp";
import { usePagina } from "@base/hooks/usePagina/usePagina";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, Divider, Row, Spin, Typography } from "antd";

export const Route = createFileRoute("/(auth)/asistencia/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { requestParams, setRequestParams } = usePagina();
  const { get } = useHttp();

  const verPpdf = () => {
    window.open(
      `${VITE_ENV.BASE_API_URL}/invitacion.pdf?${new URLSearchParams(requestParams).toString()}`,
      "_blank"
    );
  };

  const query = useQuery({
    queryKey: ["v1/empleado.json", requestParams],
    queryFn: () =>
      get({
        endpoint: "v1/empleado.json",
        params: requestParams,
      }),
  });

  const empleados = query.data?.resultado ?? [];

  return (
    <DefaultContainer>
      <Row gutter={[10, 10]} justify={"space-between"}>
        <Col>
          <Typography.Title style={{ margin: 0 }}>
            Registrando Asistencia
          </Typography.Title>
        </Col>
        <Divider style={{ margin: 0 }} />
        <Col span={24}>
          <Spin spinning={query?.isLoading}>
            <Card>
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <BuscadorAutomatico
                    setRequestParams={setRequestParams}
                    hideClearButton={true}
                    responsive
                  />
                </Col>
                <Col span={12}>
                  <Button
                    block
                    onClick={verPpdf}
                    size="large"
                    type="primary"
                    className="my-1"
                  >
                    Obtener Invitaciones
                  </Button>
                </Col>
                <Divider style={{ margin: 0 }} />
                {empleados?.map((empleado) => (
                  <Col span={6}>
                    <Card classNames={{ body: "p-2" }} hoverable>
                      <Row gutter={[10, 10]}>
                        <Col span={24}>
                          <div className="w-full flex flex-row justify-between">
                            <p className="text-lg font-semibold">
                              {empleado?.nombre ?? ""}{" "}
                              {empleado?.primerApellido ?? ""}{" "}
                              {empleado?.segundoApellido ?? ""}{" "}
                            </p>
                            <div className="h-5 w-5 bg-red-500 rounded-full shadow shadow-red-400" />
                          </div>
                        </Col>
                        <Divider style={{ margin: 0 }} />
                        <Col>
                          <p className="text-neutral-400">
                            {empleado?.numEmpleado}
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Spin>
        </Col>
      </Row>
    </DefaultContainer>
  );
}
