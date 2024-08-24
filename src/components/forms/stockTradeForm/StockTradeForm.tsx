import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Box, 
  Typography,
  Grid
} from '@mui/material';

interface Stock {
  id: number;
  ticker: string;
  companyName: string;
}

interface StockTradeFormProps {
  onClose: () => void;
  onTradeAdded: () => void;
}

const StockTradeForm: React.FC<StockTradeFormProps> = ({ onClose, onTradeAdded }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<number>(0);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('/api/v1/stocks');
      setStocks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
      toast.error('Failed to fetch stocks');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/user/trades', {
        stockId: selectedStock,
        type: tradeType,
        quantity,
        price,
        date,
        notes,
      });
      toast.success('Trade added successfully');
      onTradeAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add trade:', error);
      toast.error('Failed to add trade');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New Trade
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="stock-select-label">Stock</InputLabel>
            <Select
              labelId="stock-select-label"
              value={selectedStock}
              onChange={(e) => setSelectedStock(Number(e.target.value))}
              label="Stock"
              required
            >
              <MenuItem value="">
                <em>Select a stock</em>
              </MenuItem>
              {stocks.map((stock) => (
                <MenuItem key={stock.id} value={stock.id}>
                  {stock.ticker} - {stock.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="trade-type-label">Trade Type</InputLabel>
            <Select
              labelId="trade-type-label"
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value as 'BUY' | 'SELL')}
              label="Trade Type"
              required
            >
              <MenuItem value="BUY">Buy</MenuItem>
              <MenuItem value="SELL">Sell</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price per Share"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            inputProps={{ min: 0.01, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Trade"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default StockTradeForm;