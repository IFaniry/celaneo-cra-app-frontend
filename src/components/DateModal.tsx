import { Button, Group, Modal } from '@mantine/core';
import { Dispatch } from 'react';
import { formatDate } from '../constants/constant';

type DateModalProps = {
  setValue: Dispatch<Date[]>;
  value: Date[];
  setOpenModal: Dispatch<boolean>;
  openModal: boolean;
  date: Date;
};

const DateModal = ({
  setValue,
  value,
  setOpenModal,
  openModal,
  date,
}: DateModalProps) => {
  const selectDate = value.map((item) => formatDate(item));

  const buttonHandler = () => {
    if (!selectDate.includes(formatDate(date))) {
      setValue([...value, date]);
    } else {
      const dates = value.filter(
        (item) => formatDate(item) !== formatDate(date),
      );
      setValue(dates);
    }
    setOpenModal(false);
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
              // setAgree(false);
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
