import { useEffect, useState } from 'react';
import { Calendar } from '@mantine/dates';
import 'dayjs/locale/fr';
import dayjs from 'dayjs';
import DateModal from '../components/DateModal';
import { Indicator } from '@mantine/core';
import { formatDate } from '../constants/constant';

const MyCras = () => {
  const [value, setValue] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);

  const dateClickHandler = (e: Date) => {
    setOpenModal(true);
    setCurrentDate(e);
  };

  useEffect(() => {
    if (agree) {
      setValue((prev) => [...prev, currentDate]);
      setAgree(false);
    }
  }, [agree, currentDate, value]);

  return (
    <>
      {openModal && (
        <DateModal
          value={value}
          setAgree={setAgree}
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
        onChange={(e: Date) => {
          if (e !== undefined) {
            dateClickHandler(e);
          }
        }}
        excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
        renderDay={(date) => {
          const day = date.getDate();
          const selectDate = value.map((item) => formatDate(item));

          if (value !== undefined) {
            return (
              <>
                <Indicator
                  size={6}
                  color="red"
                  offset={8}
                  disabled={!selectDate.includes(formatDate(date))}
                >
                  <div>{day}</div>
                </Indicator>
              </>
            );
          }
        }}
      />
    </>
  );
};

export default MyCras;
