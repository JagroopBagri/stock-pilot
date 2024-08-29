import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Stock {
  id: number;
  ticker: string;
  companyName: string;
}

interface PurchaseTradeFormProps {
  onClose: () => void;
  onTradeAdded: () => void;
}

const PurchaseTradeForm: React.FC<PurchaseTradeFormProps> = ({
  onClose,
  onTradeAdded,
}) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState<number | "">(0);
  const [price, setPrice] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [notes, setNotes] = useState<string>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async (newSearch?: string) => {
    if ((!hasMore && !newSearch) || loading) return;
    setLoading(true);
    try {
      const searchToUse = newSearch !== undefined ? newSearch : searchTerm;
      const response = await axios.get<{ data: Stock[], meta: { hasMore: boolean } }>("/api/v1/stocks", {
        params: {
          page: newSearch !== undefined ? 1 : page,
          limit: 50,
          search: searchToUse,
        },
      });
      const newStocks = response.data.data;
  
      setStocks((prevStocks) => {
        let updatedStocks: Stock[];
        if (newSearch !== undefined) {
          // For a new search, just use the new stocks
          updatedStocks = newStocks;
        } else {
          // For pagination, combine previous and new stocks
          updatedStocks = [...prevStocks, ...newStocks];
        }
  
        // Remove duplicates based on stock id
        const uniqueStocks = Array.from(
          new Map(updatedStocks.map(stock => [stock.id, stock])).values()
        ) as Stock[];
  
        return uniqueStocks;
      });
  
      setHasMore(response.data.meta.hasMore);
      setPage((prevPage) => newSearch !== undefined ? 2 : prevPage + 1);
      if (newSearch !== undefined) {
        setSearchTerm(newSearch);
      }
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
      toast.error("Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  const handleStockSearch = (event: React.ChangeEvent<{}>, value: string) => {
    fetchStocks(value);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/user/trades", {
        stockId: selectedStock?.id || null,
        quantity,
        price,
        date: date ? date.format("YYYY-MM-DD") : null,
        notes,
      });
      toast.success("Trade added successfully");
      onTradeAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add trade:", error);
      toast.error("Failed to add trade");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid positive number with up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New Trade
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Autocomplete
              options={stocks}
              getOptionLabel={(option) => `${option.ticker} - ${option.companyName}`}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Stock" 
                  required 
                  placeholder="Search by company name or ticker"
                />
              )}
              value={selectedStock}
              onChange={(event, newValue) => {
                setSelectedStock(newValue);
              }}
              onInputChange={handleStockSearch}
              filterOptions={(x) => x}
              loadingText="Loading stocks..."
              loading={loading}
              onScroll={(event) => {
                const listboxNode = event.currentTarget;
                if (
                  listboxNode.scrollTop + listboxNode.clientHeight ===
                  listboxNode.scrollHeight
                ) {
                  fetchStocks();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of shares"
              type="number"
              value={quantity === 0 ? "" : quantity}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(
                  value === "" ? 0 : Math.max(1, parseInt(value, 10))
                );
              }}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="($) Price per Share"
              type="number"
              value={price}
              onChange={handlePriceChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{
                step: "0.01",
                min: "0",
                inputMode: "decimal",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Date of Trade"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PurchaseTradeForm;
