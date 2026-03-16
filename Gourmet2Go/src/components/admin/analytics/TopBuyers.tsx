import React from "react";
import { TopDishes } from "./TopDishes";
import type { BuyerStat } from "../../../types/analyticsTypes";

type Props = {
    data: BuyerStat[];
    color?: string;
    yKey?: string; 
};

export const TopBuyers: React.FC<Props> = ({ data, color = "#10b981", yKey = "spent" }) => {
    const chartData = data.map(d => ({ ...d }));
    return <TopDishes data={chartData as any} xKey="name" yKey={yKey} color={color} />;
};