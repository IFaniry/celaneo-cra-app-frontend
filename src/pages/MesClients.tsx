import { forwardRef } from 'react';
import ky from 'ky';
import { useRequest } from 'ahooks';
import { useForm, Controller, Control } from 'react-hook-form';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  Autocomplete,
  AutocompleteItem,
  SelectItemProps,
  Text,
} from '@mantine/core';

import './MesClients.css';

const COMPANY_SEARCH_API = 'https://recherche-entreprises.api.gouv.fr/search';
const MAX_ITEMS = 7;

type FormValues = {
  query: string;
};

type CompanyFromApi = {
  nom_raison_sociale: string;
  nom_complet: string;
  siege: {
    geo_adresse: string;
  };
};
// https://mantine.dev/core/autocomplete/#data-prop
type Company = AutocompleteItem & {
  nomRaisonSociale: string;
  nomComplet: string;
  geoAdresse: string;
};

async function getCompanies(search: string = ''): Promise<Company[]> {
  if (search.length < 3) {
    return [];
  }

  return new Promise(async (resolve, reject) => {
    try {
      const { results } = await ky
        .get(COMPANY_SEARCH_API, {
          searchParams: { q: search, per_page: MAX_ITEMS },
        })
        .json<{ results: CompanyFromApi[] }>();
      // console.log('results', results);

      // https://mantine.dev/core/autocomplete/#data-prop
      const dataProp = results.map((result: CompanyFromApi) => {
        const {
          nom_raison_sociale: nomRaisonSociale,
          nom_complet: nomComplet,
          siege: { geo_adresse: geoAdresse },
        } = result;

        return {
          value: nomRaisonSociale || nomComplet,
          nomRaisonSociale,
          nomComplet,
          geoAdresse,
        };
      });

      resolve(dataProp);
    } catch {
      reject('Error when fetching companies');
    }
  });
}

// https://mantine.dev/core/autocomplete/#custom-item-component
type CompanyItemProps = SelectItemProps & Company;

const AutoCompleteItem = forwardRef<HTMLDivElement, CompanyItemProps>(
  ({ value, geoAdresse, ...others }: CompanyItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text tt="capitalize">{value}</Text>
      <Text size="xs" color="dimmed">
        {geoAdresse}
      </Text>
    </div>
  ),
);

const CompanySearch = ({ control }: { control: Control<FormValues, any> }) => {
  // TODO: handle error
  const { data: results = [], run } = useRequest(getCompanies, {
    debounceWait: 750,
    manual: true,
  });

  return (
    <Controller
      name="query"
      control={control}
      render={({ field: { value, onChange, onBlur } }) => {
        return (
          <>
            <Autocomplete
              value={value}
              onChange={(updatedQuery) => {
                onChange(updatedQuery);

                if (!updatedQuery) {
                  return;
                }

                run(updatedQuery);
              }}
              onBlur={onBlur}
              label="Votre client"
              placeholder="Rechercher une entreprise"
              limit={MAX_ITEMS}
              itemComponent={AutoCompleteItem}
              data={results}
              filter={() => true}
            />
            {/* <pre>
            <code>{JSON.stringify(results, null, 2)}</code>
          </pre> */}
          </>
        );
      }}
    />
  );
};

const MesClients: React.FC = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      query: '',
    },
  });
  const onSubmit = (data: any) => console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gérer mes clients</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Gérer mes clients</IonTitle>
          </IonToolbar>
        </IonHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CompanySearch control={control} />
        </form>
      </IonContent>
    </IonPage>
  );
};

export default MesClients;
