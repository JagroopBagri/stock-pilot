"use client";
import { UserContext, UserContextType } from "@/components/Store";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
} from "@mui/material";
import {
  SaleTrade as PrismaSaleTrade,
  PurchaseTrade,
  Stock,
} from "@prisma/client";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import SaleTradeForm from "@/components/forms/saleTradeForm/SaleTradeForm";
import Decimal from "decimal.js";
import { appColors } from "@/styles/appColors";
import DeleteIcon from "@mui/icons-material/Delete";

interface SaleTrade extends PrismaSaleTrade {
  purchaseTrade: PurchaseTrade & {
    stock: Stock;
  };
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

export default function SoldSharesPage() {
  const [saleTrades, setSaleTrades] = useState<SaleTrade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [tradeToDelete, setTradeToDelete] = useState<SaleTrade | null>(null);
  const { user } = useContext(UserContext) as UserContextType;
  const [saleTradeToEdit, setSaleTradeToEdit] = useState<SaleTrade | null>(
    null
  );
  const [selectedPurchaseTrade, setSelectedPurchaseTrade] =
    useState<PurchaseTrade | null>(null);
  const [showSaleTradeForm, setShowSaleTradeForm] = useState<boolean>(false);

  const openEditSaleTradeForm = (saleTrade: SaleTrade) => {
    setSelectedPurchaseTrade(saleTrade.purchaseTrade);
    setSaleTradeToEdit(saleTrade);
    setShowSaleTradeForm(true);
  };

  const closeSaleTradeForm = () => {
    setSelectedPurchaseTrade(null);
    setSaleTradeToEdit(null);
    setShowSaleTradeForm(false);
  };

  const openDeleteDialog = (trade: SaleTrade) => {
    setTradeToDelete(trade);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
  };

  const handleDelete = async () => {
    if (!tradeToDelete) return;
    setLoading(true);
    closeDeleteDialog();
    try {
      await axios.delete(`/api/v1/user/sale-trade/${tradeToDelete.id}`);
      toast.success("Sale trade deleted successfully");
      await fetchSaleTrades();
    } catch (error) {
      console.error("Failed to delete sale trade:", error);
      toast.error("Failed to delete sale trade");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleTrades();
  }, []);

  const fetchSaleTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/user/sale-trade");
      const trades: SaleTrade[] = response.data.data;
      setSaleTrades(trades);
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
          Sold Shares
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="sold shares table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Edit</TableCell>
            <TableCell>Sale Date</TableCell>
            <TableCell>Company Ticker</TableCell>
            <TableCell align="center"># of Shares</TableCell>
            <TableCell align="center">Sell Price</TableCell>
            <TableCell align="center">Purchase Price</TableCell>
            <TableCell align="center">Net Profit</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {saleTrades.map((trade) => (
            <TableRow
              key={trade.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">
                <IconButton
                  onClick={() => openEditSaleTradeForm(trade)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                {new Date(trade.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{trade.purchaseTrade.stock.ticker}</TableCell>
              <TableCell align="center">{trade.quantity}</TableCell>
              <TableCell align="center">
                ${new Decimal(trade.sellPrice).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                ${new Decimal(trade.purchaseTrade.price).toFixed(2)}
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
                <IconButton onClick={() => openDeleteDialog(trade)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        )}
      </Box>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Sale Trade
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this sale trade? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={showSaleTradeForm}
        onClose={closeSaleTradeForm}
        aria-labelledby="sale-trade-modal-title"
        aria-describedby="sale-trade-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedPurchaseTrade && (
            <SaleTradeForm
              purchaseTrade={selectedPurchaseTrade}
              onClose={closeSaleTradeForm}
              onSaleTradeAdded={async () => {
                await fetchSaleTrades();
              }}
              setLoading={setLoading}
              saleTrade={saleTradeToEdit}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
}