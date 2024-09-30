"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ChartComponent = ({ data }) => {
  return <Line data={data} />;
};

export default ChartComponent;
