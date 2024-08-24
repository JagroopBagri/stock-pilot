export interface TableProps {
    headers: string[]; // headers for the table ex. ["Ticker", "Bought for", "Sold for", "Date Purchased"]
    rows: (string | number)[][] // row values for the table ex. [["AAPL", "$10", "$11", "01/01/2024"]]
}