import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";

let openModalFn;
export default function CustomBootDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [element, setElement] = useState();
  const handleOpen = () => {};
  const handleClose = () => {
    setOpen(false);
  };
  const onOpenModal = element => {
    setOpen(true);
    setElement(element);
  };

  useEffect(() => {
    openModalFn = onOpenModal;
  }, []);
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div className="modal-body">
          {element ? element : <div>This is empty div .</div>}
        </div>
      </Modal>
    </div>
  );
}

export function openModal(val?) {
  openModalFn({ ...val });
}
