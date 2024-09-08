import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Decimal from "decimal.js";
import { PurchaseTrade, SaleTrade } from "@prisma/client";

interface SaleTradeFormProps {
  onClose: () => void;
  onSaleTradeAdded: () => Promise<void>;
  purchaseTrade: PurchaseTrade;
  setLoading: (bool: boolean) => void;
  saleTrade?: SaleTrade | null;
}

const SaleTradeForm: React.FC<SaleTradeFormProps> = ({
  onClose,
  onSaleTradeAdded,
  purchaseTrade,
  setLoading,
  saleTrade,
}) => {
  const [quantity, setQuantity] = useState<number | "">(
    saleTrade?.quantity || purchaseTrade.quantity
  );
  const [sellPrice, setSellPrice] = useState<string>(
    saleTrade?.sellPrice.toString() || ""
  );
  const [date, setDate] = useState<Dayjs | null>(
    saleTrade ? dayjs(saleTrade.date) : dayjs()
  );
  const [notes, setNotes] = useState<string>(saleTrade?.notes || "");
  const [dateError, setDateError] = useState<string | null>(null);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate && newDate.isBefore(dayjs(purchaseTrade.date))) {
      setDateError("Date of sale cannot be before the purchase date.");
      setDate(null);
    } else {
      setDateError(null);
      setDate(newDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onClose();
    try {
      const totalAmount = new Decimal(sellPrice).times(quantity).toFixed(2);
      const netProfit = new Decimal(sellPrice)
        .minus(purchaseTrade.price)
        .times(quantity)
        .toFixed(2);

      const url = saleTrade
        ? `/api/v1/user/sale-trade/${saleTrade.id}`
        : "/api/v1/user/sale-trade";
      const method = saleTrade ? "PUT" : "POST";

      await axios({
        method,
        url,
        data: {
          purchaseTradeId: purchaseTrade.id,
          quantity,
          sellPrice,
          totalAmount,
          netProfit,
          date: date ? date.format("YYYY-MM-DD") : null,
          notes,
        },
      });

      toast.success(
        `Sale trade ${saleTrade ? "updated" : "added"} successfully`
      );
      await onSaleTradeAdded();
    } catch (error) {
      console.error("Failed to save sale trade:", error);
      toast.error(`Failed to ${saleTrade ? "update" : "add"} sale trade`);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setSellPrice(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{marginBottom: "1rem"}}>
          Sell Shares
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of shares"
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(value === "" ? 0 : parseInt(value, 10));
              }}
              required
              inputProps={{
                min: 1,
                max: saleTrade?.id
                  ? saleTrade.quantity + purchaseTrade.quantity
                  : purchaseTrade.quantity,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="($) Price per Share"
              type="number"
              value={sellPrice}
              onChange={handlePriceChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
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
              label="Date of Sale"
              value={date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: Boolean(dateError),
                  helperText: dateError || "",
                },
              }}
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

export default SaleTradeForm;
