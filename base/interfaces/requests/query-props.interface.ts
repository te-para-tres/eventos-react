export default interface QueryProps {
  queryKey?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onFinish?: (data: any) => void;
  endpoint: string;
  extraParams?: any;
  enabled?: boolean;
}
