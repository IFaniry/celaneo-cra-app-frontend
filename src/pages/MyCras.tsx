import { useState } from 'react';
import { Calendar, DayModifiers } from '@mantine/dates';
import 'dayjs/locale/fr';
import dayjs from 'dayjs';
import DateModal from '../components/DateModal';
import { formatDate } from '../constants/constant';

type Day = { dates: Date; option: string; desc: string };

const MyCras = () => {
  const [day, setDay] = useState<Day[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dateOption, setDateOption] = useState<string>('');

  const dateClickHandler = (e: Date) => {
    setOpenModal(true);
    setCurrentDate(e);
  };

  return (
    <>
      {openModal && (
        <DateModal
          day={day}
          setDay={setDay}
          setDateOption={setDateOption}
          dateOption={dateOption}
          date={currentDate}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
      <Calendar
        dayStyle={(date: Date, modifiers: DayModifiers) => {
          const halfDay = day.filter(
            (item: Day) => item.option === 'Demi-journée',
          );
          const halfDayFormat = halfDay.map((item: Day) =>
            formatDate(item.dates),
          );
          const restDay = day.filter((item: Day) => item.option === 'Absence');
          const restDayFormat = restDay.map((item: Day) =>
            formatDate(item.dates),
          );

          let bgColor: string;
          if (
            halfDay.length !== 0 &&
            halfDayFormat.includes(formatDate(date))
          ) {
            bgColor = 'white';
          } else {
            bgColor = '#DEF5E5';
          }

          let restDayStyle;
          if (
            restDay.length !== 0 &&
            restDayFormat.includes(formatDate(date))
          ) {
            restDayStyle = {
              backgroundColor: '#8EC3B0',
            };
          }

          let disabledDay: boolean = false;
          if (modifiers.disabled || modifiers.outside) {
            disabledDay = true;
          }

          return {
            ...restDayStyle,
            backgroundImage: restDayStyle
              ? 'none'
              : `linear-gradient(to bottom, ${
                  disabledDay ? 'none' : bgColor
                } 50%, ${disabledDay ? 'none' : '#DEF5E5'} 50%)`,
          };
        }}
        styles={{
          weekday: {
            color: '#594545',
          },
          day: {
            margin: '3px',
          },
        }}
        minDate={new Date(2023, 0, 0)}
        maxDate={dayjs(new Date()).endOf('month').add(1, 'month').toDate()}
        locale="fr"
        onChange={(e: Date) => {
          if (e !== undefined) {
            dateClickHandler(e);
          }
        }}
        excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
    </>
  );
};

export default MyCras;
