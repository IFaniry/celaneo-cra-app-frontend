import { Button, Group, Modal, Select, Textarea } from '@mantine/core';
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
  setDescription: Dispatch<string>;
  description: string;
};

const DateModal = ({
  setDay,
  day,
  setOpenModal,
  openModal,
  date,
  setDateOption,
  dateOption,
  setDescription,
  description,
}: DateModalProps) => {
  const findIndex = day.findIndex(
    (item) => formatDate(item.dates) === formatDate(date),
  );
  const buttonHandler = () => {
    let copyArr = [...day];

    if (findIndex !== -1) {
      copyArr[findIndex] = {
        ...copyArr[findIndex],
        option: dateOption,
      };
      setDay(copyArr);
    } else {
      setDay([
        ...day,
        {
          dates: date,
          option: dateOption,
          desc: description,
        },
      ]);
    }
    setOpenModal(false);
  };

  const [selectedDay] = day.filter(
    (item) => formatDate(item.dates) === formatDate(date),
  );

  const descHandler = (e: any) => {
    let copyArr = [...day];
    if (findIndex !== -1) {
      copyArr[findIndex] = {
        ...copyArr[findIndex],
        desc: e.currentTarget.value,
      };
      setDay(copyArr);
    } else {
      setDescription(e.currentTarget.value);
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
          <Select
            placeholder="Choisir"
            defaultValue={
              selectedDay?.option ? selectedDay?.option : dateOption[0]
            }
            searchable
            onSearchChange={setDateOption}
            searchValue={dateOption}
            nothingFound="No options"
            data={['Journée', 'Demi-journée', 'Absence']}
          />

          <Textarea
            value={
              selectedDay?.desc || selectedDay?.desc === ''
                ? selectedDay?.desc
                : undefined
            }
            onChange={descHandler}
            placeholder="Commentaire"
            label="Commentaire"
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
