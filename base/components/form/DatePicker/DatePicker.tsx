import { DatePicker as AntDatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
export interface DatePickerFormProps extends DatePickerProps {
  value?: any;
}
const DatePicker = ({ value, ...props }: DatePickerProps) => {
  const valueMemo = useMemo(() => {
    if (typeof value === "string") {
      return dayjs(value);
    }
    return value;
  }, [value]);
  return <AntDatePicker {...props} value={valueMemo} />;
};

export default DatePicker;
