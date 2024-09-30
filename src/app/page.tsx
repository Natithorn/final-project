"use client";
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from 'next/link';


Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface IRecord {
  _id?: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  notes: string;
  userId: string; 
}

export default function Home() {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [notes, setNotes] = useState<string>('');
  const [userId, setUserId] = useState<string>(''); 

  const totalIncome = records.reduce((acc, record) => record.type === 'income' ? acc + record.amount : acc, 0);
  const totalExpense = records.reduce((acc, record) => record.type === 'expense' ? acc + record.amount : acc, 0);

  //income and expense data for the past two months
  const incomeData = [0, 0]; 
  const expenseData = [0, 0]; 

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  records.forEach(record => {
    const recordDate = new Date(record.date);
    const recordMonth = recordDate.getMonth();

    // Check if the record is from the last two months
    if (recordDate.getFullYear() === currentDate.getFullYear() && (recordMonth === currentMonth || recordMonth === currentMonth - 1)) {
      if (record.type === 'income') {
        incomeData[recordMonth === currentMonth ? 0 : 1] += record.amount; 
      } else if (record.type === 'expense') {
        expenseData[recordMonth === currentMonth ? 0 : 1] += record.amount; 
      }
    }
  });

  const data = {
    labels: [
      new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentDate.getFullYear(), currentMonth, 1)),
      new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentDate.getFullYear(), currentMonth - 1, 1))
    ], 
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Expense',
        data: expenseData,
        borderColor: 'red',
        fill: false,
      },
    ],
  };

  const handleAddRecord = async () => {
    console.log("Add Record button clicked");

    if (amount <= 0 || !date || !type || notes.trim() === '' || !userId) {
      console.log("Invalid input");
      return; 
    }

    const newRecord: IRecord = { amount, date, type, notes, userId };

    // Log newRecord to check 
    console.log("New Record:", newRecord);

    
    setRecords(prevRecords => [...prevRecords, newRecord]);

    // Reset form fields
    setAmount(0);
    setDate('');
    setType('income');
    setNotes('');
    setUserId('');

    // Save the new record to the database
    try {
      const response = await fetch('/api/v1/slip', {
        method: 'POST',
        body: JSON.stringify(newRecord),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Add Record Error: ${errorData.error}`);
      }

      const data = await response.json();
      console.log("Record added:", data);
      
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    console.log(`Attempting to delete record with ID: ${recordId}`); 
    try {
        const response = await fetch(`/api/v1/slip`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId, 
            },
            body: JSON.stringify({ id: recordId }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Delete Error: ${errorData.error}`);
        }

        // Update the records state after deletion
        setRecords(records.filter(record => record._id !== recordId));
    } catch (error) {
        console.error("Error deleting record:", error);
    }
};


  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`/api/v1/slip?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Fetch Records Error: ${errorData.error}`);
        }
        const data = await response.json();
        setRecords(data.data || []);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    if (userId) {
      fetchRecords();
    }
  }, [userId]);

  return (
    <div className={styles.page}>
      <div className={styles['expen-container']}>
        <h1 className={styles['income-header']}>Income and Expense Tracker</h1>
        
        <div className={styles['input-group']}>
          <input
            type="number"
            className={styles['add-input']}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Amount"
          />
          <input
            type="datetime-local"
            className={styles['add-input']}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
          <select
            className={styles['add-input']}
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            className={styles['add-input']}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
          />
          <input
            type="text"
            className={styles['add-input']}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
          />
          <button className={styles['add-button']} onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        <h2>Total Income: {totalIncome}</h2>
        <h2>Total Expense: {totalExpense}</h2>
        <h2>Net: {totalIncome - totalExpense}</h2>

        {/* Display graph */}
        <Line data={data} />
        
        <ul className={styles['income-list']}>
            {records.map((record) => (
                <li key={record._id} className={styles['income-item']}>
                    <div className={styles['income-item-content']}>
                        <div className={styles['income-item-header']}>
                            <h3>{record.type === 'income' ? 'Income' : 'Expense'}: {record.amount}</h3>
                            
                        </div>
                        <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                        <p>Notes: {record.notes}</p>
                    </div>
                </li>
            ))}
        </ul>
              
      </div>
    </div>
  );
}
