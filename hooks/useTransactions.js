import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://localhost:5001/api"

export const useTransactions = (userId) =>{
    const [transactions,setTransactions] = useState([]);
    const[summary,setSummary] = useState({
        balance:0,
        income:0,
        expenses:0,
    });
    const [isLoading,setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () =>{
        try {
            const response =await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json()
            setTransactions(data)
        } catch (error) {
            console.error("error fetching transactions:",error)
        }
    },[userId]);

     const fetchSummary = useCallback(async () =>{
        try {
            const response =await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json()
            setSummary(data)
        } catch (error) {
            console.error("error fetching summary:",error)
        }
    },[userId]);

    const loadData = useCallback(async () =>{
        if(!userId) return;

        setIsLoading(true);

        try {
           await Promise.all([fetchTransactions(),fetchSummary()]);
            
        } catch (error) {
            console.error("error loading data:",error)
        }finally{
            setIsLoading(false);
        }
    },[fetchTransactions,fetchSummary,userId]);


const deleteTransactions = async (id) =>{
        try {
            const response =await fetch(`${API_URL}/transactions/${id}`,{method:"DELETE"});
            if(!response.ok) throw new Error("failed to delete transaction")

            loadData();
            Alert.alert("Success","Transaction deleted successfully");
        } catch (error) {
            console.error("error fetching summary:",error);
            Alert.alert("error",error.message);
        }
    };

    return{transactions,summary,isLoading,loadData,deleteTransactions}
};