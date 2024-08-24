"use client";
import { useState, useRef, useEffect } from "react";
import { TableProps } from "./helpers/types";


function Table({headers, rows}: TableProps) {
  return (
    <div className="overflow-x-auto mt-5">
      <table className="table table-zebra">
        {/* headers */}
        <thead>
          <tr>
            {headers.map((header, index) => {
                return <th key={header + index}>{header}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {rows.map((row, index) => {
            return <tr key={`Row-${index}`}>
                {row.map((val, index)=>{
                    return <td key={`Val-${index}`}>{val}</td>
                })}
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
