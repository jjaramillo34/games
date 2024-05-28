import React, { useState } from "react";
import "../styles/FizzBuzz.css";

const FizzBuzz = () => {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(number);
    if (isNaN(num)) {
      setResult("Please enter a valid number");
      return;
    }
    if (num % 3 === 0 && num % 5 === 0) {
      setResult("FizzBuzz");
    } else if (num % 3 === 0) {
      setResult("Fizz");
    } else if (num % 5 === 0) {
      setResult("Buzz");
    } else {
      setResult(num);
    }
  };

  return (
    <div className="fizzbuzz game">
      <h1>FizzBuzz</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={number}
          onChange={handleChange}
          placeholder="Enter a number"
        />
        <button type="submit">Submit</button>
      </form>
      <div className="result">{result}</div>
    </div>
  );
};

export default FizzBuzz;
