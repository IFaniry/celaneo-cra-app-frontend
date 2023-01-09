/** @jsxImportSource @emotion/react */
import { useState, Dispatch, SetStateAction } from 'react';
import { renderToString } from 'react-dom/server';
// TODO: uninstall @emotion/styled????
import { css } from '@emotion/react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
import { Calendar } from '@mantine/dates';
import {
  createStyles,
  TextInput,
  Button,
  Textarea,
  Switch,
  useMantineTheme,
  NativeSelect,
} from '@mantine/core';
// import { Indicator } from '@mantine/core';
import { openModal, closeAllModals } from '@mantine/modals';
import { IconSquare, IconSquareHalf } from '@tabler/icons';

import './MesCras.css';

dayjs.locale('fr');
dayjs.extend(isSameOrBefore);

const isWeekend = (date: Date) => {
  const day = date.getDay();

  /**
   * Date will be enabled if it is not
   * Sunday or Saturday
   */
  return day === 0 || day === 6;
};

const getFirstWorkDayOfMonth = (date: Date) => {
  let currentDay = dayjs(date).startOf('month');
  while (true) {
    if (currentDay.day() !== 0 && currentDay.day() !== 6) {
      return currentDay.date();
    }

    currentDay = currentDay.add(1, 'day');
  }
};
const getWorkDaysCount = (date: Date) => {
  /**
   * Count work days in month from given date
   */
  let count = 0;

  let currentDay = dayjs(date).startOf('month');
  const endOfMonth = dayjs(date).endOf('month');
  while (currentDay.isSameOrBefore(endOfMonth, 'day')) {
    if (currentDay.day() !== 0 && currentDay.day() !== 6) {
      count++;
    }

    currentDay = currentDay.add(1, 'day');
  }

  return count;
};

type DayAttributes = {
  nbHour: number;
};
type Cras = Record<string, DayAttributes>;

// https://stackoverflow.com/a/37069277
// const getWorkDaysCount = (startDate: Date, endDate: Date) => {
//   let count = 0;

//   // clone startDate
//   const curDate = new Date(startDate.getTime());
//   while (curDate <= endDate) {
//       const dayOfWeek = curDate.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//         count ++;
//       }

//       curDate.setDate(curDate.getDate() + 1);
//   }

//   return count;
// };

// https://mantine.dev/dates/calendar/#styles-based-on-modifiers
const useCalendarStyles = createStyles((theme) => ({
  weekend: {
    color: `${theme.colors.gray[4]} !important`,
  },
  selected: {
    backgroundColor: 'transparent !important',
    color: `${theme.colors.dark[9]} !important`,
  },
}));

// TODO: refine any type
const WorkVolumeSelect = ({
  date,
  setCras,
}: {
  date: Date;
  setCras: Dispatch<SetStateAction<Cras>>;
}) => {
  // TODO: refine  var name and type
  const [value, setValue] = useState('être en congé ou absent');

  return (
    <NativeSelect
    label="Je vais"
    value={value}
    onChange={(event) => {
      let nbHour: number;
      switch (event.currentTarget.value) {
        case 'travailler à plein temps':
          nbHour = 7;
          break;
        case 'travailler une demi-journée':
          nbHour = 3.5;
          break;
        case 'être en congé ou absent':
          nbHour = 0;
          break;
        default:
          throw new Error(
            'Work volume must be one of ["travailler à plein temps", "travailler une demi-journée", "être en congé ou absent"].',
          );
      }
      // TODO: refine
      setValue(value);
      // field.onChange(dayjs(date).format());
      setCras(cras => ({...cras, [dayjs(date).format()]: { nbHour } }));
    }}
    data={[
      'travailler à plein temps',
      'travailler une demi-journée',
      'être en congé ou absent',
    ]}
  />
  );
};

const CustomDayCell = ({
  date,
  month,
  cras,
}: {
  date: Date;
  month: Date;
  cras: Cras;
}) => {
  const theme = useMantineTheme();

  const fullDayBackgroundStr = renderToString(
    <IconSquare
      size={50}
      stroke={0.5}
      color={theme.colors.blue[6]}
      fill={theme.colors.blue[6]}
    />,
  );
  const fullDayBackground = `data:image/svg+xml;base64,${window.btoa(
    fullDayBackgroundStr,
  )}`;
  // const halfDayBackgroundStr = renderToString(<IconSquareHalf size={50} stroke={0.5} color={theme.colors.blue[7]} css={{ transform: 'rotate(45deg)' }} />);
  const halfDayBackgroundStr = renderToString(
    <IconSquare
      size={50}
      stroke={0.5}
      color={theme.colors.green[3]}
      fill={theme.colors.green[3]}
    />,
  );
  const halfDayBackground = `data:image/svg+xml;base64,${window.btoa(
    halfDayBackgroundStr,
  )}`;
  // TODO: use hook for getting fullDayBackground and halfDayBackground
  const day = date.getDate();

  // TODO: day belongs to month and full or half day
  return (
    <div
      data-full={
        (dayjs(month).isSame(dayjs(date), 'month') &&
        cras?.[dayjs(date).format()]?.nbHour === 7) ? true : undefined
      }
      data-half={
        (dayjs(month).isSame(dayjs(date), 'month') &&
        cras?.[dayjs(date).format()]?.nbHour === 3.5) ? true : undefined
      }
      css={css`
        &[data-full] {
          background-image: url(${fullDayBackground});
          background-repeat: no-repeat;
          background-position: center;
          color: #fff;
        }
        &[data-half] {
          background-image: url(${halfDayBackground});
          background-repeat: no-repeat;
          background-position: center;
          color: #fff;
        }
      `}
    >
      {day}
    </div>
  );
};

const DatePicker = () => {
  const { classes, cx } = useCalendarStyles();

  const [cras, setCras] = useState<Cras>({});
  const [selectedDay, setSelectedDay] = useState<Date|null>(null);
  const [month, onMonthChange] = useState(new Date());

  return (
    <Calendar
      locale="fr"
      minDate={new Date(2023, 0, 0)}
      maxDate={dayjs(new Date()).endOf('month').add(1, 'month').toDate()}
      allowLevelChange={false}
      month={month}
      onMonthChange={onMonthChange}
      value={selectedDay}
      onChange={(newlySelectedDay) => {
        if (!newlySelectedDay) {
          return;
        }

        setSelectedDay(newlySelectedDay);

        openModal({
          title: `Ce ${dayjs(newlySelectedDay).format('dddd D MMMM')}`,
          children: (
            <>
              <WorkVolumeSelect
                date={newlySelectedDay}
                setCras={setCras}
              />
              <Textarea
                label="et j'ajouterai"
                placeholder="un commentaire"
                autosize
                minRows={2}
                maxRows={4}
              />
              <Button
                type="submit"
                onClick={() => {
                  setCras(cras => ({...cras, '[day]': { nbHour: 7 } }));
                  closeAllModals();
                }}
                mt="md"
              >
                Et voilà
              </Button>
              <Button
                onClick={() => {
                  // TODO: implement
                  // const cras: Cras[] = updatedWorkDays.map(workDay => ({
                  //   workDate: dayjs(workDay).format(),
                  //   nbHour: 7,
                  // }));
                  // setCras(cras);
                  closeAllModals();
                }}
                mt="md"
              >
                J'annule
              </Button>
            </>
          ),
        });
      }}
      excludeDate={isWeekend}
      dayClassName={(_, modifiers) =>
        cx({
          [classes.weekend]: modifiers.weekend,
          [classes.selected]: modifiers.selected,
        })
      }
      renderDay={(date) => {
        // TODO: import { useElementSize } from '@mantine/hooks'; to resize fullDayBackground??
        // TODO: check if controlled month work?

        // dayjs(month).isSame(dayjs(date), 'month')
        // isWeekend(date)
        return (
          <CustomDayCell cras={cras} month={month} date={date} />
        );
      }}
    />
  );
};

const MesCras = () => {
  // const [cras, setCras] = useState<Cras>({});
  // const [selectedDay, setSelectedDay] = useState<Date|null>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Remplir mon CRA</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Remplir mon CRA</IonTitle>
          </IonToolbar>
        </IonHeader>

        <DatePicker />
        <pre>
          <code>JSON.stringify(cal, null, 2)</code>
        </pre>
      </IonContent>
    </IonPage>
  );
};

export default MesCras;
