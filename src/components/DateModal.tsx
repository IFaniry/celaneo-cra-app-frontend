import { Button, Group, Modal } from '@mantine/core';
import { Dispatch } from 'react';
import { formatDate } from '../constants/constant';

type DateModalProps = {
  setValue: Dispatch<Date[]>;
  value: Date[];
  setOpenModal: Dispatch<boolean>;
  openModal: boolean;
  date: Date;
  setAgree: Dispatch<boolean>;
};

const DateModal = ({
  setValue,
  value,
  setOpenModal,
  openModal,
  date,
  setAgree,
}: DateModalProps) => {
  const selectDate = value.map((item) => formatDate(item));

  const buttonHandler = () => {
    setAgree(true);
    setOpenModal(false);
    if (selectDate.includes(formatDate(date))) {
      const test = value.filter((it) => formatDate(it) !== formatDate(date));
      setValue(test);
    }
  };

  return (
    <>
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title={`Ce ${formatDate(date)}`}
      >
        <Group position="center">
          <Button onClick={buttonHandler}>
            {selectDate.includes(formatDate(date)) ? 'Annule' : 'Ok'}
          </Button>
          <Button
            onClick={() => {
              setAgree(false);
              setOpenModal(false);
            }}
          >
            Close
          </Button>
        </Group>
      </Modal>
    </>
  );
};
export default DateModal;
