// src/app/record/page.tsx
"use client";
import { useState } from 'react';
import styles from './record.module.css'; // Create a CSS module if needed

export default function AddRecord() {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [notes, setNotes] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const handleAddRecord = () => {
    const newRecord = { amount, date, type, notes, userId };

    // Log newRecord to check its content
    console.log("New Record:", newRecord);

    // Save the new record to the database
    fetch('/api/v1/slip', {
      method: 'POST',
      body: JSON.stringify(newRecord),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div className={styles.container}>
      <h1>Add New Record</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Amount"
      />
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Date"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
      />
      <button onClick={handleAddRecord}>Add Record</button>
    </div>
  );
}
