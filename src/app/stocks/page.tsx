"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Pagination,
  TextField,
  Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { Stock } from "@prisma/client";
import { toast } from "react-hot-toast";

interface StocksResponse {
  data: Stock[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const limit = 50;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchStocks(page, search);
  }, [page]);

  const fetchStocks = async (currentPage: number, searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get<StocksResponse>(`/api/v1/stocks?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`);
      setStocks(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
      toast.error("Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchStocks = useCallback((searchQuery: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchStocks(page, searchQuery);
    }, 500); // Debounce time is 500ms
  }, [page]);

  const handleRowClick = (ticker: string) => {
    router.push(`/stocks/${ticker}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDirectPageInput = () => {
    const pageNum = parseInt(pageInput, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    } else {
      toast.error("Invalid page number");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    debouncedFetchStocks(event.target.value);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h3" component="h1" sx={{ marginBottom: "3rem", fontWeight: "bold", textDecorationLine: "underline", textDecorationThickness: "2px", textUnderlineOffset: "3px" }}>
          Stocks
        </Typography>
        <TextField
          label="Search by Ticker or Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={handleSearchChange}
        />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
              <Table sx={{ minWidth: 650 }} stickyHeader aria-label="stocks table">
                <TableHead>
                  <TableRow>
                    <TableCell>View Details</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Company Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.id} sx={{ cursor: "pointer" }} onClick={() => handleRowClick(stock.ticker)}>
                      <TableCell>
                        <IconButton onClick={(e) => { e.stopPropagation(); handleRowClick(stock.ticker); }} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{stock.ticker}</TableCell>
                      <TableCell>{stock.companyName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 2 }}>
              <Typography>{`Displaying ${stocks.length} of ${totalPages * limit} records`}</Typography>
              {/* <Box>
                <TextField
                  label="Go to page"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  sx={{ marginRight: 2 }}
                />
                <Button variant="contained" onClick={handleDirectPageInput}>Go</Button>
              </Box> */}
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
