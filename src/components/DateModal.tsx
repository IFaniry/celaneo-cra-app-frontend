import { Button, Group, Modal } from '@mantine/core';
import dayjs from 'dayjs';
import { Dispatch } from 'react';

type DateModalProps = {
  setValue: Dispatch<Date[]>;
  setOpenModal: Dispatch<boolean>;
  openModal: boolean;
  date: Date | undefined;
};

const DateModal = ({
  setValue,
  setOpenModal,
  openModal,
  date,
}: DateModalProps) => {
  // const okButton = () => {};
  return (
    <>
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title={`Ce ${dayjs(date).format('dddd D MMMM')}`}
      >
        <Group position="center">
          <Button
            onClick={() => {
              if (date !== undefined) {
                setValue(date);
                setOpenModal(false);
              }
            }}
          >
            Ok
          </Button>
          <Button onClick={() => setOpenModal(true)}>Close</Button>
        </Group>
      </Modal>
    </>
  );
};
export default DateModal;
