"use client";
import { UserContext, UserContextType } from "@/components/Store";
import { appColors } from "@/styles/appColors";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal
} from "@mui/material";
import {
  PurchaseTrade as PrismaPurchaseTrade,
  SaleTrade as PrismaSaleTrade,
  Stock,
} from "@prisma/client";
import axios from "axios";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PurchaseTradeForm from "@/components/forms/purchaseTradeForm/PurchaseTradeForm";

interface PurchaseTrade extends PrismaPurchaseTrade {
  stock: Stock;
}

interface SaleTrade extends PrismaSaleTrade {
  purchaseTrade: PurchaseTrade;
}

interface AggregatedPurchaseStocks {
  ticker: string;
  totalAmount: Decimal;
  totalShares: number;
}

interface AggregatedSaleStocks {
  ticker: string;
  netProfit: Decimal;
  totalSharesSold: number;
}

const styles = {
  tableTitle: {marginTop: "3rem"},
  modalStyle: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      cursor: "pointer",
    },
  },
}


export default function DashboardPage() {
  const [showPurchaseTradeForm, setShowPurchaseTradeForm] =
    useState<boolean>(false);
  const [purchaseTrades, setPurchaseTrades] = useState<PurchaseTrade[]>([]);
  const [saleTrades, setSaleTrades] = useState<SaleTrade[]>([]);
  const [aggregatedPurchaseStocks, setAggregatedPurchaseStocks] = useState<
    AggregatedPurchaseStocks[]
  >([]);
  const [aggregatedSaleStocks, setAggregatedSaleStocks] = useState<
    AggregatedSaleStocks[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useContext(UserContext) as UserContextType;
  const router = useRouter();

  const togglePurchaseTradeForm = () =>
    setShowPurchaseTradeForm(!showPurchaseTradeForm);

  useEffect(() => {
    fetchPurchaseTrades();
    fetchSaleTrades();
  }, []);

  const fetchPurchaseTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/user/purchase-trade");
      const trades: PurchaseTrade[] = response.data.data;
      setPurchaseTrades(trades);

      // Aggregate by stock
      const aggregated: Record<string, AggregatedPurchaseStocks> =
        trades.reduce((acc, trade) => {
          const { ticker } = trade.stock;
          if (!acc[ticker]) {
            acc[ticker] = {
              ticker,
              totalAmount: new Decimal(0),
              totalShares: 0,
            };
          }
          acc[ticker].totalAmount = acc[ticker].totalAmount.plus(
            trade.totalAmount
          );
          acc[ticker].totalShares += trade.quantity;
          return acc;
        }, {} as Record<string, AggregatedPurchaseStocks>);

      setAggregatedPurchaseStocks(Object.values(aggregated));
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
      const trades: SaleTrade[] = response.data.data;
      setSaleTrades(trades);

      // Aggregate by stock
      const aggregated: Record<string, AggregatedSaleStocks> = trades.reduce(
        (acc: any, trade) => {
          const { ticker } = trade.purchaseTrade.stock;
          if (!acc[ticker]) {
            acc[ticker] = {
              ticker,
              netProfit: new Decimal(0),
              totalSharesSold: 0,
            };
          }
          acc[ticker].netProfit = acc[ticker].netProfit.plus(trade.netProfit);
          acc[ticker].totalSharesSold += trade.quantity;
          return acc;
        },
        {} as Record<string, AggregatedSaleStocks>
      );

      setAggregatedSaleStocks(Object.values(aggregated));
    } catch (error) {
      console.error("Failed to fetch sale trades:", error);
      toast.error("Failed to fetch sale trades");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (ticker: string) => {
    // Navigate to the stock detail page
    router.push(`/stocks/${ticker}`);
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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Aggregated Purchase Stocks Table */}
            <Typography variant="h6" component="h2" gutterBottom sx={styles.tableTitle}>
              My Shares
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">View Details</TableCell>
                    <TableCell align="left">Stock</TableCell>
                    <TableCell align="center"># of Shares Held</TableCell>
                    <TableCell align="center">Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aggregatedPurchaseStocks.map((stock) => (
                    <TableRow
                      key={stock.ticker}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(stock.ticker);
                      }}
                      sx={styles.tableRow}
                    >
                      <TableCell align="left">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(stock.ticker);
                          }}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="left">{stock.ticker}</TableCell>
                      <TableCell align="center">{stock.totalShares}</TableCell>
                      <TableCell align="center">
                        ${new Decimal(stock.totalAmount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Aggregated Sale Stocks Table */}
            <Typography variant="h6" component="h2" gutterBottom sx={styles.tableTitle}>
              Sold Shares
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">View Details</TableCell>
                    <TableCell align="left">Stock</TableCell>
                    <TableCell align="center"># of Shares Sold</TableCell>
                    <TableCell align="center">Total Profit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aggregatedSaleStocks.map((stock) => (
                    <TableRow
                      key={stock.ticker}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(stock.ticker);
                      }}
                      sx={styles.tableRow}
                    >
                      <TableCell align="left">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(stock.ticker);
                          }}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="left">{stock.ticker}</TableCell>
                      <TableCell align="center">{stock.totalSharesSold}</TableCell>
                      <TableCell align="center" sx={{
                          color: new Decimal(
                            stock.netProfit
                          ).greaterThanOrEqualTo(0)
                            ? appColors.green
                            : appColors.red,
                          fontWeight: "bold",
                        }}>
                        ${new Decimal(stock.netProfit).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal
        open={showPurchaseTradeForm}
        onClose={togglePurchaseTradeForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalStyle}>
          <PurchaseTradeForm
            onClose={togglePurchaseTradeForm}
            onTradeAdded={fetchPurchaseTrades}
          />
        </Box>
      </Modal>
          </>
        )}
      </Box>
    </Container>
  );
}
