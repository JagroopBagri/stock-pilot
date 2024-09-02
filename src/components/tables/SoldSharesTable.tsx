"use client";
import React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Decimal from "decimal.js";
import { SaleTrade as PrismaSaleTrade, PurchaseTrade, Stock } from "@prisma/client";
import { appColors } from "@/styles/appColors";

interface SaleTrade extends PrismaSaleTrade {
    purchaseTrade: PurchaseTrade & {
      stock: Stock;
    };
  }

interface SoldSharesTableProps {
  soldShares: SaleTrade[];
  onDelete: (trade: SaleTrade) => void;
}

const SoldSharesTable: React.FC<SoldSharesTableProps> = ({
  soldShares,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="sold shares table">
        <TableHead>
          <TableRow>
            <TableCell>Sale Date</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell align="center"># of Shares</TableCell>
            <TableCell align="center">Sell Price</TableCell>
            <TableCell align="center">Purchase Price</TableCell>
            <TableCell align="center">Net Profit</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {soldShares.map((trade) => (
            <TableRow
              key={trade.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {new Date(trade.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{trade.purchaseTrade.stock.ticker}</TableCell>
              <TableCell align="center">{trade.quantity}</TableCell>
              <TableCell align="center">
                ${new Decimal(trade.sellPrice).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                ${new Decimal(trade.buyPrice).toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: new Decimal(trade.netProfit).greaterThanOrEqualTo(0)
                    ? appColors.green
                    : appColors.red,
                  fontWeight: "bold",
                }}
              >
                ${new Decimal(trade.netProfit).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => onDelete(trade)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SoldSharesTable;
