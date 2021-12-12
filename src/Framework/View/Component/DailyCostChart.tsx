import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { DateTime } from 'luxon';

export const DailyCostChart: ({
                                data,
                                xAxisKey,
                                dataKey,
                                meanValue
                              }: {
  data: { datetime: string , xAxisLabel: string}[], xAxisKey: string, dataKey: string, meanValue: string
}) => JSX.Element = ({
                       data,
                       xAxisKey,
                       dataKey,
                       meanValue
                     }) => {
  const currentHour = data.filter((dataValue) => DateTime.fromISO(dataValue.datetime).hour === DateTime.now().hour)[0] ?? null;
  const now = `${DateTime.now().toFormat('HH:mm')}h`;

  return (<ResponsiveContainer>
    <LineChart data={data} margin={{top: 20}}>
      <CartesianGrid/>
      <XAxis dataKey={xAxisKey} interval={0} tickMargin={8} height={50} padding={{left: 25, right: 25}}/>
      <YAxis type={'number'} domain={['dataMin - 10', 'dataMax + 10']} width={65} tickMargin={8} tickCount={8}/>
      <Tooltip formatter={(value: string) => [`${value}€ MW/h`, 'Coste']} labelFormatter={(value) => `${value}h`}/>
      {meanValue && <ReferenceLine y={meanValue} stroke={'lightgreen'} isFront={true} alwaysShow={true} label={{
        position: 'insideTopLeft',
        value: meanValue,
        fill: 'green',
      }}/>}
      {currentHour && <ReferenceLine x={currentHour.xAxisLabel} stroke={'red'} isFront={true} alwaysShow={true} label={{
        position: 'top',
        value: now,
        fill: 'red',
      }}/>}
      <Legend verticalAlign={'bottom'} formatter={() => '€ MW/h'}/>
      <Line
        type="natural"
        dataKey={dataKey}
        stroke="#8884d8"
        activeDot={{r: 8}}
        dot={{r: 4}}
      />
    </LineChart>
  </ResponsiveContainer>);
}
