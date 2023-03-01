import React from "react";
import { hot } from "react-hot-loader/root";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import StarIcon from '@mui/icons-material/StarBorder';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { PageWrapper } from './Component/PageWrapper';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { DailyCostChart } from './Component/DailyCostChart';
import { DateTime } from 'luxon';
import pvpc_mock_res from './../../Data/Resource/pvpc-price-example.json'

type LocationType = {
  geo_id: number,
  geo_name: string
}

type ClassType = 'minimum' | 'mean' | 'maximum';

type TierType = {
  name: string,
  price: string,
  class: ClassType,
  hour: DateTime | null
}

type IndicatorValuesType = {
  value: number,
  datetime: string,
} & LocationType;

const mock = false;
const getTiersByLocation = (values: IndicatorValuesType[], location: LocationType): TierType[] => {
  // Get values by location
  const locationValues = values.filter((value) => value.geo_id === location.geo_id);

  const locationValuesPrices = locationValues.map((locationValue) => locationValue.value);

  // Calculate the mean value
  const meanValue = locationValuesPrices.reduce(
    (accumulate, locationValuePrice) => accumulate + locationValuePrice, 0
  ) / locationValuesPrices.length;

  // Get max
  const max = Math.max(...locationValuesPrices)

  // Get min
  const min = Math.min(...locationValuesPrices);

  return [
    {
      name: 'Valor máximo',
      price: max.toFixed(2),
      class: 'maximum',
      hour: DateTime.fromISO(locationValues.filter((value) => value.value === max)[0].datetime)
    },
    {
      name: 'Valor medio',
      price: meanValue.toFixed(2),
      class: 'mean',
      hour: null
    },
    {
      name: 'Valor mínimo',
      price: min.toFixed(2),
      class: 'minimum',
      hour: DateTime.fromISO(locationValues.filter((value) => value.value === min)[0].datetime)
    },
  ];
}
const localStorageKey = `today-data-${DateTime.now().day}`;

const HomePage = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [tiers, setTiers] = useState([]);
  const [pvpcData, setPvpcData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getData = () => {
    const savedData: string | null = localStorage.getItem(localStorageKey);
    if (null === savedData) {
      localStorage.clear();
      fetchDataFromApi();

      return;
    }

    const jsonResponse = JSON.parse(savedData);

    saveDataToState(jsonResponse)
  }

  const fetchDataFromApi = () => {
    if (mock) {
      saveDataToState(pvpc_mock_res);

      localStorage.setItem(localStorageKey, JSON.stringify(pvpc_mock_res));
      return;
    }

    fetch(process.env.BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }

          return response.json();
        }
      ).then((jsonResponse) => {
      saveDataToState(jsonResponse);

      localStorage.setItem(localStorageKey, JSON.stringify(jsonResponse));
    }).catch((error: Error) => {
      setError(error.message);
    })
  }

  const saveDataToState: (data: any & { indicator: { geos: LocationType[] } }) => void = (data) => {
    const geos: LocationType[] = []
    const geo_ids: number[] = []

    for(let item of data.indicator.values) {
      if (geo_ids.indexOf(item.geo_id) === -1) {
        geo_ids.push(item.geo_id)

        geos.push({
          "geo_id": item.geo_id,
          "geo_name": item.geo_name
        })
      }
    }

    data.indicator.geos = geos

    setPvpcData(data);
    setLocation(data.indicator.geos[0])
  }

  useEffect(getData, []);

  useEffect(() => {
    if (pvpcData && location) {
      setTiers(
        getTiersByLocation(pvpcData.indicator.values, location).map((tier) => {
          return {
            title: tier.name,
            subheader: null,
            price: tier.price,
            description: tier.hour ? [tier.hour.toLocaleString(DateTime.TIME_SIMPLE)] : ['Coste medio del día'],
            class: tier.class,
          }
        })
      )
    }
  }, [location]);

  return (<PageWrapper>
    <Container disableGutters maxWidth="sm" component="main" sx={{pt: 8, pb: 6}}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Coste
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" component="p">
        <p>Precio de la luz día a día</p>
        <span>{DateTime.now().toLocaleString(DateTime.DATE_HUGE, {locale: 'es-es'})}</span>
      </Typography>
    </Container>
    <Container maxWidth="md" component="main">
      {(error) ? (<Card>
        <CardHeader
          title={'¡Error de comunicación!'}
          titleTypographyProps={{align: 'center'}}
          subheaderTypographyProps={{
            align: 'center',
          }}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              mb: 2,
            }}
          >
            <Typography component="h2" variant="h6">
              {error}
            </Typography>
          </Box>
        </CardContent>
      </Card>) : (pvpcData && location) ? (<>
        <FormControl sx={{marginBottom: 5}} fullWidth>
          <InputLabel id="demo-simple-select-label">Zona</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={location.geo_id}
            label="Location"
            onChange={(event) => setLocation(
              pvpcData.indicator.geos.filter((option) => option.geo_id === event.target.value)[0]
            )}
          >
            {pvpcData.indicator.geos.map((option) => (
              <MenuItem value={option.geo_id}>{option.geo_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{align: 'center'}}
                  action={tier.title === 'Pro' ? <StarIcon/> : null}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                      color: tier.class === 'maximum' ? 'lightcoral' : tier.class === 'mean' ? 'lightgreen' : 'lightblue',
                    }}
                  >
                    <Typography component="h2" variant="h3">
                      {tier.price}
                    </Typography>
                    <Typography variant="h6">
                      € MW/h
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div style={{height: '500px', marginTop: '3rem', marginBottom: '3rem'}}>
          <DailyCostChart
            data={pvpcData.indicator.values.filter((value) => value.geo_id === location.geo_id).map((value) => {
              return {
                ...value,
                xAxisLabel: DateTime.fromISO(value.datetime).toFormat("H")
              }
            })}
            xAxisKey={'xAxisLabel'}
            dataKey={'value'}
            meanValue={tiers.filter((tier) => tier.class === 'mean')[0]?.price}
          />
        </div>
      </>) : (<p>Cargando...</p>)}
    </Container>
  </PageWrapper>);
}

export default hot(HomePage);
