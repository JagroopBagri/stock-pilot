"use client";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const limit = 50;

  useEffect(() => {
    fetchStocks(page);
  }, [page]);

  const fetchStocks = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await axios.get<StocksResponse>(`/api/v1/stocks?page=${currentPage}&limit=${limit}`);
      setStocks(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
      toast.error("Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (ticker: string) => {
    router.push(`/stocks/${ticker}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
          Stocks
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="stocks table">
                <TableHead>
                  <TableRow>
                    <TableCell>View Details</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Company Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow
                      key={stock.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                      onClick={() => handleRowClick(stock.ticker)}
                      
                    >
                      <TableCell>
                        <IconButton
                          onClick={() => handleRowClick(stock.ticker)}
                          color="primary"
                        >
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}