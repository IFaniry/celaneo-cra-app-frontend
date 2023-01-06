import React, { useState } from 'react';
import { Calendar } from '@mantine/dates';
import 'dayjs/locale/fr';
import dayjs from 'dayjs';
import DateModal from '../components/DateModal';

const MyCras = () => {
  const [value, setValue] = useState<Date>(); // ok한 날짜
  const [currentDate, setCurrentDate] = useState<Date | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const dateClickHandler = (e: Date) => {
    // setValue(e);
    setOpenModal(true);
    setCurrentDate(e);
  };

  return (
    <>
      {openModal && (
        <DateModal
          setValue={setValue}
          date={currentDate}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
      <Calendar
        minDate={new Date(2023, 0, 0)}
        maxDate={dayjs(new Date()).endOf('month').add(1, 'month').toDate()}
        locale="fr"
        value={value}
        onChange={(e) => {
          if (e !== null) {
            dateClickHandler(e);
          }
        }}
        excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
    </>
  );
};

export default MyCras;
