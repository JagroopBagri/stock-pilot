"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SellIcon from "@mui/icons-material/Sell";
import Link from "next/link";
import {
  Box,
  Button,
  Breadcrumbs,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import Decimal from "decimal.js";
import { PurchaseTrade as PrismaPurchaseTrade, SaleTrade as PrismaSaleTrade, Stock } from "@prisma/client";
import { toast } from "react-hot-toast";
import PurchaseTradeForm from "@/components/forms/purchaseTradeForm/PurchaseTradeForm";
import SaleTradeForm from "@/components/forms/saleTradeForm/SaleTradeForm";
import { appColors } from "@/styles/appColors";

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

const styles = {
  tableTitle: {marginTop: "3rem"}
}

export default function StockDetailPage() {
  const [purchaseTrades, setPurchaseTrades] = useState<PurchaseTrade[]>([]);
  const [saleTrades, setSaleTrades] = useState<SaleTrade[]>([]);
  const [showPurchaseTradeForm, setShowPurchaseTradeForm] = useState<boolean>(false);
  const [showSaleTradeForm, setShowSaleTradeForm] = useState<boolean>(false);
  const [selectedPurchaseTrade, setSelectedPurchaseTrade] = useState<PurchaseTrade | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<"purchase" | "sale" | null>(
    null
  );
  const [tradeToDelete, setTradeToDelete] = useState<PurchaseTrade | SaleTrade | null>(
    null
  );
  const { ticker } = useParams();

  const togglePurchaseTradeForm = () =>
    setShowPurchaseTradeForm(!showPurchaseTradeForm);

  const openSaleTradeForm = (trade: PurchaseTrade) => {
    setSelectedPurchaseTrade(trade);
    setShowSaleTradeForm(true);
  };

  const openDeleteDialog = (
    type: "purchase" | "sale",
    trade: PurchaseTrade | SaleTrade
  ) => {
    setDeleteType(type);
    setTradeToDelete(trade);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
    setDeleteType(null);
  };

  const handleDelete = async () => {
    if (!tradeToDelete || !deleteType) return;
    setLoading(true);
    closeDeleteDialog();
    try {
      const url =
        deleteType === "purchase"
          ? `/api/v1/user/purchase-trade/${tradeToDelete.id}`
          : `/api/v1/user/sale-trade/${tradeToDelete.id}`;

      await axios.delete(url);

      toast.success(
        `${
          deleteType === "purchase" ? "Purchase" : "Sale"
        } trade deleted successfully`
      );

      // Refetch data
      await fetchPurchaseTrades();
      await fetchSaleTrades();
    } catch (error) {
      console.error(`Failed to delete ${deleteType} trade:`, error);
      toast.error(`Failed to delete ${deleteType} trade`);
    } finally {
      closeDeleteDialog();
      setLoading(false);
    }
  };

  const fetchPurchaseTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/user/purchase-trade?ticker=${ticker}`
      );
      setPurchaseTrades(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stock details:", error);
      toast.error("Failed to fetch stock details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSaleTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/user/sale-trade?ticker=${ticker}`);
      const trades: SaleTrade[] = response.data.data;
      setSaleTrades(trades);
    } catch (error) {
      console.error("Failed to fetch sale trades:", error);
      toast.error("Failed to fetch sale trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseTrades();
    fetchSaleTrades();
  }, [ticker]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/dashboard" passHref>
            <Typography color="inherit" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Dashboard
            </Typography>
          </Link>
          <Link href="/stocks" passHref>
            <Typography color="inherit" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Stocks
            </Typography>
          </Link>
          <Typography color="text.primary">{ticker}</Typography>
        </Breadcrumbs>
      </Box>
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
           {ticker}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={togglePurchaseTradeForm}
          sx={{ mb: 2 }}
        >
          Add Trade
        </Button>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Purchase Trades Table */}
            <Typography variant="h6" component="h2" gutterBottom sx={styles.tableTitle}>
              Currently Held {ticker} Shares
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
                    <TableCell align="center">Sell Shares</TableCell>
                    <TableCell align="center">Delete</TableCell>
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
                      <TableCell align="center">
                        <IconButton
                          onClick={() => openSaleTradeForm(trade)}
                          color="primary"
                        >
                          <SellIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => openDeleteDialog("purchase", trade)}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Sale Trades Table */}
            <Typography variant="h6" component="h2" gutterBottom sx={styles.tableTitle}>
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
                    <TableCell align="center">Delete</TableCell>
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
                      <TableCell
                        align="center"
                        sx={{
                          color: new Decimal(
                            trade.netProfit
                          ).greaterThanOrEqualTo(0)
                            ? appColors.green
                            : appColors.red,
                          fontWeight: "bold",
                        }}
                      >
                        ${new Decimal(trade.netProfit).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => openDeleteDialog("sale", trade)}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
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
          {`Delete ${deleteType === "purchase" ? "Purchase" : "Sale"} Trade`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete this ${
              deleteType === "purchase" ? "purchase" : "sale"
            } trade? ${
              deleteType === "purchase"
                ? "All associated sale trades will also be deleted. This action cannot be undone."
                : "This action cannot be undone."
            }`}
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
              onSaleTradeAdded={async () => {
                await fetchPurchaseTrades();
                await fetchSaleTrades();
              }}
              setLoading={setLoading}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
}
