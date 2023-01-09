/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import {
  useForm,
  Controller,
  useController,
  Control,
  FieldValues,
  useFieldArray,
} from 'react-hook-form';
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

const DaySwitch = () => {
  const theme = useMantineTheme();

  const [isFullDay, setIsFullDay] = useState(true);

  return (
    <Switch
      size="xl"
      checked={isFullDay}
      onChange={(event) => {
        setIsFullDay(event.currentTarget.checked);
      }}
      label={isFullDay ? 'Journée pleine' : 'Demi-journée'}
      thumbIcon={
        isFullDay ? (
          <IconSquare
            size={12}
            stroke={1}
            color={theme.colors.blue[2]}
            fill={theme.colors.blue[2]}
          />
        ) : (
          <IconSquareHalf
            size={12}
            stroke={1}
            color={theme.colors.blue[7]}
            css={{ transform: 'rotate(270deg)' }}
          />
        )
      }
    />
  );
};

// TODO: refine any type
const WorkVolumeSelect = ({
  control,
  date,
  month,
}: {
  control: Control<FormValues, any>;
  date: Date;
  month: Date;
}) => {
  const theme = useMantineTheme();

  const { getValues } = useForm();

  const day = date.getDate();

  const { field } = useController({
    control,
    name: `calendar.${day - getFirstWorkDayOfMonth(month)}.workDate`,
  });

  return (
    <Controller
      control={control}
      name={`calendar.${day - getFirstWorkDayOfMonth(month)}.nbHour`}
      render={({ field: { onChange, onBlur, value } }) => (
        <NativeSelect
          label="Je vais"
          value={value}
          onBlur={onBlur}
          onChange={(event) => {
            console.log('getValues', getValues('calendar'));
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
            onChange(nbHour);
            field.onChange(dayjs(date).format());
          }}
          data={[
            'être en congé ou absent',
            'travailler à plein temps',
            'travailler une demi-journée',
          ]}
        />
      )}
    />
  );
};

const CustomDayCell = ({
  date,
  month,
  fullDayBackground,
  halfDayBackground,
}: {
  date: Date;
  month: Date;
  fullDayBackground: string;
  halfDayBackground: string;
}) => {
  const { getValues } = useForm<FormValues>();

  const day = date.getDate();

  return (
    <div
      data-full={
        getValues(`calendar.${day - getFirstWorkDayOfMonth(month)}.nbHour`) ===
          7 || undefined
      }
      data-half={
        getValues(`calendar.${day - getFirstWorkDayOfMonth(month)}.nbHour`) ===
          3.5 || undefined
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

const DatePicker = ({ control }: { control: Control<FormValues, any> }) => {
  const theme = useMantineTheme();

  const { getValues } = useForm<FormValues>();
  // TODO: useFieldArray from hook form
  // const { fields } = useFieldArray({
  //   control,
  //   name: 'calendar',
  // });

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

  const { classes, cx } = useCalendarStyles();

  const [cras, setCras] = useState<Cra[]>([]);
  const [workDays, setWorkDays] = useState<Date[]>([]);
  const [month, onMonthChange] = useState(new Date());

  return (
    <Calendar
      multiple
      locale="fr"
      minDate={new Date(2023, 0, 0)}
      maxDate={dayjs(new Date()).endOf('month').add(1, 'month').toDate()}
      allowLevelChange={false}
      month={month}
      onMonthChange={onMonthChange}
      value={workDays}
      onChange={(mantineUpdatedWorkDays) => {
        // console.log('mantineUpdatedWorkDays', mantineUpdatedWorkDays);
        // console.log('workDays', workDays);
        const numMantineUpdatedWorkDays = mantineUpdatedWorkDays.length;
        const numWorkDays = workDays.length;

        let updatedWorkDays = mantineUpdatedWorkDays;
        // let selectedCra = updatedWorkDays[0];
        let selectedCra: Date;
        if (numMantineUpdatedWorkDays < numWorkDays) {
          selectedCra = workDays[0];
          for (let i = 0; i < numWorkDays; i++) {
            if (!dayjs(workDays[i]).isSame(dayjs(workDays[i]), 'day')) {
              // Override Mantine Calendar default functionality
              // add back unselected date
              selectedCra = workDays[i];
              updatedWorkDays = [...updatedWorkDays, selectedCra];
              break;
            }
          }
          // TODO: verify!
          // return;
        } else {
          selectedCra = mantineUpdatedWorkDays[0];
          for (let i = 0; i < numMantineUpdatedWorkDays; i++) {
            if (
              !dayjs(workDays[i]).isSame(
                dayjs(mantineUpdatedWorkDays[i]),
                'day',
              )
            ) {
              selectedCra = mantineUpdatedWorkDays[i];
              break;
            }
          }
        }

        setWorkDays(updatedWorkDays);

        openModal({
          title: `Ce ${dayjs(selectedCra).format('dddd D MMMM')}`,
          children: (
            <>
              <WorkVolumeSelect
                control={control}
                date={selectedCra}
                month={month}
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
                  const cras: Cra[] = updatedWorkDays.map((workDay) => ({
                    workDate: dayjs(workDay).format(),
                    nbHour: 7, // TODO: implement
                  }));
                  setCras(cras);
                  closeAllModals();
                }}
                mt="md"
              >
                Et voilà
              </Button>
              <Button
                onClick={() => {
                  // TODO: implement
                  // const cras: Cra[] = updatedWorkDays.map(workDay => ({
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
        const day = date.getDate();
        // TODO: import { useElementSize } from '@mantine/hooks'; to resize fullDayBackground??
        // TODO: check if controlled month work?

        // dayjs(month).isSame(dayjs(date), 'month')
        // isWeekend(date)
        return (
          <Controller
            control={control}
            name={`calendar.${day - getFirstWorkDayOfMonth(month)}.workDate`}
            render={({ field }) => (
              <div
                data-full={
                  cras.find(
                    (cra) =>
                      dayjs(cra.workDate).isSame(dayjs(date), 'day') &&
                      cra.nbHour === 7,
                  )
                    ? true
                    : undefined
                }
                data-half={
                  getValues(
                    `calendar.${day - getFirstWorkDayOfMonth(month)}.nbHour`,
                  ) === 3.5 || undefined
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
            )}
          />
        );
      }}
    />
  );
};

// TODO:
type FormValues = {
  calendar: {
    workDate: string;
    nbHour: number;
    test: string;
  }[];
};

type Cra = {
  workDate: string;
  nbHour: number;
};

const MesCras = () => {
  const theme = useMantineTheme();

  // TODO: defaultValues
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<FormValues>();
  const cal = watch('calendar');
  const onSubmit = (data: any) => console.log(data);

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
      color={theme.colors.blue[3]}
      fill={theme.colors.blue[3]}
    />,
  );
  const halfDayBackground = `data:image/svg+xml;base64,${window.btoa(
    halfDayBackgroundStr,
  )}`;

  const { classes, cx } = useCalendarStyles();

  const [cras, setCras] = useState<Cra[]>([]);
  const [workDays, setWorkDays] = useState<Date[]>([]);

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <DatePicker control={control} />
          <pre>
            <code>{JSON.stringify(cal, null, 2)}</code>
          </pre>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default MesCras;
