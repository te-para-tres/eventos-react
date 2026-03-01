import { Alert, Skeleton } from "antd";

export interface QueryStateLoaderProps {
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  data: any;
  children: React.ReactNode;
}

export function QueryStateLoader({
  isLoading,
  isPending,
  isError,
  data,
  children,
}: QueryStateLoaderProps) {
  if (isError) {
    return <Alert message="Error" type="error" />;
  }

  if (isLoading || isPending || !data) {
    return <Skeleton active />;
  }

  return children;
}
