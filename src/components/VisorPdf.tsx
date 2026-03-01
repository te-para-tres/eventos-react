import { Modal, ModalProps } from "antd";
import React from "react";

interface VisorPdfProps {
  rutaPdf: string;
  verPdf: boolean;
  onClose: () => void;
  modalProps?: ModalProps; // ✅ Todas las props del Modal
  iframeClassName?: string;
}

const VisorPdf = ({
  rutaPdf,
  verPdf,
  onClose,
  modalProps = {},
  iframeClassName = "w-full h-[80vh]",
}: VisorPdfProps) => {
  return (
    <Modal
      open={verPdf}
      onCancel={onClose}
      footer={null}
      width="90%"
      centered
      destroyOnClose
      {...modalProps} 
    >
      <iframe className={iframeClassName} src={rutaPdf} title="PDF Viewer" />
    </Modal>
  );
};

export default VisorPdf;
