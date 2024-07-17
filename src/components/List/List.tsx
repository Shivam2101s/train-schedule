import React from "react";
import { TrainDataType } from "../../types";
import s from "./List.module.css";
import dayjs from "dayjs";

type ListPropType = {
  data: TrainDataType[];
  label: string;
};

export const List: React.FunctionComponent<ListPropType> = ({
  label,
  data,
}) => {
  const formatDate = (val: any) => {
    return dayjs(val).format("hh:mm A");
  };
  return (
    <div className={s.root}>
      <div className={s.header}>
        <h3>{label}</h3>
      </div>
      {data?.length > 0 ? (
        <div className={s.list}>
          <div className={s.title}>
            <h4>No.</h4>
            <h4>Train Number</h4>
            <h4>Arrival</h4>
            <h4>Departure</h4>
          </div>
          {data?.map((item, idx) => (
            <div key={`${item?.trainNumber}_${idx + 1}`} className={s.card}>
              <p>{idx + 1}</p>
              <p>{item?.trainNumber}</p>
              <p>{formatDate(item?.arrivalTime)}</p>
              <p>{formatDate(item?.departureTime)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <p>No trains available</p>
        </div>
      )}
    </div>
  );
};
