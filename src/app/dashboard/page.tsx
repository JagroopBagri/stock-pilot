"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext, UserContextType } from "@/components/Store";
import { toast } from "react-hot-toast";
import PurchaseTradeForm from "@/components/forms/purchaseTradeForm/PurchaseTradeForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Modal,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Decimal from 'decimal.js';

interface Trade {
  id: number;
  type: string;
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  notes: string;
  stock: {
    ticker: string;
    companyName: string;
  };
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function DashboardPage() {
  const [showTradeForm, setShowTradeForm] = useState<boolean>(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const { user } = useContext(UserContext) as UserContextType;

  const toggleTradeForm = () => setShowTradeForm(!showTradeForm);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get("/api/v1/user/trades");
      setTrades(response.data.data);
    } catch (error) {
      console.error("Failed to fetch trades:", error);
      toast.error("Failed to fetch trades");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        {user && (
          <Typography variant="h6" gutterBottom>
            Welcome, {user.username}!
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={toggleTradeForm}
          sx={{ mb: 2 }}
        >
          Add Trade
        </Button>
        {trades.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total Amount</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow
                    key={trade.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {new Date(trade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{`${trade.stock.ticker}`}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell align="right">{trade.quantity}</TableCell>
                    <TableCell align="right">${new Decimal(trade.price).toFixed(2)}</TableCell>
            <TableCell align="right">${new Decimal(trade.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>{trade.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">No trades found. Add a trade to get started!</Typography>
        )}
      </Box>
      <Modal
        open={showTradeForm}
        onClose={toggleTradeForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <PurchaseTradeForm
            onClose={toggleTradeForm}
            onTradeAdded={fetchTrades}
          />
        </Box>
      </Modal>
    </Container>
  );
}