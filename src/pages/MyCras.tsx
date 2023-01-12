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
  const [description, setDescription] = useState<string>('');

  const dateClickHandler = (e: Date) => {
    setOpenModal(true);
    setCurrentDate(e);
  };

  // console.log('Day : ', day);

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
          setDescription={setDescription}
          description={description}
        />
      )}
      <Calendar
        dayStyle={(date: Date, modifiers: DayModifiers) => {
          console.log('day', day);
          
          let dayType = '';

          const fullDay = day
            .filter((item: Day) => item.option === 'Journée')
            .map((item: Day) => formatDate(item.dates));
          const halfDay = day
            .filter((item: Day) => item.option === 'Demi-journée')
            .map((item: Day) => formatDate(item.dates));
          const restDay = day
            .filter((item: Day) => item.option === 'Absence')
            .map((item: Day) => formatDate(item.dates));

          // let bgColor: string;
          if (halfDay.length !== 0 && halfDay.includes(formatDate(date))) {
          // if (day.some(d => d.option === 'Demi-journée' && dayjs(d.dates).isSame(date, 'day') )) {
            dayType = 'halfDay';
            // bgColor = 'white';
          } else if (fullDay.length !== 0 && fullDay.includes(formatDate(date))) {
            dayType = 'fullDay';
            // bgColor = '#DEF5E5';
          } else if (restDay.length !== 0 && restDay.includes(formatDate(date))) {
            dayType = 'restDay';
            // bgColor = '#DEF5E5';
          }
          // let restDayStyle;
          // if (restDay.length !== 0 && restDay.includes(formatDate(date))) {
          //   dayType = 'restDay';
          //   // restDayStyle = {
          //   //   borderColor: '#DEF5E5',
          //   //   borderWidth: 2,
          //   //   borderStyle: 'solid',
          //   // };
          // }

          // let disabledDay: boolean = false;
          // if (modifiers.disabled || modifiers.outside) {
          //   // disabledDay = true;
          //   dayType = 'disabled';
          // }

          let myDayStyle: React.CSSProperties = {};

          switch (dayType) {
            case 'fullDay':
              myDayStyle = {
                ...myDayStyle,
                border: '2px solid #DEF5E5',
                backgroundImage: `linear-gradient(to bottom, #DEF5E5 50%, #DEF5E5 50%)`,
              };
              break;
            case 'halfDay':
              myDayStyle = {
                ...myDayStyle,
                border: '2px solid white',
                backgroundImage: `linear-gradient(to bottom, white 50%, #DEF5E5 50%)`,
              };
              break;
            case 'restDay':
              myDayStyle = {
                ...myDayStyle,
                border: '2px solid #DEF5E5',
              };
              break;
            // case 'disabled':
            //   myDayStyle = {
            //     ...myDayStyle,
            //   };
            //   break;
          
            default:
              break;
          }

          return myDayStyle;
          // return {
          //   ...restDayStyle,
          //   backgroundImage: restDayStyle
          //     ? 'none'
          //     : `linear-gradient(to bottom, ${
          //         disabledDay ? 'none' : bgColor
          //       } 50%, ${disabledDay ? 'none' : '#DEF5E5'} 50%)`,
          // };
        }}
        styles={{
          weekday: {
            color: '#594545',
          },
          day: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
