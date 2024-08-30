"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext, UserContextType } from "@/components/Store";
import { toast } from "react-hot-toast";
import PurchaseTradeForm from "@/components/forms/purchaseTradeForm/PurchaseTradeForm";
import SaleTradeForm from "@/components/forms/saleTradeForm/SaleTradeForm";
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
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Decimal from "decimal.js";
import SellIcon from "@mui/icons-material/Sell";
import {
  Stock,
  PurchaseTrade as PrismaPurchaseTrade,
  SaleTrade as PrismaSaleTrade,
} from "@prisma/client";

interface PurchaseTrade extends PrismaPurchaseTrade {
  stock: Stock;
}

interface SaleTrade extends PrismaSaleTrade {
  purchaseTrade: PurchaseTrade;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function DashboardPage() {
  const [showPurchaseTradeForm, setShowPurchaseTradeForm] =
    useState<boolean>(false);
  const [purchaseTrades, setPurchaseTrades] = useState<PurchaseTrade[]>([]);
  const [saleTrades, setSaleTrades] = useState<SaleTrade[]>([]);
  const [showSaleTradeForm, setShowSaleTradeForm] = useState<boolean>(false);
  const [selectedPurchaseTrade, setSelectedPurchaseTrade] =
    useState<PurchaseTrade | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useContext(UserContext) as UserContextType;

  const togglePurchaseTradeForm = () =>
    setShowPurchaseTradeForm(!showPurchaseTradeForm);

  const openSaleTradeForm = (trade: PurchaseTrade) => {
    setSelectedPurchaseTrade(trade);
    setShowSaleTradeForm(true);
  };

  useEffect(() => {
    fetchPurchaseTrades();
    fetchSaleTrades();
  }, []);

  const fetchPurchaseTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/user/purchase-trade");
      setPurchaseTrades(response.data.data);
    } catch (error) {
      console.error("Failed to fetch trades:", error);
      toast.error("Failed to fetch trades");
    } finally {
      setLoading(false);
    }
  };

  const fetchSaleTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/user/sale-trade");
      setSaleTrades(response.data.data);
    } catch (error) {
      console.error("Failed to fetch sale trades:", error);
      toast.error("Failed to fetch sale trades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            marginBottom: "3rem",
            fontWeight: "bold",
            textDecorationLine: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "3px",
          }}
        >
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={togglePurchaseTradeForm}
          sx={{ mb: 2 }}
        >
          Add Trade
        </Button>
        {/* Purchase Trades Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Purchased Shares
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell align="center"># of Shares</TableCell>
                    <TableCell align="center">Price per Share</TableCell>
                    <TableCell align="center">Total Spent</TableCell>
                    {/* <TableCell>Notes</TableCell> */}
                    <TableCell align="center">Sell Shares</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseTrades.map((trade) => (
                    <TableRow
                      key={trade.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{`${trade.stock.ticker}`}</TableCell>
                      <TableCell align="center">{trade.quantity}</TableCell>
                      <TableCell align="center">
                        ${new Decimal(trade.price).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        ${new Decimal(trade.totalAmount).toFixed(2)}
                      </TableCell>
                      {/* <TableCell>{trade.notes || "-"}</TableCell> */}
                      <TableCell align="center">
                        <IconButton
                          onClick={() => openSaleTradeForm(trade)}
                          color="primary"
                        >
                          <SellIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {/* Sale Trades Table */}
        {loading ? (
          <></>
        ) : (
          <>
            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
              Sold Shares
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="sale trades table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sale Date</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell align="center"># of Shares</TableCell>
                    <TableCell align="center">Sell Price</TableCell>
                    <TableCell align="center">Purchase Price</TableCell>
                    <TableCell align="center">Net Profit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {saleTrades.map((trade) => (
                    <TableRow
                      key={trade.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{`${trade.purchaseTrade.stock.ticker}`}</TableCell>
                      <TableCell align="center">{trade.quantity}</TableCell>
                      <TableCell align="center">
                        ${new Decimal(trade.sellPrice).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        ${new Decimal(trade.buyPrice).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        ${new Decimal(trade.netProfit).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
      <Modal
        open={showPurchaseTradeForm}
        onClose={togglePurchaseTradeForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <PurchaseTradeForm
            onClose={togglePurchaseTradeForm}
            onTradeAdded={fetchPurchaseTrades}
          />
        </Box>
      </Modal>
      <Modal
        open={showSaleTradeForm}
        onClose={() => setShowSaleTradeForm(false)}
        aria-labelledby="sale-trade-modal-title"
        aria-describedby="sale-trade-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedPurchaseTrade && (
            <SaleTradeForm
              purchaseTrade={selectedPurchaseTrade}
              onClose={() => setShowSaleTradeForm(false)}
              onSaleTradeAdded={fetchSaleTrades}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
}
