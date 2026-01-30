import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { data } from "react-router";
import { set } from "zod";

interface Order {
    user_id: string;
    menu_id: number;
    timestamp: string;
    status: string;
    notes?: string;
    total: number;
}

const addOrder = async (order: Order) => {
    const { data, error } = await supabase
    .from("Orders")
    .insert([order])
    .select();

    if (error) {
        throw error;
    }

    return data;
}

export const AddOrder = () => {
    const { user } = useAuth();
    const [menuId, setMenuId] = useState<number>(0);
    const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());
    const [status, setStatus] = useState<string>("Pending");
    const [notes, setNotes] = useState<string>("");
    const [total, setTotal] = useState<number>(0);

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (data: Order) => {
            return addOrder(data);
        },
        onSuccess: () => {
            setMenuId(0);
            setTimestamp(new Date().toISOString());
            setStatus("Completed");
            setNotes("");
            setTotal(0);
        
            alert("Order placed successfully!");
        },
        onError: (error) => {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        },
    });

    const handleSubmit = () => {
        if (!user) {
            alert("You must be logged in to place an order.");
            return;
        }

        mutate({
            user_id: user.id,
            menu_id: menuId,
            timestamp,
            status,
            notes,
            total,
        });
    }

}