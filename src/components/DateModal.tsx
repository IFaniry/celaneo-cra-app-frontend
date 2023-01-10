import { Button, Group, Modal, Select } from '@mantine/core';
import { Dispatch } from 'react';
import { formatDate } from '../constants/constant';

type Day = { dates: Date; option: string; desc: string };

type DateModalProps = {
  setDay: Dispatch<Day[]>;
  day: Day[];
  setOpenModal: Dispatch<boolean>;
  openModal: boolean;
  date: Date;
  setDateOption: Dispatch<string>;
  dateOption: string;
};

const DateModal = ({
  setDay,
  day,
  setOpenModal,
  openModal,
  date,
  setDateOption,
  dateOption,
}: DateModalProps) => {
  const buttonHandler = () => {
    const findIndex = day.findIndex(
      (item) => formatDate(item.dates) === formatDate(date),
    );

    let copyArr = [...day];
    if (findIndex !== -1) {
      copyArr[findIndex] = {
        ...copyArr[findIndex],
        option: dateOption,
        desc: 'desc',
      };
      setDay(copyArr);
    } else {
      setDay([
        ...day,
        {
          dates: date,
          option: dateOption,
          desc: 'desc',
        },
      ]);
    }
    setOpenModal(false);
  };

  const [selectedOption] = day.filter(
    (item) => formatDate(item.dates) === formatDate(date),
  );

  return (
    <>
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title={`Ce ${formatDate(date)}`}
      >
        <Group position="center">
          <Select
            placeholder="Choisir"
            defaultValue={
              selectedOption?.option ? selectedOption?.option : dateOption[0]
            }
            searchable
            onSearchChange={setDateOption}
            searchValue={dateOption}
            nothingFound="No options"
            data={['Journée', 'Demi-journée', 'Absence']}
          />

          <Button onClick={buttonHandler}>Ok</Button>
          <Button
            onClick={() => {
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
