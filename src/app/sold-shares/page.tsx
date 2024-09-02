"use client";
import { UserContext, UserContextType } from "@/components/Store";
import SoldSharesTable from "@/components/tables/SoldSharesTable";
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
  Typography
} from "@mui/material";
import {
  SaleTrade as PrismaSaleTrade,
  PurchaseTrade,
  Stock,
} from "@prisma/client";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface SaleTrade extends PrismaSaleTrade {
  purchaseTrade: PurchaseTrade & {
    stock: Stock;
  };
}

export default function SoldSharesPage() {
  const [saleTrades, setSaleTrades] = useState<SaleTrade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [tradeToDelete, setTradeToDelete] = useState<SaleTrade | null>(null);
  const { user } = useContext(UserContext) as UserContextType;

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
          <SoldSharesTable
            soldShares={saleTrades}
            onDelete={openDeleteDialog}
          />
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
    </Container>
  );
}