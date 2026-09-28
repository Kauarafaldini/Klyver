import React from "react";
import {
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid,
  Area,
  Bar,
  ResponsiveContainer,
} from "recharts";

// Simplified XAxis wrapper - only add essential props to avoid conflicts
export const XAxis: React.FC<any> = (props) => {
  return <RechartsXAxis {...props} />;
};

// Simplified YAxis wrapper - only add essential props to avoid conflicts
export const YAxis: React.FC<any> = (props) => {
  return <RechartsYAxis {...props} />;
};

// Custom AreaChart wrapper with margin
export const AreaChart: React.FC<any> = ({ margin, ...props }) => {
  const defaultMargin = margin || { top: 5, right: 30, left: 20, bottom: 5 };
  return <RechartsAreaChart margin={defaultMargin} {...props} />;
};

// Custom BarChart wrapper with margin
export const BarChart: React.FC<any> = ({ margin, ...props }) => {
  const defaultMargin = margin || { top: 5, right: 30, left: 20, bottom: 5 };
  return <RechartsBarChart margin={defaultMargin} {...props} />;
};

// Re-export other components as-is
export { CartesianGrid, Area, Bar, ResponsiveContainer };
