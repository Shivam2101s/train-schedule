import React, { useEffect, useState } from "react";
import s from "./Schedule.module.css";
import { TrainDataType, TrainFieldsEnum } from "../../types";
import List from "../List";

const initState = {
  trainNumber: "",
  arrivalTime: "",
  departureTime: "",
};

export const Schedule = () => {
  const [formData, setFormData] = useState<TrainDataType>(initState);
  const [trainList, setTrainList] = useState<TrainDataType[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [activeTrains, setActiveTrains] = useState<TrainDataType[]>([]);

  const [p1Train, setP1Train] = useState<TrainDataType | null>(null);
  const [p2Train, setP2Train] = useState<TrainDataType | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      formData?.arrivalTime &&
      formData?.departureTime &&
      formData?.trainNumber
    ) {
      if (
        !trainList?.find((item) => item.trainNumber === formData.trainNumber)
      ) {
        setTrainList((prev) => [...prev, formData]);
        setFormData(initState);
      } else {
        alert("Train number already exist!!");
        setFormData(initState);
      }
    } else {
      // error
      alert("All fields are mandetory!!");
    }
  };

  const handleChange = (key: TrainFieldsEnum, val: any) => {
    const obj = { ...formData };
    obj[key] = val;
    setFormData(obj);
  };

  const checkTrains = (
    currentTime: any,
    activeTrains: TrainDataType[],
    trainList: TrainDataType[]
  ) => {
    setCurrentTime(new Date());
    const active: TrainDataType[] = [...activeTrains];
    const upComing: TrainDataType[] = [];

    trainList?.forEach((item) => {
      const arrival = new Date(item.arrivalTime);
      const departure = new Date(item.departureTime);
      if (currentTime >= arrival && currentTime < departure) {
        if (!active.find((itm) => itm.trainNumber === item.trainNumber)) {
          active.push(item);
        }
      } else {
        upComing.push(item);
      }
    });
    setActiveTrains(active);
    setTrainList(upComing);
  };

  const removeFromPlatForm = (
    currentTime: any,
    p1Train: TrainDataType | null,
    p2Train: TrainDataType | null
  ) => {
    if (!!p1Train) {
      const departure = new Date(p1Train?.departureTime);
      if (currentTime >= departure) {
        setP1Train(null);
      }
    } else {
    }
    if (!!p2Train) {
      const departure = new Date(p2Train?.departureTime);
      if (currentTime >= departure) {
        setP2Train(null);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (trainList || p1Train || p2Train || activeTrains) {
      interval = setInterval(() => {
        checkTrains(currentTime, activeTrains, trainList);
        removeFromPlatForm(currentTime, p1Train, p2Train);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [currentTime, trainList, p1Train, p2Train, activeTrains]);

  useEffect(() => {
    if (!!activeTrains?.length) {
      if (!p1Train) {
        setP1Train(activeTrains[0]);
        setActiveTrains((prev) => prev.slice(1));
      } else if (!p2Train) {
        setP2Train(activeTrains[0]);
        setActiveTrains((prev) => prev.slice(1));
      }
    }
  }, [p1Train, p2Train, activeTrains]);

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h1>Train Schedule</h1>
      </div>
      <div className={s.inputs_container}>
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <h5>Train number</h5>
            <input
              type="text"
              value={formData?.trainNumber}
              placeholder="Enter train name"
              required
              onChange={(e) => {
                handleChange(TrainFieldsEnum.TrainNumber, e.target.value);
              }}
            />
          </div>
          <div className={s.field}>
            <h5>Arrival Time</h5>
            <input
              type="datetime-local"
              value={formData?.arrivalTime}
              required
              onChange={(e) => {
                handleChange(TrainFieldsEnum.ArrivalTime, e.target.value);
              }}
            />
          </div>
          <div className={s.field}>
            <h5>Departure Time</h5>
            <input
              type="datetime-local"
              value={formData?.departureTime}
              required
              onChange={(e) => {
                handleChange(TrainFieldsEnum.DepartureTime, e.target.value);
              }}
            />
          </div>
          <button type="submit">Add train</button>
        </form>
      </div>
      <div className={s.container}>
        <List data={trainList} label={"Upcoming trains"} />
        <div className={s.platforms}>
          <List data={p1Train ? [p1Train] : []} label={"Platform 1"} />
          <List data={p2Train ? [p2Train] : []} label={"Platform 2"} />
        </div>
      </div>
    </div>
  );
};
